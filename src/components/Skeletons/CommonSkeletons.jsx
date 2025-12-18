"use client";
import React from "react";
import { Skeleton } from "@heroui/react";

export const LeftSidebarSkeleton = () => {
  return (
    <div className="lg:col-span-2 lg:sticky lg:top-24 self-start p-2 sm:p-4 space-y-6">
      {/* Ad Space Skeleton */}
      <div className="w-full overflow-hidden rounded-md border border-gray-200 shadow-sm">
        <Skeleton className="w-full aspect-[3/2]" />
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-3">Trending</h3>

      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-1">
            <div className="w-16 h-16 overflow-hidden rounded-md border border-gray-200 flex-shrink-0">
              <Skeleton className="w-full h-full" />
            </div>
            <div className="flex-1 min-w-0 space-y-2">
              <Skeleton className="w-3/4 h-4 rounded" />
              <Skeleton className="w-1/2 h-3 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Second Ad Space Skeleton */}
      <div className="w-full overflow-hidden rounded-md border border-gray-200 shadow-sm">
        <Skeleton className="w-full aspect-[3/2]" />
      </div>
    </div>
  );
};

export const RightSidebarSkeleton = () => {
  return (
    <div className="lg:col-span-2 lg:sticky lg:top-24 self-start p-4 bg-white z-20 space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-red-600 mb-4">
        Directório
      </h2>

      <div className="flex flex-col gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-md" />
        ))}
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">Trending</h3>

      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-1">
            <div className="w-16 h-16 overflow-hidden rounded-md border border-gray-200 flex-shrink-0 bg-gray-100">
              <Skeleton className="w-full h-full" />
            </div>
            <div className="flex-1 min-w-0 space-y-2">
              <Skeleton className="w-3/4 h-4 rounded" />
              <Skeleton className="w-1/2 h-3 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
