"use client";
import React from "react";

const Profile = () => {
  return (
    <div className="max-w-6xl mx-auto bg-white shadow-md rounded-xl p-6 md:p-10 mt-20">
      {/* Header */}
      <div className="flex justify-between items-start">
        <h2 className="text-lg font-semibold text-gray-900">My Profile</h2>
        <button className="flex items-center gap-2 text-red-500 border border-red-200 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-medium transition">
          {/* <FaTrashAlt /> */}
          Delete Account
        </button>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center mt-6">
        <div className="relative">
          <img
            src="/images/avatar.png" 
            alt="avatar"
            className="w-36 h-36 rounded-full border-4 border-amber-500 object-cover"
          />
         
        </div>
        <span className="mt-3 font-semibold text-gray-800 text-lg">
          My Avatar
        </span>
      </div>

      {/* Form */}
      <form className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* User Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            User Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Support User"
            className="w-full px-4 py-2.5 rounded-md bg-gray-100 focus:ring-2 focus:ring-amber-500 outline-none"
          />
        </div>

        {/* Mobile */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Mobile <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="1212121212"
            className="w-full px-4 py-2.5 rounded-md bg-gray-100 focus:ring-2 focus:ring-amber-500 outline-none"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            placeholder="test@gmail.com"
            className="w-full px-4 py-2.5 rounded-md bg-gray-100 focus:ring-2 focus:ring-amber-500 outline-none"
          />
        </div>

        {/* Old Password */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Old Password
          </label>
          <div className="relative">
            <input
              type="password"
              placeholder="Enter old password"
              className="w-full px-4 py-2.5 rounded-md bg-gray-100 focus:ring-2 focus:ring-amber-500 outline-none"
            />
            {/* <FaEye className="absolute right-4 top-3 text-gray-400" /> */}
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            New Password
          </label>
          <div className="relative">
            <input
              type="password"
              placeholder="Enter new password"
              className="w-full px-4 py-2.5 rounded-md bg-gray-100 focus:ring-2 focus:ring-amber-500 outline-none"
            />
            {/* <FaEye className="absolute right-4 top-3 text-gray-400" /> */}
          </div>
        </div>

        {/* Confirm New Password */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type="password"
              placeholder="Confirm new password"
              className="w-full px-4 py-2.5 rounded-md bg-gray-100 focus:ring-2 focus:ring-amber-500 outline-none"
            />
            {/* <FaEye className="absolute right-4 top-3 text-gray-400" /> */}
          </div>
        </div>
      </form>

      {/* Save Button */}
      <div className="mt-8">
        <button className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-md font-medium transition">
          Save
        </button>
      </div>
    </div>
  );
};

export default Profile;
