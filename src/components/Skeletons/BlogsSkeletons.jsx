"use client";
import React from "react";
import { Skeleton } from "@heroui/react";
import LeftSidebarSkeleton from "./CommonSkeletons";
import RightSidebarSkeleton from "./CommonSkeletons";

export const BlogsPageSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-md overflow-hidden shadow">
          <Skeleton className="w-full h-64" />
          <div className="p-4 space-y-3">
            <Skeleton className="w-full h-6 rounded" />
            <Skeleton className="w-3/4 h-6 rounded" />
            <Skeleton className="w-1/4 h-3 rounded mt-4" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const BlogDetailsSkeleton = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-28">
        <div className="animate-pulse">
          {/* Featured image */}
          <div className="mb-8 rounded-lg overflow-hidden">
            <Skeleton className="w-full h-[40rem]" />
          </div>

          {/* Title */}
          <Skeleton className="h-12 rounded w-full max-w-3xl mb-4" />

          {/* Meta */}
          <Skeleton className="h-5 rounded w-96 mb-8" />

          {/* Content paragraphs */}
          <div className="space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-6 rounded w-1/3" />
                <Skeleton className="h-4 rounded w-full" />
                <Skeleton className="h-4 rounded w-11/12" />
                <Skeleton className="h-4 rounded w-10/12" />
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="mt-12 flex flex-wrap gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-24 rounded-full" />
            ))}
          </div>

          {/* Related posts skeleton */}
          <div className="mt-20">
            <Skeleton className="h-10 rounded w-64 mb-10" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-lg overflow-hidden shadow-md">
                  <Skeleton className="h-64" />
                  <div className="p-6 space-y-4">
                    <Skeleton className="h-5 rounded w-32" />
                    <Skeleton className="h-8 rounded w-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 rounded w-full" />
                      <Skeleton className="h-4 rounded w-11/12" />
                    </div>
                    <Skeleton className="h-4 rounded w-48" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
