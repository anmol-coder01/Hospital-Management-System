# Hospital Management System (MERN-style: React + Express)

A full-stack Hospital Management System with:
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT authentication
- **Frontend**: React (Create React App), React Router, Axios

## Features
- User registration/login with JWT auth and roles (admin, doctor, receptionist)
- Patient management (create, view, search, update, delete)
- Doctor management (create, view, update, delete — admin only for write actions)
- Appointment booking & management (linking a patient with a doctor, date/time, status)
- Dashboard with live stats
- Protected routes on both frontend (React Router) and backend (JWT middleware)

## Project Structure
```
hospital-management-system/
├── backend/            # Express REST API
│   ├── config/         # DB connection
│   ├── controllers/    # Route handler logic
│   ├── middleware/     # Auth + error handling
│   ├── models/         # Mongoose schemas (User, Patient, Doctor, Appointment)
│   ├── routes/         # Express routers
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── frontend/           # React app
    ├── public/
    └── src/
        ├── api/         # Axios instance with JWT interceptor
        ├── components/  # Navbar, PrivateRoute
        ├── context/     # AuthContext (login/register/logout)
        ├── pages/       # Login, Register, Dashboard, Patients, Doctors, Appointments
        ├── App.js
        └── App.css
```

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB running locally, or a MongoDB Atlas connection string

### 1. Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env and set MONGO_URI and JWT_SECRET
npm install
npm run dev        # starts on http://localhost:5000 (requires nodemon, included in devDependencies)
# or: npm start
```

### 2. Frontend Setup
```bash
cd frontend
cp .env.example .env
# Edit .env if your backend runs on a different URL
npm install
npm start           # starts on http://localhost:3000
```

### 3. Using the App
1. Open http://localhost:3000
2. Register a new account (choose role: admin/doctor/receptionist)
3. Log in
4. Add doctors (admin role required), register patients, and book appointments
5. View live counts on the Dashboard

## API Overview (Backend)

| Method | Endpoint                  | Description                  | Auth Required |
|--------|----------------------------|-------------------------------|----------------|
| POST   | /api/auth/register          | Register new user             | No |
| POST   | /api/auth/login              | Login, returns JWT             | No |
| GET    | /api/auth/me                  | Get logged-in user profile     | Yes |
| GET    | /api/patients                  | List/search patients            | Yes |
| POST   | /api/patients                   | Create patient                   | Yes |
| GET/PUT/DELETE | /api/patients/:id         | Get/update/delete a patient       | Yes |
| GET    | /api/doctors                     | List doctors                       | Yes |
| POST/PUT/DELETE | /api/doctors(/:id)       | Manage doctors                      | Yes (admin) |
| GET    | /api/appointments                  | List appointments                    | Yes |
| POST/PUT/DELETE | /api/appointments(/:id) | Manage appointments                   | Yes |

## Notes
- Passwords are hashed with bcrypt before storage.
- JWT tokens are stored in `localStorage` on the frontend and attached automatically via an Axios interceptor.
- Only users with the `admin` role can create/update/delete doctors (adjust `authorize()` calls in `backend/routes/doctorRoutes.js` to change this policy).
- This project uses MongoDB, but the Mongoose models can be adapted to another database if preferred.
