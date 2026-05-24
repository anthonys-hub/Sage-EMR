import React from "react";
import { useEffect } from "react"
import { useState } from "react"

export default function Schedule() {
    const [appointments, setAppointments] = useState([])
    const timeSlots = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM']

    function formatTime() {




    }


    function fetchAppointments() {
        fetch(`${import.meta.env.VITE_API_URL}/api/appointments`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setAppointments(data)
            })
    }


    useEffect(() => {
        fetchAppointments()
    }, [])






    return (

        <div className="flex flex-row mt-10 ml-10 gap-10">

            <div className="bg-yellow-300 max-w-290 w-full h-200 flex flex-col">
                <div className="max-h-96 overflow-y-auto"></div>
                {timeSlots.map(slot => (
                    <div key={slot} className="flex flex-row gap-10">
                        <div>{slot}</div>
                        <div>appointment cell</div>
                        <div>appointment cell</div>
                    </div>
                ))}


            </div>


            {/* Unsigned visits and wait list */}
            <div className="bg-blue-500 max-w-100 w-full h-200">
                <h1>wait list</h1>


            </div>
        </div >
    )
}