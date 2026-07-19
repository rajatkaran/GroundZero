"use client";

import React from "react";
import { MapPin, TrendingUp, Users, Clock } from "lucide-react";

// Fallback images for fests lacking valid banner links
const getFallbackImage = (id: string | number) => {
  const fallbacks = [
    "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1200",
    "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1200",
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200",
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200",
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200"
  ];
  const str = String(id);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % fallbacks.length;
  return fallbacks[index];
};

export default function GenericInfoSection({
  pastFestivals = [],
  onFestivalClick
}: {
  pastFestivals?: any[];
  onFestivalClick?: (fest: any) => void;
}) {
  return (
    <section className="py-8 md:py-17 bg-[#09080F] relative border-b border-brand-border w-full">
      {/* Subtle Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.05)_0%,rgba(139,92,246,0)_60%)] pointer-events-none" />

      <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="flex flex-col gap-4">

          {/* ROW 1: Heading + Ecosystem (compact) */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 xl:gap-6 items-center">

            {/* Left: Heading */}
            <div className="xl:col-span-4 flex flex-col gap-3">
              <h2 className="font-serif text-[36px] sm:text-[46px] leading-[1.08] tracking-tight text-[#fdfbf7] font-medium">
                Everything the<br />Event Industry Needs,<br />In One Place.
              </h2>
              <p className="font-sans text-[14px] sm:text-[15px] text-[#9a99a8] font-light leading-relaxed max-w-sm">
                Discover opportunities, build the right partnerships, and run every activation with clarity.
              </p>
            </div>

            {/* Right: Hub & Spoke Ecosystem */}
            <div className="xl:col-span-8 flex justify-center xl:justify-end">
              <div className="flex flex-col items-center w-full max-w-[560px]">
                <span className="font-sans text-[9px] tracking-[0.2em] uppercase text-purple-400 mb-3 font-semibold">Ecosystem</span>

                {/* Desktop hub-spoke */}
                <div className="hidden sm:block relative w-full" style={{ height: '250px' }}>
                  {/* SVG Lines — each card → center */}
                  <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none">
                    <line x1="18%" y1="50%" x2="38%" y2="50%" stroke="rgba(168,85,247,0.3)" strokeWidth="1" strokeDasharray="4,4" />
                    <line x1="62%" y1="42%" x2="80%" y2="18%" stroke="rgba(168,85,247,0.3)" strokeWidth="1" strokeDasharray="4,4" />
                    <line x1="62%" y1="58%" x2="80%" y2="82%" stroke="rgba(168,85,247,0.3)" strokeWidth="1" strokeDasharray="4,4" />
                  </svg>

                  {/* Glowing dots */}
                  {[
                    { left: '18%', top: '50%' }, { left: '38%', top: '50%' },
                    { left: '62%', top: '42%' }, { left: '80%', top: '18%' },
                    { left: '62%', top: '58%' }, { left: '80%', top: '82%' },
                  ].map((pos, i) => (
                    <div key={`d-${i}`} className="absolute z-30 w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.9)]" style={{ left: pos.left, top: pos.top, transform: 'translate(-50%, -50%)' }} />
                  ))}

                  {/* Center Orb */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                    <div className="relative w-[115px] h-[115px] rounded-full bg-[#0a0a0f] border-2 border-purple-500/40 shadow-[0_0_30px_rgba(168,85,247,0.2)] flex items-center justify-center">
                      <div className="absolute inset-[-3px] rounded-full border border-purple-400/30 blur-[1px]" />
                      <div className="absolute inset-1.5 rounded-full border border-purple-400/15" />
                      <span className="font-serif text-[16px] text-[#fdfbf7] text-center font-medium leading-tight">GROUND<br />ZERO</span>
                    </div>
                  </div>

                  {/* Organizers — Left */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
                    <div className="bg-[#12101a] border border-purple-500/20 rounded-xl w-[110px] h-[110px] flex flex-col items-center justify-center text-center p-2.5 hover:border-purple-500/40 transition-colors">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-purple-300 mb-2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
                      <span className="font-serif text-[12px] text-[#fdfbf7] font-medium">Organizers</span>
                      <span className="font-sans text-[8px] text-[#9a99a8] font-light leading-tight mt-0.5">Plan & manage</span>
                    </div>
                  </div>

                  {/* Brands — Top Right */}
                  <div className="absolute right-0 top-0 z-10">
                    <div className="bg-[#12101a] border border-purple-500/20 rounded-xl w-[110px] h-[110px] flex flex-col items-center justify-center text-center p-2.5 hover:border-purple-500/40 transition-colors">
                      <Users size={16} strokeWidth={1.5} className="text-purple-300 mb-2" />
                      <span className="font-serif text-[12px] text-[#fdfbf7] font-medium">Brands &<br />Sponsors</span>
                      <span className="font-sans text-[8px] text-[#9a99a8] font-light leading-tight mt-0.5">Find & activate</span>
                    </div>
                  </div>

                  {/* Vendors — Bottom Right */}
                  <div className="absolute right-0 bottom-0 z-10">
                    <div className="bg-[#12101a] border border-purple-500/20 rounded-xl w-[110px] h-[110px] flex flex-col items-center justify-center text-center p-2.5 hover:border-purple-500/40 transition-colors">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-purple-300 mb-2"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" /><path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" /><path d="M12 3v6" /></svg>
                      <span className="font-serif text-[12px] text-[#fdfbf7] font-medium">Vendors &<br />Exhibitors</span>
                      <span className="font-sans text-[8px] text-[#9a99a8] font-light leading-tight mt-0.5">Book & grow</span>
                    </div>
                  </div>
                </div>

                {/* Mobile: simplified vertical */}
                <div className="sm:hidden flex flex-col items-center gap-2">
                  <div className="bg-[#12101a] border border-purple-500/20 rounded-xl w-[100px] h-[90px] flex flex-col items-center justify-center text-center p-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-purple-300 mb-1"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
                    <span className="font-serif text-[12px] text-[#fdfbf7] font-medium">Organizers</span>
                  </div>
                  <div className="w-[1px] h-3 bg-purple-500/30" />
                  <div className="w-[90px] h-[90px] rounded-full bg-[#0a0a0f] border-2 border-purple-500/40 flex items-center justify-center">
                    <span className="font-serif text-[13px] text-[#fdfbf7] text-center font-medium leading-tight">GROUND<br />ZERO</span>
                  </div>
                  <div className="w-[1px] h-3 bg-purple-500/30" />
                  <div className="flex gap-3">
                    <div className="bg-[#12101a] border border-purple-500/20 rounded-xl w-[100px] h-[90px] flex flex-col items-center justify-center text-center p-2">
                      <Users size={14} strokeWidth={1.5} className="text-purple-300 mb-1" />
                      <span className="font-serif text-[10px] text-[#fdfbf7] font-medium">Brands</span>
                    </div>
                    <div className="bg-[#12101a] border border-purple-500/20 rounded-xl w-[100px] h-[90px] flex flex-col items-center justify-center text-center p-2">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-purple-300 mb-1"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" /><path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" /><path d="M12 3v6" /></svg>
                      <span className="font-serif text-[10px] text-[#fdfbf7] font-medium">Vendors</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ROW 2: Past Events (compact cards) */}
          <div className="flex flex-col gap-3">
            <span className="font-sans text-[9px] tracking-[0.2em] uppercase text-purple-400 font-semibold pl-1">Past Events</span>

            {pastFestivals.length === 0 ? (
              <div className="bg-[#12101a] border border-purple-500/20 rounded-2xl p-8 text-center font-sans text-xs text-[#9a99a8]">
                No past event registries published on the network yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {pastFestivals.slice(0, 3).map((fest) => (
                  <div
                    key={fest.id}
                    onClick={() => onFestivalClick && onFestivalClick(fest)}
                    className="bg-[#12101a] border border-purple-500/20 rounded-xl overflow-hidden flex flex-col group cursor-pointer hover:border-purple-500/40 transition-colors"
                  >
                    <div className="relative h-36 w-full overflow-hidden">
                      <img
                        src={fest.bannerUrl || getFallbackImage(fest.id)}
                        alt={fest.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#12101a] via-[#12101a]/30 to-transparent" />
                      <div className="absolute bottom-3 left-4 flex flex-col">
                        <span className="font-serif text-[20px] text-[#fdfbf7] font-medium leading-tight">{fest.name}</span>
                        <span className="font-sans text-[10px] text-[#9a99a8] flex items-center gap-1 mt-0.5">
                          <MapPin size={9} /> {fest.collegeName} &middot; {fest.location}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 border-t border-purple-500/10 px-4 py-3 divide-x divide-purple-500/10">
                      <div className="flex flex-col gap-0.5 pr-2">
                        <span className="font-sans text-[7px] uppercase tracking-wider text-[#9a99a8] flex items-center gap-1"><TrendingUp size={8} className="text-purple-400" /> Reach</span>
                        <span className="font-serif text-[13px] text-[#fdfbf7]">{((fest.expectedFootfall || 135000) * 2.1).toLocaleString("en-IN", { maximumFractionDigits: 0 })}+</span>
                      </div>
                      <div className="flex flex-col gap-0.5 px-3 text-center">
                        <span className="font-sans text-[7px] uppercase tracking-wider text-[#9a99a8] flex items-center justify-center gap-1"><Users size={8} className="text-purple-400" /> Footfall</span>
                        <span className="font-serif text-[13px] text-[#fdfbf7]">{(fest.expectedFootfall || 135000).toLocaleString("en-IN")}+</span>
                      </div>
                      <div className="flex flex-col gap-0.5 pl-2 text-right">
                        <span className="font-sans text-[7px] uppercase tracking-wider text-[#9a99a8] flex items-center justify-end gap-1"><Clock size={8} className="text-purple-400" /> Price</span>
                        <span className="font-sans font-medium text-[11px] text-[#fdfbf7]">₹{(fest.defaultStallPrice || 30000).toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ROW 3: Brand Strip (slim) */}
          <div className="w-full border border-purple-500/15 bg-[#12101a]/40 rounded-lg px-5 py-4 flex flex-col sm:flex-row items-center gap-4 sm:gap-10">
            <span className="font-sans text-[9px] tracking-[0.2em] uppercase text-purple-400 font-semibold whitespace-nowrap">
              Brands Who've Built With Us
            </span>
            <div className="flex flex-wrap items-center justify-center sm:justify-between w-full gap-6 sm:gap-8">
              {[
                { src: "/brand-logo/burger-club.png", alt: "Burger Club" },
                { src: "/brand-logo/dominos-logo-4168.png", alt: "Dominos" },
                { src: "/brand-logo/suzuki.png", alt: "Suzuki" },
                { src: "/brand-logo/viberse-logo.png", alt: "Viberse" },
              ].map((brand, idx) => (
                <div key={`brand-${idx}`} className="flex items-center justify-center h-12 w-28 sm:h-14 sm:w-32 hover:scale-110 transition-transform duration-300">
                  <img
                    src={brand.src}
                    alt={brand.alt}
                    className="max-h-full max-w-full object-contain brightness-150"
                    onError={(e: any) => e.target.style.display = 'none'}
                  />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
