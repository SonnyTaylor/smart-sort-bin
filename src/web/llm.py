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

SYSTEM_PROMPT = """You are a waste classification AI inside a smart recycling bin.
You will receive a photo of a waste item placed on a sorting tray.

Classify the item into exactly ONE of these categories:
- general (non-recyclable waste: plastic wrap, chip packets, tissues, styrofoam, etc.)
- recycling (recyclable materials: plastic bottles, aluminium cans, cardboard, glass, paper, etc.)
- compost (organic/compostable waste: food scraps, fruit peels, tea bags, coffee grounds, etc.)

Respond with ONLY a JSON object in this exact format:
{"category": "<general|recycling|compost>", "label": "<specific item name>", "confidence": <0.0-1.0>}

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
        dict with keys: category, label, confidence, raw_response
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
                    {"type": "text", "text": "Classify this waste item:"},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{image_b64}",
                        },
                    },
                ],
            },
        ],
        "max_tokens": 100,
        "temperature": 0.1,
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
                "category": None,
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

        # Validate category
        valid_categories = {"general", "recycling", "compost"}
        category = result.get("category", "general").lower()
        if category not in valid_categories:
            category = "general"

        return {
            "category": category,
            "label": result.get("label", "Unknown item"),
            "confidence": min(1.0, max(0.0, float(result.get("confidence", 0.8)))),
            "raw_response": raw_text,
        }

    except httpx.TimeoutException:
        return {
            "error": f"Request to {provider_id} timed out after {timeout}s. "
            "Try a faster model or increase the timeout.",
            "category": None,
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
            "category": None,
        }
    except json.JSONDecodeError as e:
        return {
            "error": f"Model response was not valid JSON: {str(e)}",
            "category": None,
            "raw_response": locals().get("raw_text", ""),
        }
    except (KeyError, IndexError) as e:
        return {
            "error": f"Unexpected response structure: {str(e)}",
            "category": None,
            "raw_response": locals().get("raw_text", ""),
        }
    except Exception as e:
        return {"error": f"Unexpected error: {str(e)}", "category": None}
