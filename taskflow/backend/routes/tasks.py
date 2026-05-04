from datetime import datetime, date, timedelta
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from .. import db
from ..models import Task, User

tasks_bp = Blueprint("tasks", __name__)


@tasks_bp.route("/api/tasks", methods=["GET"])
@jwt_required()
def get_tasks():
    user = db.session.get(User, int(get_jwt_identity()))
    tasks = Task.query.filter_by(user_id=user.id).order_by(Task.sort_order, Task.created.desc()).all()
    return jsonify([t.to_dict() for t in tasks]), 200


@tasks_bp.route("/api/tasks", methods=["POST"])
@jwt_required()
def create_task():
    user = db.session.get(User, int(get_jwt_identity()))
    data = request.get_json() or {}
    title = (data.get("title") or "").strip()
    if not title:
        return jsonify({"error": "Title is required."}), 400
    max_order = db.session.query(db.func.max(Task.sort_order)).filter_by(user_id=user.id).scalar() or 0
    tags_raw = data.get("tags", "")
    if isinstance(tags_raw, list):
        tags_raw = ",".join(tags_raw)
    due_raw = data.get("due_date") or None
    due_date = date.fromisoformat(due_raw) if due_raw else None
    task = Task(title=title, category=data.get("category", "work"), tags=tags_raw,
                due_date=due_date, sort_order=max_order + 1, user_id=user.id)
    db.session.add(task); db.session.commit()
    return jsonify(task.to_dict()), 201


@tasks_bp.route("/api/tasks/<int:task_id>", methods=["PATCH"])
@jwt_required()
def update_task(task_id):
    user = db.session.get(User, int(get_jwt_identity()))
    task = Task.query.filter_by(id=task_id, user_id=user.id).first()
    if not task:
        return jsonify({"error": "Task not found."}), 404
    data = request.get_json() or {}
    if "title" in data:
        t = data["title"].strip()
        if not t:
            return jsonify({"error": "Title cannot be empty."}), 400
        task.title = t
    if "category" in data:   task.category = data["category"]
    if "tags" in data:
        v = data["tags"]; task.tags = ",".join(v) if isinstance(v, list) else (v or "")
    if "done" in data:
        task.done = bool(data["done"]); task.done_at = datetime.utcnow() if task.done else None
    if "due_date" in data:
        raw = data["due_date"]
        task.due_date = date.fromisoformat(raw) if raw else None
    if "sort_order" in data:
        task.sort_order = int(data["sort_order"])
    db.session.commit()
    return jsonify(task.to_dict()), 200


@tasks_bp.route("/api/tasks/reorder", methods=["POST"])
@jwt_required()
def reorder_tasks():
    user = db.session.get(User, int(get_jwt_identity()))
    order = (request.get_json() or {}).get("order", [])
    for idx, tid in enumerate(order):
        t = Task.query.filter_by(id=tid, user_id=user.id).first()
        if t:
            t.sort_order = idx
    db.session.commit()
    return jsonify({"ok": True}), 200


@tasks_bp.route("/api/tasks/<int:task_id>", methods=["DELETE"])
@jwt_required()
def delete_task(task_id):
    user = db.session.get(User, int(get_jwt_identity()))
    task = Task.query.filter_by(id=task_id, user_id=user.id).first()
    if not task:
        return jsonify({"error": "Task not found."}), 404
    db.session.delete(task); db.session.commit()
    return jsonify({"message": "Deleted."}), 200


@tasks_bp.route("/api/notifications", methods=["GET"])
@jwt_required()
def get_notifications():
    user = db.session.get(User, int(get_jwt_identity()))
    today = date.today()
    tomorrow = today + timedelta(days=1)
    notifs = []
    for t in Task.query.filter_by(user_id=user.id, done=False).all():
        if not t.due_date:
            continue
        if t.due_date < today:
            notifs.append({"id": t.id, "title": t.title, "type": "overdue",   "due_date": t.due_date.isoformat()})
        elif t.due_date == today:
            notifs.append({"id": t.id, "title": t.title, "type": "today",     "due_date": t.due_date.isoformat()})
        elif t.due_date == tomorrow:
            notifs.append({"id": t.id, "title": t.title, "type": "tomorrow",  "due_date": t.due_date.isoformat()})
    return jsonify(notifs), 200
