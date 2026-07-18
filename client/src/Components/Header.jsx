import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


export default function Header() {
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");
  const [profilePicture, setProfilePicture] = useState(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/users/me/profile-picture`, {
      method: "GET",
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.profile_picture) {
          setProfilePicture(data.profile_picture);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(() => {
      fetch(
        `${import.meta.env.VITE_API_URL}/api/patients?search=${encodeURIComponent(query)}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )
        .then((res) => res.json())
        .then((data) => setResults(data))
        .catch((err) => console.log(err));
    }, 250);

    return () => clearTimeout(timeout);
  }, [query]);

  function handleSelectPatient(patient) {
    setQuery("");
    setResults([]);
    navigate("/patients", { state: { openPatientId: patient.patient_id } });
  }

  function formatDob(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }

  return (
    <div className="bg-white flex flex-row border-b-2 border-[#e2e2e2] justify-between items-center h-12.5 gap-3 px-3">
      <div className="relative w-72">
        <input

          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search patients"

          className="w-full border border-[#7AAE9E] ml-7 bg-gray-100 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#7AAE9E]"
        />
        {results.length > 0 && (
          <div className="absolute top-full left-0 w-full ml-7 bg-white border border-gray-200 rounded-lg mt-1 shadow-lg max-h-64 overflow-y-auto z-50">
            {results.map((patient) => (
              <div
                key={patient.patient_id}
                onClick={() => handleSelectPatient(patient)}
                className="px-3 py-2  hover:bg-gray-100 cursor-pointer text-sm flex justify-between"
              >
                <span>{patient.first_name} {patient.last_name}</span>
                <span className="text-gray-400 text-xs">{formatDob(patient.dob)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-row items-center gap-3">
        <div>
          <h1 className="font-bold text-center"><span className="font-normal">👋 Hello,</span> {name}!</h1>
          <p className="text-sm text-center"></p>
        </div>

        <div className="w-9 h-9 rounded-full bg-blue-500 overflow-hidden flex items-center justify-center shrink-0">
          {profilePicture ? (
            <img
              src={profilePicture}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <h2 className="text-white text-xs">?</h2>
          )}
        </div>
      </div>
    </div>
  );
}