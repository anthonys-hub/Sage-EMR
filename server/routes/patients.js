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







module.exports = router