# HotelPro - Roles and Responsibilities (RBAC Matrix)

HotelPro enforces strict Role-Based Access Control (RBAC) to ensure security, data integrity, and separation of duties.

---

## 1. Role Definitions

### 👤 1. Guest (Customer)
* **Goal:** Discover and reserve accommodations, review invoices, manage trip itineraries.
* **Permissions:**
  * View public hotel listings, room catalogs, and reviews.
  * Register, login, and update personal profile & contact details.
  * Create reservations, apply promotional codes, and simulate payments.
  * Access personal booking history and download invoices/stay vouchers.
  * Submit cancellation and refund requests for eligible reservations.
  * Leave verified ratings and reviews for completed reservations.

### 🛎️ 2. Hotel Staff (Front Desk & Housekeeping)
* **Goal:** Facilitate day-to-day on-site hospitality operations and guest service.
* **Permissions:**
  * View all arrivals and departures scheduled for the day.
  * Process guest **Check-In** (updating booking status to `checked-in` and room to `occupied`).
  * Process guest **Check-Out** (updating booking to `checked-out` and room to `cleaning`).
  * Update room housekeeping statuses (e.g. marking `cleaning` ➔ `available`).
  * View and resolve in-house guest service and maintenance requests.
  * *Restrictions:* Cannot alter base room prices, delete hotels, or access overall financial audit reports.

### 🛡️ 3. Hotel Administrator / Manager
* **Goal:** Oversee hotel properties, inventory, staffing, financial growth, and system health.
* **Permissions:**
  * Comprehensive access to Executive Analytics (revenue metrics, occupancy ratios, visual charts).
  * Room inventory management: Create, update, or decommission rooms.
  * Dynamic pricing control: Configure seasonal discounts and surge rates.
  * Staff administration: Create staff accounts and assign responsibilities.
  * Review audit logs for security, login activities, and transaction history.
  * Moderate reviews and process emergency reservation overrides.

---

## 2. Role-Based Access Control (RBAC) Matrix

| Module / Endpoint | Guest | Staff | Admin |
| :--- | :---: | :---: | :---: |
| Browse Rooms & Hotels | ✅ | ✅ | ✅ |
| Book Room & Make Payment | ✅ | ❌ | ✅ |
| View Own Bookings & Invoices | ✅ | ❌ | ✅ |
| Cancel Own Reservation | ✅ | ❌ | ✅ |
| Write Room Review | ✅ | ❌ | ❌ |
| Front-Desk Check-In / Check-Out | ❌ | ✅ | ✅ |
| Housekeeping Status Board | ❌ | ✅ | ✅ |
| Resolve Service Requests | ❌ | ✅ | ✅ |
| Manage Room Inventory & Pricing | ❌ | ❌ | ✅ |
| View Financial & Occupancy Analytics | ❌ | ❌ | ✅ |
| Manage Users & Staff Accounts | ❌ | ❌ | ✅ |
| View System Activity & Security Logs | ❌ | ❌ | ✅ |
