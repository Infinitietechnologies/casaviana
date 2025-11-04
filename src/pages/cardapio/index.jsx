"use client";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const categories = [
  { name: "ENTRADAS", image: "/cardapio/entradas.png" },
  { name: "SOPAS", image: "/cardapio/sopas.png" },
  { name: "SALADAS", image: "/cardapio/salads.png" },
  { name: "PETISCO", image: "/cardapio/petisco.png" },
  { name: "MARISCOS", image: "/cardapio/meriscos.png" },
  { name: "CARNES", image: "/cardapio/carnes.png" },
  { name: "PEIXES", image: "/cardapio/peixes.png" },
  { name: "TÁBULAS", image: "/cardapio/tabulas.png" },
  { name: "FASTFOOD", image: "/cardapio/fastfood.png" },
];

const Index = () => {
  const router = useRouter();

  const handleClick = (name) => {
    if (name === "ENTRADAS") {
      router.push("/entradas");
    }
  };

  return (
    <>
      <div className="mx-auto py-4 md:py-0 px-2 sm:px-4 mt-20 sm:mt-24"></div>

      <div className="mx-auto px-2 sm:px-4 md:px-8 lg:px-0 min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 relative min-h-screen">
          <LeftSidebar />

          <div className="lg:col-span-8 py-4 md:py-6 gap-6 flex flex-col items-center">
            {/* Buttons Section */}
            <div className="flex flex-col sm:flex-row justify-between items-center w-full px-4 md:px-6 mb-10 gap-3 sm:gap-0">
              <Link href="/cardapio">
                <button className="bg-red-600 text-white font-bold text-lg px-6 py-3 rounded-md shadow hover:bg-red-700 transition w-full sm:w-auto">
                  CASA VIANA
                </button>
              </Link>
              <Link href="https://centraldipanda.ao/dipanda-plaza/">
                <span className="bg-gray-400 text-white font-bold text-lg px-6 py-3 rounded-md shadow hover:bg-gray-500 transition w-full sm:w-auto">
                  DIPANDA PLAZZA
                </span>
              </Link>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-6 w-full px-4 max-w-[1400px] mx-auto">
              {categories.map((cat, index) => (
                <div
                  key={index}
                  onClick={() => handleClick(cat.name)}
                  className="flex flex-col items-center rounded transition cursor-pointer"
                >
                  <div className="flex flex-col items-center w-full">
                    <div className="w-full aspect-[4/3] overflow-hidden flex items-center justify-center">
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        width={380}
                        height={192}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="mt-3 bg-red-600 text-white font-semibold text-sm text-center w-full py-1 rounded-sm">
                      {cat.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <RightSidebar />
        </div>
      </div>
    </>
  );
};

export default Index;
