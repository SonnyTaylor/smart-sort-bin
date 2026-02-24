"""
AI Smart Bin - Web Dashboard Configuration
"""

import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Database
DATABASE_PATH = os.path.join(BASE_DIR, "smartbin.db")

# Server
HOST = "0.0.0.0"
PORT = 8080
DEBUG = True

# Classification modes
MODE_YOLO = "yolo"
MODE_LLM = "llm"
DEFAULT_MODE = MODE_YOLO

# Waste categories
CATEGORIES = ["general", "recycling", "compost"]

# Default servo angles (degrees)
DEFAULT_ANGLES = {
    "general": 0,
    "recycling": 120,
    "compost": 240,
}

# LLM settings (OpenRouter)
OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"
OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY", "")
OPENROUTER_MODEL = "meta-llama/llama-4-scout"
LLM_TIMEOUT_SECONDS = 3

# Mock mode - set to False when running on real hardware
MOCK_MODE = True
