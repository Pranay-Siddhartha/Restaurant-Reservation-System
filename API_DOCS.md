# API Documentation

Base URL: `/api` (e.g., `http://localhost:5000/api`)

All endpoints returning JSON use the standard format (or something similar depending on the error handler):
```json
{
  "status": "success",
  "data": { ... }
}
```

## Authentication

### `POST /auth/register`
Register a new customer.
- **Body:** `name`, `email`, `password` (min 6 chars, uppercase, lowercase, number, special char)
- **Response:** `201 Created` with `user` and `token`

### `POST /auth/login`
Log in an existing user (customer or admin).
- **Body:** `email`, `password`
- **Response:** `200 OK` with `user` and `token`

## Users

### `GET /users/profile`
Get the current logged-in user's profile.
- **Auth:** Required
- **Response:** `200 OK` with `user` details (no password)

## Reservations (Customer)

### `POST /reservations`
Create a new reservation. The system automatically assigns a table.
- **Auth:** Required (Customer only)
- **Body:** `reservationDate` (YYYY-MM-DD), `startTime` (HH:mm), `endTime` (HH:mm), `guestCount` (number)
- **Response:** `201 Created` with reservation details. Returns `409 Conflict` if no tables are available.

### `GET /reservations/my`
Get a list of reservations for the logged-in customer.
- **Auth:** Required (Customer only)
- **Query:** `page` (default 1), `limit` (default 10), `status` (optional: confirmed, cancelled, completed)
- **Response:** `200 OK` with paginated reservations.

### `DELETE /reservations/:id`
Cancel a reservation. Only confirmed reservations can be cancelled.
- **Auth:** Required (Customer only, must own reservation)
- **Response:** `200 OK` with updated reservation (status changed to 'cancelled').

## Admin - Reservations

### `GET /admin/reservations`
Get a list of all reservations in the system.
- **Auth:** Required (Admin only)
- **Query:** `page`, `limit`, `date` (optional filter), `status` (optional filter), `search` (optional by customer name/email)
- **Response:** `200 OK` with paginated reservations.

### `PATCH /admin/reservations/:id`
Update a reservation (e.g., change status to completed or cancelled).
- **Auth:** Required (Admin only)
- **Body:** `status` (confirmed, cancelled, completed), or other allowed fields.
- **Response:** `200 OK` with updated reservation.

### `DELETE /admin/reservations/:id`
Cancel any reservation.
- **Auth:** Required (Admin only)
- **Response:** `200 OK`

### `GET /admin/stats`
Get dashboard statistics.
- **Auth:** Required (Admin only)
- **Response:** `200 OK` with `totalReservations`, `todaysReservations`, `activeReservations`, `totalTables`, `occupancyRate`.

## Admin - Tables

### `GET /tables`
Get all tables in the system.
- **Auth:** Required (Admin/Customer for reading, usually admin)
- **Query:** `page`, `limit`
- **Response:** `200 OK` with paginated tables.

### `POST /tables`
Create a new table.
- **Auth:** Required (Admin only)
- **Body:** `tableNumber` (number), `capacity` (number), `isActive` (boolean, default true)
- **Response:** `201 Created` with table details.

### `PATCH /tables/:id`
Update table details.
- **Auth:** Required (Admin only)
- **Body:** `tableNumber`, `capacity`, `isActive`
- **Response:** `200 OK`

### `DELETE /tables/:id`
Delete a table. Fails if there are future confirmed reservations for this table.
- **Auth:** Required (Admin only)
- **Response:** `200 OK`
