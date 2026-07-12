const express = require('express')
const router = express.Router()
const pool = require('../db/db.js')
const requireAdmin = require('../middleware/requireAdmin.js')
const authMiddleware = require('../middleware/authMiddleware.js')
const requireDoctorOrAdmin = require('../middleware/requireDoctorOrAdmin.js')

router.get('/:id', authMiddleware, async (req, res) => {

    try {
        const result = await pool.query('SELECT visit_id, appointment_id, visit_date, vitals, notes, case_id, doctor_id, patient_id FROM visits WHERE visit_id = $1', [req.params.id])
        const visit = result.rows[0]
        return res.status(200).json(visit)
    }

    catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Visit not found!' })
    }
}
)

router.get('/', authMiddleware, async (req, res) => {
    const { patient_id } = req.query

    try {
        let query = `
            SELECT visits.visit_id, visits.visit_date, visits.vitals, visits.notes, 
                   visits.case_id, visits.doctor_id, visits.patient_id,
                   users.first_name AS doctor_first_name, users.last_name AS doctor_last_name
            FROM visits
            JOIN users ON visits.doctor_id = users.user_id
        `

        const values = []

        if (patient_id) {
            query += ' WHERE visits.patient_id = $1'
            values.push(patient_id)
        }

        query += ' ORDER BY visits.visit_date DESC'

        const result = await pool.query(query, values)
        return res.status(200).json(result.rows)
    }

    catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Error fetching visits' })
    }
})

router.post('/', authMiddleware, requireDoctorOrAdmin, async (req, res) => {
    try {
        const { appointment_id, visit_date, vitals, notes, case_id, doctor_id, patient_id } = req.body
        const newVisit = await pool.query('INSERT INTO visits ( appointment_id, visit_date, vitals, notes, case_id, doctor_id, patient_id ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING visit_id', [appointment_id, visit_date, vitals, notes, case_id, doctor_id, patient_id])
        return res.status(201).json({ message: 'Visit added!', visit_id: newVisit.rows[0].visit_id })
    }

    catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Cannot add visit!' })
    }
})

router.put('/:id', authMiddleware, requireDoctorOrAdmin, async (req, res) => {
    try {
        const { visit_id, appointment_id, visit_date, vitals, notes, case_id, doctor_id, patient_id } = req.body
        const VisitId = req.params.id
        const edit = await pool.query('UPDATE visits SET  appointment_id = $1, visit_date = $2, vitals = $3, notes = $4, case_id = $5, doctor_id = $6, patient_id = $7  WHERE visit_id = $8', [appointment_id, visit_date, vitals, notes, case_id, doctor_id, patient_id, VisitId])
        return res.status(200).json({ message: 'Visit changes saved' });
    }


    catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Server error' });
    }
})


module.exports = router