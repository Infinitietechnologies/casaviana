"use client";
import React from "react";
import { Skeleton } from "@heroui/react";

export const ServicesPageSkeleton = () => {
    return (
        <div className="space-y-12 mt-20">
            <section className="text-white py-8 bg-black full-width px-4 sm:px-6 lg:px-8 xl:px-20">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 gap-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <Skeleton className="w-48 h-8 rounded" />
                        <Skeleton className="w-60 h-10 rounded-md" />
                    </div>
                    <Skeleton className="w-24 h-10 rounded-md" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="w-full h-48 bg-gray-200">
                                <Skeleton className="w-full h-full" />
                            </div>
                            <div className="p-4 space-y-4">
                                <Skeleton className="w-3/4 h-6 rounded" />
                                <Skeleton className="w-full h-16 rounded-md" />
                                <div className="flex justify-between items-center pt-2">
                                    <Skeleton className="w-20 h-4 rounded" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};
