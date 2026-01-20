"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { update_profile } from "@/Api/api";
import { updateProfile } from "@/store/authSlice";
import ProfileSidebar from "@/views/ProfileSidebar";
import { DatePicker } from "@heroui/react";
import { parseDate, today, getLocalTimeZone } from "@internationalized/date";

const Profile = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [birthdate, setBirthdate] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/");
    }
  }, [isLoggedIn, router]);

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
      // Parse birthdate if exists
      if (user.birthdate) {
        try {
          let dateString = user.birthdate;

          // Check if it's in ISO format with time (e.g., 1999-07-15T00:00:00.000000Z)
          if (dateString.includes("T")) {
            dateString = dateString.split("T")[0];
          }

          // Check if it matches YYYY-MM-DD format
          const isoMatch = dateString.match(/^(\d{4})-(\d{2})-(\d{2})$/);
          if (isoMatch) {
            setBirthdate(parseDate(dateString));
          } else {
            // Try to parse as a regular date and convert to YYYY-MM-DD
            const date = new Date(user.birthdate);
            if (!isNaN(date.getTime())) {
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, "0");
              const day = String(date.getDate()).padStart(2, "0");
              setBirthdate(parseDate(`${year}-${month}-${day}`));
            }
          }
        } catch (e) {
          console.error("Failed to parse birthdate:", e);
        }
      }
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setMessage({ type: "error", text: "Please select a valid image file" });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({
          type: "error",
          text: "Image size should be less than 5MB",
        });
        return;
      }

      setProfilePicture(file);
      setPreviewUrl(URL.createObjectURL(file));
      setMessage({ type: "", text: "" });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await update_profile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        birthdate: birthdate ? birthdate.toString() : null,
        profile_picture: profilePicture,
      });

      if (response.success !== false) {
        // Update Redux store with new user data
        const userData = response.user ?? response.data?.user ?? response;
        dispatch(updateProfile(response));

        // Also update localStorage to keep in sync
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(userData));
        }

        setMessage({ type: "success", text: "Profile updated successfully!" });

        // Clear preview and file input
        setProfilePicture(null);
        setPreviewUrl(null);

        // Reset file input
        const fileInput = document.getElementById("profile-picture-input");
        if (fileInput) fileInput.value = "";
      } else {
        setMessage({
          type: "error",
          text: response.error || "Failed to update profile",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "An error occurred while updating profile",
      });
    } finally {
      setLoading(false);
    }
  };

  const getCurrentAvatar = () => {
    if (previewUrl) return previewUrl;
    if (user?.profile_picture) return user.profile_picture;
    return "/images/avatar.png";
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 mt-24 px-4 mb-8">
      {/* Reusable Sidebar */}
      <ProfileSidebar currentPath="/my-profile" />

      {/* Profile Form */}
      <div className="flex-1 bg-white shadow-md rounded-xl p-6 md:p-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">My Profile</h2>

        {/* Success/Error Message */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            <div className="flex items-center gap-2">
              {message.type === "success" ? (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <span className="font-medium">{message.text}</span>
            </div>
          </div>
        )}

        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-8 pb-8 border-b border-gray-200">
          <div className="relative">
            <img
              src={getCurrentAvatar()}
              alt="avatar"
              className="w-32 h-32 rounded-full border-4 border-amber-500 object-cover shadow-lg"
            />
            <label
              htmlFor="profile-picture-input"
              className="absolute bottom-0 right-0 bg-amber-500 text-white p-2.5 rounded-full cursor-pointer hover:bg-amber-600 transition shadow-lg"
              title="Change profile picture"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                />
              </svg>
            </label>
            <input
              id="profile-picture-input"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
          <span className="mt-4 font-semibold text-gray-800 text-lg">
            {user?.name || user?.username || "My Avatar"}
          </span>
          <p className="text-xs text-gray-500 mt-1">
            Click the camera icon to change picture
          </p>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Data de Nascimento
            </label>
            <DatePicker
              value={birthdate}
              onChange={setBirthdate}
              showMonthAndYearPickers
              maxValue={today(getLocalTimeZone())}
              className="w-full"
              variant="bordered"
              classNames={{
                base: "w-full",
                inputWrapper:
                  "bg-gray-50 border border-gray-200 hover:border-gray-300",
              }}
            />
          </div>

          <div className="md:col-span-2">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-amber-500 text-white font-semibold py-3 rounded-lg hover:bg-amber-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Updating...
                </span>
              ) : (
                "Update Profile"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
