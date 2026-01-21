import { useEffect, useState } from "react";

const API = "http://localhost:3000/api";

export default function Provider() {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    const res = await fetch(`${API}/bookings`);
    setBookings(await res.json());
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id, status) => {
    await fetch(`${API}/bookings/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, actor: "provider" })
    });
    fetchBookings();
  };

  const cancelBooking = async (id) => {
    await fetch(`${API}/bookings/${id}/cancel`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ actor: "provider" })
    });
    fetchBookings();
  };

  const rejectBooking = async (id) => {
    await fetch(`${API}/bookings/${id}/reject`, { method: "PATCH" });
    fetchBookings();
  };

  const bg =
    (status) =>
      status === "pending" ? "bg-red-100" :
      status === "in_progress" ? "bg-yellow-100" :
      status === "completed" ? "bg-green-100" :
      status === "cancelled" ? "bg-red-400" :
      status === "assigned" ? "bg-green-300" :
      "bg-white";

  return (
    <>
      <h2 className="title">Provider View</h2>

      {bookings.map(b => (
        <div key={b.id} className={`card ${bg(b.status)}`}>
          <p className="font-bold">{b.service}</p>
          <p>{b.customer_name} — {b.location}</p>
          <p>Status: <b>{b.status}</b></p>
          {b.status === "rejected" && (
            <p className="text-red-500">Booking rejected by provider Will assign a Provider later</p>
          )}

          {b.status === "pending" && (
            <div className="flex gap-2 mt-2">
              <button
                className="btn-primary"
                onClick={() => updateStatus(b.id, "assigned")}
              >
                Accept
              </button>
              <button
                className="btn-danger"
                onClick={() => rejectBooking(b.id)}
              >
                Reject
              </button>
            </div>
          )}

          {(b.status === "assigned" || b.status === "in_progress") && (
            <div className="flex gap-2 mt-2 flex-wrap">
              <button
                className="btn-primary"
                onClick={() => updateStatus(b.id, "in_progress")}
              >
                In Progress
              </button>
              <button
                className="btn-primary"
                onClick={() => updateStatus(b.id, "completed")}
              >
                Complete
              </button>
              <button
                className="btn-danger"
                onClick={() => cancelBooking(b.id)}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      ))}
    </>
  );
}
