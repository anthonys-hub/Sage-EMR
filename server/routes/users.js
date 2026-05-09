const express = require('express')
const router = express.Router()
const pool = require('../db/db.js')
const requireAdmin = require('../middleware/requireAdmin.js')
const authMiddleware = require('../middleware/authMiddleware.js')

router.get('/', authMiddleware, requireAdmin, async (req, res) => {

    try {
        const result = await pool.query('SELECT user_id, first_name, last_name, email, role  FROM users')
        const users = result.rows
        return res.status(200).json(users)
    }

    catch {
        return res.status(401).json({ message: 'Not an admin!' })
    }

}

)


module.exports = router