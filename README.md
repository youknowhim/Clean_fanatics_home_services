🏠 On-Demand Home Services Booking System

A full-stack application that demonstrates the core booking lifecycle of an on-demand home services marketplace.
Customers can create service requests, providers can fulfill them, and admins can monitor and intervene when needed.

This project focuses on real-world product behavior, not just CRUD.

📁 Project Structure
backend/
 ├── server.js
 ├── routes.js
 ├── dbconfig.js
 ├── .env
 ├── package.json

frontend/
 ├── src/
 │   ├── App.jsx
 │   ├── Customer.jsx
 │   ├── Provider.jsx
 │   ├── Admin.jsx
 ├── tailwind.config.js
 ├── package.json

⚙️ Setup Instructions (IMPORTANT)
1️⃣ Prerequisites

Node.js (v18+ recommended)
MySQL
npm

2️⃣Cloning
  git clone https://github.com/youknowhim/Clean_fanatics_home_services.git
  cd Clean_fanatics_home_services
3️⃣ Backend Setup
cd backend
npm install

3️⃣ Environment Variables

Create a .env file inside the backend folder:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=booking_system

------The database tables are auto-created on server start.-------

4️⃣ Start Backend Server
node server.js
Server runs at:
http://localhost:3000

5️⃣ Frontend Setup
cd frontend
npm install
npm run dev


Frontend runs at:

http://localhost:5173

🧠 How the System Works

The system models a real booking lifecycle with clear ownership and responsibilities.

👥 Role-Based Access & Responsibilities
👤 Customer

Create a booking

Cancel a booking

Business logic

Customer cancellation deletes the booking

Cancellation event is still stored in history

🧑‍🔧 Provider

View bookings

Accept or reject bookings
Assigned , if accepted by the Provider

Move booking to:

in_progress

completed

Business logic

Reject → UI change , it will be assigned to a provider later

Provider cannot delete bookings

🛠️ Admin

View all active bookings

Cancel or reset bookings (override)

View full booking history (including deleted bookings)

Business logic

Admin does not “accept” bookings

Admin acts as an operational supervisor

Admin can inspect audit logs

🔄 Booking Status Lifecycle
pending → in_progress → completed


Other flows:

Provider reject → rejected , assigned later

Admin cancel → pending

Customer cancel → booking deleted completely

🗄️ Database Design
bookings (Current State)

Stores only active bookings.

id
customer_name
service
location
status
created_at

booking_status_history (Audit Log)

Stores every lifecycle event, even after deletion.

id
booking_id
customer_name
service
location
old_status
new_status
actor
timestamp

🔍 Observability & History
Per-Booking History

Admin can view full lifecycle of a single booking

Includes actor and timestamp

Full Booking History

Shows latest status of every booking ever created

Includes deleted bookings

Uses history table only

🧠 Key Design Decisions
1️⃣ Why History Is Immutable

Prevents data loss

Enables auditing

Matches real production systems

2️⃣ Why Booking Details Are Stored in History

Deleted bookings still need context

Avoids soft deletes

History remains self-contained

3️⃣ Why Customer Cancel Deletes Booking

Booking is no longer active

UI reflects real availability

History preserves the event

4️⃣ Latest Status Logic

Latest state per booking is fetched using:

MAX(id)


instead of timestamp to avoid collisions when multiple events occur within the same second.

🔐 Authentication Note

This project uses UI-level role separation:

Customer / Provider / Admin have separate screens

Backend trusts the actor field

Authentication is out of scope for this assignment.

🚫 Out of Scope (Intentionally)

Authentication & authorization

Payments

Provider assignment algorithm

Notifications

Real-time updates

✅ Assignment Requirement Mapping
Requirement	Implemented
Create booking	✅
Assign provider	✅
Partner workflow	✅
Booking lifecycle	✅
Cancellations	✅
Failure handling	✅
Retry / recovery	✅
Admin override	✅
Observability	✅
Admin panel	✅
🧾 Summary

This project demonstrates:

Correct lifecycle modeling

Clear role separation

Real-world cancellation logic

Strong observability via audit logs

The focus is on system correctness and clarity, not over-engineering.

👨‍💻 Author

Full Stack Engineering Intern – Assignment Submission
