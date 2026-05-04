import os
from datetime import timedelta
import json
from dotenv import load_dotenv

load_dotenv()

DEFAULT_SIDEBAR = json.dumps([
    {"key": "all",       "label": "All tasks",  "builtin": True},
    {"key": "today",     "label": "Today",      "builtin": True},
    {"key": "personal",  "label": "Personal",   "builtin": True},
    {"key": "work",      "label": "Work",       "builtin": True},
    {"key": "urgent",    "label": "Urgent",     "builtin": True},
    {"key": "overdue",   "label": "Overdue",    "builtin": True},
    {"key": "completed", "label": "Completed",  "builtin": True},
])

class Config:
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL", "sqlite:///taskflow.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "change-this-in-production-please")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=12)
