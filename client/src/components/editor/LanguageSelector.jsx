"use client"
import { useState } from "react";
import { LANGUAGE_VERSIONS } from "@/constants/constants";
import { ChevronDown } from 'lucide-react';

const languages = Object.entries(LANGUAGE_VERSIONS);

const LanguageSelector = ({ language, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-2.5 sm:px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg flex items-center justify-between text-sm w-32 sm:w-36"
      >
        <span className="truncate">{language}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-40 sm:w-48 bg-neutral-800 border border-neutral-700 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto">
          {languages.map(([lang, version]) => (
            <button
              key={lang}
              className={`w-full px-3 py-1.5 text-left hover:bg-neutral-700 transition-colors text-sm ${
                lang === language 
                  ? 'text-cyan-400 bg-neutral-700' 
                  : 'text-neutral-200'
              }`}
              onClick={() => {
                onSelect(lang);
                setIsOpen(false);
              }}
            >
              <div className="flex items-center justify-between">
                <span className="truncate">{lang}</span>
                <span className="text-xs text-neutral-400 ml-2">({version})</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
