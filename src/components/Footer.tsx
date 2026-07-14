import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-brand-border bg-brand-bg py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Logo & Intro */}
          <div className="md:col-span-2 flex flex-col gap-6">
            <Link href="/" className="group flex items-center gap-4 w-fit">
              <div className="relative h-16 w-16 overflow-hidden rounded-2xl border-2 border-brand-border bg-[#b1b3b3] dark:bg-[#4e4c4c] shadow-sm group-hover:border-brand-primary/40 group-hover:shadow-md transition-all duration-300">
                <img
                  src="/logo.jpg"
                  alt="Ground Zero Logo"
                  className="h-full w-full object-cover transition-transform group-hover:scale-105 duration-300 dark:invert dark:hue-rotate-180 dark:brightness-110"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-[22px] font-semibold tracking-tight text-brand-primary leading-none">
                  Ground Zero
                </span>
                <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-brand-secondary mt-1">
                  by ThinkThrough
                </span>
              </div>
            </Link>
            <p className="max-w-xs font-sans text-[13px] leading-6 text-brand-secondary">
              India's premium commerce and vendor intelligence network powering the festival economy. Built for enterprise-grade intelligence.
            </p>
          </div>

          {/* Network Links */}
          <div className="flex flex-col gap-4">
            <h4 className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-primary">
              Network
            </h4>
            <div className="flex flex-col gap-3 font-sans text-[13px]">
              <Link href="/discover" className="text-brand-secondary hover:text-brand-primary transition-colors w-fit">
                Festival Directory
              </Link>
              <Link href="/#vendors" className="text-brand-secondary hover:text-brand-primary transition-colors w-fit">
                Vendor Intelligence
              </Link>
              <Link href="/#organizers" className="text-brand-secondary hover:text-brand-primary transition-colors w-fit">
                Organizer Portals
              </Link>
              <Link href="/#intelligence" className="text-brand-secondary hover:text-brand-primary transition-colors w-fit">
                Opportunity Scoring
              </Link>
            </div>
          </div>

          {/* Corporate Links */}
          <div className="flex flex-col gap-4">
            <h4 className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-primary">
              Company
            </h4>
            <div className="flex flex-col gap-3 font-sans text-[13px]">
              <Link href="/#about" className="text-brand-secondary hover:text-brand-primary transition-colors w-fit">
                About ThinkThrough
              </Link>
              <Link href="/#contact" className="text-brand-secondary hover:text-brand-primary transition-colors w-fit">
                Contact & Support
              </Link>
              <a href="#" className="text-brand-secondary hover:text-brand-primary transition-colors w-fit">
                Privacy Policy
              </a>
              <a href="#" className="text-brand-secondary hover:text-brand-primary transition-colors w-fit">
                Terms of Service
              </a>
            </div>
          </div>
        </div>

        {/* Brand Lockup Section */}
        <div className="mt-16 pt-12 border-t border-brand-border/40 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="font-serif text-[20px] font-semibold tracking-tight text-brand-primary">
              Ground Zero
            </span>
            <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-brand-secondary">
              by
            </span>
            {/* ThinkThrough Logo */}
            <div className="border-l border-brand-border/60 pl-6 ml-3 flex items-center h-32">
              <img
                src="/thinkthrough_logo.png"
                alt="ThinkThrough"
                className="h-32 w-auto object-contain dark:brightness-110"
              />
            </div>
          </div>
          
          <span className="font-serif text-xs italic text-brand-secondary max-w-sm text-center sm:text-right">
            "Connecting India's festival commerce ecosystem through data & intelligence."
          </span>
        </div>

        <div className="mt-16 md:mt-24 border-t border-brand-border pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-sans text-[11px] tracking-wide text-brand-secondary">
            &copy; {currentYear} Ground Zero by ThinkThrough. All rights reserved.
          </p>
          <div className="flex gap-6 font-sans text-[11px] tracking-wide text-brand-secondary">
            <span>Designed in India</span>
            <span>Investor Grade GTM</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
