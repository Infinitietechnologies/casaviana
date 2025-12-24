"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { update_profile } from "@/Api/api";
import { updateProfile } from "@/store/authSlice";

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
        setMessage({ type: "error", text: "Image size should be less than 5MB" });
        return;
      }

      setProfilePicture(file);
      setPreviewUrl(URL.createObjectURL(file));
      setMessage({ type: "", text: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await update_profile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        profile_picture: profilePicture,
      });

      if (response.success !== false) {
        // Update Redux store with new user data
        dispatch(updateProfile(response));
        setMessage({ type: "success", text: "Profile updated successfully!" });
        
        // Clear preview and file input
        setProfilePicture(null);
        setPreviewUrl(null);
        
        // Reset file input
        const fileInput = document.getElementById("profile-picture-input");
        if (fileInput) fileInput.value = "";
      } else {
        setMessage({ type: "error", text: response.error || "Failed to update profile" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred while updating profile" });
    } finally {
      setLoading(false);
    }
  };

  const getCurrentAvatar = () => {
    if (previewUrl) return previewUrl;
    if (user?.profile_picture) return user.profile_picture;
    return "/images/avatar.png";
  };

  const menuItems = [
    {
      name: "My Profile",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0zM4.5 20.25a8.25 8.25 0 1 1 15 0v.75H4.5v-.75z"
          />
        </svg>
      ),
    },
    {
      name: "Orders",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15l4.5-4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
          />
        </svg>
      ),
    },
    {
      name: "Favorites",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
          className="w-5 h-5"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 
            4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 
            2.09A6.003 6.003 0 0 1 21.5 8.5c0 
            3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      ),
    },
    {
      name: "Address",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 21c-4.418 0-8-3.582-8-8S7.582 5 12 5s8 
            3.582 8 8-3.582 8-8 8zm0-13.5a2.5 
            2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"
          />
        </svg>
      ),
    },
    {
      name: "Wallet",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 
            0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 
            0 0 2-2v-5zm-4 0a1 1 0 1 1-2 0 
            1 1 0 0 1 2 0z"
          />
        </svg>
      ),
    },
    {
      name: "Transactions",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 9V7a2 2 0 0 0-2-2H5a2 2 
            0 0 0-2 2v10a2 2 0 0 0 2 
            2h10a2 2 0 0 0 2-2v-2m4-3H9m0 
            0 3-3m-3 3 3 3"
          />
        </svg>
      ),
    },
    {
      name: "Chat",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.5 8.25h9m-9 3h6M4.5 
            4.5h15a2.25 2.25 0 0 1 
            2.25 2.25v9a2.25 2.25 0 
            0 1-2.25 2.25H8.25L3 21V6.75A2.25 
            2.25 0 0 1 5.25 4.5z"
          />
        </svg>
      ),
    },
    {
      name: "Support tickets",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.75V9m0 6v.008M21 
            12a9 9 0 1 1-18 0 9 9 0 0 
            1 18 0z"
          />
        </svg>
      ),
    },
    {
      name: "Refer & Earn",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8.25V12l3 3m6 0a9 9 
            0 1 1-18 0 9 9 0 0 1 18 
            0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 mt-24 px-4 mb-4">
      {/* Sidebar */}
      <aside className="w-full md:w-1/3 lg:w-1/4 bg-white shadow-md rounded-xl p-6">
        <div className="flex flex-col items-center">
          <img
            src={getCurrentAvatar()}
            alt="avatar"
            className="w-20 h-20 rounded-full object-cover border-2 border-amber-500"
          />
          <h3 className="mt-3 font-semibold text-gray-900">
            {user?.name || user?.username || "User"}
          </h3>
          <p className="text-gray-500 text-sm">{user?.email || "No email"}</p>
        </div>

        <div className="mt-6 space-y-1">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className={`w-full flex items-center justify-between text-gray-700 py-2.5 px-4 rounded-lg text-sm transition ${
                index === 0 ? "bg-red-600 text-white" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                {item.name}
              </div>
              <span>›</span>
            </button>
          ))}
        </div>
      </aside>

      {/* Profile Form */}
      <div className="flex-1 bg-white shadow-md rounded-xl p-6 md:p-10">
        <h2 className="text-lg font-semibold text-gray-900">My Profile</h2>

        {/* Avatar Section */}
        <div className="flex flex-col items-center mt-6">
          <div className="relative">
            <img
              src={getCurrentAvatar()}
              alt="avatar"
              className="w-36 h-36 rounded-full border-4 border-amber-500 object-cover"
            />
            <label
              htmlFor="profile-picture-input"
              className="absolute bottom-0 right-0 bg-amber-500 text-white p-2 rounded-full cursor-pointer hover:bg-amber-600 transition"
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
          <span className="mt-3 font-semibold text-gray-800 text-lg">
            {user?.name || user?.username || "My Avatar"}
          </span>
          <p className="text-xs text-gray-500 mt-1">Click the camera icon to change picture</p>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
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
              className="w-full px-4 py-2.5 rounded-md bg-gray-100 focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          {/* <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              value={user?.username || ""}
              className="w-full px-4 py-2.5 rounded-md bg-gray-200 text-gray-500 cursor-not-allowed"
              readOnly
              disabled
            />
          </div> */}

          <div className="md:col-span-2">
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
              className="w-full px-4 py-2.5 rounded-md bg-gray-100 focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          <div className="md:col-span-2">
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
              className="w-full px-4 py-2.5 rounded-md bg-gray-100 focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 text-white font-semibold py-3 rounded-md hover:bg-amber-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;

