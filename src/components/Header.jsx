"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import LoginModal from "./Modals/LoginModal";
import { useDispatch, useSelector } from "react-redux";
import { logout as logoutAction } from "@/store/authSlice";
import { logout } from "@/Api/api";
import { addToast } from "@heroui/react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

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

  const handleLogout = async () => {
    try {
      await logout();
      dispatch(logoutAction());
      setProfileOpen(false);
      addToast({
        title: "Logged out successfully",
        color: "danger",
      });
    } catch (err) {
      // console.log("Logout failed:", err);
    }
  };
  return (
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
            <div className="relative">
              <Image
                src="/images/online-shopping.png"
                alt="Cart"
                width={30}
                height={30}
                className="invert"
              />
              <span className="absolute -top-1 -right-2 bg-red-800 text-white text-xs rounded-full px-1.5">
                0
              </span>
            </div>
            {isLoggedIn ? (
              <>
                {/* Profile Icon */}
                <div
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full cursor-pointer transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.8}
                    stroke="currentColor"
                    className="w-5 h-5 text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 
          19.5a8.25 8.25 0 0115 0v.75a.75.75 
          0 01-.75.75H5.25a.75.75 
          0 01-.75-.75v-.75z"
                    />
                  </svg>
                </div>

                {/* Dropdown Menu */}
                {profileOpen && (
                  <div className="absolute right-0 top-14 w-48 bg-white text-gray-800 rounded-lg shadow-lg py-2 z-50">
                    <div className="px-4 py-2 flex items-center gap-2 text-sm font-medium border-b">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.6}
                        stroke="currentColor"
                        className="w-4 h-4 text-orange-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.25 6.75V3.75a.75.75 0 00-.75-.75h-9a.75.75 0 00-.75.75v3a.75.75 0 01-.75.75H4.5a.75.75 0 00-.75.75v11.25A2.25 2.25 0 006 21h12a2.25 2.25 0 002.25-2.25V8.25a.75.75 0 00-.75-.75h-1.5a.75.75 0 01-.75-.75z"
                        />
                      </svg>
                      30,00 AOA
                    </div>

                    <Link
                      href="/my-profile"
                      className="px-4 py-2 flex items-center gap-2 text-sm hover:bg-gray-100"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.8}
                        stroke="currentColor"
                        className="w-4 h-4 text-orange-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 
              19.5a8.25 8.25 0 0115 0v.75a.75.75 
              0 01-.75.75H5.25a.75.75 
              0 01-.75-.75v-.75z"
                        />
                      </svg>
                      Perfil
                    </Link>

                    <Link
                      href="/"
                      className="px-4 py-2 flex items-center gap-2 text-sm hover:bg-gray-100"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.8}
                        stroke="currentColor"
                        className="w-4 h-4 text-orange-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.5 8.25V3.75m0 0h-9v4.5m9-4.5l3.75 3.75M7.5 12h9m-9 4.5h9M6 21h12a2.25 2.25 0 002.25-2.25V8.25a.75.75 0 00-.75-.75H4.5a.75.75 0 00-.75.75v10.5A2.25 2.25 0 006 21z"
                        />
                      </svg>
                      Pedidos
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 flex items-center gap-2 text-sm hover:bg-gray-100"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.8}
                        stroke="currentColor"
                        className="w-4 h-4 text-orange-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 9V5.25a.75.75 0 00-.75-.75h-6a.75.75 0 00-.75.75V9m6 6v3.75a.75.75 0 01-.75.75h-6a.75.75 0 01-.75-.75V15m9-3H3.75m0 0l3-3m-3 3l3 3"
                        />
                      </svg>
                      Sair
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
                  className="w-9 h-9 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full cursor-pointer transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.8}
                    stroke="currentColor"
                    className="w-5 h-5 text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 
                  19.5a8.25 8.25 0 0115 0v.75a.75.75 
                  0 01-.75.75H5.25a.75.75 
                  0 01-.75-.75v-.75z"
                    />
                  </svg>
                </div>

                {/* Mobile Dropdown Menu */}
                {profileOpen && (
                  <div className="absolute right-0 top-12 w-48 bg-white text-gray-800 rounded-lg shadow-lg py-2 z-50">
                    <div className="px-4 py-2 flex items-center gap-2 text-sm font-medium border-b">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.6}
                        stroke="currentColor"
                        className="w-4 h-4 text-orange-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.25 6.75V3.75a.75.75 0 00-.75-.75h-9a.75.75 0 00-.75.75v3a.75.75 0 01-.75.75H4.5a.75.75 0 00-.75.75v11.25A2.25 2.25 0 006 21h12a2.25 2.25 0 002.25-2.25V8.25a.75.75 0 00-.75-.75h-1.5a.75.75 0 01-.75-.75z"
                        />
                      </svg>
                      30,00 AOA
                    </div>

                    <Link
                      href="/my-profile"
                      className="px-4 py-2 flex items-center gap-2 text-sm hover:bg-gray-100"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.8}
                        stroke="currentColor"
                        className="w-4 h-4 text-orange-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 
                      19.5a8.25 8.25 0 0115 0v.75a.75.75 
                      0 01-.75.75H5.25a.75.75 
                      0 01-.75-.75v-.75z"
                        />
                      </svg>
                      Perfil
                    </Link>

                    <Link
                      href=""
                      className="px-4 py-2 flex items-center gap-2 text-sm hover:bg-gray-100"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.8}
                        stroke="currentColor"
                        className="w-4 h-4 text-orange-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.5 8.25V3.75m0 0h-9v4.5m9-4.5l3.75 3.75M7.5 12h9m-9 4.5h9M6 21h12a2.25 2.25 0 002.25-2.25V8.25a.75.75 0 00-.75-.75H4.5a.75.75 0 00-.75.75v10.5A2.25 2.25 0 006 21z"
                        />
                      </svg>
                      Pedidos
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 flex items-center gap-2 text-sm hover:bg-gray-100"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.8}
                        stroke="currentColor"
                        className="w-4 h-4 text-orange-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 9V5.25a.75.75 0 00-.75-.75h-6a.75.75 0 00-.75.75V9m6 6v3.75a.75.75 0 01-.75.75h-6a.75.75 0 01-.75-.75V15m9-3H3.75m0 0l3-3m-3 3l3 3"
                        />
                      </svg>
                      Sair
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
        {["Início", "Serviços", "Eventos", "Reservar", "Contactos"].map(
          (item, i) => (
            <Link
              key={i}
              href={
                item === "Início"
                  ? "/"
                  : item === "Eventos"
                  ? "/events"
                  : item === "Reservar"
                  ? "/reserva"
                  : "#"
              }
              className="text-lg font-medium hover:text-gray-200 transition py-2"
            >
              {item}
            </Link>
          )
        )}
        <div className="flex items-center gap-6 mt-2">
          <Link href="" className="flex items-center gap-1 hover:text-gray-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 4l4 4 4-4m4 6v7.5A1.5 1.5 0 0118.5 19h-13A1.5 1.5 0 014 17.5V10A1.5 1.5 0 015.5 8.5h13A1.5 1.5 0 0120 10z"
              />
            </svg>
            <span className="text-lg">TV</span>
          </Link>

          <Link href="" className="flex items-center gap-1 hover:text-gray-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 7.5l15-4.5M3 10.5v6.75A1.75 1.75 0 004.75 19h14.5A1.75 1.75 0 0021 17.25V10.5M6 14.25h.008v.008H6v-.008zm3 0h.008v.008H9v-.008zm3 0h.008v.008H12v-.008z"
              />
            </svg>
            <span className="text-lg">Rádio</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Header;
