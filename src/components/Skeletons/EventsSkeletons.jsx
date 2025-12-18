"use client";
import React from "react";
import { Skeleton } from "@heroui/react";

export const EventsPageSkeleton = () => {
  const FeaturedSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center rounded-xl overflow-hidden shadow-md">
          <div className="w-[40%] h-[120px] sm:h-[140px] bg-gray-200">
            <Skeleton className="w-full h-full" />
          </div>
          <div className="w-[60%] p-3 bg-white h-[120px] sm:h-[140px] space-y-3">
            <Skeleton className="w-3/4 h-4 rounded" />
            <Skeleton className="w-1/2 h-4 rounded" />
            <div className="flex justify-end mt-2">
              <Skeleton className="w-10 h-10 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const UpcomingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
          <Skeleton className="w-full h-48" />
          <div className="p-4 space-y-4">
            <Skeleton className="w-3/4 h-6 rounded" />
            <Skeleton className="w-1/2 h-4 rounded" />
            <div className="flex justify-between items-center pt-2">
              <Skeleton className="w-20 h-4 rounded" />
              <Skeleton className="w-12 h-12 rounded" />
            </div>
            <Skeleton className="w-full h-10 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-12">
      <section className="text-white py-8 bg-black full-width px-4 sm:px-6 lg:px-8 xl:px-20">
        <h2 className="text-xl sm:text-2xl font-bold mb-6">Destaques</h2>
        <FeaturedSkeleton />
      </section>

      <section className="py-16 bg-white px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-8xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <Skeleton className="w-48 h-8 rounded" />
              <Skeleton className="w-60 h-10 rounded-md" />
            </div>
            <Skeleton className="w-24 h-10 rounded-md" />
          </div>
          <UpcomingSkeleton />
        </div>
      </section>
    </div>
  );
};

export const EventDetailsSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 mt-20">
      <div className="relative bg-black text-white pb-6 lg:pb-12 full-width">
        <div className="py-4 lg:py-6 px-4 lg:px-12">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="text-right"></div>
            <Skeleton className="w-16 h-16 rounded-lg" />
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 px-4 lg:px-12">
          <div className="relative">
            <div className="h-[250px] sm:h-[350px] lg:h-[500px] rounded-lg overflow-hidden shadow-lg">
              <Skeleton className="w-full h-full" />
            </div>
          </div>

          <div className="text-gray-200 lg:pt-0 space-y-4">
            <Skeleton className="w-20 h-4 rounded" />
            <Skeleton className="w-3/4 h-10 rounded" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-2 lg:gap-4">
              <div className="p-3 lg:p-4 space-y-2">
                <Skeleton className="w-1/2 h-3" />
                <Skeleton className="w-3/4 h-5" />
              </div>
              <div className="p-3 lg:p-4 border-l space-y-2">
                <Skeleton className="w-1/2 h-3" />
                <Skeleton className="w-3/4 h-5" />
              </div>
              <div className="p-3 lg:p-4 border-l space-y-2">
                <Skeleton className="w-1/2 h-3" />
                <Skeleton className="w-3/4 h-5" />
              </div>
            </div>

            <div className="p-3 lg:p-4 space-y-2">
              <Skeleton className="w-1/2 h-4" />
              <Skeleton className="w-3/4 h-4" />
            </div>

            <div className="p-3 lg:p-4 space-y-4">
              <Skeleton className="w-32 h-6" />
              <Skeleton className="w-full h-20" />
            </div>

            <div className="p-3 lg:p-4 space-y-4">
              <Skeleton className="w-32 h-6" />
              <div className="space-y-2">
                <Skeleton className="w-1/2 h-5" />
                <Skeleton className="w-3/4 h-4" />
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-lg p-4 lg:p-6 pb-20">
              <Skeleton className="w-48 h-8 mb-6" />
              <div className="space-y-8">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="border-b pb-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 space-y-3">
                        <Skeleton className="w-1/2 h-6" />
                        <Skeleton className="w-1/3 h-8" />
                      </div>
                      <Skeleton className="w-16 h-6" />
                    </div>
                    <Skeleton className="w-full h-10" />
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-8 h-8 rounded" />
                        <Skeleton className="w-12 h-6 rounded" />
                        <Skeleton className="w-8 h-8 rounded" />
                      </div>
                      <div className="space-y-1">
                        <Skeleton className="w-16 h-3" />
                        <Skeleton className="w-24 h-5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-6 space-y-4">
                <div className="flex justify-between">
                  <Skeleton className="w-24 h-6" />
                  <Skeleton className="w-32 h-8" />
                </div>
                <Skeleton className="w-full h-14 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
