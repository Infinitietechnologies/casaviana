"use client";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const RightSidebar = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const router = useRouter();

  const toggleSubmenu = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  const handleRedirect = () => {
    router.push("/posts");
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
    <div className="lg:col-span-2 lg:sticky lg:top-24 self-start p-4 bg-white z-20 space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-red-600 mb-4">
        Directório
      </h2>

      {/* Menu */}
      <div className="flex flex-col gap-2">
        {menuItems.map((item, i) => (
          <div
            key={i}
            className="relative group"
            onMouseEnter={() => setOpenIndex(i)}
            onMouseLeave={() => setOpenIndex(null)}
          >
            {/* MAIN BUTTON */}
            <button
              onClick={() => toggleSubmenu(i)}
              className="flex justify-between items-center bg-red-600 text-white font-semibold 
                px-3 sm:px-4 py-2 rounded-md hover:bg-red-700 transition-colors 
                text-xs sm:text-sm w-full text-left truncate"
            >
              {item.name}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-3 h-3 ml-2"
              >
                <path
                  fillRule="evenodd"
                  d="M6.646 11.854a.5.5 0 0 0 .708 0l4.146-4.147a.5.5 0 0 0-.708-.707L7 10.793 3.207 6.999a.5.5 0 1 0-.708.707l4.147 4.148z"
                />
              </svg>
            </button>

            {/* DESKTOP SUBMENU (hover + delay fix) */}
            {item.sub && openIndex === i && (
              <div
                className="hidden lg:block absolute left-[-210px] top-0 bg-[#8c181a] text-white 
                rounded-md p-2 w-52 z-50"
              >
                {item.sub.map((subItem, j) => (
                  <div
                    key={j}
                    onClick={handleRedirect}
                    className="px-3 py-2 hover:bg-red-800 rounded-md cursor-pointer text-sm whitespace-nowrap"
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
                    onClick={handleRedirect}
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

      {/* Tabs */}
      <div className="flex border-b border-gray-300">
        {["Trending", "Comments", "Latest"].map((tab) => (
          <button
            key={tab}
            className="flex-1 text-center py-2 text-sm font-semibold border-b-2 border-transparent hover:border-red-600 hover:text-red-600 transition-colors"
          >
            {tab}
          </button>
        ))}
      </div>

      {/* News items */}
      <div className="space-y-4">
        {[
          {
            title: "Restaurante",
            date: "NOVEMBRO 6, 2024",
            img: "/images/swiper3.png",
          },
          {
            title: "KIKOLÂNDIA",
            date: "NOVEMBRO 5, 2024",
            img: "/images/img_jkr.png",
          },
          {
            title: "Sala Vitória",
            date: "NOVEMBRO 6, 2024",
            img: "/images/swiper2.png",
          },
          {
            title: "Casamento Sonhos",
            date: "NOVEMBRO 18, 2024",
            img: "/images/swiper_center1.png",
          },
        ].map((news, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-1 hover:bg-gray-50 rounded-md transition-colors cursor-pointer"
            onClick={handleRedirect}
          >
            <div className="w-16 h-16 overflow-hidden rounded-md border border-gray-200 flex-shrink-0 bg-gray-100">
              <Image
                src={news.img}
                alt={news.title}
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {news.title}
              </p>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4 text-gray-400 flex-shrink-0"
                >
                  <path d="M10 2a8 8 0 1 0 8 8A8.01 8.01 0 0 0 10 2Zm.75 8.25V5.75a.75.75 0 0 0-1.5 0v5a.75.75 0 0 0 .22.53l3 3a.75.75 0 1 0 1.06-1.06Z" />
                </svg>
                {news.date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RightSidebar;
