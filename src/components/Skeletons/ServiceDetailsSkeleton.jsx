"use client";
import React from "react";
import { Skeleton } from "@heroui/react";

export const ServiceDetailsSkeleton = () => {
    return (
        <div className="min-h-screen bg-gray-50 mt-20">
            <div className="relative bg-black text-white pb-6 lg:pb-12 full-width">
                <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 px-4 lg:px-12 pt-8">
                    <div className="relative">
                        <div className="h-[250px] sm:h-[350px] lg:h-[500px] rounded-lg overflow-hidden shadow-lg bg-gray-800">
                            <Skeleton className="w-full h-full" />
                        </div>
                    </div>

                    <div className="text-gray-200 lg:pt-0 space-y-4">
                        <Skeleton className="w-32 h-6 rounded" />
                        <Skeleton className="w-3/4 h-10 rounded" />
                        <Skeleton className="w-full h-24 rounded" />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white shadow rounded-lg">
                                <Skeleton className="w-20 h-4 mb-2" />
                                <Skeleton className="w-32 h-6" />
                            </div>
                            <div className="p-4 bg-white shadow rounded-lg">
                                <Skeleton className="w-20 h-4 mb-2" />
                                <Skeleton className="w-32 h-6" />
                            </div>
                        </div>

                        <div className="p-6 bg-white shadow rounded-lg space-y-4">
                            <Skeleton className="w-48 h-8" />
                            <Skeleton className="w-full h-32" />
                        </div>
                    </div>

                    <div>
                        <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
                            <Skeleton className="w-48 h-8 mb-6" />
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <Skeleton className="w-24 h-6" />
                                    <Skeleton className="w-32 h-8" />
                                </div>
                                <Skeleton className="w-full h-12 rounded-lg" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
