import { useState, useEffect } from "react"

export default function Charts() {

    const [patients, setPatients] = useState([])
    const [selectedPatient, setSelectedPatient] = useState(null)
    const [visits, setVisits] = useState([])
    const [expandedVisit, setExpandedVisit] = useState(null)

    function formatDate(dateString) {
        const date = new Date(dateString)
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const year = date.getFullYear()
        return `${month}/${day}/${year}`
    }

    function loadPatients() {
        fetch(`${import.meta.env.VITE_API_URL}/api/patients?first_name=&last_name=&dob=&patient_id=`, {
            method: 'GET',
            cache: 'no-store',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setPatients(data)
            })
            .catch(err => console.log(err))
    }

    function selectPatient(patient) {
        setSelectedPatient(patient)
        setExpandedVisit(null)

        fetch(`${import.meta.env.VITE_API_URL}/api/visits?patient_id=${patient.patient_id}`, {
            method: 'GET',
            cache: 'no-store',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setVisits(data)
            })
            .catch(err => console.log(err))
    }

    function toggleVisit(visitId) {
        setExpandedVisit(expandedVisit === visitId ? null : visitId)
    }

    useEffect(() => {
        loadPatients()
    }, [])

    return (
        <div className="max-w-6xl mx-auto px-6 mt-10">

            <h1 className="text-2xl font-semibold text-[#7AAE9E] mb-6">Charts</h1>

            <div className="flex gap-6">

                <div className="w-1/3 border border-gray-200 rounded-lg max-h-[75vh] overflow-y-auto">
                    {patients.map((patient) => (
                        <div
                            key={patient.patient_id}
                            onClick={() => selectPatient(patient)}
                            className={`px-4 py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${selectedPatient?.patient_id === patient.patient_id ? 'bg-[#7AAE9E]/10' : ''}`}
                        >
                            <p className="font-medium">{patient.first_name} {patient.last_name}</p>
                            <p className="text-sm text-gray-500">ID: {patient.patient_id}</p>
                        </div>
                    ))}
                </div>

                <div className="w-2/3">

                    {!selectedPatient && (
                        <p className="text-gray-500">Select a patient to view their chart.</p>
                    )}

                    {selectedPatient && (
                        <div>
                            <h2 className="text-lg font-semibold mb-4">
                                {selectedPatient.first_name} {selectedPatient.last_name}
                            </h2>

                            {visits.length === 0 && (
                                <p className="text-gray-500">No visits recorded.</p>
                            )}

                            {visits.map((visit) => (
                                <div
                                    key={visit.visit_id}
                                    className="border-l-4 border-[#7AAE9E] bg-gray-50 rounded-lg p-3 mb-3 cursor-pointer"
                                    onClick={() => toggleVisit(visit.visit_id)}
                                >
                                    <p className="text-sm text-[#7AAE9E] font-semibold">{formatDate(visit.visit_date)}</p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Dr. {visit.doctor_first_name} {visit.doctor_last_name}
                                    </p>

                                    {expandedVisit === visit.visit_id && (
                                        <div className="mt-3 pt-3 border-t border-gray-200">
                                            {visit.vitals && (
                                                <p className="text-sm text-gray-700 mb-2">
                                                    <span className="font-semibold">Vitals: </span>{visit.vitals}
                                                </p>
                                            )}
                                            {visit.notes && (
                                                <p className="text-sm text-gray-700">
                                                    <span className="font-semibold">Notes: </span>{visit.notes}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                </div>

            </div>

        </div>
    )
}