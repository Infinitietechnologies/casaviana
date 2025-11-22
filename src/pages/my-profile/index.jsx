"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const Profile = () => {
  const router = useRouter();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/"); 
    }
  }, [isLoggedIn]);

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
            src="/images/avatar.png"
            alt="avatar"
            className="w-20 h-20 rounded-full object-cover border-2 border-amber-500"
          />
          <h3 className="mt-3 font-semibold text-gray-900">Support User</h3>
          <p className="text-gray-500 text-sm">test@gmail.com</p>
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
        <div className="flex justify-between items-start">
          <h2 className="text-lg font-semibold text-gray-900">My Profile</h2>
          <button className="flex items-center gap-2 text-red-500 border border-red-200 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-medium transition">
            Delete Account
          </button>
        </div>

        {/* Avatar Section */}
        <div className="flex flex-col items-center mt-6">
          <img
            src="/images/avatar.png"
            alt="avatar"
            className="w-36 h-36 rounded-full border-4 border-amber-500 object-cover"
          />
          <span className="mt-3 font-semibold text-gray-800 text-lg">
            My Avatar
          </span>
        </div>

        {/* Form Fields */}
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
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

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Old Password
            </label>
            <input
              type="password"
              placeholder="Enter old password"
              className="w-full px-4 py-2.5 rounded-md bg-gray-100 focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter new password"
              className="w-full px-4 py-2.5 rounded-md bg-gray-100 focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              placeholder="Confirm new password"
              className="w-full px-4 py-2.5 rounded-md bg-gray-100 focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>
        </form>

        <div className="mt-8">
          <button className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-md font-medium transition">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
