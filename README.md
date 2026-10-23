# HotelPro - Complete Hotel Booking & Management Solution

HotelPro is an end-to-end modern Hotel Management System built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js). Designed for boutique hotels and enterprise hospitality chains, it provides seamless room booking for guests, real-time management for hotel staff, and comprehensive financial and operational analytics for administrators.

---

## 🌟 Key Features

### 👤 Guest Experience
- **Smart Catalog & Search:** Filter rooms by category, amenities, capacity, and date availability.
- **Reservation Workflow:** Interactive booking process with automated total price and tax calculation.
- **Secure Payments:** Payment portal with simulation and instant invoice generation.
- **Guest Dashboard:** Real-time booking tracking, cancellation/refund requests, and stay history.
- **Ratings & Reviews:** Leave verified feedback for rooms and hotel services.

### 🛎️ Hotel Staff Portal
- **Front-Desk Check-In & Check-Out:** Live status updates for arriving and departing guests.
- **Room Status Management:** Track and toggle room states (`Available`, `Occupied`, `Cleaning/Dirty`, `Maintenance`).
- **Housekeeping & Service Requests:** Coordinate maintenance and guest amenities in real-time.

### 📊 Management & Admin Dashboard
- **Room & Inventory Control:** Dynamic seasonal pricing, category configuration, and capacity management.
- **Visual Analytics:** Interactive charts for occupancy rates, monthly revenue, and booking volume.
- **User & Staff Administration:** Role-Based Access Control (`Guest`, `Staff`, `Admin`).
- **Audit & Activity Logs:** Security monitoring and system health tracking.

---

## 🛠️ Technology Stack

- **Frontend:** React.js, React Router v6, Redux Toolkit, Modern CSS3 & Glassmorphism UI, Recharts / Chart.js, React-Toastify
- **Backend:** Node.js, Express.js, JSON Web Tokens (JWT), bcryptjs, Multer, CORS
- **Database:** MongoDB & Mongoose ODM
- **Security:** Password hashing, JWT auth guards, Role-based authorization

---

## 📂 Project Structure

```text
hotelpro/
├── client/              # React frontend application
│   ├── public/
│   └── src/
│       ├── components/  # Reusable UI components
│       ├── pages/       # Guest, Staff & Admin views
│       ├── services/    # API callers
│       └── context/     # State management
├── server/              # Express REST API backend
│   ├── config/          # Database connection
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth & RBAC guards
│   ├── models/          # Mongoose Schemas
│   ├── routes/          # Express API routes
│   └── seed/            # Demo data generator
└── docs/                # Architecture diagrams & ER schemas
```
