"use client";
import React from "react";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";

const LayoutView = ({
    children,
    title = "Nossos Serviços",
    description = "Explore a variedade de serviços que oferecemos."
}) => {
    return (
        <div className="mt-20">
            <div className="mx-auto px-2 sm:px-4 md:px-8 lg:px-0 min-h-screen">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 relative min-h-screen">
                    <LeftSidebar />

                    <div className="lg:col-span-8 py-4 md:py-6 gap-6 flex flex-col">
                        <section className="py-8 bg-black rounded-xl px-4 sm:px-6 lg:px-8 xl:px-20 text-white shadow-lg">
                            <h1 className="text-3xl font-bold">{title}</h1>
                            <p className="text-gray-300 mt-2">{description}</p>
                        </section>

                        {children}
                    </div>

                    <RightSidebar />
                </div>
            </div>
        </div>
    );
};

export default LayoutView;