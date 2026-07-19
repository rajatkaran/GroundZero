"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { LogOut, Loader2, User as UserIcon, Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface PortalLayoutProps {
  children: React.ReactNode;
  activeTab: string;
}

export default function PortalLayout({ children, activeTab }: PortalLayoutProps) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const isPublicPath = pathname === "/discover" || pathname.startsWith("/festival/");

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAuthorized = () => {
    if (isPublicPath) return true;
    if (!user) return false;
    if (pathname.startsWith("/dashboard/admin") && user.role !== "ADMIN") return false;
    if (pathname.startsWith("/dashboard/organizer") && user.role !== "ORGANIZER") return false;
    if (pathname.startsWith("/dashboard/vendor") && user.role !== "VENDOR") return false;
    return true;
  };

  useEffect(() => {
    if (!loading) {
      if (!user && !isPublicPath) {
        router.push("/auth?type=login");
      } else if (user) {
        // Prevent access to dashboard paths that do not match the user's role
        if (pathname.startsWith("/dashboard/admin") && user.role !== "ADMIN") {
          router.push(user.role === "ORGANIZER" ? "/dashboard/organizer" : "/dashboard/vendor");
        } else if (pathname.startsWith("/dashboard/organizer") && user.role !== "ORGANIZER") {
          router.push(user.role === "ADMIN" ? "/dashboard/admin" : "/dashboard/vendor");
        } else if (pathname.startsWith("/dashboard/vendor") && user.role !== "VENDOR") {
          router.push(user.role === "ADMIN" ? "/dashboard/admin" : "/dashboard/organizer");
        }
      }
    }
  }, [user, loading, router, pathname, isPublicPath]);

  if (loading || (!user && !isPublicPath) || !isAuthorized()) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center text-brand-primary">
        <Loader2 size={32} className="animate-spin text-brand-secondary" />
      </div>
    );
  }

  // Define menu links based on role
  const getNavLinks = () => {
    if (!user) {
      return [
        { name: "Discover", href: "/discover", emoji: "🎪" }
      ];
    }
    switch (user.role) {
      case "VENDOR":
        return [
          { name: "Overview", href: "/dashboard/vendor", emoji: "📊" },
          { name: "Discover", href: "/discover", emoji: "🎪" },
          { name: "Negotiations", href: "/dashboard/vendor/negotiations", emoji: "💬" },
          { name: "My Bookings", href: "/dashboard/vendor/bookings", emoji: "🎟️" },
        ];
      case "ORGANIZER":
        return [
          { name: "Overview", href: "/dashboard/organizer", emoji: "📊" },
          { name: "My Festivals", href: "/dashboard/organizer/festivals", emoji: "🎪" },
          { name: "Register Festival", href: "/dashboard/organizer/create", emoji: "✨" },
          { name: "Discover Network", href: "/discover", emoji: "🌐" },
        ];
      case "ADMIN":
        return [
          { name: "Control Room", href: "/dashboard/admin", emoji: "⚙️" },
          { name: "Approvals", href: "/dashboard/admin/approvals", emoji: "🛡️" },
          { name: "Negotiations Center", href: "/dashboard/admin/negotiations", emoji: "💬" },
        ];
      default:
        return [];
    }
  };

  const links = getNavLinks();

  return (
    <div className="min-h-screen bg-brand-bg text-brand-primary font-sans flex flex-col">
      {/* Editorial Dashboard Header */}
      <header className="border-b border-brand-border bg-brand-card">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="flex h-20 items-center justify-between">
            {/* Logo Group */}
            <div className="flex items-center gap-6">
              <Link href="/" className="group flex items-center gap-3">
                <div className="relative h-11 w-11 overflow-hidden rounded-xl border-2 border-brand-border bg-[#b1b3b3] dark:bg-[#4e4c4c] shadow-sm group-hover:border-brand-primary/40 group-hover:shadow-md transition-all duration-300">
                  <img
                    src="/logo.jpg"
                    alt="Ground Zero Logo"
                    className="h-full w-full object-cover transition-transform group-hover:scale-105 duration-300 dark:invert dark:hue-rotate-180 dark:brightness-110"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-[16px] font-semibold tracking-tight text-brand-primary leading-none">
                    Ground Zero
                  </span>
                  <span className="font-sans text-[8px] uppercase tracking-[0.2em] text-brand-secondary mt-1">
                    Network Portal
                  </span>
                </div>
              </Link>

              {/* Role Badge */}
              {user && (
                <span className="px-2.5 py-0.5 border border-brand-border rounded-full text-[10px] uppercase tracking-wider text-brand-secondary bg-brand-bg font-medium select-none">
                  {user.role === "VENDOR" ? "🏪 Vendor" : user.role === "ORGANIZER" ? "🎪 Host" : "⚙️ Admin"}
                </span>
              )}
            </div>

            {/* Editorial Tab Links */}
            <nav className="hidden md:flex items-center gap-8 h-full">
              {links.map((link) => {
                const isActive = pathname === link.href || activeTab === link.name.toLowerCase();
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`font-sans text-[13px] tracking-wide h-full flex items-center border-b-2 px-1 transition-all ${isActive
                        ? "border-brand-primary text-brand-primary font-medium"
                        : "border-transparent text-brand-secondary hover:text-brand-primary"
                      }`}
                  >
                    <span className="mr-1.5 text-sm">{link.emoji}</span>
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* User Details & Logout or Guest options */}
            <div className="flex items-center gap-6">
              {mounted ? (
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full border border-brand-border bg-brand-bg text-brand-secondary hover:text-brand-primary hover:border-brand-primary transition-all flex items-center justify-center focus:outline-none cursor-pointer"
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
                </button>
              ) : (
                <div className="w-8 h-8" />
              )}

              {user ? (
                <>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-brand-bg border border-brand-border flex items-center justify-center text-brand-secondary">
                      <UserIcon size={14} />
                    </div>
                    <div className="hidden sm:flex flex-col text-left">
                      <span className="text-[12px] font-medium text-brand-primary leading-none">
                        {user.profile?.companyName || user.email}
                      </span>
                      <span className="text-[10px] text-brand-secondary mt-0.5">
                        {user.email}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={logout}
                    className="p-2 text-brand-secondary hover:text-brand-primary transition-colors focus:outline-none cursor-pointer"
                    aria-label="Logout"
                  >
                    <LogOut size={16} />
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/auth?type=login" className="font-sans text-[13px] text-brand-secondary hover:text-brand-primary transition-colors font-medium">
                    Log In
                  </Link>
                  <Link href="/auth?type=signup" className="btn-liquid-glass-dark py-2.5 px-4 text-xs font-semibold">
                    Signup
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          {children}
        </div>
      </main>
    </div>
  );
}
