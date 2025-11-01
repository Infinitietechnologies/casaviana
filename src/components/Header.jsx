"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          <Link href="https://centraldipanda.ao/" className="hidden md:block">
            <Image
              src="/images/mabululu.png"
              alt="Mabululu"
              width={50}
              height={80}
            />
          </Link>

          <Link href="https://centraldipanda.ao/" className="hidden md:block">
            <Image
              src="/images/Centra-Dipanda.png"
              alt="Central Dipanda"
              width={50}
              height={80}
            />
          </Link>
        </div>

        {/* CENTER MENU (desktop only) */}
        <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-white">
          {["Início", "Serviços", "Eventos", "Reservar", "Contactos"].map(
            (item, i) => (
              <a
                key={i}
                href={item === "Eventos" ? "/events" : "#"}
                className="relative group transition-colors hover:text-gray-200 text-lg"
              >
                {item}
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-white transition-all group-hover:w-full"></span>
              </a>
            )
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">
          {/* Desktop right side */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="https://www.casaviana.ao/cardapio/">
              <Image
                src="/images/cardapio.png"
                alt="Cardápio"
                width={55}
                height={55}
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

            {/* Profile Icon */}
            <div className="w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full cursor-pointer transition">
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
          </div>

          {/* Mobile right side */}
          <div className="flex md:hidden items-center gap-3">
            {/* Cardapio small image */}
            <Link href="https://www.casaviana.ao/cardapio/">
              <Image
                src="/images/cardapio.png"
                alt="Cardápio"
                width={90}
                height={90}
              />
            </Link>
            {/* Profile icon */}
            <div className="w-9 h-9 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full cursor-pointer transition">
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

            {/* Hamburger Menu */}
            <button
              className="text-white focus:outline-none"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                // Close icon
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
                // Hamburger icon
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
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden text-white flex flex-col items-center overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen
            ? "max-h-96 py-4 shadow-lg backdrop-blur-md bg-red-600/70 border-t border-white/20"
            : "max-h-0 py-0"
        }`}
      >
        {["Início", "Serviços", "Eventos", "Reservar", "Contactos"].map(
          (item, i) => (
            <a
              key={i}
              href={item === "Eventos" ? "/events" : "#"}
              className="text-lg font-medium hover:text-gray-200 transition py-2"
            >
              {item}
            </a>
          )
        )}
      </div>
    </nav>
  );
};

export default Header;
