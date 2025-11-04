"use client";
import React, { useState } from "react";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import Image from "next/image";

const FoodMenu = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const foodItems = [
    {
      id: 1,
      name: "Jhagdisa",
      price: "100.00 kr",
      image: "/entradas/5-min.png",
      time: "5 min",
    },
    {
      id: 2,
      name: "Idosa Salgadinhos",
      price: "45.00 kr",
      image: "/entradas/5-min-1.png",
      time: "5 min",
    },
    {
      id: 3,
      name: "Pao Ao Alho",
      price: "180.00 kr",
      image: "/entradas/5-min-2.png",
      time: "5 min",
    },
    {
      id: 4,
      name: "Coxinest",
      price: "250.00 kr",
      image: "/entradas/5-min-3.png",
      time: "5 min",
    },
    {
      id: 5,
      name: "Batata Recheada",
      price: "120.00 kr",
      image: "/entradas/5-min-5.png",
      time: "5 min",
    },
    {
      id: 6,
      name: "Croquete",
      price: "85.00 kr",
      image: "/entradas/Entrada-01.png",
      time: "5 min",
    },
  ];

  return (
    <div className="mx-auto px-2 sm:px-4 md:px-8 lg:px-0 min-h-screen mt-20 sm:mt-20 mb-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 relative min-h-screen">
        <LeftSidebar />

        <div className="lg:col-span-8 py-4 md:py-6 gap-6 flex flex-col items-center bg-gradient-to-br from-orange-500 via-orange-600 to-red-600">
          <div className="w-full px-4 md:px-6 max-w-[1400px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {foodItems.map((item) => (
                <div
                  key={item.id}
                  className="relative overflow-hidden transition-all duration-500 cursor-pointer group rounded-lg"
                  onMouseEnter={() => setHoveredCard(item.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="relative">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={400}
                      height={400}
                      className={`w-full h-auto object-cover transition-transform duration-500 ${
                        hoveredCard === item.id ? "scale-100" : "scale-100"
                      }`}
                    />
                  </div>

                  <div
                    className={`absolute inset-0 flex flex-col justify-center items-center text-center text-white bg-black/50 px-2 transition-opacity duration-500 ${
                      hoveredCard === item.id ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <h3 className="font-semibold text-sm md:text-base">
                      {item.name}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-200">
                      Categoria: Entradas
                    </p>
                    <p className="text-sm font-bold mt-1">{item.price}</p>
                  </div>

                  {/* Quick View Bar */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 bg-gray-800 text-white text-center text-sm font-medium py-2 transition-transform duration-500 ${
                      hoveredCard === item.id
                        ? "translate-y-0"
                        : "translate-y-full"
                    }`}
                  >
                    Quick View 👁
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Row - Small cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {foodItems.slice(0, 4).map((item) => (
                <div
                  key={`small-${item.id}`}
                  className="rounded-lg overflow-hidden shadow-md transition-all duration-300 cursor-pointer bg-white"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={400}
                    height={400}
                    className="w-full h-auto object-cover"
                  />

                  {/* Info */}
                  <div className="p-3 text-center border-t">
                    <h3 className="font-semibold text-sm mb-1">{item.name}</h3>
                    <p className="text-red-600 font-bold text-sm">
                      {item.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <RightSidebar />
      </div>
    </div>
  );
};

export default FoodMenu;
