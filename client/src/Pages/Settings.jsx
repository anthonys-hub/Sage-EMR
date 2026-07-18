import { useState, useEffect } from "react";

export default function Settings() {
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);

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
          setPreview(data.profile_picture);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  }

  function saveProfilePicture() {
    if (!preview) return;

    setSaving(true);
    fetch(`${import.meta.env.VITE_API_URL}/api/users/me/profile-picture`, {
      method: "PUT",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ profile_picture: preview }),
    })
      .then((res) => res.json())
      .then(() => {
        setSaving(false);
        alert("Profile picture updated.");
      })
      .catch((err) => {
        console.log(err);
        setSaving(false);
      });
  }

  return (
    <div className="max-w-2xl mx-auto px-6 mt-10">
      <h1 className="text-3xl text-[#7AAE9E] font-bold mb-6">Settings</h1>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-[#7AAE9E] mb-4">
          Profile Picture
        </h2>

        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
            {preview ? (
              <img
                src={preview}
                alt="Profile preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-400 text-sm">No image</span>
            )}
          </div>

          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mb-3 block"
            />
            <button
              onClick={saveProfilePicture}
              disabled={!preview || saving}
              className="bg-[#7AAE9E] text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
