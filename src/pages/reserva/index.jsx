"use client";
import React from "react";
import Image from "next/image";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";

const categories = [
  {
    title: "Reserva de Mesa",
    img: "/Reserva/Reserva.jpg",
  },
  {
    title: "Reserva de Salas",
    img: "/Reserva/Salas.jpg",
  },
  {
    title: "Festas de Aniversários",
    img: "/Reserva/Aniversários.jpg",
  },
  {
    title: "Casamentos",
    img: "/Reserva/Casamentos.png",
  },
];

const Index = () => {
  return (
    <>
      <div className="mx-auto py-4 md:py-0 px-2 sm:px-4 mt-20 sm:mt-24"></div>

      <div className="mx-auto px-2 sm:px-4 md:px-8 lg:px-0 min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 relative min-h-screen">
          <LeftSidebar />

          <div className="lg:col-span-8 py-4 md:py-6 gap-6 flex flex-col items-center">
           

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full px-4 md:px-10">
              {categories.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="overflow-hidden rounded-xl shadow-md hover:shadow-lg transition">
                    <Image
                      src={item.img}
                      alt={item.title}
                      width={500}
                      height={400}
                      className="w-full h-64 object-cover rounded-xl"
                    />
                  </div>
                  <h3 className="mt-4 text-lg sm:text-xl font-medium text-gray-900">
                    {item.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <RightSidebar />
        </div>
      </div>
    </>
  );
};

export default Index
