import { useState, useEffect } from "react";

export default function Header() {
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");
  const [profilePicture, setProfilePicture] = useState(null);

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

  return (
    <div className="bg-white flex flex-row border-b-2 border-[#e2e2e2] justify-end items-center h-12.5 gap-3 pr-3">
      <div>
        <h1>{name}</h1>
        <h2>{role}</h2>
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
  );
}
