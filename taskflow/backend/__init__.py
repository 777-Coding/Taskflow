from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager

from .config import Config

db     = SQLAlchemy()
bcrypt = Bcrypt()
jwt    = JWTManager()


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, resources={r"/api/*": {"origins": "*"}})
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    # JWT error handlers
    @jwt.expired_token_loader
    def expired_token(h, p):
        from flask import jsonify
        return jsonify({"error": "Session expired. Please sign in again.", "code": "token_expired"}), 401

    @jwt.invalid_token_loader
    def invalid_token(r):
        from flask import jsonify
        return jsonify({"error": "Invalid session. Please sign in again.", "code": "token_invalid"}), 401

    @jwt.unauthorized_loader
    def missing_token(r):
        from flask import jsonify
        return jsonify({"error": "Authentication required.", "code": "token_missing"}), 401

    # Register blueprints
    from .routes.auth import auth_bp
    from .routes.tasks import tasks_bp
    app.register_blueprint(auth_bp)
    app.register_blueprint(tasks_bp)

    # Catch-all
    @app.route("/", defaults={"path": ""}, methods=["GET", "POST", "OPTIONS"])
    @app.route("/<path:path>",             methods=["GET", "POST", "OPTIONS"])
    def catch_all(path):
        from flask import jsonify
        return jsonify({"error": "Not found"}), 404

    return app
