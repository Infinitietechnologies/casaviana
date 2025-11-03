"use client";
import React, { useState } from "react";

const RightSidebar = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleSubmenu = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  const menuItems = [
    {
      name: "Aqui Acontece",
      sub: ["Casamento", "Aniversários", "Eventos Empresariais"],
    },
    {
      name: "Lá Fora",
      sub: ["Concertos", "Famosos", "Lançamentos", "Night Life"],
    },
    {
      name: "Destinos",
      sub: ["Praias", "Resorts", "Restaurantes"],
    },
    {
      name: "Em Forma",
      sub: ["Ginásios", "Saúde", "Alimentação"],
    },
    {
      name: "Clube da Cultura",
      sub: [
        "Cinemateca",
        "Teatro",
        "Karaoke",
        "Dança",
        "Cerâmica",
        "Pintura",
        "Escultura",
        "Literatura",
      ],
    },
    { name: "O Nosso SPORTING" },
  ];

  return (
    <div className="lg:col-span-2 lg:sticky lg:top-24 self-start p-4 bg-white z-10">
      <h2 className="text-xl sm:text-2xl font-bold text-red-600 mb-4">
        Directório
      </h2>

      <div className="flex flex-col gap-2">
        {menuItems.map((item, i) => (
          <div key={i} className="relative group">
            {/* MAIN BUTTON */}
            <button
              onClick={() => toggleSubmenu(i)}
              className="flex justify-between items-center bg-red-600 text-white font-semibold 
                px-3 sm:px-4 py-2 rounded-md hover:bg-red-700 transition-colors 
                text-xs sm:text-sm w-full text-left truncate"
            >
              {item.name} <span className="text-white font-bold">●</span>
            </button>

            {/* DESKTOP SUBMENU (hover) */}
            {item.sub && (
              <div
                className="hidden lg:group-hover:block absolute left-[-200px] top-0 bg-[#8c181a] text-white 
                rounded-md p-2 w-48 z-20"
              >
                {item.sub.map((subItem, j) => (
                  <div
                    key={j}
                    className="px-3 py-2 hover:bg-red-800 rounded-md cursor-pointer text-sm"
                  >
                    {subItem}
                  </div>
                ))}
              </div>
            )}

            {/* MOBILE SUBMENU (click toggle) */}
            {item.sub && openIndex === i && (
              <div className="lg:hidden bg-[#8c181a] text-white rounded-md p-2 mt-1 z-20">
                {item.sub.map((subItem, j) => (
                  <div
                    key={j}
                    className="px-3 py-2 hover:bg-red-800 rounded-md cursor-pointer text-sm"
                  >
                    {subItem}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RightSidebar;