const express = require("express");
const router = express.Router();
const pool = require("../db/db.js");
const authMiddleware = require("../middleware/authMiddleware.js");
const requireDoctorOrAdmin = require("../middleware/requireDoctorOrAdmin.js");

router.post("/", authMiddleware, requireDoctorOrAdmin, async (req, res) => {
  try {
    const { patient_id, reason, preferred_doctor_id } = req.body;
    const newWaitlist = await pool.query(
      "INSERT INTO waitlist (  patient_id, reason, preferred_doctor_id) VALUES ($1, $2, $3) RETURNING waitlist_id",
      [patient_id, reason, preferred_doctor_id],
    );
    return res.status(201).json({
      message: "Added to waitlist",
      waitlist_id: newWaitlist.rows[0].waitlist_id,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Cannot add to waitlist!" });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
        SELECT waitlist.waitlist_id, waitlist.patient_id, waitlist.reason, waitlist.preferred_doctor_id, waitlist.date_added, 
            patients.first_name AS patient_first_name, patients.last_name AS patient_last_name, 
            users.first_name AS doctor_first_name, users.last_name AS doctor_last_name
    FROM waitlist 
        JOIN patients ON waitlist.patient_id = patients.patient_id
                LEFT JOIN doctors ON waitlist.preferred_doctor_id = doctors.doctor_id
LEFT JOIN users ON doctors.user_id = users.user_id
        `);
    const waitlist = result.rows;
    return res.status(200).json(waitlist);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Waitlist not loading!" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const waitlistId = req.params.id;
    const deleteWaitlist = await pool.query(
      "DELETE FROM waitlist WHERE waitlist_id = $1",
      [waitlistId],
    );
    return res.status(200).json({ message: "Removed from waitlist! :)" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
