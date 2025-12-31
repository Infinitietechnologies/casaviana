"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import LoginModal from "./Modals/LoginModal";
import LogoutModal from "./Modals/LogoutModal";
import { useDispatch, useSelector } from "react-redux";
import { logout as logoutAction, setLogin } from "@/store/authSlice";
import { logout } from "@/Api/api";
import { addToast, useDisclosure } from "@heroui/react";
import CartOffcanvas from "./CartOffcanvas";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user);
  const cartTotalQuantity = useSelector((state) => state.cart.totalQuantity);
  const {
    isOpen: isLogoutOpen,
    onOpen: onLogoutOpen,
    onOpenChange: onLogoutOpenChange,
  } = useDisclosure();
  const {
    isOpen: isCartOpen,
    onOpen: onCartOpen,
    onClose: onCartClose,
  } = useDisclosure();

  const dispatch = useDispatch();
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Hydrate state from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("authToken"); // Ensure token matches interceptor key

      if (storedUser && storedToken) {
        try {
          const parsedUser = JSON.parse(storedUser);
          dispatch(logoutAction()); // Reset first to be safe
          // We need to re-set the token in the interceptor (although it initializes from localStorage,
          // redundant calls are safe and ensure sync if we ever change logic)
          // Note: setAccessToken is not imported from interceptor directly but via api?
          // Actually api.js doesn't export setAccessToken.
          // We rely on interceptor initializing itself.

          // Dispatch login
          // Dispatch login with delay to avoid 'insertBefore' hydration error
          // similar to the fix in LoginModal.jsx
          setTimeout(() => {
            dispatch(setLogin(parsedUser));
          }, 100);
        } catch (e) {
          console.error("Failed to parse stored user", e);
          localStorage.removeItem("user");
        }
      }
    }
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await logout();
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");
      }
      dispatch(logoutAction());
      setProfileOpen(false);
      addToast({
        title: "Logged out successfully",
        color: "danger",
      });
    } catch (err) {
      // console.log("Logout failed:", err);
      // Force client-side logout even if API fails
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");
      }
      dispatch(logoutAction());
      setProfileOpen(false);
    }
  };
  return (
    <>
      <nav
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 border-b
          ${
            isScrolled
              ? "backdrop-blur-md bg-red-600/60 border-white/20 shadow-lg"
              : "bg-red-600 border-transparent"
          }`}
      >
      <div className="max-w-[1900px] mx-auto flex items-center justify-between h-20 px-4 md:px-6">
        {/* LEFT LOGOS */}
        <div className="flex items-center gap-2">
          <Link href="/">
            <Image
              src="/images/casa-viana.png"
              alt="Casa Viana"
              width={90}
              height={90}
            />
          </Link>
          {/* Hide on mobile */}
          {/* <Link href="https://centraldipanda.ao/" className="hidden md:block">
            <Image
              src="/images/mabululu.png"
              alt="Mabululu"
              width={60}
              height={80}
            />
          </Link> */}

          {/* <Link href="https://centraldipanda.ao/" className="hidden md:block">
            <Image
              src="/images/Centra-Dipanda.png"
              alt="Central Dipanda"
              width={60}
              height={80}
            />
          </Link> */}
        </div>

        {/* CENTER MENU (desktop only) */}
        <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-white">
          {[
            "Início",
            "Serviços",
            "Eventos",
            "Reservar",
            "Contactos",
            "Blogs",
          ].map((item, i) => (
            <Link
              key={i}
              href={
                item === "Início"
                  ? "/"
                  : item === "Eventos"
                  ? "/events"
                  : item === "Reservar"
                  ? "/reserva"
                  : item === "Serviços"
                  ? "/reserva"
                  : item === "Blogs"
                  ? "/blogs"
                  : "#"
              }
              className="relative group transition-colors hover:text-gray-200 text-xl"
            >
              {item}
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-white transition-all group-hover:w-full"></span>
            </Link>
          ))}

          {/* TV Icon Box */}
          <Link
            href="#"
            className="group relative flex flex-col items-center hover:text-gray-200"
          >
            <div className="flex flex-row items-center justify-center w-16 h-10 rounded-xl bg-red-700 hover:bg-red-800 transition-colors shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="w-6 h-6 mb-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 4l4 4 4-4m4 6v7.5A1.5 1.5 0 0118.5 19h-13A1.5 1.5 0 014 17.5V10A1.5 1.5 0 015.5 8.5h13A1.5 1.5 0 0120 10z"
                />
              </svg>
              <span className="text-sm font-semibold">TV</span>
            </div>
          </Link>

          {/* Rádio Icon Box */}
          <Link
            href="#"
            className="group relative flex flex-col items-center hover:text-gray-200"
          >
            <div className="flex flex-row items-center justify-center w-20 h-10 rounded-xl bg-red-700 hover:bg-red-800 transition-colors shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="w-6 h-6 mb-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 7.5l15-4.5M3 10.5v6.75A1.75 1.75 0 004.75 19h14.5A1.75 1.75 0 0021 17.25V10.5M6 14.25h.008v.008H6v-.008zm3 0h.008v.008H9v-.008zm3 0h.008v.008H12v-.008z"
                />
              </svg>
              <span className="text-sm font-semibold">Rádio</span>
            </div>
          </Link>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">
          {/* Desktop right side */}
          <div
            className="hidden md:flex items-center gap-4 relative"
            ref={dropdownRef}
          >
            <Link href="/cardapio">
              <Image
                src="/images/cardapio.png"
                alt="Cardápio"
                width={75}
                height={75}
              />
            </Link>
            <Link href="https://maps.app.goo.gl/UuTFT2sXNC6epm4x6">
              <Image
                src="/images/qualidade.png"
                alt="Qualidade"
                width={300}
                height={100}
              />
            </Link>

            {/* Cart */}
            {isLoggedIn && (
              <button
                onClick={onCartOpen}
                className="relative cursor-pointer"
              >
                <Image
                  src="/images/online-shopping.png"
                  alt="Cart"
                  width={30}
                  height={30}
                  className="invert"
                />
                {cartTotalQuantity > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-800 text-white text-xs rounded-full px-1.5 min-w-[20px] text-center">
                    {cartTotalQuantity}
                  </span>
                )}
              </button>
            )}
            {isLoggedIn ? (
              <>
                {/* Profile Icon */}
                <div
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="w-12 h-12 flex items-center justify-center rounded-full cursor-pointer transition overflow-hidden border-2 border-white/30 hover:border-white/50"
                >
                  <img
                    src={user?.profile_picture || "/images/avatar.png"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Dropdown Menu */}
                {profileOpen && (
                  <div className="absolute right-0 top-14 w-56 bg-white text-gray-800 rounded-lg shadow-lg py-2 z-50">
                    <div className="px-4 py-3 border-b">
                      <p className="text-sm font-semibold text-gray-900">
                        {user?.name || user?.username || "User"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user?.email || "No email"}
                      </p>
                    </div>

                    <Link
                      href="/my-profile"
                      className="px-4 py-2.5 flex items-center gap-3 text-sm hover:bg-gray-100 transition"
                      onClick={() => setProfileOpen(false)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.8}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 0115 0v.75H4.5v-.75z"
                        />
                      </svg>
                      Profile
                    </Link>

                    <Link
                      href="/bookings"
                      className="px-4 py-2.5 flex items-center gap-3 text-sm hover:bg-gray-100 transition"
                      onClick={() => setProfileOpen(false)}
                    >
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
                      Bookings
                    </Link>
                    <Link
                      href="/"
                      className="px-4 py-2.5 flex items-center gap-3 text-sm hover:bg-gray-100 transition"
                      onClick={() => setProfileOpen(false)}
                    >
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
                          d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
                        />
                      </svg>
                      Payments
                    </Link>
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        onLogoutOpen();
                      }}
                      className="w-full text-left px-4 py-2.5 flex items-center gap-3 text-sm hover:bg-gray-100 transition"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.8}
                        stroke="currentColor"
                        className="w-5 h-5 text-red-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                        />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <LoginModal />
            )}
          </div>

          {isLoggedIn ? (
            <>
              {/* Mobile right side */}
              <div className="flex md:hidden items-center gap-3">
                {/* Cardapio small image */}
                <Link href="/cardapio">
                  <Image
                    src="/images/cardapio.png"
                    alt="Cardápio"
                    width={90}
                    height={90}
                  />
                </Link>

                {/* Profile icon */}
                <div
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="w-9 h-9 flex items-center justify-center rounded-full cursor-pointer transition overflow-hidden border-2 border-white/30 hover:border-white/50"
                >
                  <img
                    src={user?.profile_picture || "/images/avatar.png"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Mobile Dropdown Menu */}
                {profileOpen && (
                  <div className="absolute right-0 top-12 w-56 bg-white text-gray-800 rounded-lg shadow-lg py-2 z-50">
                    <div className="px-4 py-3 border-b">
                      <p className="text-sm font-semibold text-gray-900">
                        {user?.name || user?.username || "User"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user?.email || "No email"}
                      </p>
                    </div>

                    <Link
                      href="/my-profile"
                      className="px-4 py-2.5 flex items-center gap-3 text-sm hover:bg-gray-100 transition"
                      onClick={() => setProfileOpen(false)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.8}
                        stroke="currentColor"
                        className="w-5 h-5 text-orange-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 0115 0v.75H4.5v-.75z"
                        />
                      </svg>
                      Profile
                    </Link>

                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        onLogoutOpen();
                      }}
                      className="w-full text-left px-4 py-2.5 flex items-center gap-3 text-sm hover:bg-gray-100 transition"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.8}
                        stroke="currentColor"
                        className="w-5 h-5 text-red-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                        />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}

                {/* Hamburger Menu */}
                <button
                  className="text-white focus:outline-none"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  {menuOpen ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-7 h-7"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-7 h-7"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="sm:flex md:hidden">
              <LoginModal />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden text-white flex flex-col items-center overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen
            ? "max-h-96 py-4 backdrop-blur-md backdrop-saturate-150 bg-red-600/60 border-t border-white/20 shadow-[0_4px_20px_rgba(255,255,255,0.08)] relative z-[60]"
            : "max-h-0 py-0"
        }`}
      >
        {[
          "Início",
          "Serviços",
          "Eventos",
          "Reservar",
          "Contactos",
          "Blogs",
        ].map((item, i) => (
          <Link
            key={i}
            href={
              item === "Início"
                ? "/"
                : item === "Eventos"
                ? "/events"
                : item === "Reservar"
                ? "/reserva"
                : item === "Serviços"
                ? "/reserva"
                : item === "Blogs"
                ? "/blogs"
                : "#"
            }
            className="text-lg font-medium hover:text-gray-200 transition py-2"
          >
            {item}
          </Link>
        ))}
        <div className="flex items-center gap-6 mt-2">
          <Link
            href="#"
            className="group relative flex flex-col items-center hover:text-gray-200"
          >
            <div className="flex flex-row items-center justify-center w-16 h-10 rounded-xl bg-red-700 hover:bg-red-800 transition-colors shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="w-6 h-6 mb-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 4l4 4 4-4m4 6v7.5A1.5 1.5 0 0118.5 19h-13A1.5 1.5 0 014 17.5V10A1.5 1.5 0 015.5 8.5h13A1.5 1.5 0 0120 10z"
                />
              </svg>
              <span className="text-sm font-semibold">TV</span>
            </div>
          </Link>
          <Link
            href="#"
            className="group relative flex flex-col items-center hover:text-gray-200"
          >
            <div className="flex flex-row items-center justify-center w-20 h-10 rounded-xl bg-red-700 hover:bg-red-800 transition-colors shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="w-6 h-6 mb-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 7.5l15-4.5M3 10.5v6.75A1.75 1.75 0 004.75 19h14.5A1.75 1.75 0 0021 17.25V10.5M6 14.25h.008v.008H6v-.008zm3 0h.008v.008H9v-.008zm3 0h.008v.008H12v-.008z"
                />
              </svg>
              <span className="text-sm font-semibold">Rádio</span>
            </div>
          </Link>
        </div>
      </div>
      </nav>
      <LogoutModal
        isOpen={isLogoutOpen}
        onOpenChange={onLogoutOpenChange}
        onConfirm={handleLogout}
      />
      <CartOffcanvas isOpen={isCartOpen} onClose={onCartClose} />
    </>
  );
};

export default Header;
