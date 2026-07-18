import { useState, useEffect } from "react";

export default function Reports() {
  const [recallList, setRecallList] = useState([]);

  function formatDate(dateString) {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/reports/recall`, {
      method: "GET",
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setRecallList(data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 mt-10">
      <h1 className="text-3xl text-[#7AAE9E] font-bold mb-2">Recall List</h1>
      <p className="text-gray-500 mb-6">
        Patients whose last appointment has passed with nothing upcoming
        scheduled.
      </p>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#7AAE9E] text-white text-left">
            <th className="px-4 py-2">Patient</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Mobile Phone</th>
            <th className="px-4 py-2">Last Appointment</th>
          </tr>
        </thead>
        <tbody>
          {recallList.map((patient) => (
            <tr key={patient.patient_id} className="even:bg-gray-100 border-b">
              <td className="px-4 py-2">
                {patient.first_name} {patient.last_name}
              </td>
              <td className="px-4 py-2">{patient.email}</td>
              <td className="px-4 py-2">{patient.mobile_phone}</td>
              <td className="px-4 py-2">
                {formatDate(patient.last_appointment_date)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {recallList.length === 0 && (
        <p className="text-gray-500 mt-6">
          No patients currently need a recall appointment.
        </p>
      )}
    </div>
  );
}
