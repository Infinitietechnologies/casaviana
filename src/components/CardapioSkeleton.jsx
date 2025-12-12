"use client";
import React from "react";
import { Skeleton } from "@heroui/react";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";

const CardapioSkeleton = () => {
  // Skeleton component matching card design
  const CategoryCardSkeleton = () => (
    <div className="flex flex-col items-center rounded transition">
      <div className="flex flex-col items-center w-full">
        <div className="w-full aspect-[4/3] overflow-hidden flex items-center justify-center bg-gray-200">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="mt-3 bg-gray-200 w-full py-1 rounded-sm">
          <Skeleton className="w-3/4 h-4 mx-auto" />
        </div>
      </div>
    </div>
  );

  // Skeleton for menu item cards (large)
  const CardSkeleton = () => (
    <div className="relative overflow-hidden rounded-lg bg-gray-200">
      <Skeleton className="w-full aspect-square" />
      <div className="absolute inset-0 bg-transparent pointer-events-none">
        <div className="h-full flex items-center justify-center">
          <Skeleton className="w-3/4 h-6 rounded" />
        </div>
      </div>
    </div>
  );

  // Skeleton for small menu item cards
  const SmallCardSkeleton = () => (
    <div className="rounded-lg overflow-hidden shadow-md bg-white">
      <Skeleton className="w-full aspect-square" />
      <div className="p-3 text-center border-t">
        <Skeleton className="w-3/4 h-4 mx-auto mb-2 rounded" />
        <Skeleton className="w-1/2 h-4 mx-auto rounded" />
      </div>
    </div>
  );

  return (
    <div className="mx-auto px-2 sm:px-4 md:px-8 lg:px-0 min-h-screen mt-20 sm:mt-24 mb-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 relative min-h-screen">
        <LeftSidebar />
        <div className="lg:col-span-8 py-4 md:py-6 gap-6 flex flex-col items-center">
          {/* Buttons Section Skeleton */}
          <div className="flex flex-col sm:flex-row justify-between items-center w-full px-4 md:px-6 mb-10 gap-3 sm:gap-0">
            <Skeleton className="h-12 w-40 rounded-md" />
            <Skeleton className="h-12 w-40 rounded-md" />
          </div>

          {/* Categories Grid Skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-6 w-full px-4 max-w-[1400px] mx-auto">
            {Array.from({ length: 6 }).map((_, index) => (
              <CategoryCardSkeleton key={index} />
            ))}
          </div>
        </div>
        <RightSidebar />
      </div>
    </div>
  );
};

// Export skeleton components for menu items page
export const MenuItemsSkeleton = () => {
  const CardSkeleton = () => (
    <div className="relative overflow-hidden rounded-lg bg-gray-200">
      <Skeleton className="w-full aspect-square" />
      <div className="absolute inset-0 bg-transparent pointer-events-none">
        <div className="h-full flex items-center justify-center">
          <Skeleton className="w-3/4 h-6 rounded" />
        </div>
      </div>
    </div>
  );

  const SmallCardSkeleton = () => (
    <div className="rounded-lg overflow-hidden shadow-md bg-white">
      <Skeleton className="w-full aspect-square" />
      <div className="p-3 text-center border-t">
        <Skeleton className="w-3/4 h-4 mx-auto mb-2 rounded" />
        <Skeleton className="w-1/2 h-4 mx-auto rounded" />
      </div>
    </div>
  );

  return (
    <div className="mx-auto px-2 sm:px-4 md:px-8 lg:px-0 min-h-screen mt-20 sm:mt-20 mb-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 relative min-h-screen">
        <LeftSidebar />
        <div className="lg:col-span-8 py-4 md:py-6 gap-6 flex flex-col items-center bg-gradient-to-br from-orange-500 via-orange-600 to-red-600">
          <div className="w-full px-4 md:px-6 max-w-[1400px] mx-auto">
            {/* Main Grid Skeletons */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {Array.from({ length: 6 }).map((_, index) => (
                <CardSkeleton key={index} />
              ))}
            </div>
            {/* Bottom Row Skeletons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {Array.from({ length: 4 }).map((_, index) => (
                <SmallCardSkeleton key={index} />
              ))}
            </div>
          </div>
        </div>
        <RightSidebar />
      </div>
    </div>
  );
};

export default CardapioSkeleton;


