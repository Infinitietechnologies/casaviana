"use client";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const posts = [
  {
    category: "WORLD",
    title: "Shooting More than 40 Years of New York’s Halloween Parade",
    date: "JUNHO 8, 2025",
    image: "/images/19_8b4a5b573eb071d49c25425c4b4331de_image.jpg",
  },
  {
    category: "BUSINESS",
    title: "Why Millennials Need to Save Twice as Much as Boomers Did",
    date: "JUNHO 5, 2025",
    image: "/images/07_739d11a007244184794b683209b90f1a_image.jpg",
  },
  {
    category: "BUSINESS",
    title: "Ducati launch: Lorenzo and Dovizioso’s Desmosedici",
    date: "JUNHO 2, 2025",
    image: "/images/19_8b4a5b573eb071d49c25425c4b4331de_image.jpg",
  },
  {
    category: "SCIENCE",
    title: "Vinales will be as tough for Rossi as Lorenzo – Suzuki MotoGP boss",
    date: "MAIO 28, 2025",
    image:
      "https://i.etsystatic.com/18858649/r/il/ce92bb/5359529302/il_fullxfull.5359529302_bc6i.jpg",
  },
  {
    category: "LIFESTYLE",
    title: "5 Habits That Will Change Your Life Forever",
    date: "MAIO 25, 2025",
    image: "/images/19_8b4a5b573eb071d49c25425c4b4331de_image.jpg",
  },
  {
    category: "TECH",
    title: "AI Revolution: What It Means for the Future of Work",
    date: "MAIO 20, 2025",
    image: "/images/07_739d11a007244184794b683209b90f1a_image.jpg",
  },
  {
    category: "HEALTH",
    title: "Simple Exercises to Improve Your Posture",
    date: "MAIO 15, 2025",
    image: "/images/07_739d11a007244184794b683209b90f1a_image.jpg",
  },
  {
    category: "TRAVEL",
    title: "Top 10 Hidden Beaches Around the World",
    date: "MAIO 12, 2025",
    image: "/images/07_739d11a007244184794b683209b90f1a_image.jpg",
  },
  {
    category: "FOOD",
    title: "Why Homemade Pizza Will Always Beat Store-Bought",
    date: "MAIO 10, 2025",
    image:
      "https://i.etsystatic.com/18858649/r/il/ce92bb/5359529302/il_fullxfull.5359529302_bc6i.jpg",
  },
];

const Index = () => {
  return (
    <>
      {/* top spacing same as your other pages */}
      <div className="mx-auto py-4 md:py-0 px-2 sm:px-4 mt-20 sm:mt-24"></div>

      <div className="mx-auto px-2 sm:px-4 md:px-8 lg:px-0 min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 relative min-h-screen">
          {/* Left Sidebar */}
          <LeftSidebar />

          {/* Main Content */}
          <div className="lg:col-span-8 py-4 md:py-6 flex flex-col items-center w-full">
            <Link href="/blogs">
              <div className="w-full px-4 max-w-[1400px] mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {posts.map((post, index) => (
                    <div
                      key={index}
                      className="relative group cursor-pointer overflow-hidden rounded-md"
                    >
                      {/* Image */}
                      <Image
                        src={post.image}
                        alt={post.title}
                        width={400}
                        height={250}
                        className="w-full h-[28rem] object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      {/* Overlay color */}
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition"></div>

                      {/* Category tag */}
                      <div className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded">
                        {post.category}
                      </div>

                      {/* Title and date */}
                      <div className="absolute bottom-4 left-4 right-4 text-white z-10">
                        <h3 className="font-semibold text-lg leading-snug mb-1">
                          {post.title}
                        </h3>
                        <p className="text-sm opacity-90">{post.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Link>
          </div>

          {/* Right Sidebar */}
          <RightSidebar />
        </div>
      </div>
    </>
  );
};

export default Index;
