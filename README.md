# HR System — Employee Leave & Attendance Management

A full-stack mini HR system for managing employee leave requests, attendance records, and employee data.

---

## 🔥 Live Demo (after deployment)

- **Frontend:** `https://your-frontend.vercel.app`
- **Backend API:** `https://your-backend.render.com`

---

## 📦 Tech Stack & Justification

| Layer | Technology | Reason |
|---|---|---|
| Frontend | React 18 + React Router v6 | Industry standard SPA, component reusability |
| Styling | Custom CSS (no framework) | Full control over design, zero bloat |
| Backend | Node.js + Express | Lightweight, fast REST API |
| Database | MongoDB + Mongoose | Flexible schema, great for HR data |
| Auth | JWT (jsonwebtoken) | Stateless, secure, scalable |
| Password | bcryptjs | Industry-standard hashing |
| Notifications | react-hot-toast | Clean UX toasts |

---

## 🚀 Installation & Local Setup

### Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)

### 1. Clone the repo
```bash
git clone https://github.com/your-username/hr-system.git
cd hr-system
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run seed        # Creates admin user
npm run dev         # Starts on port 5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
npm start           # Starts on port 3000
```

---

## 🔐 Environment Variables

### Backend (`backend/.env`)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hr-system
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend (`frontend/.env`)
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 👤 Admin Credentials (seeded)

```
Email:    admin@hrsystem.com
Password: Admin@123
```
> Run `npm run seed` inside the `backend/` folder to create the admin account.

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register employee |
| POST | `/api/auth/login` | Login (returns JWT) |
| GET | `/api/auth/me` | Get current user |

### Leaves
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/leaves` | Employee | Apply for leave |
| GET | `/api/leaves/my` | Employee | Get own leave requests |
| PUT | `/api/leaves/:id` | Employee | Edit pending leave |
| DELETE | `/api/leaves/:id` | Employee | Cancel pending leave |
| GET | `/api/leaves/all` | Admin | Get all leave requests |
| PUT | `/api/leaves/:id/review` | Admin | Approve / Reject leave |

### Attendance
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/attendance` | Employee | Mark today's attendance |
| GET | `/api/attendance/my` | Employee | Get own attendance history |
| GET | `/api/attendance/today` | Employee | Check if today is marked |
| GET | `/api/attendance/all` | Admin | All attendance (filterable) |

### Users (Admin)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/users` | Admin | List all employees |
| GET | `/api/users/:id` | Admin | Get one employee |

---

## 🗃️ Database Models

### User
| Field | Type | Notes |
|---|---|---|
| fullName | String | Required |
| email | String | Unique, required |
| password | String | Hashed with bcrypt, hidden |
| role | String | `employee` or `admin` |
| dateOfJoining | Date | Auto set on register |
| leaveBalance | Number | Default: 20 |

### Leave
| Field | Type | Notes |
|---|---|---|
| employee | ObjectId | Ref → User |
| leaveType | String | Casual / Sick / Paid |
| startDate | Date | Required |
| endDate | Date | Required |
| totalDays | Number | Auto-calculated |
| status | String | Pending / Approved / Rejected |
| reason | String | Optional |
| appliedDate | Date | Auto set |
| reviewedBy | ObjectId | Ref → User (admin) |
| reviewedAt | Date | When admin acted |

### Attendance
| Field | Type | Notes |
|---|---|---|
| employee | ObjectId | Ref → User |
| date | Date | Required, unique per employee/day |
| status | String | Present / Absent |
| markedAt | Date | Auto set |

**Relationships:**
- One User → Many Leaves
- One User → Many Attendance records
- One Leave → reviewed by one Admin

---

## 🛡️ Security Features

- JWT authentication on all protected routes
- Role-based access control (Employee vs Admin)
- bcrypt password hashing (12 rounds)
- Employees can only access their own data
- Proper HTTP status codes: 401 (Unauthorized), 403 (Forbidden), 404 (Not Found)
- CORS configured for frontend origin only

---

## 🤖 AI Tools Declaration

| Tool | Usage |
|---|---|
| Claude (Anthropic) | Initial scaffolding, boilerplate code generation, README template |

**Manual implementation (original logic):**
- Leave balance deduction logic on approval
- Single attendance per day enforcement
- Role-based route guards (both backend middleware and frontend routing)
- JWT interceptor and auto-logout on 401
- Admin review flow with state updates
- Edit/Cancel restrictions to Pending-only leaves

> All business logic was reviewed, understood, and verified manually. Code was not blindly copied.

---

## ⚠️ Known Limitations

- No email notifications (mock only)
- No pagination (all records loaded at once — fine for small teams)
- No password reset flow
- Admin cannot manually adjust leave balance
- No monthly/annual report generation

---

## ⏱️ Time Spent

| Task | Time |
|---|---|
| Planning & DB design | 30 min |
| Backend (API, models, auth) | 2.5 hr |
| Frontend (all pages, routing) | 3 hr |
| Styling & UX polish | 1 hr |
| README & cleanup | 30 min |
| **Total** | **~7.5 hours** |

---

## 📁 Project Structure

```
hr-system/
├── backend/
│   ├── config/
│   │   ├── db.js          # MongoDB connection
│   │   └── seed.js        # Admin seeder
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── leaveController.js
│   │   ├── attendanceController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── auth.js        # JWT protect + adminOnly
│   ├── models/
│   │   ├── User.js
│   │   ├── Leave.js
│   │   └── Attendance.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── leaves.js
│   │   ├── attendance.js
│   │   └── users.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── components/
│   │   │   └── Layout.js
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── EmployeeDashboard.js
│   │   │   ├── ApplyLeave.js
│   │   │   ├── MyLeaves.js
│   │   │   ├── MyAttendance.js
│   │   │   ├── AdminDashboard.js
│   │   │   ├── AdminLeaves.js
│   │   │   ├── AdminAttendance.js
│   │   │   └── AdminEmployees.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## 🚢 Deployment

### Backend (Render)
1. Push to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Set root directory: `backend`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables from `.env`

### Frontend (Vercel)
1. Create a new project on [vercel.com](https://vercel.com)
2. Set root directory: `frontend`
3. Framework: Create React App
4. Add env var: `REACT_APP_API_URL=https://your-backend.render.com/api`

<!-- mongodb+srv://rajni702358_db_user:<db_password>@cluster0.beioin8.mongodb.net/?appName=Cluster0 -->