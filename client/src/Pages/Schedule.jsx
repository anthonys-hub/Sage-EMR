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
  const [newAppointment, setNewAppointment] = useState(false);
  const [patients, setPatients] = useState([]);
  const [appointmentPatient, setAppointmentPatient] = useState(null);
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [appointmentSlot, setAppointmentSlot] = useState(null);
  const [appointmentDoctor, setAppointmentDoctor] = useState(null);
  const [patientSearch, setPatientSearch] = useState("");
  const [editingAppointmentId, setEditingAppointmentId] = useState(null);

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

  const slotTo24Hour = {
    "8:00 AM": "08:00:00",
    "9:00 AM": "09:00:00",
    "10:00 AM": "10:00:00",
    "11:00 AM": "11:00:00",
    "12:00 PM": "12:00:00",
    "1:00 PM": "13:00:00",
    "2:00 PM": "14:00:00",
    "3:00 PM": "15:00:00",
    "4:00 PM": "16:00:00",
    "5:00 PM": "17:00:00",
  };

  const slotToEndTime = {
    "8:00 AM": "09:00:00",
    "9:00 AM": "10:00:00",
    "10:00 AM": "11:00:00",
    "11:00 AM": "12:00:00",
    "12:00 PM": "13:00:00",
    "1:00 PM": "14:00:00",
    "2:00 PM": "15:00:00",
    "3:00 PM": "16:00:00",
    "4:00 PM": "17:00:00",
    "5:00 PM": "18:00:00",
  };

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

  function editAppointment() {
    if (!appointmentPatient || !selectedCase || !appointmentSlot) {
      alert("Please select a patient, case, and time.");
      return;
    }

    fetch(
      `${import.meta.env.VITE_API_URL}/api/appointments/${editingAppointmentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          appointment_date: selectedDate,
          appointment_starttime: slotTo24Hour[appointmentSlot],
          appointment_endtime: slotToEndTime[appointmentSlot],
          status: "scheduled",
          patient_id: appointmentPatient,
          case_id: selectedCase,
          doctor_id: appointmentDoctor.doctor_id,
        }),
      },
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update appointment");
        return res.json();
      })
      .then(() => {
        fetchAppointments();
        setNewAppointment(false);
        setEditingAppointmentId(null);
        setAppointmentPatient(null);
        setSelectedCase(null);
        setPatientSearch("");
      })
      .catch((err) => {
        console.log(err);
        alert("Something went wrong updating the appointment.");
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

  function onContextMenu(e, appt, slot, doctor) {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      appointment: appt,
      slot: slot,
      doctor: doctor,
    });
  }

  function formatTime(strTime) {
    const parts = strTime.split(":");
    const hour = parseInt(parts[0]);

    if (hour === 0) {
      return "12:" + parts[1] + " AM";
    } else if (hour === 12) {
      return "12:" + parts[1] + " PM";
    } else if (hour > 12) {
      return hour - 12 + ":" + parts[1] + " PM";
    } else {
      return hour + ":" + parts[1] + " AM";
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

  function addAppointment() {
    if (!appointmentPatient || !selectedCase || !appointmentSlot) {
      alert("Please select a patient, case, and time.");
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/appointments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        appointment_date: selectedDate,
        appointment_starttime: slotTo24Hour[appointmentSlot],
        appointment_endtime: slotToEndTime[appointmentSlot],
        status: "scheduled",
        patient_id: appointmentPatient,
        case_id: selectedCase,
        doctor_id: appointmentDoctor.doctor_id,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to create appointment");
        }
        return res.json();
      })
      .then(() => {
        fetchAppointments();
        setNewAppointment(false);
        setAppointmentPatient(null);
        setSelectedCase(null);
        setPatientSearch("");
      })
      .catch((err) => {
        console.log(err);
        alert("Something went wrong creating the appointment.");
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

  function deleteAppointment(appointmentId) {
    fetch(`${import.meta.env.VITE_API_URL}/api/appointments/${appointmentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(() => {
        fetchAppointments();
        setContextMenu(null);
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/patients`, {
      method: "GET",
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setPatients(data);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (!appointmentPatient) return;
    fetch(
      `${import.meta.env.VITE_API_URL}/api/cases?patient_id=${appointmentPatient}`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    )
      .then((res) => res.json())
      .then((data) => {
        setCases(data);
      })
      .catch((err) => console.log(err));
  }, [appointmentPatient]);

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
      <div className="bg-white rounded-t-lg border-[#e2e2e2] flex-1 h-200 flex flex-col">
        {" "}
        <div className="border border-[#e2e2e2] rounded-t-lg h-full flex flex-col ">
          <h1 className="text-3xl ml-2 py-1 text-[#7AAE9E] font-quicksand font-bold">
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

          <div className="flex flex-row flex-1">
            {doctors.map((doctor) => (
              <div
                key={doctor.doctor_id}
                className="bg-[#f2f4f1] border border-[#e2e2e2] flex-1 min-w-40 flex flex-col justify-center items-center h-full"
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
                      className=" flex-1 min-w-40 min-h-16 border-r border-l border-gray-200"
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
                        <div
                          className="h-16"
                          onContextMenu={(e) =>
                            onContextMenu(e, null, slot, doctor)
                          }
                        ></div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-[#7AAE9E] max-w-150 mr-3 w-full h-200 rounded-t-lg border-[#e2e2e2]">
        <h1 className="text-3xl font-quicksand mt-1 py-1 text-white font-bold text-center">
          {" "}
          Wait List
        </h1>

        <div className="">
          {waitlist.map((entry) => (
            <div
              key={entry.waitlist_id}
              className="border border-[#7AAE9E] flex hover:cursor-pointer bg-gray-50 justify-between mt-1 ml-2 w-145 rounded-lg p-3 "
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
          {contextMenu.appointment ? (
            <>
              <div
                onClick={() => {
                  const appt = contextMenu.appointment;
                  const doctor = doctors.find(
                    (d) => d.doctor_id === appt.doctor_id,
                  );

                  setEditingAppointmentId(appt.appointment_id);
                  setAppointmentPatient(appt.patient_id);
                  setPatientSearch(`${appt.first_name} ${appt.last_name}`);
                  setSelectedCase(appt.case_id);
                  setAppointmentSlot(formatTime(appt.appointment_starttime));
                  setAppointmentDoctor(doctor);
                  setNewAppointment(true);
                  setContextMenu(null);
                }}
                className="hover:bg-gray-100 px-4 py-2 cursor-pointer text-sm"
              >
                <p>Edit Appointment</p>
              </div>

              <div
                onClick={() => {
                  const appt = contextMenu.appointment;
                  fetch(
                    `${import.meta.env.VITE_API_URL}/api/patients/${appt.patient_id}`,
                    {
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                      },
                    },
                  )
                    .then((res) => res.json())
                    .then((data) => {
                      setSelectedPatient(data);
                      setActiveTab("info");
                      setProfileModal(true);
                    });

                  fetch(
                    `${import.meta.env.VITE_API_URL}/api/visits?patient_id=${appt.patient_id}`,
                    {
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                      },
                    },
                  )
                    .then((res) => res.json())
                    .then((data) => setVisits(data));

                  setContextMenu(null);
                }}
                className="hover:bg-gray-100 px-4 py-2 cursor-pointer text-sm"
              >
                <p>Edit Client</p>
              </div>

              <div className="hover:bg-gray-100 px-4 py-2 cursor-pointer text-sm">
                <p>Cash Register</p>
              </div>
              <div
                onMouseEnter={() => setShowStatusMenu(true)}
                onMouseLeave={() => setShowStatusMenu(false)}
                className="relative hover:bg-gray-100 px-4 py-2 cursor-pointer text-sm"
              >
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
                    <div
                      onClick={() =>
                        deleteAppointment(
                          contextMenu.appointment.appointment_id,
                        )
                      }
                      className="hover:bg-gray-100 px-4 py-2 cursor-pointer text-sm"
                    >
                      <p>Delete Appointment</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="hover:bg-gray-100 px-4 py-2 cursor-pointer text-sm">
              <p
                onClick={() => {
                  setAppointmentSlot(contextMenu.slot);
                  setAppointmentDoctor(contextMenu.doctor);
                  setNewAppointment(true);
                  setContextMenu(null);
                }}
              >
                New Appointment
              </p>
            </div>
          )}
        </div>
      )}

      {newAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold text-[#7AAE9E] mb-4">
              {editingAppointmentId ? "Edit Appointment" : "New Appointment"}
            </h2>

            <input
              type="text"
              placeholder="Search patient by name..."
              value={patientSearch}
              onChange={(e) => {
                setPatientSearch(e.target.value);
                setAppointmentPatient(null);
              }}
              className="border border-gray-300 rounded-lg px-2 py-1 w-full mb-2"
            />
            {patientSearch && !appointmentPatient && (
              <div className="border border-gray-200 rounded-lg max-h-40 overflow-y-auto mb-4">
                {patients
                  .filter((patient) =>
                    `${patient.first_name} ${patient.last_name}`
                      .toLowerCase()
                      .includes(patientSearch.toLowerCase()),
                  )
                  .map((patient) => (
                    <div
                      key={patient.patient_id}
                      onClick={() => {
                        setAppointmentPatient(patient.patient_id);
                        setPatientSearch(
                          `${patient.first_name} ${patient.last_name}`,
                        );
                      }}
                      className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
                    >
                      {patient.first_name} {patient.last_name}
                    </div>
                  ))}
              </div>
            )}

            <select
              value={selectedCase}
              onChange={(e) => setSelectedCase(e.target.value)}
              className="border border-gray-300 rounded-lg px-2 py-1 w-full mb-4"
            >
              <option value="">Select a case</option>
              {cases.map((case_) => (
                <option key={case_.case_id} value={case_.case_id}>
                  {case_.description}
                </option>
              ))}
            </select>

            <select
              value={appointmentSlot}
              onChange={(e) => setAppointmentSlot(e.target.value)}
              className="border border-gray-300 rounded-lg px-2 py-1 w-full mb-4"
            >
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => {
                  setNewAppointment(false);
                  setEditingAppointmentId(null);
                  setAppointmentPatient(null);
                  setSelectedCase(null);
                  setPatientSearch("");
                }}
                className="px-3 py-1 rounded-lg border border-gray-300 text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={editingAppointmentId ? editAppointment : addAppointment}
                className="bg-[#7AAE9E] text-white px-3 py-1 rounded-lg"
              >
                Submit
              </button>
            </div>
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