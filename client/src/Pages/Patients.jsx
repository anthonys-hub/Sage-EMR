
import { useState } from "react"
export default function Patients() {


    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [dob, setDob] = useState('')
    const [patientId, setPatientId] = useState('')
    const [patients, setPatients] = useState([])

    function searchPatients() {
        fetch(`${import.meta.env.VITE_API_URL}/api/patients?first_name=${firstName}&last_name=${lastName}&dob=${dob}&patient_id=${patientId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setPatients(data)
            })
    }


    return (
        <h1>patients</h1>
    )
}