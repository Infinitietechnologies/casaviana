"use client";
import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import RightSidebar from "@/components/RightSidebar";
import LeftSidebar from "@/components/LeftSidebar";
import Link from "next/link";

const brands = [
  { name: "REI GALETO", img: "/dipanda-plaza/dipanda-plaza-img1.png" },
  { name: "CHIC BURGER", img: "/dipanda-plaza/dipanda-plaza-img2.png" },
  { name: "BEST GRILL", img: "/dipanda-plaza/dipanda-plaza-img3.png" },
  { name: "BWÉ DE FISH", img: "/dipanda-plaza/dipanda-plaza-img4.png" },
  { name: "PIZZA POINT", img: "/dipanda-plaza/dipanda-plaza-img5.png" },
  { name: "LEITÃO BAIRRADA", img: "/dipanda-plaza/dipanda-plaza-img6.png" },
  { name: "SANDULAS", img: "/dipanda-plaza/dipanda-plaza-img7.png" },
  { name: "SHAWARMA", img: "/dipanda-plaza/dipanda-plaza-img8.png" },
  { name: "MARISQUEIRA", img: "/dipanda-plaza/dipanda-plaza-img9.png" },
];

const Index = () => {
  return (
    <>
      {/* Top Padding for Header Offset */}
      <div className="mx-auto py-4 md:py-0 px-2 sm:px-4 mt-20 sm:mt-20"></div>

      {/* Swiper Section */}
      <div className="relative full-width mb-10">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop
          className="w-full h-[400px] md:h-[500px]"
        >
          <SwiperSlide>
            <div className="relative w-full h-[400px] md:h-[500px]">
              <Image
                src="/dipanda-plaza/dipanda-plaza-swiper1.png"
                alt="Banner 1"
                fill
                priority
                className="object-cover"
              />
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="relative w-full h-[400px] md:h-[500px]">
              <Image
                src="/dipanda-plaza/dipanda-plaza-swiper2.png"
                alt="Banner 2"
                fill
                className="object-cover"
              />
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      {/* Main Layout with Sidebars */}
      <div className="mx-auto px-2 sm:px-4 md:px-8 lg:px-0 min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 relative min-h-screen">
          <LeftSidebar />

          {/* Center Section */}
          <div className="lg:col-span-8 py-4 md:py-6 gap-6 flex flex-col items-center">
            {/* Brands Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 w-full px-4 max-w-[1400px] mx-auto">
              {brands.map((brand, index) => (
                <div key={index} className="flex flex-col items-center">
                  {/* Image */}
                  <Link href="/entradas">
                    <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center bg-white rounded-full shadow-md mb-2">
                      <Image
                        src={brand.img}
                        alt={brand.name}
                        width={240}
                        height={240}
                        className="object-contain"
                      />
                    </div>
                  </Link>
                  {/* Brand Name */}
                  <span className="w-44 sm:w-52 text-white bg-black text-[14px] font-extrabold uppercase text-center py-1 rounded">
                    {brand.name}
                  </span>
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
