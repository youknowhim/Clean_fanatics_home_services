const express = require("express");
const router = express.Router();
const db = require("./dbconfig");

/**
 * CREATE BOOKING (Customer)
 */
router.post("/bookings", (req, res) => {
  const { customer_name, location, service } = req.body;

  db.query(
    `INSERT INTO bookings (customer_name, location, service, status)
     VALUES (?, ?, ?, 'pending')`,
    [customer_name, location, service],
    (err, result) => {
      if (err) return res.status(500).send(err);

      db.query(
        `INSERT INTO booking_status_history
         (booking_id, customer_name, service, location,
          old_status, new_status, actor)
         VALUES (?, ?, ?, ?, NULL, 'pending', 'customer')`,
        [result.insertId, customer_name, service, location]
      );

      res.json({ booking_id: result.insertId });
    }
  );
});

/**
 * GET ALL ACTIVE BOOKINGS
 */
router.get("/bookings", (req, res) => {
  db.query(`SELECT * FROM bookings`, (err, rows) => {
    if (err) return res.status(500).send(err);
    res.json(rows);
  });
});

/**
 * PROVIDER REJECT → MOVE TO PENDING
 */
router.patch("/bookings/:id/reject", (req, res) => {
  const bookingId = req.params.id;

  db.query(
    `SELECT customer_name, service, location, status
     FROM bookings WHERE id = ?`,
    [bookingId],
    (err, rows) => {
      if (err) return res.status(500).send(err);
      if (!rows.length) return res.status(404).send("Not found");

      const { customer_name, service, location, status } = rows[0];

      db.query(
        `UPDATE bookings SET status = 'pending' WHERE id = ?`,
        [bookingId]
      );

      db.query(
        `INSERT INTO booking_status_history
         (booking_id, customer_name, service, location,
          old_status, new_status, actor)
         VALUES (?, ?, ?, ?, ?, 'pending', 'provider')`,
        [bookingId, customer_name, service, location, status]
      );

      res.json({ message: "Booking moved back to pending" });
    }
  );
});

/**
 * CANCEL (ROLE BASED)
 */
router.patch("/bookings/:id/cancel", (req, res) => {
  const { actor } = req.body;
  const bookingId = req.params.id;

  // CUSTOMER CANCEL → DELETE BOOKING
  if (actor === "customer") {
    db.query(
      `SELECT customer_name, service, location, status
       FROM bookings WHERE id = ?`,
      [bookingId],
      (err, rows) => {
        if (err) return res.status(500).send(err);
        if (!rows.length) return res.status(404).send("Not found");

        const { customer_name, service, location, status } = rows[0];

        db.query(
          `INSERT INTO booking_status_history
           (booking_id, customer_name, service, location,
            old_status, new_status, actor)
           VALUES (?, ?, ?, ?, ?, 'cancelled', 'customer')`,
          [bookingId, customer_name, service, location, status]
        );

        db.query(
          `DELETE FROM bookings WHERE id = ?`,
          [bookingId]
        );

        res.json({ message: "Booking cancelled by customer" });
      }
    );
    return;
  }

  // PROVIDER / ADMIN CANCEL → MOVE TO PENDING
  db.query(
    `SELECT customer_name, service, location, status
     FROM bookings WHERE id = ?`,
    [bookingId],
    (err, rows) => {
      if (err) return res.status(500).send(err);
      if (!rows.length) return res.status(404).send("Not found");

      const { customer_name, service, location, status } = rows[0];

      db.query(
        `UPDATE bookings SET status = 'pending' WHERE id = ?`,
        [bookingId]
      );

      db.query(
        `INSERT INTO booking_status_history
         (booking_id, customer_name, service, location,
          old_status, new_status, actor)
         VALUES (?, ?, ?, ?, ?, 'pending', ?)`,
        [bookingId, customer_name, service, location, status, actor]
      );

      res.json({ message: "Booking moved back to pending" });
    }
  );
});

/**
 * UPDATE STATUS (Accept / In-Progress / Completed)
 */
router.patch("/bookings/:id/status", (req, res) => {
  const { status, actor } = req.body;
  const bookingId = req.params.id;

  db.query(
    `SELECT customer_name, service, location, status
     FROM bookings WHERE id = ?`,
    [bookingId],
    (err, rows) => {
      if (err) return res.status(500).send(err);
      if (!rows.length) return res.status(404).send("Not found");

      const {
        customer_name,
        service,
        location,
        status: oldStatus
      } = rows[0];

      db.query(
        `UPDATE bookings SET status = ? WHERE id = ?`,
        [status, bookingId]
      );

      db.query(
        `INSERT INTO booking_status_history
         (booking_id, customer_name, service, location,
          old_status, new_status, actor)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          bookingId,
          customer_name,
          service,
          location,
          oldStatus,
          status,
          actor
        ]
      );

      res.json({ message: "Status updated" });
    }
  );
});

/**
 * BOOKING HISTORY (PER BOOKING)
 */
router.get("/bookings/:id/history", (req, res) => {
  db.query(
    `SELECT *
     FROM booking_status_history
     WHERE booking_id = ?
     ORDER BY timestamp`,
    [req.params.id],
    (err, rows) => {
      if (err) return res.status(500).send(err);
      res.json(rows);
    }
  );
});

/**
 * FULL BOOKING HISTORY (INCLUDING DELETED)
 */
router.get("/bookings/history", (req, res) => {
  db.query(
    `SELECT
       booking_id,
       customer_name,
       service,
       location,
       old_status,
       new_status,
       actor,
       timestamp
     FROM booking_status_history
     ORDER BY booking_id, timestamp`,
    (err, rows) => {
      if (err) return res.status(500).send(err);
      res.json(rows);
    }
  );
});

module.exports = router;
