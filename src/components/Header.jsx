"use client";
import React from "react";
import Image from "next/image";

const Header = () => {
  return (
    <nav
      className="
        fixed left-0 right-0 top-0 z-50
        transition-all duration-300
        shadow-lg backdrop-blur-md
        bg-red-600/70 hover:bg-red-600/80
        border-b border-white/10
      "
    >
      <div className="max-w-[1900px] mx-auto flex items-center justify-between h-24 px-4 md:px-6">
        {/* Left logos */}
        <div className="flex items-center gap-2">
          <Image
            src="/images/casa-viana.png"
            alt="Casa Viana"
            width={90}
            height={90}
            className="rounded-md bg-white/80 p-1 backdrop-blur-sm transition-transform"
          />
          <Image
            src="/images/mabululu.png"
            alt="Mabululu"
            width={80}
            height={80}
            className="rounded-md bg-white/80 p-1 backdrop-blur-sm transition-transform"
          />
          <Image
            src="/images/Centra-Dipanda.png"
            alt="Central Dipanda"
            width={80}
            height={80}
            className="rounded-md bg-white/80 p-1 backdrop-blur-sm transition-transform"
          />
        </div>

        {/* Center menu */}
        <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-white">
          {["Início", "Serviços", "Eventos", "Reservar", "Contactos"].map(
            (item, i) => (
              <a
                key={i}
                href="#"
                className="relative group transition-colors hover:text-gray-200"
              >
                {item}
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-white transition-all group-hover:w-full"></span>
              </a>
            )
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Image
            src="/images/cardapio.png"
            alt="Cardápio"
            width={55}
            height={55}
            className="transition-transform"
          />
          <Image
            src="/images/qualidade.png"
            alt="Qualidade"
            width={300}
            height={100}
            className="transition-opacity"
          />
          <div className="relative">
            <Image
              src="/images/online-shopping.png"
              alt="Cart"
              width={30}
              height={30}
              className="invert transition-transform"
            />
            <span className="absolute -top-1 -right-2 bg-red-800 text-white text-xs rounded-full px-1.5">
              0
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
