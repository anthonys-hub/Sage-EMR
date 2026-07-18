const express = require("express");
const router = express.Router();
const pool = require("../db/db.js");
const authMiddleware = require("../middleware/authMiddleware.js");

router.get("/me/profile-picture", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT profile_picture FROM users WHERE user_id = $1",
      [req.user.user_id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ profile_picture: result.rows[0].profile_picture });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load profile picture" });
  }
});

router.put("/me/profile-picture", authMiddleware, async (req, res) => {
  const { profile_picture } = req.body;

  if (!profile_picture) {
    return res.status(400).json({ error: "No image provided" });
  }

  try {
    const result = await pool.query(
      "UPDATE users SET profile_picture = $1 WHERE user_id = $2 RETURNING profile_picture",
      [profile_picture, req.user.user_id], // adjust field name to match authMiddleware
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save profile picture" });
  }
});

module.exports = router;
