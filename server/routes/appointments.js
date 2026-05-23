const express = require('express')
const router = express.Router()
const pool = require('../db/db.js')
const authMiddleware = require('../middleware/authMiddleware.js')


router.get('/:id', authMiddleware, async (req, res) => {

    try {
        const result = await pool.query('SELECT appointment_id, appointment_date,  appointment_starttime, appointment_endtime, status,  patient_id,  case_id, doctor_id FROM appointments WHERE appointment_id = $1', [req.params.id])
        const appointment = result.rows[0]
        return res.status(200).json(appointment)
    }

    catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Appointment not found!' })
    }
}
)

router.get('/', authMiddleware, async (req, res) => {

    try {
        const result = await pool.query('SELECT * FROM appointments')
        const appointment = result.rows
        return res.status(200).json(appointment)
    }

    catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Appointment not found!' })
    }
}
)


router.post('/', authMiddleware, async (req, res) => {
    try {
        const { appointment_id, appointment_date, appointment_starttime, appointment_endtime, status, patient_id, case_id, doctor_id } = req.body
        const newAppointment = await pool.query('INSERT INTO appointments (appointment_date, appointment_starttime, appointment_endtime, status, patient_id, case_id, doctor_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING appointment_id', [appointment_date, appointment_starttime, appointment_endtime, status, patient_id, case_id, doctor_id])
        return res.status(201).json({ message: 'Appointment added!', appointment_id: newAppointment.rows[0].appointment_id })
    }

    catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Cannot add appointment' })
    }
})

router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { appointment_id, appointment_date, appointment_starttime, appointment_endtime, status, patient_id, case_id, doctor_id } = req.body
        const appointmentId = req.params.id
        const edit = await pool.query('UPDATE appointments SET appointment_date = $1, appointment_starttime = $2, appointment_endtime = $3, status = $4, patient_id = $5, case_id = $6, doctor_id = $7 WHERE appointment_id = $8', [appointment_date, appointment_starttime, appointment_endtime, status, patient_id, case_id, doctor_id, appointmentId])
        return res.status(200).json({ message: 'Appointment changes saved' });
    }


    catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Server error' });
    }
})

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const appointmentId = req.params.id
        const deleteAppointment = await pool.query('DELETE FROM appointments WHERE appointment_id = $1', [appointmentId])
        return res.status(200).json({ message: 'Appointment deleted! :)' });
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Server error' });
    }
})






module.exports = router