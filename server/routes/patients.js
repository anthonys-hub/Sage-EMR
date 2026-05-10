const express = require('express')
const router = express.Router()
const pool = require('../db/db.js')
const requireAdmin = require('../middleware/requireAdmin.js')
const authMiddleware = require('../middleware/authMiddleware.js')

router.get('/:id', authMiddleware, async (req, res) => {

    try {
        const result = await pool.query('SELECT patient_id, first_name, last_name, email, dob, address, mobile_phone, home_phone, marriage_status, title, social_security, emergency_contact FROM patients WHERE patient_id = $1', [req.params.id])
        const patient = result.rows[0]
        return res.status(200).json(patient)
    }

    catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Patient not found!' })


    }

}

)

router.post('/', authMiddleware, async (req, res) => {
    try {
        const { first_name, last_name, email, dob, address, mobile_phone, home_phone, marriage_status, title, social_security, emergency_contact } = req.body
        const newPatient = await pool.query('INSERT INTO patients (first_name, last_name, email, dob, address, mobile_phone, home_phone, marriage_status, title, social_security, emergency_contact) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING patient_id', [first_name, last_name, email, dob, address, mobile_phone, home_phone, marriage_status, title, social_security, emergency_contact])
        return res.status(201).json({ message: 'Patient added!', patient_id: newPatient.rows[0].patient_id })
    }

    catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Cannot add patient' })
    }
})

router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { first_name, last_name, email, dob, address, mobile_phone, home_phone, marriage_status, title, social_security, emergency_contact } = req.body
        const patient_id = req.params.id
        const edit = await pool.query('UPDATE patients SET first_name = $1, last_name = $2, email = $3, dob = $4, address = $5, mobile_phone = $6, home_phone = $7, marriage_status = $8, title = $9, social_security = $10, emergency_contact = $11 WHERE patient_id = $12', [first_name, last_name, email, dob, address, mobile_phone, home_phone, marriage_status, title, social_security, emergency_contact, patient_id])
        return res.status(200).json({ message: 'Patient changes saved' });
    }


    catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Server error' });
    }
})






module.exports = router