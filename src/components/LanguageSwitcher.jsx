"use client";
import React from "react";
import { useTranslation } from "react-i18next";
import { changeLanguage } from "@/utils/i18n";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@heroui/react";

const languages = [
    { code: "pt", name: "Português", flag: "🇦🇴" },
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "zh", name: "Chinese", flag: "🇨🇳" },
];

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const currentLang = languages.find((l) => l.code === i18n.language) || languages[0];

    const handleLanguageChange = (langCode) => {
        changeLanguage(langCode);
    };

    return (
        <Dropdown>
            <DropdownTrigger>
                <Button
                    variant="light"
                    className="min-w-0 px-2 gap-2 text-white hover:bg-white/10"
                    startContent={<span className="text-lg">{currentLang.flag}</span>}
                >
                    <span className="hidden sm:inline uppercase">{currentLang.code}</span>
                </Button>
            </DropdownTrigger>
            <DropdownMenu
                aria-label="Language selection"
                onAction={(key) => handleLanguageChange(key)}
                selectedKeys={new Set([currentLang.code])}
                selectionMode="single"
            >
                {languages.map((lang) => (
                    <DropdownItem key={lang.code} textValue={lang.name}>
                        <div className="flex items-center gap-2">
                            <span className="text-xl">{lang.flag}</span>
                            <span>{lang.name}</span>
                        </div>
                    </DropdownItem>
                ))}
            </DropdownMenu>
        </Dropdown>
    );
};

export default LanguageSwitcher;
