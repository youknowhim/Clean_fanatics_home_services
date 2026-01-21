import { useEffect, useState } from "react";

const API = "http://localhost:3000/api";

export default function Customer() {
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState({
    customer_name: "",
    location: "",
    service: "Cleaning"
  });

  const fetchBookings = async () => {
    const res = await fetch(`${API}/bookings`);
    setBookings(await res.json());
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const createBooking = async () => {
    await fetch(`${API}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    setForm({ customer_name: "", location: "", service: "Cleaning" });
    fetchBookings();
  };

  const cancelBooking = async (id) => {
    await fetch(`${API}/bookings/${id}/cancel`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ actor: "customer" })
    });
    setBookings(bookings.filter(b => b.id !== id));
  };
  const bg = (status) =>
    status === "pending" ? "bg-red-100" :
    status === "in_progress" ? "bg-yellow-100" :
    status === "completed" ? "bg-green-100" :
    "bg-white";

  return (
    <>
      <h2 className="title">Customer View</h2>

      {/* CREATE FORM */}
      <div className="card mb-6">
        <input className="input" placeholder="Customer Name"
          value={form.customer_name}
          onChange={e => setForm({ ...form, customer_name: e.target.value })}
        />
        <input className="input" placeholder="Location"
          value={form.location}
          onChange={e => setForm({ ...form, location: e.target.value })}
        />
        <select className="input"
          value={form.service}
          onChange={e => setForm({ ...form, service: e.target.value })}
        >
          <option>Cleaning</option>
          <option>Plumbing</option>
          <option>Electrical</option>
          <option>Painting</option>
          <option>Carpentry</option>
        </select>

        <button className="btn-primary" onClick={createBooking}>
          Create Booking
        </button>
      </div>


      {/* BOOKINGS */}
      {bookings.map(b => (
        <div key={b.id} className={`card ${bg(b.status)}`}>
          <p className="font-bold">{b.service}</p>
          <p>{b.customer_name} — {b.location}</p>
          <p>Status: <b>{b.status}</b></p>

          <button
            className="btn-danger mt-2"
            onClick={() => cancelBooking(b.id)}
          >
            Cancel
          </button>
        </div>
      ))}
    </>
  );
}
