# Student Information Management System

A professional full-stack Student Information Management System built with:

- **Frontend:** React.js + Vite + Tailwind CSS + React Router v7 + Axios + Lucide React
- **Backend:** Node.js + Express + MySQL
- **API:** RESTful CRUD endpoints for students and departments

## Features

- Real-time Dashboard with student statistics (total, active, graduated, inactive, average GPA)
- Student directory with live search, department filtering, and status filtering
- Add, view, edit, and delete student records
- Detailed student profile view
- Department management and creation modal
- Automatic database and table creation on startup
- Synchronized demo data seeder from `frontend/src/data/demoData.json`
- Responsive, modern Tailwind CSS UI

## Quick Start

### 1. Configure and Run Backend

Ensure your local MySQL service is running. Configure credentials in `backend/.env`:

```env
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD="your_password"
MYSQL_DATABASE=student_information_system
PORT=8000
CORS_ORIGIN=http://localhost:5173
```

Install dependencies and start the backend:

```bash
cd backend
npm install
npm start
```

> **Note:** The server automatically creates the MySQL database `student_information_system` and all tables if they do not exist. If the database is empty, it also automatically populates the demo data from `frontend/src/data/demoData.json`.

To manually re-seed the exact demo JSON data at any time:
```bash
npm run seed
```

You can also import `backend/student_information_system.sql` directly into MySQL via MySQL Workbench or CLI:
```bash
mysql -u root -p < student_information_system.sql
```

Backend API URL: http://127.0.0.1:8000

### 2. Configure and Run Frontend

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend Application URL: http://localhost:5173

Set `VITE_API_URL` in the frontend environment if your backend runs on a custom URL or port (default: `http://127.0.0.1:8000/api`).

## API Endpoints

- `GET /api/dashboard/` — Overview metrics and recent student list
- `GET /api/students/` — List all students (supports `?search=`, `?department=`, `?status=`)
- `POST /api/students/` — Register a new student
- `GET /api/students/:id/` — Detailed profile of a single student
- `PUT /api/students/:id/` — Update a student record
- `DELETE /api/students/:id/` — Delete a student record
- `GET /api/departments/` — List academic departments with student counts
- `POST /api/departments/` — Create a new department
