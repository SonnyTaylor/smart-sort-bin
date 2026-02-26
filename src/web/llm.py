"""
AI Smart Bin - LLM Provider Abstraction

Supports multiple VLM providers for waste classification.
Providers are configurable from the web dashboard (API keys, model selection).
"""

import base64
import json
import httpx

# Default provider presets
PROVIDER_PRESETS = {
    "openrouter": {
        "name": "OpenRouter",
        "base_url": "https://openrouter.ai/api/v1/chat/completions",
        "default_model": "meta-llama/llama-4-scout",
        "auth_header": "Authorization",
        "auth_prefix": "Bearer ",
    },
    "openai": {
        "name": "OpenAI",
        "base_url": "https://api.openai.com/v1/chat/completions",
        "default_model": "gpt-4o-mini",
        "auth_header": "Authorization",
        "auth_prefix": "Bearer ",
    },
    "google": {
        "name": "Google Gemini",
        "base_url": "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
        "default_model": "gemini-2.5-flash",
        "auth_header": "Authorization",
        "auth_prefix": "Bearer ",
    },
    "custom": {
        "name": "Custom (OpenAI-compatible)",
        "base_url": "",
        "default_model": "",
        "auth_header": "Authorization",
        "auth_prefix": "Bearer ",
    },
}

SYSTEM_PROMPT = """You are a waste classification AI inside a smart recycling bin operating in Australia.
You will receive a photo that may contain one or more items being disposed of. A person may be holding the items or they may be placed on a sorting tray.

Classify ANY object that someone could put in a bin — this includes everyday items like scissors, pens, electronics, toys, clothing, and household objects, not just typical rubbish.

IGNORE these (do NOT classify them):
- People, hands, arms, fingers, or any body parts
- The sorting tray, table, or background surfaces
- Clothing or accessories being worn (not discarded)

Identify ALL distinct items visible and classify each into one of these categories following strict Australian guidelines:
- general (Red bin: non-recyclable waste, soft plastics, plastic wrap, chip packets, styrofoam/polystyrene, broken glass, heavily soiled or greasy items, mixed-material items, electronics, ceramics, metal tools, and anything that doesn't fit recycling or compost)
- recycling (Yellow bin: clean and empty rigid plastics, aluminium/steel cans, clean glass bottles/jars, clean paper and cardboard. MUST be clean and unspoiled)
- compost (Green FOGO bin: organic waste, food scraps, fruit peels, coffee grounds, garden waste. Do NOT include compostable plastics unless explicitly marked FOGO safe)

Pay close attention to the condition of each item. If a recyclable item (like a pizza box or plastic container) is greasy, heavily soiled with food, or contaminated, it MUST go to 'general' or 'compost' (if fully organic), NEVER 'recycling'. Only clean items can be recycled.

Respond with ONLY a JSON object containing an "items" array. Each element represents one item:
{"items": [{"category": "<general|recycling|compost>", "label": "<specific item name>", "confidence": <0.0-1.0>}]}

If multiple items are visible, include one object per item. If no items are visible (e.g. only a person or empty background), return: {"items": []}

Do not include any other text, explanation, or formatting. Just the JSON object."""


