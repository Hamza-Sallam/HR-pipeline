"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe } from "lucide-react";

export type Language = "en" | "tr";

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "tr", name: "Türkçe", flag: "🇹🇷" },
] as const;

export function LanguageSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentLanguage, setCurrentLanguage] = useState<Language>("en");

  useEffect(() => {
    const lang = searchParams.get("lang") as Language;
    if (lang && ["en", "tr"].includes(lang)) {
      setCurrentLanguage(lang);
    }
  }, [searchParams]);

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language);
    
    // Update URL with new language parameter
    const params = new URLSearchParams(searchParams.toString());
    params.set("lang", language);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const selectedLanguage = languages.find(lang => lang.code === currentLanguage);

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Select value={currentLanguage} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue>
            <div className="flex items-center gap-2">
              <span>{selectedLanguage?.flag}</span>
              <span className="hidden sm:inline">{selectedLanguage?.name}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {languages.map((language) => (
            <SelectItem key={language.code} value={language.code}>
              <div className="flex items-center gap-2">
                <span>{language.flag}</span>
                <span>{language.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
} 