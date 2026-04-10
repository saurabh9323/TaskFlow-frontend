# Task & Project Management System

Built with **FastAPI** (backend) + **Next.js 14 TypeScript** (frontend) as an alternative stack to the Laravel + React assignment.

---

## Project Structure

```
task-management/
├── backend/                  # FastAPI
│   ├── app/
│   │   ├── main.py           # App entry point + APScheduler (overdue job)
│   │   ├── database.py       # SQLAlchemy engine + session
│   │   ├── models.py         # ORM models: User, Project, Task
│   │   ├── schemas.py        # Pydantic request/response schemas
│   │   ├── deps.py           # JWT auth dependencies
│   │   ├── routers/
│   │   │   ├── auth.py       # /auth/login, /auth/register, /auth/me
│   │   │   ├── projects.py   # CRUD /projects/
│   │   │   └── tasks.py      # CRUD /tasks/ + status transitions
│   │   ├── services/
│   │   │   └── task_service.py  # Overdue detection logic (Django-equivalent)
│   │   └── utils/
│   │       └── auth.py       # JWT + bcrypt helpers
│   ├── seed.py               # Seeds demo users, projects, tasks
│   ├── requirements.txt
│   └── .env.example
│
└── frontend/                 # Next.js 14 + TypeScript
    └── src/
        ├── app/
        │   ├── layout.tsx
        │   ├── page.tsx              # Redirects to /login or /projects
        │   ├── login/page.tsx        # Login form
        │   ├── projects/
        │   │   ├── page.tsx          # Projects grid
        │   │   └── [id]/page.tsx     # Project detail + Kanban board
        ├── components/
        │   ├── ui/
        │   │   ├── Navbar.tsx
        │   │   ├── Modal.tsx
        │   │   ├── Badges.tsx        # Status + Priority badges
        │   │   └── Spinner.tsx
        │   ├── projects/
        │   │   ├── ProjectCard.tsx
        │   │   └── CreateProjectModal.tsx
        │   └── tasks/
        │       ├── TaskCard.tsx      # Inline status transitions
        │       ├── TaskBoard.tsx     # Kanban columns
        │       ├── CreateTaskModal.tsx
        │       └── EditTaskModal.tsx
        ├── hooks/
        │   └── useAuth.ts
        ├── lib/
        │   ├── api.ts               # Axios instance with JWT interceptors
        │   └── auth.ts              # Login/logout/register helpers
        └── types/
            └── index.ts             # All TypeScript interfaces
```

---

## Overdue Task Logic

The `task_service.py` module implements the overdue rules (originally specified for Django):

| Rule | Behaviour |
|------|-----------|
| Past due date + not DONE | Automatically set to **OVERDUE** |
| Overdue → WIP / TODO | ❌ Blocked with 422 error |
| Overdue → DONE (member) | ❌ Blocked – admin only |
| Overdue → DONE (admin) | ✅ Allowed |

The overdue check runs **automatically every 15 minutes** via APScheduler.  
Admins can also trigger it manually from the project detail page.

---

## Role Permissions

| Action | Admin | Member |
|--------|-------|--------|
| Create project | ✅ | ❌ |
| Delete project | ✅ | ❌ |
| Create task | ✅ | ❌ |
| Delete task | ✅ | ❌ |
| Edit task (all fields) | ✅ | ❌ |
| Update own task status | ✅ | ✅ |
| View all tasks | ✅ | ❌ (own only) |
| Close overdue task | ✅ | ❌ |

---

## Setup & Run

### 1 – Backend

```bash
cd backend

# Copy and edit environment variables
cp .env.example .env
# Edit DATABASE_URL and SECRET_KEY in .env

# Install dependencies
pip install -r requirements.txt

# Seed the database (creates tables + demo data)
python seed.py

# Start the server
uvicorn app.main:app --reload --port 8000
```

API docs available at: http://localhost:8000/docs

---

### 2 – Frontend

```bash
cd frontend

# Copy env
cp .env.example .env.local
# Edit NEXT_PUBLIC_API_URL if needed

# Install dependencies
npm install

# Run development server
npm run dev
```

App available at: http://localhost:3000

---

## Test Credentials

| Role   | Email              | Password   |
|--------|--------------------|------------|
| Admin  | admin@demo.com     | admin123   |
| Member | member@demo.com    | member123  |
| Member | jane@demo.com      | jane123    |

---

## API Reference (Key Endpoints)

```
POST   /auth/register
POST   /auth/login
GET    /auth/me

GET    /projects/
POST   /projects/
GET    /projects/{id}
PUT    /projects/{id}
DELETE /projects/{id}

GET    /tasks/?project_id={id}
POST   /tasks/
GET    /tasks/{id}
PUT    /tasks/{id}
DELETE /tasks/{id}
POST   /tasks/run-overdue-check   ← Admin: manual trigger
GET    /tasks/users/all
```

---

## Deployment

### Backend (Render / Railway)
1. Set env vars: `DATABASE_URL`, `SECRET_KEY`
2. Build command: `pip install -r requirements.txt`
3. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Frontend (Vercel)
1. Set `NEXT_PUBLIC_API_URL` to your deployed backend URL
2. `npm run build` → deploy
