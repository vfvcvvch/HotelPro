# Steps for Project Execution - HotelPro

This guide provides clear, step-by-step instructions to run, test, and evaluate the **HotelPro** full-stack application on any machine.

---

## 📋 1. Prerequisites
- **Node.js**: v16.0.0 or higher (Tested on Node v20/v24)
- **npm**: v8.0.0 or higher
- **MongoDB**: (Optional) MongoDB local service on port 27017 or MongoDB Atlas URI in `server/.env`.
  > *Note: If MongoDB is not active on your machine, the built-in resilient in-memory storage engine takes over automatically, ensuring the app runs flawlessly.*

---

## 🚀 2. Quick Start Execution

### Step A: Start the Backend Server (Port 5000)
Open a terminal in the project directory:
```bash
cd hotelpro/server
npm install
npm run seed     # Seeds sample hotels in Goa, Mumbai, Jaipur, Manali, and test accounts
npm start        # Starts Express server on http://localhost:5000
```

### Step B: Start the Frontend Client (Port 5173)
Open a second terminal window:
```bash
cd hotelpro/client
npm install
npm run dev      # Launches Vite React development server on http://localhost:5173
```

Now open **`http://localhost:5173`** in Google Chrome or any browser!

---

## 🔑 3. Pre-Configured Test Accounts

For effortless presentation to college mentors, the navigation bar includes a **"1-Click Role Switcher"**, or you can login using these credentials:

| Persona | Email | Password | Role Description |
| :--- | :--- | :--- | :--- |
| **👤 Guest** | `guest@hotelpro.com` | `Password123!` | Search rooms, book, pay, cancel, and download invoices |
| **🛎️ Staff** | `staff@hotelpro.com` | `Password123!` | Front-desk arrivals/check-in, check-out, and housekeeping board |
| **🛡️ Admin** | `admin@hotelpro.com` | `Password123!` | Financial revenue charts, occupancy analytics, dynamic pricing |

---

## 🎯 4. Complete Evaluation Walkthrough

1. **MakeMyTrip Hero Search**:
   * On the homepage, select **Goa** (or Mumbai / Jaipur), pick dates, and click **"SEARCH HOTELS"**.
2. **Catalog Filters**:
   * On `/rooms`, use the price slider and amenity checkboxes (e.g. Free WiFi, Breakfast Included).
3. **Room Details & Instant Booking**:
   * Click any room card. Review the photos, specifications, and verified reviews.
   * Click **"BOOK NOW"**. In the checkout modal, notice the 20% discount code **`HOTELPRO20`** is applied.
4. **Payment Gateway & Tax Invoice**:
   * Enter test card details or select UPI / QR. Click **"PAY NOW"**.
   * Instant confirmation modal displays the official **GST Tax Invoice & Stay Voucher** with a printable format (`window.print()`).
5. **Guest Dashboard (`/my-bookings`)**:
   * View upcoming stays, check booking status badges, and test the 1-click **"Cancel Stay"** with 100% refund confirmation.
6. **Staff Command Center (`/staff`)**:
   * Click **"Staff Portal"** in the top demo bar.
   * Test the **"CHECK-IN GUEST"** button on pending arrivals.
   * View the **Housekeeping Room Matrix** and toggle room statuses (`Available`, `Occupied`, `Cleaning`, `Maintenance`).
7. **Admin Executive Console (`/admin`)**:
   * Click **"Admin Console"** in the top bar.
   * Review the SVG Monthly Revenue and Room Type Occupancy charts.
   * Use the **"Update Price"** tool to dynamically modify seasonal room tariffs.
   * View real-time security & audit activity logs.
