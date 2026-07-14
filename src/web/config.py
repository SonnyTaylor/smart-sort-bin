"""
AI Smart Bin - Web Dashboard Configuration
"""

import os
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Database
DATABASE_PATH = os.path.join(BASE_DIR, "smartbin.db")

# Server
HOST = "0.0.0.0"
PORT = 8080
DEBUG = True

# Waste categories
CATEGORIES = ["general", "recycling", "compost"]

# Pi prototype mode - uses real servos/camera/LED via src/pi/hardware.py
# Override with: python app.py --mock  or  python app.py --pi
if "--pi" in sys.argv:
    PI_MODE = True
    MOCK_MODE = False
else:
    PI_MODE = False
    MOCK_MODE = True
