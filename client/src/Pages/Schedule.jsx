import React, { use } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { FaTrashAlt } from "react-icons/fa";

export default function Schedule() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [waitlist, setWaitlist] = useState([]);
  const [profileModal, setProfileModal] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [visits, setVisits] = useState([]);

  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  });

  const timeSlots = [
    "8:00 AM",
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
  ];

  function formatDate(dateString) {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }

  function updateStatus(appointmentId, newStatus) {
    fetch(`${import.meta.env.VITE_API_URL}/api/appointments/${appointmentId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...contextMenu.appointment,
        status: newStatus,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        fetchAppointments();
        setContextMenu(null);
      });
  }

  function updatePatient() {
    fetch(
      `${import.meta.env.VITE_API_URL}/api/patients/${selectedPatient.patient_id}`,
      {
        method: "PUT",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(selectedPatient),
      },
    )
      .then((res) => res.json())
      .then((data) => {
        fetchWaitlist();
        setSelectedPatient(data);
        setProfileModal(false);
      })
      .catch((err) => console.log(err));
  }

  function onContextMenu(e, appt) {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      appointment: appt,
    });
  }

  function formatTime(strTime) {
    const parts = strTime.split(":");
    const hour = parseInt(parts[0]);

    if (hour > 12) {
      return hour - 12 + ":" + parts[1] + " " + "PM";
    } else {
      return hour + ":" + parts[1] + " " + "AM";
    }
  }

  function openWaitlistProfile(entry) {
    fetch(`${import.meta.env.VITE_API_URL}/api/patients/${entry.patient_id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setSelectedPatient(data);
        setProfileModal(true);
        setActiveTab("info");
      });

    fetch(
      `${import.meta.env.VITE_API_URL}/api/visits?patient_id=${entry.patient_id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    )
      .then((res) => res.json())
      .then((data) => {
        setVisits(data);
      });
  }

  function fetchDoctors() {
    fetch(`${import.meta.env.VITE_API_URL}/api/doctors`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setDoctors(data);
      });
  }

  function fetchAppointments() {
    fetch(
      `${import.meta.env.VITE_API_URL}/api/appointments?date=${selectedDate}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    )
      .then((res) => res.json())
      .then((data) => {
        setAppointments(data);
      });
  }

  function getStatusColor(status) {
    if (status === "arrived") {
      return "bg-yellow-100";
    } else if (status === "no_call_no_show") {
      return "bg-blue-900";
    } else if (status === "cancelled") {
      return "bg-red-900";
    } else if (status === "cancelled_without_notice") {
      return "bg-red-400";
    } else if (status === "rescheduled") {
      return "bg-orange-800";
    } else if (status === "scheduled") {
      return "bg-[#eff1f0]";
    }
  }

  function fetchWaitlist() {
    fetch(`${import.meta.env.VITE_API_URL}/api/waitlist`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setWaitlist(data);
      });
  }

  function removeFromWaitlist(waitlistId) {
    fetch(`${import.meta.env.VITE_API_URL}/api/waitlist/${waitlistId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((data) => {
        fetchWaitlist();
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    fetchWaitlist();
    fetchDoctors();
    fetchAppointments();
  }, [selectedDate]);

  return (
    <div
      onClick={() => setContextMenu(null)}
      className="flex flex-row mt-5 ml-10 gap-10"
    >
      <div className="bg-white rounded-t-lg border-[#e2e2e2] max-w-290 w-full h-200 flex flex-col">
        <div className="border border-[#e2e2e2] rounded-t-lg h-full flex flex-col ">
          <h1 className="text-3xl ml-2 text-[#7AAE9E] font-bold">
            {" "}
            Daily Multi Schedule
          </h1>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 rounded p-1 text-sm"
          />
        </div>

        <div className="flex flex-row max-h-40 h-full w-full bg-[#f2f4f1] ">
          <h1 className="bg-[#f2f4f1] text-[#7aae9e] border  border-[#e2e2e2] w-32 shrink-0 justify-center items-center flex">
            Time
          </h1>

          <div className="flex flex-row">
            {doctors.map((doctor) => (
              <div
                key={doctor.doctor_id}
                className="bg-[#f2f4f1] border border-[#e2e2e2] w-50 flex flex-col justify-center items-center h-full "
              >
                <p className="font-bold text-[#5b7e73] text-sm">
                  Dr. {doctor.first_name} {doctor.last_name}
                </p>
                <p className="text-xs">{doctor.specialty}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          {timeSlots.map((slot) => {
            const slotAppointments = appointments.filter(
              (appointment) =>
                formatTime(appointment.appointment_starttime) === slot,
            );

            return (
              <div
                key={slot}
                className="flex flex-row  border border-gray-300 items-center"
              >
                <div className="w-32 shrink-0 p-2">{slot}</div>

                {doctors.map((doctor) => {
                  const appt = slotAppointments.find(
                    (a) => a.doctor_id === doctor.doctor_id,
                  );
                  return (
                    <div
                      key={doctor.doctor_id}
                      className=" w-50 min-h-16 border-r border-l border-gray-200"
                    >
                      {appt ? (
                        <div
                          className={`${getStatusColor(appt.status)} border-l-4 border-[#7AAE9E] rounded p-2 shadow-sm`}
                          onContextMenu={(e) => onContextMenu(e, appt)}
                        >
                          <p className="font-bold text-[#7AAE9E] text-sm">
                            {appt.first_name} {appt.last_name}{" "}
                            <span className="text-black font-semibold ml-10 ">
                              {appt.status}
                            </span>
                          </p>
                          <p className="text-xs">{appt.description}</p>
                          <p className="text-xs text-gray-500">
                            {formatTime(appt.appointment_starttime)} -{" "}
                            {formatTime(appt.appointment_endtime)}
                          </p>
                        </div>
                      ) : (
                        <div className="h-16"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-[#7AAE9E] max-w-150 w-full h-200 rounded-t-lg border-[#e2e2e2]">
        <h1 className="text-3xl mt-3 text-white font-bold text-center">
          {" "}
          Wait List
        </h1>

        <div className="">
          {waitlist.map((entry) => (
            <div
              key={entry.waitlist_id}
              className="border border-[#7AAE9E] flex bg-gray-50 justify-between mt-1 ml-2 w-145 rounded-lg p-3 "
              onClick={() => openWaitlistProfile(entry)}
            >
              <div className="">
                <p className="font-medium">
                  {entry.patient_first_name} {entry.patient_last_name}
                </p>
                <p className="text-sm text-gray-600">{entry.reason}</p>
                <p className="text-sm text-gray-600">
                  Prefers: Dr {entry.doctor_first_name} {entry.doctor_last_name}
                </p>
              </div>

              <div className="mt-5 text-[#7AAE9E] text-2xl">
                <FaTrashAlt
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromWaitlist(entry.waitlist_id);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {contextMenu && (
        <div
          style={{ position: "fixed", top: contextMenu.y, left: contextMenu.x }}
          className="bg-white border border-gray-200 shadow-lg rounded z-50"
        >
          <div className="hover:bg-gray-100 px-4 py-2 cursor-pointer text-sm">
            <p>Edit Appointment</p>
          </div>
          <div className="hover:bg-gray-100 px-4 py-2 cursor-pointer text-sm">
            {" "}
            <p>Edit Client</p>
          </div>
          <div className="hover:bg-gray-100 px-4 py-2 cursor-pointer text-sm">
            {" "}
            <p>Cash Register</p>
          </div>
          <div
            onMouseEnter={() => setShowStatusMenu(true)}
            onMouseLeave={() => setShowStatusMenu(false)}
            className="relative hover:bg-gray-100 px-4 py-2 cursor-pointer text-sm"
          >
            {" "}
            <p>Status</p>
            {showStatusMenu && (
              <div className="absolute left-full top-0 bg-white border border-gray-200 shadow-lg rounded">
                <div
                  onClick={() =>
                    updateStatus(
                      contextMenu.appointment.appointment_id,
                      "scheduled",
                    )
                  }
                  className="hover:bg-gray-100 px-4 py-2 cursor-pointer text-sm"
                >
                  Scheduled
                </div>
                <div
                  onClick={() =>
                    updateStatus(
                      contextMenu.appointment.appointment_id,
                      "arrived",
                    )
                  }
                  className="hover:bg-gray-100 px-4 py-2 cursor-pointer text-sm"
                >
                  Arrived
                </div>
                <div
                  onClick={() =>
                    updateStatus(
                      contextMenu.appointment.appointment_id,
                      "cancelled",
                    )
                  }
                  className="hover:bg-gray-100 px-4 py-2 cursor-pointer text-sm"
                >
                  Cancelled
                </div>
                <div
                  onClick={() =>
                    updateStatus(
                      contextMenu.appointment.appointment_id,
                      "rescheduled",
                    )
                  }
                  className="hover:bg-gray-100 px-4 py-2 cursor-pointer text-sm"
                >
                  Rescheduled
                </div>
                <div
                  onClick={() =>
                    updateStatus(
                      contextMenu.appointment.appointment_id,
                      "no_call_no_show",
                    )
                  }
                  className="hover:bg-gray-100 px-4 py-2 cursor-pointer text-sm"
                >
                  No Call No Show
                </div>
                <div
                  onClick={() =>
                    updateStatus(
                      contextMenu.appointment.appointment_id,
                      "cancelled_without_notice",
                    )
                  }
                  className="hover:bg-gray-100 px-4 py-2 cursor-pointer text-sm"
                >
                  Cancelled Without Notice
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {profileModal && selectedPatient && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center px-4"
          onClick={() => setProfileModal(false)}
        >
          <div
            className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-[#7AAE9E] mb-1">
              {selectedPatient.first_name} {selectedPatient.last_name}
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Patient ID: {selectedPatient.patient_id}
            </p>

            <div className="flex gap-4 border-b border-gray-200 mb-4">
              <button
                onClick={() => setActiveTab("info")}
                className={`pb-2 px-1 ${activeTab === "info" ? "border-b-2 border-[#7AAE9E] text-[#7AAE9E] font-semibold" : "text-gray-500"}`}
              >
                Personal Information
              </button>
              <button
                onClick={() => setActiveTab("visits")}
                className={`pb-2 px-1 ${activeTab === "visits" ? "border-b-2 border-[#7AAE9E] text-[#7AAE9E] font-semibold" : "text-gray-500"}`}
              >
                Visit History
              </button>
            </div>

            {activeTab === "info" && (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={selectedPatient.first_name || ""}
                    onChange={(e) =>
                      setSelectedPatient({
                        ...selectedPatient,
                        first_name: e.target.value,
                      })
                    }
                    placeholder="First Name"
                    className="border border-gray-300 rounded-lg px-2 py-1"
                  />

                  <input
                    type="text"
                    value={selectedPatient.last_name || ""}
                    onChange={(e) =>
                      setSelectedPatient({
                        ...selectedPatient,
                        last_name: e.target.value,
                      })
                    }
                    placeholder="Last Name"
                    className="border border-gray-300 rounded-lg px-2 py-1"
                  />

                  <input
                    type="email"
                    value={selectedPatient.email || ""}
                    onChange={(e) =>
                      setSelectedPatient({
                        ...selectedPatient,
                        email: e.target.value,
                      })
                    }
                    placeholder="Email"
                    className="border border-gray-300 rounded-lg px-2 py-1"
                  />

                  <input
                    type="date"
                    value={
                      selectedPatient.dob
                        ? selectedPatient.dob.slice(0, 10)
                        : ""
                    }
                    onChange={(e) =>
                      setSelectedPatient({
                        ...selectedPatient,
                        dob: e.target.value,
                      })
                    }
                    placeholder="Date of Birth"
                    className="border border-gray-300 rounded-lg px-2 py-1"
                  />

                  <input
                    type="text"
                    value={selectedPatient.address || ""}
                    onChange={(e) =>
                      setSelectedPatient({
                        ...selectedPatient,
                        address: e.target.value,
                      })
                    }
                    placeholder="Address"
                    className="border border-gray-300 rounded-lg px-2 py-1 sm:col-span-2"
                  />

                  <input
                    type="text"
                    value={selectedPatient.mobile_phone || ""}
                    onChange={(e) =>
                      setSelectedPatient({
                        ...selectedPatient,
                        mobile_phone: e.target.value,
                      })
                    }
                    placeholder="Mobile Phone"
                    className="border border-gray-300 rounded-lg px-2 py-1"
                  />

                  <input
                    type="text"
                    value={selectedPatient.home_phone || ""}
                    onChange={(e) =>
                      setSelectedPatient({
                        ...selectedPatient,
                        home_phone: e.target.value,
                      })
                    }
                    placeholder="Home Phone"
                    className="border border-gray-300 rounded-lg px-2 py-1"
                  />

                  <input
                    type="text"
                    value={selectedPatient.marriage_status || ""}
                    onChange={(e) =>
                      setSelectedPatient({
                        ...selectedPatient,
                        marriage_status: e.target.value,
                      })
                    }
                    placeholder="Marriage Status"
                    className="border border-gray-300 rounded-lg px-2 py-1"
                  />

                  <input
                    type="text"
                    value={selectedPatient.title || ""}
                    onChange={(e) =>
                      setSelectedPatient({
                        ...selectedPatient,
                        title: e.target.value,
                      })
                    }
                    placeholder="Title"
                    className="border border-gray-300 rounded-lg px-2 py-1"
                  />

                  <input
                    type="text"
                    value={selectedPatient.social_security || ""}
                    onChange={(e) =>
                      setSelectedPatient({
                        ...selectedPatient,
                        social_security: e.target.value,
                      })
                    }
                    placeholder="Social Security"
                    className="border border-gray-300 rounded-lg px-2 py-1"
                  />

                  <input
                    type="text"
                    value={selectedPatient.emergency_contact || ""}
                    onChange={(e) =>
                      setSelectedPatient({
                        ...selectedPatient,
                        emergency_contact: e.target.value,
                      })
                    }
                    placeholder="Emergency Contact"
                    className="border border-gray-300 rounded-lg px-2 py-1 sm:col-span-2"
                  />
                </div>

                <div className="flex justify-end gap-3 mt-5">
                  <button
                    onClick={() => setProfileModal(false)}
                    className="px-3 py-1 rounded-lg border border-gray-300 text-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={updatePatient}
                    className="bg-[#7AAE9E] text-white px-3 py-1 rounded-lg"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === "visits" && (
              <div>
                {visits.length === 0 && (
                  <p className="text-gray-500">No visits recorded.</p>
                )}

                {visits.map((visit) => (
                  <div
                    key={visit.visit_id}
                    className="border-l-4 border-[#7AAE9E] bg-gray-50 rounded-lg p-3 mb-3"
                  >
                    <p className="text-sm text-[#7AAE9E] font-semibold">
                      {formatDate(visit.visit_date)}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Dr. {visit.doctor_first_name} {visit.doctor_last_name}
                    </p>
                    {visit.notes && (
                      <p className="text-sm text-gray-700 mt-2">
                        {visit.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
