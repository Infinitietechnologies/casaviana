"use client";
import Image from "next/image";
import React from "react";

const LeftSidebar = () => {
  return (
    <div className="lg:col-span-2 lg:sticky lg:top-24 self-start p-2 sm:p-4 space-y-6">
      {/* Top Ad image */}
      <div className="w-full overflow-hidden rounded-md border border-gray-200 shadow-sm">
        <Image
          src="/images/images_cms.png"
          alt="Advertisement"
          width={600}
          height={400}
          className="w-full h-auto object-contain"
        />
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
            className="flex items-center gap-3 p-1 hover:bg-gray-50 rounded-md transition-colors"
          >
            <div className="w-16 h-16 overflow-hidden rounded-md border border-gray-200 flex-shrink-0">
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

      {/* Bottom Ad image */}
      <div className="w-full overflow-hidden rounded-md border border-gray-200 shadow-sm">
        <Image
          src="/images/dogq.jpg"
          alt="Advertisement"
          width={600}
          height={400}
          className="w-full h-auto object-contain"
        />
      </div>
    </div>
  );
};

export default LeftSidebar;