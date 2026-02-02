"use client";
import React from "react";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import { useTranslation } from "react-i18next";

const LayoutView = ({
    children,
    title,
    description,
    backgroundImage = null
}) => {
    const { t } = useTranslation();

    const displayTitle = title || t("layout.services.default_title");
    const displayDescription = description || t("layout.services.default_description");

    return (
        <div className="mt-20">
            <div className="mx-auto px-2 sm:px-4 md:px-8 lg:px-0 min-h-screen">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 relative min-h-screen">
                    <LeftSidebar />

                    <div className="lg:col-span-8 py-4 md:py-6 gap-6 flex flex-col">
                        <section
                            className={`py-8 rounded-xl px-4 sm:px-6 lg:px-8 xl:px-20 text-white shadow-lg relative overflow-hidden ${!backgroundImage ? 'bg-black' : ''}`}
                            style={backgroundImage ? {
                                backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${backgroundImage})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                height: '231px'
                            } : {}}
                        >
                            <div className="relative z-10">
                                <h1 className="text-3xl font-bold">{displayTitle}</h1>
                                <p className="text-gray-200 mt-2">{displayDescription}</p>
                            </div>
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