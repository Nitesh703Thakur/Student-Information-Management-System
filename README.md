# Student Information Management System

A professional full-stack Student Information Management System built with:

- **Frontend:** React.js + Vite + Tailwind CSS + React Router + Axios + Lucide React
- **Backend:** Django + Django REST Framework + SQLite
- **API:** RESTful CRUD endpoints for students and departments

## Features

- Dashboard with student statistics
- Student list with search, filtering and pagination
- Add, edit and delete students
- Student profile/detail view
- Department management
- Responsive professional admin UI
- Django REST API
- Seed command with demo data

## Run backend

```bash
cd backend
python -m venv venv
# Windows: venv\\Scripts\\activate
# macOS/Linux: source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_demo
python manage.py runserver
```

Backend: http://127.0.0.1:8000

## Run frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173

## API endpoints

- `GET /api/students/`
- `POST /api/students/`
- `GET /api/students/:id/`
- `PUT /api/students/:id/`
- `DELETE /api/students/:id/`
- `GET /api/departments/`
- `POST /api/departments/`
- `GET /api/dashboard/`
