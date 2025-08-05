"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "hi", name: "हिंदी", flag: "🇮🇳" },
  { code: "gu", name: "ગુજરાતી", flag: "🇮🇳" },
];

export function LanguageSwitcher() {
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const { t, i18n } = useTranslation("common");

  useEffect(() => {
    // Get language from localStorage or default to English
    const savedLanguage = localStorage.getItem("preferred-language") || "en";
    setCurrentLanguage(savedLanguage);
  }, []);

  const handleLanguageChange = (languageCode: string) => {
    // Save to localStorage
    localStorage.setItem("preferred-language", languageCode);
    setCurrentLanguage(languageCode);

    // Change language without page reload
    i18n.changeLanguage(languageCode);
  };

  const currentLang = languages.find((lang) => lang.code === currentLanguage);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <span className="text-lg">{currentLang?.flag}</span>
          <span className="hidden sm:inline">{currentLang?.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={currentLanguage === language.code ? "bg-accent" : ""}
          >
            <span className="mr-2 text-lg">{language.flag}</span>
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
