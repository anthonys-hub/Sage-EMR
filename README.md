# Sage EMR

A full-stack Electronic Medical Records (EMR) platform built for staff at a medical office, featuring patient management, scheduling, waitlists, case tracking, and reporting, all in one place.

Built from the ground up with React, Node/Express, and PostgreSQL, informed by real-world experience working in a medical office environment.

## 🔗 Live Demo

**[sage-emr.vercel.app](https://sage-emr.vercel.app)**

Try it out with the demo admin account:

```
Email:    demo@sageemr.com
Password: [your password]
```

> This is a shared demo account — data may reflect other visitors' testing. Feel free to poke around the Schedule, Patients, Charts, and Reports pages.

## Features

- **Schedule** — daily multi-doctor calendar view with appointment creation, editing, status tracking (scheduled, arrived, cancelled, no-show, etc.), and a waitlist panel
- **Patients** — searchable patient directory, full profile editing, visit history, and case management
- **Charts** — per-patient visit history with vitals and clinical notes
- **Reports** — recall list showing patients without upcoming appointments, so staff can follow up
- **Settings** — profile picture upload for staff accounts
- **Auth** — JWT-based login with role support (admin/doctor/staff)

## Tech Stack

**Frontend**
- React + Vite
- Tailwind CSS
- React Router

**Backend**
- Node.js + Express
- PostgreSQL
- JWT authentication, bcrypt password hashing

**Deployment**
- Frontend: Vercel
- Backend + Database: Railway

## Project Structure

```
Sage-EMR/
├── client/          # React frontend (Vite)
└── server/          # Express backend
    ├── db/          # DB connection + schema
    ├── middleware/  # Auth middleware
    └── routes/      # API routes (auth, patients, appointments, etc.)
```

## Running Locally

1. Clone the repo
2. Set up a local PostgreSQL database and run `server/db/schema.sql`
3. Create a `.env` file in `server/` with:
   ```
   PORT=5000
   DB_HOST=localhost
   DB_USER=your_pg_user
   DB_PASSWORD=your_pg_password
   DB_NAME=your_db_name
   DB_PORT=5432
   JWT_SECRET=your_secret_key
   ```
4. Install dependencies and run both apps:
   ```bash
   cd server && npm install && npm start
   cd client && npm install && npm run dev
   ```
