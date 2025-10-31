import React from "react";
import Image from "next/image";

const Header = () => {
  return (
    <header className="w-full bg-[#ff0000]">
      {" "}
      {/* full red bar */}
      <div className="max-w-[1900px] mx-auto flex items-center justify-between py-2 px-4">
        {/* Left logos */}
        <div className="flex items-center space-x-2">
          <Image
            src="/images/casa-viana.png"
            alt="Casa Viana"
            width={90}
            height={90}
            className="rounded-md bg-white p-1"
          />
          <Image
            src="/images/mabululu.png"
            alt="Mabululu"
            width={80}
            height={80}
            className="rounded-md bg-white p-1"
          />
          <Image
            src="/images/Centra-Dipanda.png"
            alt="Central Dipanda"
            width={80}
            height={80}
            className="rounded-md bg-white p-1"
          />
        </div>

        {/* Center menu */}
        <nav className="hidden md:flex items-center space-x-6 font-semibold text-white">
          <a href="#" className="hover:text-gray-200">
            Início
          </a>
          <a href="#" className="hover:text-gray-200">
            Serviços
          </a>
          <a href="#" className="hover:text-gray-200">
            Eventos
          </a>
          <a href="#" className="hover:text-gray-200">
            Reservar
          </a>
          <a href="#" className="hover:text-gray-200">
            Contactos
          </a>
        </nav>

        {/* Right side */}
        <div className="flex items-center space-x-3">
          <Image
            src="/images/cardapio.png"
            alt="Cardápio"
            width={55}
            height={55}
          />

          <Image
            src="/images/qualidade.png"
            alt="Cardápio"
            width={300}
            height={100}
          />

          <div className="relative">
            <Image
              src="/images/cart.png"
              alt="Cart"
              width={30}
              height={30}
              className="invert"
            />
            <span className="absolute -top-1 -right-2 bg-red-700 text-white text-xs rounded-full px-1.5">
              0
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
