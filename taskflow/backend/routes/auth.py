import json
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from .. import db, bcrypt
from ..models import User
from ..config import DEFAULT_SIDEBAR

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/api/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    username = (data.get("username") or "").strip()
    password = data.get("password") or ""
    if not username or not password:
        return jsonify({"error": "Username and password are required."}), 400
    if len(username) < 3:
        return jsonify({"error": "Username must be at least 3 characters."}), 400
    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters."}), 400
    if User.query.filter_by(username=username).first():
        return jsonify({"error": "That username is already taken. Please choose another."}), 409
    hashed = bcrypt.generate_password_hash(password).decode("utf-8")
    user = User(username=username, password=hashed)
    db.session.add(user); db.session.commit()
    token = create_access_token(identity=str(user.id))
    return jsonify({"token": token, "username": user.username, "theme": user.theme,
                    "sidebar_layout": json.loads(user.sidebar_layout)}), 201


@auth_bp.route("/api/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    username = (data.get("username") or "").strip()
    password = data.get("password") or ""
    if not username or not password:
        return jsonify({"error": "Please enter your username and password."}), 400
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({"error": "No account found with that username."}), 401
    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Incorrect password. Please try again."}), 401
    token = create_access_token(identity=str(user.id))
    return jsonify({"token": token, "username": user.username, "theme": user.theme,
                    "sidebar_layout": json.loads(user.sidebar_layout or DEFAULT_SIDEBAR)}), 200


@auth_bp.route("/api/me", methods=["GET"])
@jwt_required()
def me():
    user = db.session.get(User, int(get_jwt_identity()))
    if not user:
        return jsonify({"error": "User not found."}), 404
    return jsonify({"username": user.username, "theme": user.theme,
                    "sidebar_layout": json.loads(user.sidebar_layout or DEFAULT_SIDEBAR)}), 200


@auth_bp.route("/api/me/theme", methods=["PATCH"])
@jwt_required()
def set_theme():
    user = db.session.get(User, int(get_jwt_identity()))
    data = request.get_json() or {}
    theme = data.get("theme", "dark")
    if theme not in ("dark", "light"):
        return jsonify({"error": "Invalid theme."}), 400
    user.theme = theme; db.session.commit()
    return jsonify({"theme": user.theme}), 200


@auth_bp.route("/api/me/sidebar", methods=["PATCH"])
@jwt_required()
def set_sidebar():
    user = db.session.get(User, int(get_jwt_identity()))
    data = request.get_json() or {}
    layout = data.get("layout", [])
    custom = [i for i in layout if not i.get("builtin")]
    if len(custom) > 3:
        return jsonify({"error": "Maximum 3 custom categories allowed."}), 400
    user.sidebar_layout = json.dumps(layout)
    db.session.commit()
    return jsonify({"sidebar_layout": layout}), 200
