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

router.delete('/:id', authMiddleware, requireAdmin, async (req, res) => {
    try {
        const userId = req.params.id
        const deleteUser = await pool.query('DELETE FROM users WHERE user_id = $1', [userId])
        return res.status(200).json({ message: 'User deleted' })
    }
    catch {
        return res.status(500).json({ message: 'Server error' });
    }
})



module.exports = router