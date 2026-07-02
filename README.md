# Fine-Dining Restaurant Reservation System

A production-ready, full-stack MERN (MongoDB, Express, React, Node.js) application built to manage restaurant table reservations. The system features a custom time-conflict engine, robust role-based access control (RBAC), and enterprise-grade optimizations including payload compression, rate-limiting, and partial unique database indexing.

---

## 1. Setup Instructions

This is a monorepo containing both the `frontend` and `backend`.

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (Local or Atlas URL)

### Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example` (or use the defaults in `config/env.js`).
4. (Optional) Run the seed script to populate mock tables and an admin user: `npm run seed`
5. Start the server: `npm run dev` (Runs on `http://localhost:5000` by default).

### Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Create a `.env` file and set `VITE_API_URL=http://localhost:5000/api`
4. Start the Vite development server: `npm run dev` (Runs on `http://localhost:5173` by default).

---

## 2. Assumptions Made

- **Strict 1-Hour Intervals**: The restaurant operates on strict, predefined 1-hour time blocks (e.g., 11:00 AM to 12:00 PM). This allows the backend to utilize a highly optimized, zero-math string-matching engine for checking availability.
- **Table Combination**: The system currently assigns a single table that best fits the `guestCount` rather than algorithmically pushing multiple smaller tables together.
- **Operating Hours**: The restaurant is assumed to be open from 11:00 AM to 10:00 PM universally, without special holiday hours implemented in this MVP.
- **Single Role**: A user is either exclusively a `customer` or an `admin`.

---

## 3. Explanation of Reservation and Availability Logic

The reservation engine is designed for maximum performance and absolute data integrity:

- **Smart Table Assignment**: When a customer requests a slot for 4 guests, the backend queries the database for all active tables with a capacity $\ge$ 4, sorting them from smallest to largest to optimize floor space.
- **High-Speed Availability Checking**: Instead of heavy math calculations, the availability engine scans existing reservations for the requested date and counts how many exact string matches (e.g., `"11:00"`) exist. If the number of occupied tables is less than the total suitable tables, the slot remains open.
- **Dynamic UI**: On the frontend, `React Query` polls this availability endpoint, instantly greying out time slots that have reached maximum capacity.
- **Race Condition Prevention**: To prevent two users from double-booking the exact same table at the exact same millisecond, a **Partial Unique Index** (`{ table: 1, reservationDate: 1, startTime: 1 }`) is enforced directly on the MongoDB Schema. The database kernel physically rejects collisions, throwing a 11000 duplicate key error that the Express error handler translates into a user-friendly 409 Conflict.

---

## 4. Explanation of Role-Based Access (User vs Admin)

RBAC is strictly enforced across both the backend and frontend:

- **Backend (JWT)**: Upon login, the server signs a JWT payload containing the user's ID. 
  - The `protect` middleware verifies the token and attaches a lightweight `.lean()` user object to the request.
  - The `authorize('admin')` middleware intercepts the request. If the attached user does not have the `admin` role, it rejects the request instantly with a `403 Forbidden` error.
- **Frontend (React Router)**: A custom `<ProtectedRoute>` wrapper intercepts route changes. It decodes the JWT claims stored in local state. If a standard user attempts to navigate to `/admin`, the wrapper catches the unauthorized role and redirects them to a 403 Error Page.

---

## 5. Known Limitations

- **Fixed Durations**: Because the system is heavily optimized for strict 1-hour blocks, it cannot natively handle custom duration requests (e.g., a VIP wanting a 2.5 hour slot) without manual database overrides.
- **No Email Integration**: Currently, reservations are confirmed instantly on the UI, but no transactional emails or SMS messages are dispatched to the customer.
- **Polling vs WebSockets**: The frontend relies on React Query's cache invalidation and polling to update table availability. It is not true real-time.

---

## 6. Areas for Improvement with Additional Time

If given additional time to scale the application, I would implement:
1. **WebSockets (Socket.io)**: Pushing real-time availability updates to all connected clients instantly so that a time slot visually vanishes the millisecond someone else books it, removing the need for HTTP polling.
2. **Turnaround/Cleaning Buffers**: Injecting a mandatory 15-minute "cleaning block" after a reservation completes before the table can be populated by the availability engine again.
3. **Automated Testing Suite**: Implementing `Jest` for unit testing the time-conflict logic and `Supertest` for integration testing the RBAC API routes.
4. **Transactional Notifications**: Integrating `SendGrid` or `Twilio` to fire off confirmation and reminder messages to users 24 hours before their booking.
