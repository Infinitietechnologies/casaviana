"use client";
import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const brands = [
  { name: "REI GALETO", img: "/dipanda-plaza/dipanda-plaza-img1.png" },
  { name: "CHIC BURGER", img: "/dipanda-plaza/dipanda-plaza-img2.png" },
  { name: "BEST GRILL", img: "/dipanda-plaza/dipanda-plaza-img3.png" },
  { name: "BWÉ DE FISH", img: "/dipanda-plaza/dipanda-plaza-img4.png" },
  { name: "PIZZA POINT", img: "/dipanda-plaza/dipanda-plaza-img5.png" },
  { name: "LEITÃO BAIRRADA", img: "/dipanda-plaza/dipanda-plaza-img6.png" },
  { name: "SANDULAS", img: "/dipanda-plaza/dipanda-plaza-img7.png" },
  { name: "SHAWARMA ", img: "/dipanda-plaza/dipanda-plaza-img8.png" },
  { name: "MARISQUEIRA", img: "/dipanda-plaza/dipanda-plaza-img9.png" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Swiper Section */}
      <div className="relative full-width">

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
      {/* Brands Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-10">
          {brands.map((brand, index) => (
            <div key={index} className="flex flex-col items-center">
              {/* Image Container */}
              <div className="relative w-56 h-56 flex items-center justify-center bg-white rounded-full shadow-md mb-0">
                <Image
                  src={brand.img}
                  alt={brand.name}
                  width={240}
                  height={240}
                  className="object-contain"
                />
              </div>

              {/* Brand Name */}
              <span className="w-56 text-white bg-black text-[14px] font-extrabold uppercase text-center px-0 py-1 rounded">
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
