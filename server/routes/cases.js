const express = require('express')
const router = express.Router()
const pool = require('../db/db.js')
const requireAdmin = require('../middleware/requireAdmin.js')
const authMiddleware = require('../middleware/authMiddleware.js')


router.get('/:id', authMiddleware, async (req, res) => {

    try {
        const result = await pool.query('SELECT case_id, description, referring_dr, patient_id FROM cases WHERE case_id = $1', [req.params.id])
        const cases = result.rows[0]
        return res.status(200).json(cases)
    }

    catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Case not found!' })
    }
}
)

router.get('/', authMiddleware, async (req, res) => {
    try {
        const { patient_id } = req.query
        const result = await pool.query(
            'SELECT case_id, description, referring_dr, patient_id FROM cases WHERE patient_id = $1',
            [patient_id]
        )
        const cases = result.rows
        return res.status(200).json(cases)
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Cases not found!' })
    }
})





router.post('/', authMiddleware, async (req, res) => {
    try {
        const { description, referring_dr, patient_id } = req.body
        const newCase = await pool.query('INSERT INTO cases ( description, referring_dr, patient_id ) VALUES ($1, $2, $3) RETURNING case_id', [description, referring_dr, patient_id])
        return res.status(201).json({ message: 'Case added!', case_id: newCase.rows[0].case_id })
    }

    catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Cannot add case!' })
    }
})

router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { description, referring_dr, patient_id } = req.body
        const CaseId = req.params.id
        const edit = await pool.query('UPDATE cases SET  description = $1,  referring_dr = $2, patient_id = $3 WHERE case_id = $4', [description, referring_dr, patient_id, CaseId])
        return res.status(200).json({ message: 'Case changes saved' });
    }


    catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Server error' });
    }
})


module.exports = router