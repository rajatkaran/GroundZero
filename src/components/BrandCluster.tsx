"use client";

import Link from "next/link";

const brands = [
  { name: "Wow Momo", color: "text-red-500", font: "font-serif", src: null },
  { name: "Bira 91", color: "text-blue-500", font: "font-sans font-black tracking-tighter", src: null },
  { name: "Chaayos", color: "text-orange-500", font: "font-serif font-bold italic", src: null },
  { name: "Red Bull", color: "text-red-600", font: "font-sans font-black uppercase tracking-widest", src: "/logos/brands/redbull.svg" },
  { name: "Zomato", color: "text-red-500", font: "font-serif font-bold tracking-tight lowercase", src: "/logos/brands/zomato.svg" },
  { name: "Swiggy", color: "text-orange-600", font: "font-sans font-bold tracking-tighter", src: "/logos/brands/swiggy.svg" },
  { name: "boAt", color: "text-zinc-100", font: "font-sans font-black lowercase tracking-tighter", src: null },
  { name: "Blinkit", color: "text-yellow-500", font: "font-sans font-bold lowercase tracking-tight", src: null },
  { name: "Zepto", color: "text-purple-500", font: "font-serif font-black italic tracking-tighter lowercase", src: null },
  { name: "Myntra", color: "text-pink-500", font: "font-sans font-bold tracking-wider", src: "/logos/brands/myntra.png" },
  { name: "The Burger Club", color: "text-purple-500", font: "font-sans font-black tracking-tight uppercase", src: "/brands-1.png" },
  { name: "Domino's", color: "text-blue-500", font: "font-sans font-bold tracking-tight", src: "/brands-2.png" },
  { name: "Suzuki", color: "text-red-600", font: "font-sans font-bold uppercase", src: "/brands-3.png" },
  { name: "California Burrito", color: "text-red-500", font: "font-sans font-black tracking-tighter uppercase", src: "/brands-4.jpg" },
  { name: "Viberse", color: "text-purple-600", font: "font-sans font-medium tracking-wide lowercase", src: "/brands-5.png" },
];

export default function BrandCluster() {
  return (
    <section id="organizer-brand-cluster" className="py-24 md:py-36 border-b border-brand-border bg-brand-bg">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-16 text-center flex flex-col items-center gap-3">
          <span className="gz-eyebrow">Brand Network</span>
          <h3 className="font-serif text-[28px] sm:text-[36px] tracking-tight text-brand-primary font-medium">
            Backed by Brands You Know
          </h3>
          <p className="font-sans text-[14px] text-brand-secondary max-w-lg font-light leading-relaxed">
            Verified brands actively looking to sponsor college fests through Ground Zero.
          </p>
        </div>

        {/* Brand Logo Grid */}
        <div className="bg-brand-card border border-brand-border rounded-[28px] p-10 sm:p-14 mb-16 shadow-sm">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-8 gap-y-12 items-center justify-items-center">
            {brands.map((brand, idx) => (
              <div 
                key={idx}
                className={`group cursor-pointer grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 ease-in-out flex items-center justify-center`}
              >
                {brand.src ? (
                  <img src={brand.src} alt={`${brand.name} logo`} className="h-8 md:h-10 w-auto object-contain select-none" />
                ) : (
                  <span className={`text-xl sm:text-2xl ${brand.font} ${brand.color} drop-shadow-sm group-hover:drop-shadow-md select-none`}>
                    {brand.name}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Credibility Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-brand-card/50 border border-brand-border rounded-2xl p-8 flex flex-col items-center text-center justify-center">
            <h4 className="font-serif text-[32px] sm:text-[40px] font-medium text-brand-primary mb-1">
              120+
            </h4>
            <span className="font-sans text-[11px] font-bold tracking-wider uppercase text-brand-secondary/70">
              Brands Onboarded
            </span>
          </div>
          
          <div className="bg-brand-card/50 border border-brand-border rounded-2xl p-8 flex flex-col items-center text-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/10 to-transparent opacity-50" />
            <h4 className="font-serif text-[32px] sm:text-[40px] font-medium text-purple-400 mb-1 relative z-10">
              ₹2.4Cr+
            </h4>
            <span className="font-sans text-[11px] font-bold tracking-wider uppercase text-brand-secondary/70 relative z-10">
              Sponsorship Facilitated
            </span>
          </div>

          <div className="bg-brand-card/50 border border-brand-border rounded-2xl p-8 flex flex-col items-center text-center justify-center">
            <h4 className="font-serif text-[32px] sm:text-[40px] font-medium text-brand-primary mb-1">
              85%
            </h4>
            <span className="font-sans text-[11px] font-bold tracking-wider uppercase text-brand-secondary/70">
              Repeat Sponsors
            </span>
          </div>
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <Link
            href="/auth?type=signup"
            className="btn-liquid-glass-dark text-center py-4 px-8 text-[13px] flex justify-center items-center gap-2"
          >
            Get Matched with Sponsors &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
