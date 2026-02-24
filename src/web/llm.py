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
            data = resp.json()

        raw_text = data["choices"][0]["message"]["content"].strip()

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
        return {"error": "Request timed out", "category": None}
    except httpx.HTTPStatusError as e:
        return {
            "error": f"API error {e.response.status_code}: {e.response.text[:200]}",
            "category": None,
        }
    except (json.JSONDecodeError, KeyError, IndexError) as e:
        return {
            "error": f"Failed to parse response: {str(e)}",
            "category": None,
            "raw_response": locals().get("raw_text", ""),
        }
    except Exception as e:
        return {"error": f"Unexpected error: {str(e)}", "category": None}
