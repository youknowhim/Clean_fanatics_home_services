🏠 On-Demand Home Services Booking System<br>

A full-stack application that demonstrates the core booking lifecycle of an on-demand home services marketplace.<br>
Customers can create service requests, providers can fulfill them, and admins can monitor and intervene when needed<br>.

This project focuses on real-world product behavior, not just CRUD.<br>

⚙️ Setup Instructions (IMPORTANT)<br>
1️⃣ Prerequisites<br>

Node.js (v18+ recommended)<br>
MySQL<br>
npm<br>

2️⃣Cloning<br>
  git clone https://github.com/youknowhim/Clean_fanatics_home_services.git<br>
  cd Clean_fanatics_home_services<br>
3️⃣ Backend Setup<br>
cd backend<br>
npm install<br>

3️⃣ Environment Variables<br>

Create a .env file inside the backend folder:<br>

DB_HOST=localhost<br>
DB_USER=root<br>
DB_PASSWORD=your_password<br><br>
DB_NAME=booking_system

------The database tables are auto-created on server start.-------<br>

4️⃣ Start Backend Server<br>
node server.js<br>
Server runs at:<br>
http://localhost:3000<br>

5️⃣ Frontend Setup<br>
cd frontend<br>
npm install<br>
npm run dev<br>


Frontend runs at:<br>

http://localhost:5173<br>

🧠 How the System Works<br>

The system models a real booking lifecycle with clear ownership and responsibilities.<br>

👥 Role-Based Access & Responsibilities<br>
👤 Customer<br>

Create a booking<br>

Cancel a booking<br>

Business logic<br>

Customer cancellation deletes the booking<br>

Cancellation event is still stored in history<br>

🧑‍🔧 Provider<br>

View bookings<br>

Accept or reject bookings<br>
Assigned , if accepted by the Provider<br>

Move booking to:<br>

in_progress<br>

completed<br>

Business logic<br>

Reject → UI change , it will be assigned to a provider later<br>

Provider cannot delete bookings<br>

🛠️ Admin<br>

View all active bookings<br>

Cancel or reset bookings (override)<br>

View full booking history (including deleted bookings)<br>

Business logic<br>

Admin does not “accept” bookings<br>

Admin acts as an operational supervisor<br>

Admin can inspect audit logs<br>

🔄 Booking Status Lifecycle<br>
pending → in_progress → completed<br>


Other flows:<br>

Provider reject → rejected , assigned later<br>

Admin cancel → pending<br>

Customer cancel → booking deleted completely<br>

🗄️ Database Design<br>
bookings (Current State)<br>

Stores only active bookings.<br>

id<br>
customer_name<br>
service<br>
location<br>
status<br>
created_at<br>

booking_status_history (Audit Log)<br>

Stores every lifecycle event, even after deletion.<br>

id<br>
booking_id<br>
customer_name<br>
service<br>
location<br>
old_status<br>
new_status<br>
actor<br>
timestamp<br>

🔍 Observability & History<br>
Per-Booking History<br>

Admin can view full lifecycle of a single booking<br>

Includes actor and timestamp<br>

Full Booking History<br>

Shows latest status of every booking ever created<br>
Includes deleted bookings<br>

Uses history table only<br>

🧠 Key Design Decisions<br>
1️⃣ Why History Is Immutable<br>

Prevents data loss<br>

Enables auditing
<br>
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
