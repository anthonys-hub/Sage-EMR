const express = require('express')
const router = express.Router()
const pool = require('../db/db.js')
const requireAdmin = require('../middleware/requireAdmin.js')
const authMiddleware = require('../middleware/authMiddleware.js')

router.get('/:id', authMiddleware, requireAdmin, async (req, res) => {

    try {
        const result = await pool.query('SELECT doctor_id, NPI, specialty FROM doctors WHERE doctor_id = $1', [req.params.id])
        const doctor = result.rows[0]
        return res.status(200).json(doctor)
    }

    catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Doctor not found!' })
    }
}
)

router.get('/', authMiddleware, async (req, res) => {

    try {
        const result = await pool.query('SELECT doctors.*, users.first_name, users.last_name FROM doctors JOIN users ON doctors.user_id = users.user_id')
        const doctors = result.rows
        return res.status(200).json(doctors)
    }

    catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Doctors not found!' })
    }
}
)


router.post('/', authMiddleware, requireAdmin, async (req, res) => {
    try {
        const { NPI, specialty, user_id } = req.body
        const newDoctor = await pool.query('INSERT INTO doctors (NPI, specialty, user_id) VALUES ($1, $2, $3) RETURNING doctor_id', [NPI, specialty, user_id])
        return res.status(201).json({ message: 'Doctor added!', doctor_id: newDoctor.rows[0].doctor_id })
    }

    catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Cannot add Doctor' })
    }
})

router.put('/:id', authMiddleware, requireAdmin, async (req, res) => {
    try {
        const { NPI, specialty, user_id } = req.body
        const DoctorId = req.params.id
        const edit = await pool.query('UPDATE doctors SET NPI = $1, specialty = $2, user_id = $3 WHERE doctor_id = $4', [NPI, specialty, user_id, DoctorId])
        return res.status(200).json({ message: 'Doctor changes saved' });
    }


    catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Server error' });
    }
})

router.delete('/:id', authMiddleware, requireAdmin, async (req, res) => {
    try {
        const DoctorId = req.params.id
        const deleteDoctor = await pool.query('DELETE FROM doctors WHERE doctor_id = $1', [DoctorId])
        return res.status(200).json({ message: 'Doctor deleted! :)' });
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Server error' });
    }
})




module.exports = router