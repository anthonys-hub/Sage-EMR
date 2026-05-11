const express = require('express')
const router = express.Router()
const pool = require('../db/db.js')
const requireAdmin = require('../middleware/requireAdmin.js')
const authMiddleware = require('../middleware/authMiddleware.js')


router.get('/:id', authMiddleware, async (req, res) => {

    try {
        const result = await pool.query('SELECT insurance_id, insurance_name, member_id, group_number, subscriber_name, subscriber_relationship, case_id FROM insurance WHERE insurance_id = $1', [req.params.id])
        const insurance = result.rows[0]
        return res.status(200).json(insurance)
    }

    catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Insurance not found!' })
    }
}
)

router.post('/', authMiddleware, async (req, res) => {
    try {
        const { insurance_name, member_id, group_number, subscriber_name, subscriber_relationship, case_id } = req.body
        const newInsurance = await pool.query('INSERT INTO insurance ( insurance_name, member_id, group_number, subscriber_name, subscriber_relationship, case_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING insurance_id', [insurance_name, member_id, group_number, subscriber_name, subscriber_relationship, case_id])
        return res.status(201).json({ message: 'Insurance added!', insurance_id: newInsurance.rows[0].insurance_id })
    }

    catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Cannot add insurance!' })
    }
})

router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { insurance_id, insurance_name, member_id, group_number, subscriber_name, subscriber_relationship, case_id } = req.body
        const InsuranceId = req.params.id
        const edit = await pool.query('UPDATE insurance SET  insurance_name = $1, member_id = $2, group_number = $3,  subscriber_name = $4, subscriber_relationship = $5 WHERE insurance_id = $6', [insurance_name, member_id, group_number, subscriber_name, subscriber_relationship, InsuranceId])
        return res.status(200).json({ message: 'Insurance changes saved' });
    }


    catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Server error' });
    }
})







module.exports = router