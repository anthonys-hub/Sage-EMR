const express = require('express')
const router = express.Router()
const pool = require('../db/db.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, password, role } = req.body
        if (!first_name || !last_name || !password || !email || !role) {
            return res.status(400).json({ message: 'Please fill in all required fields' })
        }
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
        if (result.rows.length > 0) {
            return res.status(400).json({ message: 'Email is already registered' })
        }
        const hash = await bcrypt.hash(password, 10)
        const newUser = await pool.query('INSERT INTO users (first_name, last_name, email, password_hash, role) VALUES ($1, $2, $3, $4, $5)', [first_name, last_name, email, hash, role])
        return res.status(201).json({ message: 'Account Created! :)' })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Server error' });
    }
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
        if (result.rows.length === 0) {
            return res.status(400).json({ message: 'Login failed: invalid credentials' })
        }
        const user = result.rows[0]
        const isMatch = await bcrypt.compare(password, user.password_hash)
        if (isMatch) {
            const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
            return res.status(200).json({ token, first: user.first_name, last: user.last_name })
        }
        else {
            return res.status(400).json({ message: 'Login failed: invalid credentials' })
        }
    }

    catch (err) {
        return res.status(500).json({ message: 'Server error' });
    }
})











module.exports = router