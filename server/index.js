const express = require('express');
const dotenv = require('dotenv')
const cors = require('cors')
const pool = require('./db/db.js')
const auth = require('./routes/auth.js')
const users = require('./routes/users.js')
const patients = require('./routes/patients.js')



dotenv.config()

const app = express()


app.use(cors())
app.use(express.json())

app.use('/api/auth', auth)
app.use('/api/users', users)
app.use('/api/patients', patients)




app.get('/', (req, res) => {
    res.send('Server is on')
})


const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})