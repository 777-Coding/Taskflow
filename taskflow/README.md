# TaskFlow

A clean, full-stack task management app with user authentication, categories, due dates, drag-and-drop reordering, and a dark/light theme.

## Features

- 🔐 User registration and login with JWT authentication
- ✅ Create, edit, complete, and delete tasks
- 🏷️ Categories (Work, Personal, Urgent) and custom tags
- 📅 Due dates with overdue / today / upcoming indicators
- 🔔 Notification bell for upcoming and overdue tasks
- 🖱️ Drag-and-drop task reordering
- ✏️ Edit mode for bulk complete / bulk delete
- 📊 Quick view panel (today, overdue, this week)
- 🌙 Dark and light theme, persisted per user
- 📂 Custom sidebar categories (up to 3)

## Tech Stack

**Frontend:** React, Vite  
**Backend:** Python, Flask, Flask-JWT-Extended, SQLAlchemy  
**Database:** SQLite (local) / PostgreSQL (production)

## Running Locally

### Backend

```bash
cd taskflow
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install flask flask-cors flask-sqlalchemy flask-bcrypt flask-jwt-extended python-dotenv

cp backend/.env.example backend/.env
# Edit backend/.env and set a strong JWT_SECRET_KEY

python app.py
```

The API will be running at `http://localhost:5000`.

### Frontend

```bash
cd frontend
npm install

cp .env.example .env
# .env already points to http://localhost:5000/api for local dev

npm run dev
```

The app will be running at `http://localhost:5173`.

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `JWT_SECRET_KEY` | Secret key for signing JWT tokens — make this long and random |
| `DATABASE_URL` | SQLAlchemy DB URI, defaults to SQLite |

### Frontend (`frontend/.env`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API |

## Project Structure

```
taskflow/
├── app.py                  # Entry point
├── backend/
│   ├── config.py
│   ├── models.py
│   ├── __init__.py
│   └── routes/
│       ├── auth.py
│       └── tasks.py
└── frontend/
    └── src/
        ├── components/     # Toast, TaskItem, Sidebar, etc.
        ├── pages/          # AuthScreen, Dashboard
        ├── hooks/          # useToast
        ├── services/       # api.js
        └── utils/          # dateHelpers.js
```
