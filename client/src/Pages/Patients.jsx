import { useState } from "react"
export default function Patients() {


    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [dob, setDob] = useState('')
    const [patientId, setPatientId] = useState('')
    const [patients, setPatients] = useState([])
    const [showModal, setShowModal] = useState(false)

    const [newPatient, setNewPatient] = useState({
        first_name: '',
        last_name: '',
        email: '',
        dob: '',
        address: '',
        mobile_phone: '',
        home_phone: '',
        marriage_status: '',
        title: '',
        social_security: '',
        emergency_contact: ''
    })

    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, patient: null })
    const [profileModal, setProfileModal] = useState(false)
    const [activeTab, setActiveTab] = useState('info')
    const [selectedPatient, setSelectedPatient] = useState(null)
    const [visits, setVisits] = useState([])

    function formatDate(dateString) {
        const date = new Date(dateString)
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const year = date.getFullYear()
        return `${month}/${day}/${year}`
    }

    function searchPatients() {
        fetch(`${import.meta.env.VITE_API_URL}/api/patients?first_name=${firstName}&last_name=${lastName}&dob=${dob}&patient_id=${patientId}`, {
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
    }

    function addPatient() {
        fetch(`${import.meta.env.VITE_API_URL}/api/patients`, {
            method: 'POST',
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(newPatient)
        })
            .then(res => res.json())
            .then(data => {
                setShowModal(false)
                setNewPatient({
                    first_name: '',
                    last_name: '',
                    email: '',
                    dob: '',
                    address: '',
                    mobile_phone: '',
                    home_phone: '',
                    marriage_status: '',
                    title: '',
                    social_security: '',
                    emergency_contact: ''
                })
                searchPatients()
            })
            .catch(err => console.log(err))
    }

    function handleRightClick(e, patient) {
        e.preventDefault()
        setContextMenu({
            visible: true,
            x: e.clientX,
            y: e.clientY,
            patient: patient
        })
    }

    function openProfile(patient) {
        setSelectedPatient(patient)
        setContextMenu({ visible: false, x: 0, y: 0, patient: null })
        setActiveTab('info')
        setProfileModal(true)

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

    function updatePatient() {
        fetch(`${import.meta.env.VITE_API_URL}/api/patients/${selectedPatient.patient_id}`, {
            method: 'PUT',
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(selectedPatient)
        })
            .then(res => res.json())
            .then(data => {
                setProfileModal(false)
                searchPatients()
            })
            .catch(err => console.log(err))
    }

    function addToWaitlist() {
        fetch(`${import.meta.env.VITE_API_URL}/api/waitlist`, {
            method: 'POST',
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ patient_id: selectedPatient.patient_id })
        })
            .then(res => res.json())
            .then(data => {



            })
            .catch(err => console.log(err))
    }




    return (
        <div className="max-w-6xl mx-auto px-6 mt-10" onClick={() => setContextMenu({ visible: false, x: 0, y: 0, patient: null })}>

            <div className="flex flex-row items-start gap-4 flex-wrap">

                <div className="w-full max-w-md bg-[#7AAE9E] rounded-lg">

                    <div className="flex flex-row gap-3 p-3">

                        <div className="flex-1">
                            <input className="w-full bg-white rounded-lg pl-2 py-1 placeholder:text-[#7AAE9E]" type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="First Name"
                            />
                        </div>

                        <div className="flex-1">
                            <input className="w-full bg-white rounded-lg pl-2 py-1 placeholder:text-[#7AAE9E]" type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Last Name"
                            />
                        </div>
                    </div>

                    <div className="flex flex-row gap-3 px-3">

                        <div className="flex-1">
                            <input className="w-full bg-white rounded-lg pl-2 py-1 placeholder:text-[#7AAE9E]" type="text"
                                value={patientId}
                                onChange={(e) => setPatientId(e.target.value)}
                                placeholder="Patient ID"
                            />
                        </div>


                        <div className="flex-1">
                            <input className="w-full bg-white rounded-lg pl-2 py-1 placeholder:text-[#7AAE9E]" type="text"
                                value={dob}
                                onChange={(e) => setDob(e.target.value)}
                                placeholder="Date of Birth"
                            />

                        </div>

                    </div>

                    <div className="flex justify-center py-3">
                        <button onClick={searchPatients} className="bg-white rounded-lg px-3 py-1 text-[#7AAE9E]">Search</button>
                    </div>

                </div>

                <div>
                    <button onClick={() => setShowModal(true)} className="bg-[#7AAE9E] text-white py-2 px-3 rounded-lg">Add Patient</button>
                </div>

            </div>

            <table className="w-full mt-8 border-collapse">
                <thead>
                    <tr className="bg-[#7AAE9E] text-white text-left">
                        <th className="px-4 py-2">Patient ID</th>
                        <th className="px-4 py-2">First Name</th>
                        <th className="px-4 py-2">Last Name</th>
                        <th className="px-4 py-2">DOB</th>
                    </tr>
                </thead>
                <tbody>

                    {patients.map((patient) => (
                        <tr
                            key={patient.patient_id}
                            className="even:bg-gray-100 border-b cursor-context-menu"
                            onContextMenu={(e) => handleRightClick(e, patient)}
                        >
                            <td className="px-4 py-2">{patient.patient_id}</td>
                            <td className="px-4 py-2">{patient.first_name}</td>
                            <td className="px-4 py-2">{patient.last_name}</td>
                            <td className="px-4 py-2">{formatDate(patient.dob)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {contextMenu.visible && (
                <div
                    className="fixed bg-white border border-gray-300 rounded-lg shadow-lg z-50"
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                >
                    <button
                        onClick={() => openProfile(contextMenu.patient)}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                        View Profile
                    </button>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">

                        <h2 className="text-lg font-semibold text-[#7AAE9E] mb-4">Add Patient</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                            <input
                                type="text"
                                value={newPatient.first_name}
                                onChange={(e) => setNewPatient({ ...newPatient, first_name: e.target.value })}
                                placeholder="First Name"
                                className="border border-gray-300 rounded-lg px-2 py-1"
                            />

                            <input
                                type="text"
                                value={newPatient.last_name}
                                onChange={(e) => setNewPatient({ ...newPatient, last_name: e.target.value })}
                                placeholder="Last Name"
                                className="border border-gray-300 rounded-lg px-2 py-1"
                            />

                            <input
                                type="email"
                                value={newPatient.email}
                                onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                                placeholder="Email"
                                className="border border-gray-300 rounded-lg px-2 py-1"
                            />

                            <input
                                type="date"
                                value={newPatient.dob}
                                onChange={(e) => setNewPatient({ ...newPatient, dob: e.target.value })}
                                placeholder="Date of Birth"
                                className="border border-gray-300 rounded-lg px-2 py-1"
                            />

                            <input
                                type="text"
                                value={newPatient.address}
                                onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
                                placeholder="Address"
                                className="border border-gray-300 rounded-lg px-2 py-1 sm:col-span-2"
                            />

                            <input
                                type="text"
                                value={newPatient.mobile_phone}
                                onChange={(e) => setNewPatient({ ...newPatient, mobile_phone: e.target.value })}
                                placeholder="Mobile Phone"
                                className="border border-gray-300 rounded-lg px-2 py-1"
                            />

                            <input
                                type="text"
                                value={newPatient.home_phone}
                                onChange={(e) => setNewPatient({ ...newPatient, home_phone: e.target.value })}
                                placeholder="Home Phone"
                                className="border border-gray-300 rounded-lg px-2 py-1"
                            />

                            <input
                                type="text"
                                value={newPatient.marriage_status}
                                onChange={(e) => setNewPatient({ ...newPatient, marriage_status: e.target.value })}
                                placeholder="Marriage Status"
                                className="border border-gray-300 rounded-lg px-2 py-1"
                            />

                            <input
                                type="text"
                                value={newPatient.title}
                                onChange={(e) => setNewPatient({ ...newPatient, title: e.target.value })}
                                placeholder="Title"
                                className="border border-gray-300 rounded-lg px-2 py-1"
                            />

                            <input
                                type="text"
                                value={newPatient.social_security}
                                onChange={(e) => setNewPatient({ ...newPatient, social_security: e.target.value })}
                                placeholder="Social Security"
                                className="border border-gray-300 rounded-lg px-2 py-1"
                            />

                            <input
                                type="text"
                                value={newPatient.emergency_contact}
                                onChange={(e) => setNewPatient({ ...newPatient, emergency_contact: e.target.value })}
                                placeholder="Emergency Contact"
                                className="border border-gray-300 rounded-lg px-2 py-1 sm:col-span-2"
                            />

                        </div>

                        <div className="flex justify-end gap-3 mt-5">
                            <button onClick={() => setShowModal(false)} className="px-3 py-1 rounded-lg border border-gray-300 text-gray-600">
                                Cancel
                            </button>
                            <button onClick={addPatient} className="bg-[#7AAE9E] text-white px-3 py-1 rounded-lg">
                                Submit
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {profileModal && selectedPatient && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4" onClick={() => setProfileModal(false)}>
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>

                        <div className=" flex justify-between items-start">
                            <h2 className="text-lg font-semibold text-[#7AAE9E] mb-1">
                                {selectedPatient.first_name} {selectedPatient.last_name}
                            </h2>
                            <button onClick={addToWaitlist} className="bg-[#7AAE9E] text-white px-3 py-1 rounded-lg">Add to Waitlist</button>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">Patient ID: {selectedPatient.patient_id}</p>

                        <div className="flex gap-4 border-b border-gray-200 mb-4">
                            <button
                                onClick={() => setActiveTab('info')}
                                className={`pb-2 px-1 ${activeTab === 'info' ? 'border-b-2 border-[#7AAE9E] text-[#7AAE9E] font-semibold' : 'text-gray-500'}`}
                            >
                                Personal Information
                            </button>
                            <button
                                onClick={() => setActiveTab('visits')}
                                className={`pb-2 px-1 ${activeTab === 'visits' ? 'border-b-2 border-[#7AAE9E] text-[#7AAE9E] font-semibold' : 'text-gray-500'}`}
                            >
                                Visit History
                            </button>
                        </div>

                        {activeTab === 'info' && (
                            <div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                                    <input
                                        type="text"
                                        value={selectedPatient.first_name || ''}
                                        onChange={(e) => setSelectedPatient({ ...selectedPatient, first_name: e.target.value })}
                                        placeholder="First Name"
                                        className="border border-gray-300 rounded-lg px-2 py-1"
                                    />

                                    <input
                                        type="text"
                                        value={selectedPatient.last_name || ''}
                                        onChange={(e) => setSelectedPatient({ ...selectedPatient, last_name: e.target.value })}
                                        placeholder="Last Name"
                                        className="border border-gray-300 rounded-lg px-2 py-1"
                                    />

                                    <input
                                        type="email"
                                        value={selectedPatient.email || ''}
                                        onChange={(e) => setSelectedPatient({ ...selectedPatient, email: e.target.value })}
                                        placeholder="Email"
                                        className="border border-gray-300 rounded-lg px-2 py-1"
                                    />

                                    <input
                                        type="date"
                                        value={selectedPatient.dob ? selectedPatient.dob.slice(0, 10) : ''}
                                        onChange={(e) => setSelectedPatient({ ...selectedPatient, dob: e.target.value })}
                                        placeholder="Date of Birth"
                                        className="border border-gray-300 rounded-lg px-2 py-1"
                                    />

                                    <input
                                        type="text"
                                        value={selectedPatient.address || ''}
                                        onChange={(e) => setSelectedPatient({ ...selectedPatient, address: e.target.value })}
                                        placeholder="Address"
                                        className="border border-gray-300 rounded-lg px-2 py-1 sm:col-span-2"
                                    />

                                    <input
                                        type="text"
                                        value={selectedPatient.mobile_phone || ''}
                                        onChange={(e) => setSelectedPatient({ ...selectedPatient, mobile_phone: e.target.value })}
                                        placeholder="Mobile Phone"
                                        className="border border-gray-300 rounded-lg px-2 py-1"
                                    />

                                    <input
                                        type="text"
                                        value={selectedPatient.home_phone || ''}
                                        onChange={(e) => setSelectedPatient({ ...selectedPatient, home_phone: e.target.value })}
                                        placeholder="Home Phone"
                                        className="border border-gray-300 rounded-lg px-2 py-1"
                                    />

                                    <input
                                        type="text"
                                        value={selectedPatient.marriage_status || ''}
                                        onChange={(e) => setSelectedPatient({ ...selectedPatient, marriage_status: e.target.value })}
                                        placeholder="Marriage Status"
                                        className="border border-gray-300 rounded-lg px-2 py-1"
                                    />

                                    <input
                                        type="text"
                                        value={selectedPatient.title || ''}
                                        onChange={(e) => setSelectedPatient({ ...selectedPatient, title: e.target.value })}
                                        placeholder="Title"
                                        className="border border-gray-300 rounded-lg px-2 py-1"
                                    />

                                    <input
                                        type="text"
                                        value={selectedPatient.social_security || ''}
                                        onChange={(e) => setSelectedPatient({ ...selectedPatient, social_security: e.target.value })}
                                        placeholder="Social Security"
                                        className="border border-gray-300 rounded-lg px-2 py-1"
                                    />

                                    <input
                                        type="text"
                                        value={selectedPatient.emergency_contact || ''}
                                        onChange={(e) => setSelectedPatient({ ...selectedPatient, emergency_contact: e.target.value })}
                                        placeholder="Emergency Contact"
                                        className="border border-gray-300 rounded-lg px-2 py-1 sm:col-span-2"
                                    />

                                </div>

                                <div className="flex justify-end gap-3 mt-5">
                                    <button onClick={() => setProfileModal(false)} className="px-3 py-1 rounded-lg border border-gray-300 text-gray-600">
                                        Cancel
                                    </button>
                                    <button onClick={updatePatient} className="bg-[#7AAE9E] text-white px-3 py-1 rounded-lg">
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'visits' && (
                            <div>
                                {visits.length === 0 && (
                                    <p className="text-gray-500">No visits recorded.</p>
                                )}

                                {visits.map((visit) => (
                                    <div key={visit.visit_id} className="border-l-4 border-[#7AAE9E] bg-gray-50 rounded-lg p-3 mb-3">
                                        <p className="text-sm text-[#7AAE9E] font-semibold">{formatDate(visit.visit_date)}</p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Dr. {visit.doctor_first_name} {visit.doctor_last_name}
                                        </p>
                                        {visit.notes && (
                                            <p className="text-sm text-gray-700 mt-2">{visit.notes}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                    </div>
                </div>
            )}

        </div>
    )
}