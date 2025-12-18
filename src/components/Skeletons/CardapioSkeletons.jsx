"use client";
import React from "react";
import { Skeleton } from "@heroui/react";

// Skeleton for category cards in grid
const CategoryCardSkeleton = () => (
  <div className="flex flex-col items-center rounded transition">
    <div className="flex flex-col items-center w-full">
      <div className="w-full aspect-[4/3] overflow-hidden flex items-center justify-center bg-gray-200 rounded">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="mt-3 w-full space-y-2">
        <Skeleton className="w-3/4 h-4 mx-auto rounded" />
      </div>
    </div>
  </div>
);

// Skeleton for menu item cards (large)
const CardSkeleton = () => (
  <div className="relative overflow-hidden rounded-lg bg-gray-200 aspect-square">
    <Skeleton className="w-full h-full" />
    <div className="absolute inset-0 flex items-center justify-center p-4">
      <Skeleton className="w-3/4 h-8 rounded" />
    </div>
  </div>
);

// Skeleton for small menu item cards
const SmallCardSkeleton = () => (
  <div className="rounded-lg overflow-hidden shadow-md bg-white">
    <Skeleton className="w-full aspect-square" />
    <div className="p-3 text-center border-t space-y-2">
      <Skeleton className="w-3/4 h-4 mx-auto rounded" />
      <Skeleton className="w-1/2 h-4 mx-auto rounded" />
    </div>
  </div>
);

export const CardapioCategoriesSkeleton = () => {
  return (
    <div className="w-full space-y-10">
      {/* Search/Buttons Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-center w-full px-4 md:px-6 gap-3 sm:gap-0">
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
  );
};

export const CardapioItemsSkeleton = () => {
  return (
    <div className="w-full px-4 md:px-6 max-w-[1400px] mx-auto">
      {/* Main Grid Skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {Array.from({ length: 9 }).map((_, index) => (
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
  );
};
