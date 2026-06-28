import React from "react";
import { Palette, Lock, Eye } from "lucide-react";

interface HeaderProps {
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  onNavigate: (section: string) => void;
}

export default function Header({ isAdmin, setIsAdmin, onNavigate }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-[#faf9f6]/90 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => onNavigate("hero")}
          className="flex items-center space-x-3 group cursor-pointer text-left"
          id="brand-logo-btn"
        >
          <div className="w-10 h-10 rounded-full bg-stone-900 flex items-center justify-center text-[#faf9f6] transition-transform duration-300 group-hover:rotate-12">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif text-xl font-semibold tracking-wider text-stone-900">
              JULIAN WATERMAN
            </h1>
            <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-stone-500">
              Contemporary Fine Art
            </p>
          </div>
        </button>

        {/* Navigation Menu */}
        <nav className="hidden md:flex items-center space-x-8">
          <button
            onClick={() => onNavigate("collections")}
            className="font-sans text-sm tracking-wide text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
            id="nav-collections"
          >
            Collections
          </button>
          <button
            onClick={() => onNavigate("catalogue")}
            className="font-sans text-sm tracking-wide text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
            id="nav-catalogue"
          >
            Catalogue
          </button>
          <button
            onClick={() => onNavigate("contact")}
            className="font-sans text-sm tracking-wide text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
            id="nav-contact"
          >
            Contact
          </button>
        </nav>

        {/* Mode Switcher */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsAdmin(!isAdmin)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full border text-xs font-medium tracking-wider uppercase transition-all duration-300 cursor-pointer ${
              isAdmin
                ? "bg-stone-900 text-[#faf9f6] border-stone-900 hover:bg-stone-800"
                : "bg-transparent text-stone-700 border-stone-300 hover:bg-stone-100 hover:border-stone-400"
            }`}
            id="mode-toggle-btn"
          >
            {isAdmin ? (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>Exit Portal</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>Artist Portal</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
