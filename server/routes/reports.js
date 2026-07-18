const express = require("express");
const router = express.Router();
const pool = require("../db/db.js");

router.get("/recall", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        p.patient_id,
        p.first_name,
        p.last_name,
        p.email,
        p.mobile_phone,
        MAX(a.appointment_date) AS last_appointment_date
      FROM patients p
      JOIN appointments a
        ON a.patient_id = p.patient_id
        AND a.appointment_date < CURRENT_DATE
      WHERE NOT EXISTS (
        SELECT 1
        FROM appointments a2
        WHERE a2.patient_id = p.patient_id
        AND a2.appointment_date >= CURRENT_DATE
      )
      GROUP BY p.patient_id, p.first_name, p.last_name, p.email, p.mobile_phone
      ORDER BY last_appointment_date DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load recall report" });
  }
});

module.exports = router;
