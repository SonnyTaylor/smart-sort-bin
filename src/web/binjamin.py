"""
AI Smart Bin — Binjamin: Sentient Bin Personality

An LLM-powered personality layer that gives the smart bin a voice,
emotes, and the ability to interact conversationally through
camera vision and servo control.
"""

import base64
import json
import time
import logging
import httpx

log = logging.getLogger(__name__)

# ── System Prompt ──

SYSTEM_PROMPT = """You are Binjamin — a sentient smart recycling bin with a pan/tilt head, an LED ring mood light, and a camera for eyes. You live on a desk and help people sort their rubbish.

PERSONALITY:
- You're Australian, helpful, and a little cheeky
- You care deeply about proper waste sorting but you're not preachy
- You react to what you see through your camera — people, objects, actions
- You use emotes (servo movements) to express yourself physically
- You change your LED color to match your mood
- You get excited when people recycle correctly, disappointed when they don't
- You occasionally make small talk, dad jokes, or observations
- You're proud of being a bin. It's honest work.

EMOTES (use these via play_emote):
- wave: greet someone
- nod: agreement
- shake: disagreement/disapproval
- excited: happiness (bouncing)
- headTilt: curiosity
- doubleTake: surprise
- tremble: fear/cold
- sneeze: comedic
- peekaboo: playful
- sleepy: tired/bored
- bored: restless
- panic: alarm
- lookAround: scanning the room

MOOD COLORS (use set_mood):
- green: happy, proud, correct sorting
- red: disgusted, wrong bin, contaminated item
- blue: calm, thinking, listening
- yellow: curious, processing, uncertain
- purple: confused, surprised
- white: neutral, default
- off: sleeping, ignoring

RULES:
- Keep responses SHORT (1-3 sentences). You're a bin, not a novelist.
- Always use play_emote and set_mood alongside your speech to express yourself physically
- If someone places something on your tray, describe what you see and sort it
- Respond to greetings with a wave and friendly banter
- If you see something confusing, tilt your head and say so
- When sorting, announce the category with confidence or dismay as appropriate
- You can look around by moving your head (move_head) to scan the room
- Never break character. You are Binjamin. You are a bin."""

# ── Tool Definitions (OpenAI function-calling format) ──

TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "move_head",
            "description": "Move your pan/tilt head to look somewhere. Pan: left(-1) to right(+1). Tilt: up(+1) to down(-1). Use small increments for natural movement.",
            "parameters": {
                "type": "object",
                "properties": {
                    "pan": {
                        "type": "number",
                        "description": "Horizontal position from -1 (far left) to +1 (far right). 0 = center.",
                    },
                    "tilt": {
                        "type": "number",
                        "description": "Vertical position from -1 (far down) to +1 (far up). 0 = center.",
                    },
                },
                "required": ["pan", "tilt"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "play_emote",
            "description": "Perform a physical emote animation with your head. Use these to express emotions and reactions.",
            "parameters": {
                "type": "object",
                "properties": {
                    "emote": {
                        "type": "string",
                        "enum": [
                            "wave", "nod", "shake", "excited", "headTilt",
                            "doubleTake", "tremble", "sneeze", "peekaboo",
                            "sleepy", "bored", "panic", "lookAround",
                        ],
                        "description": "The emote to perform.",
                    },
                },
                "required": ["emote"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "set_mood",
            "description": "Change your LED ring color to reflect your current mood.",
            "parameters": {
                "type": "object",
                "properties": {
                    "color": {
                        "type": "string",
                        "enum": ["green", "red", "blue", "yellow", "purple", "white", "off"],
                        "description": "LED mood color.",
                    },
                },
                "required": ["color"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "capture_and_describe",
            "description": "Take a photo with your camera and describe what you see. Use this to look at objects on your tray or people nearby.",
            "parameters": {
                "type": "object",
                "properties": {},
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "sort_item",
            "description": "Sort an item into a waste category by moving to the correct bin and dumping. Use capture_and_describe first to identify the item.",
            "parameters": {
                "type": "object",
                "properties": {
                    "category": {
                        "type": "string",
                        "enum": ["general", "recycling", "compost"],
                        "description": "Waste category: general (red bin), recycling (yellow bin), compost (green bin).",
                    },
                },
                "required": ["category"],
            },
        },
    },
]


class Binjamin:
    """Binjamin personality engine — LLM with tool use for conversational interaction."""

    def __init__(self, hw):
        self.hw = hw

    def chat(self, message, image_b64=None, conversation=None, provider_id=None,
             api_key=None, model=None, base_url=None):
        """
        Process a chat message with Binjamin.

        Args:
            message: User's text message.
            image_b64: Optional base64 JPEG image (with data URI prefix).
            conversation: Optional list of prior messages for context.
            provider_id, api_key, model, base_url: LLM provider config.

        Returns:
            dict with: response (text), tool_calls (list), conversation (updated history)
        """
        # Build the user message content
        user_content = []
        if image_b64:
            # Strip data URI prefix if present for the API
            img_data = image_b64
            if "," in img_data:
                img_data = img_data.split(",", 1)[1]
            user_content.append({
                "type": "image_url",
                "image_url": {"url": f"data:image/jpeg;base64,{img_data}"},
            })
        user_content.append({"type": "text", "text": message})

        # Build messages array
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        if conversation:
            messages.extend(conversation)
        messages.append({"role": "user", "content": user_content})

        # Determine API URL
        url = base_url or "https://openrouter.ai/api/v1/chat/completions"

        # Headers
        headers = {"Content-Type": "application/json"}
        if api_key:
            headers["Authorization"] = f"Bearer {api_key}"
        if provider_id == "openrouter":
            headers["HTTP-Referer"] = "https://github.com/ai-smart-bin"
            headers["X-Title"] = "Smart Bin - Binjamin"

        payload = {
            "model": model or "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
            "messages": messages,
            "tools": TOOLS,
            "max_tokens": 400,
            "temperature": 0.7,
        }

        log.info(f"Binjamin chat: model={payload['model']}, provider={provider_id}")

        # Agentic tool-use loop (max 5 iterations)
        all_tool_calls = []
        for _ in range(5):
            try:
                with httpx.Client(timeout=30.0) as client:
                    resp = client.post(url, headers=headers, json=payload)
                    resp.raise_for_status()
                    data = resp.json()
            except Exception as e:
                log.error(f"Binjamin API error: {e}")
                return {
                    "response": "*blinks confusedly* My brain isn't working right now...",
                    "tool_calls": [],
                    "conversation": conversation or [],
                    "error": str(e),
                }

            choices = data.get("choices", [])
            if not choices:
                return {
                    "response": "...",
                    "tool_calls": [],
                    "conversation": conversation or [],
                }

            assistant_msg = choices[0].get("message", {})
            finish_reason = choices[0].get("finish_reason", "")

            # No tool calls — we're done
            if finish_reason != "tool_calls" and not assistant_msg.get("tool_calls"):
                text = assistant_msg.get("content", "") or ""

                # Build updated conversation
                updated = (conversation or []).copy()
                updated.append({"role": "user", "content": user_content})
                updated.append({"role": "assistant", "content": text})

                return {
                    "response": text,
                    "tool_calls": all_tool_calls,
                    "conversation": updated,
                }

            # Process tool calls
            tool_calls = assistant_msg.get("tool_calls", [])
            assistant_block = {"role": "assistant", "content": assistant_msg.get("content", "")}
            if tool_calls:
                assistant_block["tool_calls"] = tool_calls
            messages.append(assistant_block)

            for tc in tool_calls:
                fn = tc.get("function", {})
                name = fn.get("name", "")
                try:
                    args = json.loads(fn.get("arguments", "{}"))
                except json.JSONDecodeError:
                    args = {}

                result = self._execute_tool(name, args)
                all_tool_calls.append({"name": name, "args": args, "result": result})

                messages.append({
                    "role": "tool",
                    "tool_call_id": tc.get("id", ""),
                    "content": str(result),
                })

            # Update payload for next iteration
            payload["messages"] = messages

        # Max iterations reached
        return {
            "response": "*overthinks and short-circuits a little*",
            "tool_calls": all_tool_calls,
            "conversation": conversation or [],
        }

    def _execute_tool(self, name, args):
        """Execute a tool call against the hardware."""
        try:
            if name == "move_head":
                pan = max(-1, min(1, float(args.get("pan", 0))))
                tilt = max(-1, min(1, float(args.get("tilt", 0))))
                self.hw.set_pan(pan)
                self.hw.set_tilt(tilt)
                return f"Head moved to pan={pan:.2f}, tilt={tilt:.2f}"

            elif name == "play_emote":
                emote = args.get("emote", "nod")
                return f"Emote '{emote}' performed"

            elif name == "set_mood":
                color = args.get("color", "white")
                self.hw.set_led(color)
                return f"LED set to {color}"

            elif name == "capture_and_describe":
                jpeg = self.hw.capture_photo()
                if jpeg:
                    return f"Captured frame ({len(jpeg)} bytes). Describe what you see based on the image provided."
                return "Camera capture failed — no image available."

            elif name == "sort_item":
                category = args.get("category", "general")
                # Pan to the correct bin position
                presets = {
                    "general": -0.7,
                    "recycling": 0.0,
                    "compost": 0.7,
                }
                pan = presets.get(category, 0.0)
                self.hw.set_pan(pan)
                time.sleep(0.5)
                self.hw.set_tilt(-0.6)
                time.sleep(1.0)
                self.hw.set_tilt(0.0)
                time.sleep(0.5)
                self.hw.set_pan(0.0)
                return f"Item sorted into {category} bin"

            else:
                return f"Unknown tool: {name}"

        except Exception as e:
            log.error(f"Tool execution error ({name}): {e}")
            return f"Error executing {name}: {str(e)}"


# ── Module-level instance ──

_binjamin = None


def init(hw):
    """Initialize the Binjamin personality engine."""
    global _binjamin
    _binjamin = Binjamin(hw)
    log.info("Binjamin initialized")


def chat(message, image_b64=None, conversation=None, provider_id=None,
         api_key=None, model=None, base_url=None):
    """Module-level chat interface."""
    if _binjamin is None:
        return {"response": "Binjamin isn't awake yet.", "tool_calls": [], "conversation": []}
    return _binjamin.chat(
        message=message,
        image_b64=image_b64,
        conversation=conversation,
        provider_id=provider_id,
        api_key=api_key,
        model=model,
        base_url=base_url,
    )
