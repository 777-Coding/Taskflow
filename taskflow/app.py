import logging
import os
from backend import create_app, db
from sqlalchemy import inspect, text
from backend.config import DEFAULT_SIDEBAR

app = create_app()

log = logging.getLogger("werkzeug")
class _F(logging.Filter):
    def filter(self, r): return "/api/" in r.getMessage()
log.addFilter(_F())

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        inspector = inspect(db.engine)
        tcols = [c["name"] for c in inspector.get_columns("task")]
        ucols = [c["name"] for c in inspector.get_columns("user")]
        migrations = []
        if "due_date"       not in tcols: migrations.append("ALTER TABLE task ADD COLUMN due_date DATE")
        if "sort_order"     not in tcols: migrations.append("ALTER TABLE task ADD COLUMN sort_order INTEGER DEFAULT 0")
        if "tags"           not in tcols: migrations.append("ALTER TABLE task ADD COLUMN tags VARCHAR(200) DEFAULT ''")
        if "done_at"        not in tcols: migrations.append("ALTER TABLE task ADD COLUMN done_at DATETIME")
        if "theme"          not in ucols: migrations.append("ALTER TABLE user ADD COLUMN theme VARCHAR(10) DEFAULT 'dark'")
        if "sidebar_layout" not in ucols: migrations.append(f"ALTER TABLE user ADD COLUMN sidebar_layout TEXT DEFAULT '{DEFAULT_SIDEBAR}'")
        if migrations:
            with db.engine.connect() as conn:
                for sql in migrations:
                    try: conn.execute(text(sql)); conn.commit()
                    except: pass
      port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
