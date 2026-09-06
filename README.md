# Dental Clinic Management System

Staff console to manage doctors and appointments.

## Links (update after deploy)

| Item | Link |
| --- | --- |
| GitHub (`develop`) | https://github.com/Abdullah-Khawar/Dental_Clinic_Management_System |
| Frontend (Vercel) | https://dental-clinic-management-system-ebon.vercel.app |
| Backend (Vercel) | https://dental-clinic-management-system-cg7.vercel.app |
| API health | https://dental-clinic-management-system-cg7.vercel.app/api/health |
| Project document (PDF) | https://drive.google.com/your-project-doc |
| Loom walkthrough | https://www.loom.com/share/your-video-id |

## Stack

- Frontend: React + Vite, RTK Query, React Hook Form
- Backend: Node.js + Express
- Database: PostgreSQL (Sequelize) on Supabase
- Auth: Admin login with JWT cookie

## Run locally

```bash
# backend
cd backend
npm install
npm run migrate
npm run seed
npm run dev

# frontend
cd frontend
npm install
npm run dev
```

- App: http://localhost:5173  
- API: http://localhost:5000  

**Demo login:** `admin@dental.local` / `Admin123!`

## What’s included

- Dashboard with clear clinic stats
- Doctors CRUD (search, detail, active/inactive)
- Appointments CRUD (filters, status, overlap checks)
- Protected routes + reusable UI components

## API

| Method | Route |
| --- | --- |
| GET | `/api/health` |
| POST | `/api/auth/login` · `/api/auth/logout` |
| GET | `/api/user/profile` |
| CRUD | `/api/doctors` · `/api/doctors/:id` |
| CRUD | `/api/appointments` · `/api/appointments/:id` |
| GET | `/api/dashboard` |

## Notes

- Admin is created automatically on server start if missing
- Pending/Scheduled appointments need a current or future date/time

