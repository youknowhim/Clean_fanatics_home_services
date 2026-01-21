🏠 On-Demand Home Services Booking System

A full-stack application that demonstrates the core booking lifecycle for an on-demand home services marketplace, where customers create service requests and providers fulfill them, with admin oversight.

This project focuses on real-world system behavior, including state transitions, failure handling, audit logs, and role-based access.

📌 Features Overview
Core Booking Lifecycle

Create booking (customer)

Provider workflow (accept, reject, in-progress, completed)

Booking status transitions:

pending → assigned → in_progress → completed


Graceful failure handling:

Customer cancellation

Provider rejection

Admin intervention

Observability & Audit

Per-booking status history

Full booking history (including deleted bookings)

Actor tracking (customer / provider / admin)

👥 Roles & Responsibilities
👤 Customer

Create a booking

Cancel a booking (hard delete)

View own bookings (UI-level)

Business rule

Customer cancellation deletes the booking from active bookings

Cancellation event is still recorded in history

🧑‍🔧 Provider

View assigned bookings

Accept or reject bookings

Move bookings to:

in_progress

completed

Cannot delete bookings

Business rule

Provider rejection moves booking back to pending

All actions are logged with actor = provider

🛠️ Admin

View all active bookings

Cancel or reset bookings (override)

View:

Per-booking status history

Full booking history (including deleted bookings)

Business rule

Admin does not “accept” bookings like a provider

Admin acts as an operational supervisor

All admin actions are logged with actor = admin

🧠 Design Decisions (Important)
1️⃣ Separation of State vs History

bookings table → current, active state

booking_status_history table → immutable audit log

This allows:

Full observability

Deleted bookings to retain history

Simple admin debugging

2️⃣ Why History Stores Booking Details

The history table stores:

customer_name

service

location

This ensures:

History remains meaningful even after booking deletion

No need for soft deletes or joins with missing rows

3️⃣ Why Deleted Bookings Disappear from UI

Customer cancellation removes booking from bookings

UI reflects only active bookings

History is visible only in Admin views

This mimics real production systems.

4️⃣ Latest Status Logic

To fetch the latest status per booking, the system uses:

MAX(id)


instead of timestamp to avoid collisions when multiple events occur within the same second.

🗄️ Database Schema
bookings (Current State)
id
customer_name
service
location
status
created_at

booking_status_history (Audit Log)
id
booking_id
customer_name
service
location
old_status
new_status
actor
timestamp

🔄 Booking Cancellation Logic
Actor	Behavior
Customer	Insert cancelled in history → delete booking
Provider	Move booking back to pending
Admin	Move booking back to pending

History is always written before delete.

🧪 Observability
Per-Booking History

Available in Admin panel

Shows full lifecycle with actor and timestamps

Full Booking History

Shows latest status of every booking ever created

Includes deleted bookings

Uses history table only

🛠️ Tech Stack
Backend

Node.js

Express

MySQL

mysql2

dotenv

Frontend

React

Tailwind CSS

Fetch API

⚙️ Project Setup
1️⃣ Clone Repository
git clone <repo-url>
cd backend

2️⃣ Install Backend Dependencies
npm install

3️⃣ Environment Variables (.env)

Create a .env file in the backend root:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=booking_system


⚠️ .env is not committed to Git.

4️⃣ Start Backend Server
node server.js


Server runs on:

http://localhost:3000

5️⃣ Frontend Setup
cd frontend
npm install
npm run dev

🔐 Role-Based Access (UI-Level)

This project uses UI-level role separation for simplicity:

Customer, Provider, Admin views are separate screens

Backend trusts the actor field for lifecycle logging

Authentication is out of scope for this assignment

🚫 Out of Scope (Intentionally)

Authentication / authorization

Payments

Provider assignment algorithm

Real-time updates

Notifications

✅ Assignment Requirements Mapping
Requirement	Status
Create booking	✅
Assign provider	✅ (accept/reject)
Partner workflow	✅
Status lifecycle	✅
Cancellations	✅
Failure handling	✅
Manual override	✅
Observability	✅
Admin panel	✅
🧾 Final Notes

This project prioritizes:

Correct lifecycle modeling

Clear separation of responsibilities

Realistic backend behavior

Simplicity over over-engineering

It is designed to demonstrate how real systems behave, not just CRUD operations.

👨‍💻 Author
Pallav Rai

Full Stack Engineering Intern Assignment
