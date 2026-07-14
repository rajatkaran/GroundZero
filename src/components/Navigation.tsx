"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="sticky top-0 z-50 border-b border-brand-border bg-brand-bg/70 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="group flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-xl border-2 border-brand-border bg-[#b1b3b3] dark:bg-[#4e4c4c] shadow-sm group-hover:border-brand-primary/40 group-hover:shadow-md transition-all duration-300">
                <img
                  src="/logo.jpg"
                  alt="Ground Zero Logo"
                  className="h-full w-full object-cover transition-transform group-hover:scale-105 duration-300 dark:invert dark:hue-rotate-180 dark:brightness-110"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-[18px] font-semibold tracking-tight text-brand-primary leading-none">
                  Ground Zero
                </span>
                <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-brand-secondary mt-1 group-hover:text-brand-primary transition-colors">
                  by ThinkThrough
                </span>
              </div>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-10">
            <Link
              href="/discover"
              className="font-sans text-[13px] font-semibold tracking-wide text-purple-400 hover:text-brand-primary transition-colors flex items-center gap-1"
            >
              ✨ Discover
            </Link>
            <Link
              href="/#past-events"
              className="font-sans text-[13px] tracking-wide text-brand-secondary hover:text-brand-primary transition-colors"
            >
              Past Events
            </Link>
            <Link
              href="/#features"
              className="font-sans text-[13px] tracking-wide text-brand-secondary hover:text-brand-primary transition-colors"
            >
              Features
            </Link>
            <Link
              href="/#intelligence"
              className="font-sans text-[13px] tracking-wide text-brand-secondary hover:text-brand-primary transition-colors"
            >
              Intelligence
            </Link>
            <Link
              href="/#vendors"
              className="font-sans text-[13px] tracking-wide text-brand-secondary hover:text-brand-primary transition-colors"
            >
              For Vendors
            </Link>
            <Link
              href="/#organizers"
              className="font-sans text-[13px] tracking-wide text-brand-secondary hover:text-brand-primary transition-colors"
            >
              For Organizers
            </Link>
            <Link
              href="/#contact"
              className="font-sans text-[13px] tracking-wide text-brand-secondary hover:text-brand-primary transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            {mounted ? (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full border border-brand-border bg-brand-card text-brand-secondary hover:text-brand-primary hover:border-brand-primary transition-all flex items-center justify-center focus:outline-none cursor-pointer"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
              </button>
            ) : (
              <div className="w-9 h-9" />
            )}
            <Link href="/auth?type=login" className="font-sans text-[13px] tracking-wide text-brand-secondary hover:text-brand-primary transition-colors px-3 py-2">
              Log In
            </Link>
            <Link href="/auth?type=signup" className="btn-liquid-glass">
              Request Access
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-brand-primary focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-brand-border bg-brand-bg px-6 py-6 transition-all duration-300">
          <div className="flex flex-col gap-6">
            <Link
              href="/discover"
              onClick={() => setMobileMenuOpen(false)}
              className="font-sans text-[15px] font-semibold text-purple-400 hover:text-brand-primary transition-colors flex items-center gap-1.5"
            >
              ✨ Discover Network
            </Link>
            <Link
              href="/#past-events"
              onClick={() => setMobileMenuOpen(false)}
              className="font-sans text-[15px] text-brand-secondary hover:text-brand-primary transition-colors"
            >
              Past Events
            </Link>
            <Link
              href="/#features"
              onClick={() => setMobileMenuOpen(false)}
              className="font-sans text-[15px] text-brand-secondary hover:text-brand-primary transition-colors"
            >
              Features
            </Link>
            <Link
              href="/#intelligence"
              onClick={() => setMobileMenuOpen(false)}
              className="font-sans text-[15px] text-brand-secondary hover:text-brand-primary transition-colors"
            >
              Intelligence
            </Link>
            <Link
              href="/#vendors"
              onClick={() => setMobileMenuOpen(false)}
              className="font-sans text-[15px] text-brand-secondary hover:text-brand-primary transition-colors"
            >
              For Vendors
            </Link>
            <Link
              href="/#organizers"
              onClick={() => setMobileMenuOpen(false)}
              className="font-sans text-[15px] text-brand-secondary hover:text-brand-primary transition-colors"
            >
              For Organizers
            </Link>
            <Link
              href="/#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="font-sans text-[15px] text-brand-secondary hover:text-brand-primary transition-colors"
            >
              Contact
            </Link>
            
            <hr className="border-brand-border" />
            
            <div className="flex flex-col gap-4">
              {mounted && (
                <button
                  onClick={() => {
                    toggleTheme();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-between px-4 py-3 border border-brand-border rounded-xl bg-brand-card text-[15px] text-brand-secondary hover:text-brand-primary cursor-pointer"
                >
                  <span className="font-sans">Theme</span>
                  {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                </button>
              )}
              <Link
                href="/auth?type=login"
                onClick={() => setMobileMenuOpen(false)}
                className="font-sans text-[15px] text-center text-brand-secondary hover:text-brand-primary transition-colors py-2"
              >
                Log In
              </Link>
              <Link
                href="/auth?type=signup"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-liquid-glass text-center justify-center w-full"
              >
                Request Access
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
