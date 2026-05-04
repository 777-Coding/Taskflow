from datetime import datetime
from . import db
from .config import DEFAULT_SIDEBAR


class User(db.Model):
    id             = db.Column(db.Integer, primary_key=True)
    username       = db.Column(db.String(80), unique=True, nullable=False)
    password       = db.Column(db.String(200), nullable=False)
    theme          = db.Column(db.String(10), default="dark")
    sidebar_layout = db.Column(db.Text, default=DEFAULT_SIDEBAR)
    created        = db.Column(db.DateTime, default=datetime.utcnow)
    tasks          = db.relationship("Task", backref="owner", lazy=True, cascade="all, delete-orphan")


class Task(db.Model):
    id         = db.Column(db.Integer, primary_key=True)
    title      = db.Column(db.String(200), nullable=False)
    category   = db.Column(db.String(50), default="work")
    tags       = db.Column(db.String(200), default="")
    done       = db.Column(db.Boolean, default=False)
    created    = db.Column(db.DateTime, default=datetime.utcnow)
    done_at    = db.Column(db.DateTime, nullable=True)
    due_date   = db.Column(db.Date, nullable=True)   # fixed: was String(10)
    sort_order = db.Column(db.Integer, default=0)
    user_id    = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)

    def to_dict(self):
        return {
            "id": self.id, "title": self.title, "category": self.category,
            "tags": [t.strip() for t in (self.tags or "").split(",") if t.strip()],
            "done": self.done, "created": self.created.isoformat(),
            "done_at": self.done_at.isoformat() if self.done_at else None,
            "due_date": self.due_date.isoformat() if self.due_date else None,
            "sort_order": self.sort_order,
        }
