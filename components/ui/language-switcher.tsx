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
  { code: "en", name: "English", letter: "EN" },
  { code: "hi", name: "हिंदी", letter: "हि" },
  { code: "gu", name: "ગુજરાતી", letter: "ગુ" },
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

    // Force a reflow to prevent layout shifts
    document.body.offsetHeight;
  };

  const currentLang = languages.find((lang) => lang.code === currentLanguage);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center justify-start"
        >
          <span className="text-lg font-semibold">{currentLang?.letter}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={currentLanguage === language.code ? "bg-accent" : ""}
          >
            <span className="mr-2 text-lg font-semibold">
              {language.letter}
            </span>
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
