import React, { useEffect } from "react";
import { Button } from "@heroui/react";

const Drawer = ({ isOpen, onClose, title, children, size = "md" }) => {
    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    // Size classes
    const sizeClasses = {
        sm: "max-w-md",
        md: "max-w-xl",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
        full: "max-w-full",
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Drawer Panel */}
            <div
                className={`relative w-full ${sizeClasses[size] || sizeClasses.md} bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
                    <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                    <Button
                        isIconOnly
                        variant="light"
                        onPress={onClose}
                        className="min-w-8 w-8 h-8 rounded-full"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </Button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Drawer;
