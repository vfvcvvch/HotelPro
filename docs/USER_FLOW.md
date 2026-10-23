# HotelPro - User Flow Diagrams

This document illustrates the end-to-end operational workflows for Guests, Staff, and Administrators in HotelPro.

---

## 1. Guest Booking & Payment Flow

```mermaid
sequenceDiagram
    autonumber
    actor Guest as Guest User
    participant Frontend as React Client
    participant Server as Express Server
    participant DB as MongoDB

    Guest->>Frontend: Enter City, Dates & Guests in Hero Search
    Frontend->>Server: GET /api/rooms?city=...&checkIn=...&checkOut=...
    Server->>DB: Query Available Rooms & Filter Dates
    DB-->>Server: Return Matching Rooms
    Server-->>Frontend: Display Hotel & Room Cards
    Guest->>Frontend: Select Room & Click "Reserve Now"
    Frontend->>Guest: Prompt Login (if guest not logged in)
    Guest->>Frontend: Fill Guest Information & Promo Code
    Frontend->>Server: POST /api/bookings (Validate dates & create pending booking)
    Server->>DB: Lock Room for Requested Dates
    Server-->>Frontend: Return Booking Details & Bill Summary
    Guest->>Frontend: Enter Payment Details & Confirm
    Frontend->>Server: POST /api/payments (Simulate Gateway)
    Server->>DB: Update Booking (paid) & Create Payment Record
    Server-->>Frontend: Return Success, Transaction ID & Invoice
    Frontend->>Guest: Display Booking Voucher & Download Invoice
```

---

## 2. Staff Check-In & Housekeeping Flow

```mermaid
stateDiagram-v2
    [*] --> Available: Room Cleaned & Ready
    Available --> Occupied: Guest Check-In Confirmed by Staff
    Occupied --> Cleaning: Guest Check-Out Processed
    Cleaning --> Maintenance: Defect Reported (AC, Plumbing)
    Maintenance --> Cleaning: Repair Resolved
    Cleaning --> Available: Housekeeping Marks "Clean"
    Available --> [*]
```

---

## 3. Cancellation & Refund Workflow

```mermaid
flowchart TD
    A[Guest Views My Bookings] --> B{Booking Status?}
    B -->|Completed or Checked-In| C[Cancellation Not Allowed]
    B -->|Confirmed| D[Click 'Cancel Booking']
    D --> E[Enter Reason for Cancellation]
    E --> F[API: POST /api/bookings/:id/cancel]
    F --> G[Update Booking Status to 'Cancelled']
    G --> H[Update Payment Status to 'Refunded']
    H --> I[Release Room Availability in Calendar]
    I --> J[Toast Alert: Refund Initiated to Original Payment Method]
```
