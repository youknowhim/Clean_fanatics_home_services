import { useEffect, useState } from "react";

const API = "http://localhost:3000/api";

export default function Admin() {
  const [bookings, setBookings] = useState([]);
  const [history, setHistory] = useState({}); 
  const [fullHistory, setFullHistory] = useState([]); // all-time history
  const [showFullHistory, setShowFullHistory] = useState(false);

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
      body: JSON.stringify({ status, actor: "admin" })
    });
    fetchBookings();
  };

  const cancelBooking = async (id) => {
    await fetch(`${API}/bookings/${id}/cancel`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ actor: "admin" })
    });
    fetchBookings();
  };

  // FETCH STATUS HISTORY
  const fetchHistory = async (id) => {
    const res = await fetch(`${API}/bookings/${id}/history`);
    const data = await res.json();

    setHistory(prev => ({
      ...prev,
      [id]: data
    }));
  };


    const fetchFullHistory = async () => {
    const res = await fetch(`${API}/bookings/history`);
    const data = await res.json();
    setFullHistory(data);
    setShowFullHistory(true);
  };

  const bg = (new_status) =>
    new_status === "pending" ? "bg-red-100" :
    new_status === "in_progress" ? "bg-yellow-100" :
    new_status === "completed" ? "bg-green-100" :
    new_status === "cancelled" ? "bg-red-400" :
    new_status === "assigned" ? "bg-green-300" :
    "bg-white";

  return (
    <>
      <h2 className="title">Admin Panel</h2>
      <button className = "btn mb-6" onClick={fetchFullHistory}>View Booking History</button>
      {showFullHistory && (
        <div className="card mb-8 btn">
          <h3 className="font-semibold mb-3">All Booking History (Including Deleted)</h3>
          {fullHistory.map(b => (
            <div key={b.id} className={`card ${bg(b.new_status)}`}>
              <p>Service: <b>{b.service}</b></p>
              <p>Customer_name: <b>{b.customer_name}</b></p>
              <p>Location: <b>{b.location}</b></p>
              <p>Status: <b>{b.new_status}</b></p>
              <p>Actor: <b>{b.actor}</b></p>
            </div>
            

          ))}
        </div>
      )}

      {bookings.map(b => (
        <div key={b.id} className={`card ${bg(b.status)}`}>
          <p className="font-bold">{b.service}</p>
          <p>{b.customer_name} — {b.location}</p>
          <p>Status: <b>{b.status}</b></p>

          {/* ACTIONS */}
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

            <button
              className="btn"
              onClick={() => fetchHistory(b.id)}
            >
              View Status History
            </button>
          </div>

          {/*STATUS HISTORY TABLE */}
          {history[b.id] && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Status History</h4>
              <table className="w-full border text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">Time</th>
                    <th className="border p-2">Old Status</th>
                    <th className="border p-2">New Status</th>
                    <th className="border p-2">Actor</th>
                  </tr>
                </thead>
                <tbody>
                  {history[b.id].map(h => (
                    <tr key={h.id}>
                      <td className="border p-2">
                        {new Date(h.timestamp).toLocaleString()}
                      </td>
                      <td className="border p-2">
                        {h.old_status || "booking created"}
                      </td>
                      <td className="border p-2">
                        {h.new_status}
                      </td>
                      <td className="border p-2">
                        {h.actor}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </>
  );
}