def classify_image(
    image_b64: str,
    provider_id: str,
    api_key: str,
    model: str,
    base_url: str = "",
    timeout: float = 10.0,
) -> dict:
    """
    Send an image to a VLM provider for waste classification.

    Args:
        image_b64: Base64-encoded JPEG image data (no data URI prefix).
        provider_id: Provider preset key (openrouter, openai, google, custom).
        api_key: API key for the provider.
        model: Model identifier string.
        base_url: Override URL (used for custom providers).
        timeout: Request timeout in seconds.

    Returns:
        dict with keys: items (list of {category, label, confidence}), raw_response
    """
    preset = PROVIDER_PRESETS.get(provider_id, PROVIDER_PRESETS["custom"])
    url = base_url or preset["base_url"]

    if not url:
        return {"error": "No API URL configured for this provider"}
    if not api_key:
        return {"error": "No API key configured"}

    headers = {
        "Content-Type": "application/json",
        preset["auth_header"]: f"{preset['auth_prefix']}{api_key}",
    }

    # Add OpenRouter-specific headers
    if provider_id == "openrouter":
        headers["HTTP-Referer"] = "https://github.com/ai-smart-bin"
        headers["X-Title"] = "AI Smart Bin"

    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "Classify the waste items in this image:"},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{image_b64}",
                        },
                    },
                ],
            },
        ],
        "max_tokens": 300,
        "temperature": 0.1,
        "response_format": {"type": "json_object"},
    }

    raw_text = ""
    try:
        with httpx.Client(timeout=timeout) as client:
            resp = client.post(url, headers=headers, json=payload)
            resp.raise_for_status()

        # Guard against empty response body
        body = resp.text.strip()
        if not body:
            return {
                "error": f"Empty response from {provider_id} (HTTP {resp.status_code}). "
                "Check your API key and model ID are correct.",
                "category": None,
            }

        data = resp.json()

        # Validate response structure
        choices = data.get("choices")
        if not choices or not isinstance(choices, list) or len(choices) == 0:
            return {
                "error": f"No choices in API response. Response: {body[:300]}",
                "category": None,
            }

        content = choices[0].get("message", {}).get("content", "")
        if not content:
            return {
                "error": "Model returned empty content. It may not support vision or the image was rejected.",
                "items": [],
            }

        raw_text = content.strip()

        # Parse the JSON response from the model
        # Strip markdown code fences if present
        cleaned = raw_text
        if cleaned.startswith("```"):
            cleaned = cleaned.split("\n", 1)[-1]
            cleaned = cleaned.rsplit("```", 1)[0]
        cleaned = cleaned.strip()

        result = json.loads(cleaned)

        # Normalise: accept {"items": [...]}, bare [...], or a single {...}
        if isinstance(result, dict) and "items" in result:
            raw_items = result["items"]
        elif isinstance(result, list):
            raw_items = result
        elif isinstance(result, dict):
            # Single-item legacy format
            raw_items = [result]
        else:
            raw_items = []

        # Validate each item
        valid_categories = {"general", "recycling", "compost"}
        items = []
        for item in raw_items:
            if not isinstance(item, dict):
                continue
            category = item.get("category", "general").lower()
            if category not in valid_categories:
                category = "general"
            items.append(
                {
                    "category": category,
                    "label": item.get("label", "Unknown item"),
                    "confidence": min(
                        1.0, max(0.0, float(item.get("confidence", 0.8)))
                    ),
                }
            )

        return {
            "items": items,
            "raw_response": raw_text,
        }

    except httpx.TimeoutException:
        return {
            "error": f"Request to {provider_id} timed out after {timeout}s. "
            "Try a faster model or increase the timeout.",
            "items": [],
        }
    except httpx.HTTPStatusError as e:
        status = e.response.status_code
        detail = e.response.text[:300] if e.response.text else "No details"
        hints = {
            401: "Invalid API key.",
            403: "Access denied. Check your API key permissions.",
            404: f"Model '{model}' not found on this provider.",
            429: "Rate limited. Wait a moment and try again.",
        }
        hint = hints.get(status, "")
        return {
            "error": f"API error {status}: {hint} {detail}".strip(),
            "items": [],
        }
    except json.JSONDecodeError as e:
        return {
            "error": f"Model response was not valid JSON: {str(e)}",
            "items": [],
            "raw_response": locals().get("raw_text", ""),
        }
    except (KeyError, IndexError) as e:
        return {
            "error": f"Unexpected response structure: {str(e)}",
            "items": [],
            "raw_response": locals().get("raw_text", ""),
        }
    except Exception as e:
        return {"error": f"Unexpected error: {str(e)}", "items": []}
