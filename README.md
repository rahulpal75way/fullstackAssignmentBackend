# 📘 Backend - Appointment Booking System

A robust Node.js backend for handling authentication, appointment scheduling, and holiday management for service-based businesses like clinics, salons, or coworking spaces.

---

## 🚀 Tech Stack

* **Node.js** with **Express.js**
* **TypeScript**
* **MongoDB** with **Mongoose**
* **Passport.js** for authentication
* **JWT** based access and refresh tokens
* **Zod** (or custom validators)
* **Nodemailer** (Email support)
* **Docker** and **Docker Compose** (optional)

---

## 📂 Folder Structure

```sh
app/
├── common/
│   ├── dto/                   # Shared DTOs
│   ├── helper/                # Utility helpers
│   └── middleware/            # Global middlewares (auth, error)
├── services/
│   ├── email.service.ts       # Email notifications
│   └── passport-jwt.service.ts# JWT strategy config
├── user/
│   ├── user.controller.ts     # User-related logic
│   ├── user.route.ts          # User routes
│   ├── user.schema.ts         # User model
├── booking/
│   ├── booking.controller.ts  # Booking logic
│   ├── booking.route.ts       # Booking routes
│   ├── booking.schema.ts      # Booking model
├── calendar/
│   ├── holiday.controller.ts  # Holiday logic
│   ├── holiday.route.ts       # Holiday routes
│   ├── holiday.schema.ts      # Holiday model
├── index.ts                   # Entry point
├── routes.ts                  # Combined route mount point
```

---

## 📌 Features

* 🔐 User registration, login, logout, and token refresh
* 📅 Appointment booking with rescheduling and cancelation
* ❌ Holiday management (admin only)
* 🧑‍⚕️ Role-based access control (`USER`, `ADMIN`)
* 📬 Email notifications (e.g., reminders, confirmations)
* 📃 JWT middleware for protected routes

---

## 🧭 API Routes Summary

### Auth & Users

| Method | Route                  | Role   | Description              |
| ------ | ---------------------- | ------ | ------------------------ |
| POST   | `/users/register`      | Public | Register user            |
| POST   | `/users/login`         | Public | Login and receive tokens |
| POST   | `/users/logout`        | USER   | Logout user              |
| POST   | `/users/refresh-token` | Public | Refresh access token     |
| GET    | `/users/me`            | USER   | Get current user profile |

### Bookings

| Method | Route                 | Role  | Description                 |
| ------ | --------------------- | ----- | --------------------------- |
| POST   | `/booking`            | USER  | Create a new booking        |
| PUT    | `/booking/:id`        | USER  | Reschedule existing booking |
| PATCH  | `/booking/:id/cancel` | USER  | Cancel a booking            |
| GET    | `/booking`            | ADMIN | Get all bookings            |
| GET    | `/booking/:id`        | USER  | Get booking by ID           |

### Holidays (Admin Only)

| Method | Route          | Role  | Description       |
| ------ | -------------- | ----- | ----------------- |
| POST   | `/holiday`     | ADMIN | Add a holiday     |
| DELETE | `/holiday/:id` | ADMIN | Remove a holiday  |
| GET    | `/holiday`     | Any   | View all holidays |

---

## 🔐 Auth & Role Middleware

* `passport-jwt` for verifying tokens
* `roleAuth(["USER"])` and `roleAuth(["ADMIN"])` guards
* `catchError` to wrap async handlers cleanly

---

## 📦 Setup & Installation

```bash
git clone <repo-url>
cd backend
npm install
npm run local
```

---

## 🔧 .env Example

```env
PORT=8000
MONGO_URI=mongodb://localhost:27017/appointments
JWT_SECRET=supersecret
ACCESS_TOKEN_EXPIRE=15m
REFRESH_TOKEN_EXPIRE=7d
EMAIL_USER=you@example.com
EMAIL_PASS=yourpassword
```

---

## 📄 License

Currently, this project does not have a license.


## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.


## ✉️ Contact

rahulpal75way  (Contact information should be added here if desired)
