# 📘 Frontend - Appointment Booking System

A user-friendly React-based frontend for an appointment booking system tailored for clinics, salons, and coworking spaces. Built with modern tools and libraries to ensure performance, scalability, and a seamless user experience.

---

## 🚀 Tech Stack

* **React** (with Vite)
* **TypeScript**
* **Redux Toolkit** with **RTK Query**
* **React Router** for navigation
* **Material UI** + **Tailwind CSS** for design
* **React Hook Form** + **Zod** for form validation
* **Day.js** for date/time formatting

---

## 📂 Folder Structure

```sh
src/
├── assets/                     # Static files
├── components/                 # Reusable UI components
│   └── Booking/                # Booking-related components (calendar, form)
├── layout/                     # Layouts for user/admin
├── pages/                      # Page-level components
│   ├── Booking.tsx             # Booking calendar
│   ├── Profile.tsx             # User profile & booking history
│   ├── AdminDashboard.tsx      # Admin interface for managing bookings & holidays
├── services/
│   ├── api.ts                  # RTK Query API definitions
│   └── baseQuery.ts            # Base query with token refresh logic
├── store/
│   ├── reducers/               # Redux slices (auth, booking)
│   └── store.ts                # Root store
├── App.tsx
├── main.tsx
```

---

## 📌 Features

* 🔐 User registration, login, and logout
* 📅 Real-time appointment booking and rescheduling
* ❌ Cancel appointments
* 📤 Token auto-refresh using `baseQuery`
* 🧑‍⚕️ Admin panel to manage holidays and view bookings
* 📆 Holiday-aware calendar that disables unavailable dates
* 🛎️ Notifications via email + toast UI

---

## 🧭 App Routes

| Path       | Role   | Description                       |
| ---------- | ------ | --------------------------------- |
| `/login`   | Public | User/admin login and registration |
| `/`        | User   | Booking calendar and form         |
| `/profile` | User   | View personal bookings            |
| `/admin`   | Admin  | Manage bookings & holidays        |

---

## 🔌 API Integration (via RTK Query)

* All calls routed through `services/api.ts`
* Uses `baseQuery.ts` for handling access token expiry and refresh
* Supports caching, polling, and automated tag invalidation

---

## 📦 Setup & Installation

```bash
git clone <repo-url>
cd frontend
npm install
npm run dev
```

---

## 🔧 .env Example

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

---

## 📄 License

Currently, this project does not have a license.


## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.


## ✉️ Contact

rahulpal75way  (Contact information should be added here if desired)
