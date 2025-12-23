"use client";
import React from "react";
import { Skeleton } from "@heroui/react";

export const SectionSwiperSkeleton = () => {
  return (
    <div className="w-full mb-10">
      {/* Title Skeleton */}
      <Skeleton className="h-10 w-3/4 mx-auto rounded-md mb-6" />

      <div className="w-full gap-4 grid grid-cols-1 md:gap-6 relative overflow-hidden">
        {/* Main Slider Skeleton */}
        <div className="w-full">
          <Skeleton className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] rounded-md" />
        </div>

        {/* Thumbnails Skeleton */}
        <div className="w-full grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 mt-2 sm:mt-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="w-full h-[50px] sm:h-[70px] md:h-[100px] rounded-md" />
          ))}
        </div>
      </div>
    </div>
  );
};

export const TopSliderSkeleton = () => {
  return (
    <div className="w-full">
      {/* Main Slider Skeleton */}
      <div className="w-full">
        <Skeleton className="w-full h-[200px] sm:h-[250px] md:h-[280px] lg:h-[260px] rounded-md" />
      </div>

      {/* Thumbnails Skeleton */}
      <div className="w-full grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 mt-2 sm:mt-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="w-full h-[50px] sm:h-[60px] md:h-[80px] rounded-md" />
        ))}
      </div>
    </div>
  );
};
