"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, MapPin, Users, Calendar, Award, Star, BarChart3, ShieldCheck, HelpCircle } from "lucide-react";
import PortalLayout from "@/components/PortalLayout";
import StallMap from "@/components/StallMap";
import { useAuth } from "@/context/AuthContext";

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

export default function FestivalDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const router = useRouter();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStall, setSelectedStall] = useState<any>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  const fetchFestivalDetails = async () => {
    try {
      const response = await fetch(`/api/festivals/${id}`);
      if (!response.ok) {
        throw new Error("Failed to load festival asset details.");
      }
      const res = await response.json();
      setData(res);
      
      // Auto-select first available stall as initial preview if present
      if (res.festival?.stalls?.length > 0) {
        const available = res.festival.stalls.find((s: any) => s.status === "AVAILABLE");
        setSelectedStall(available || res.festival.stalls[0]);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFestivalDetails();
  }, [id]);

  const handleBookingAction = async (stallId: string, action: "book" | "negotiate") => {
    if (!user) {
      router.push("/auth?type=login");
      return;
    }

    if (user.role !== "VENDOR") {
      alert("Only brands or vendors can book or negotiate stalls/booths. Host and admin profiles are restricted.");
      return;
    }

    setBookingLoading(true);
    try {
      const response = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          festivalId: id,
          vendorId: user.id,
          stallId,
          action // "book" (locks publicPrice) or "negotiate" (initiates counter-offer)
        }),
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.message || "Failed to process booking request.");
      }

      // Redirect directly to the negotiation hub for this booking
      router.push(`/dashboard/negotiations?bookingId=${res.booking.id}`);
    } catch (err: any) {
      alert(err.message || "Something went wrong processing your booking.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <PortalLayout activeTab="discover">
        <div className="flex h-96 items-center justify-center">
          <Loader2 size={32} className="animate-spin text-brand-secondary" />
        </div>
      </PortalLayout>
    );
  }

  if (error || !data) {
    return (
      <PortalLayout activeTab="discover">
        <div className="p-8 border border-brand-border bg-brand-card text-center rounded-2xl text-brand-secondary text-sm">
          {error || "Festival property not found."}
        </div>
      </PortalLayout>
    );
  }

  const { festival, metrics } = data;
  const startDateStr = new Date(festival.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  const endDateStr = new Date(festival.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return (
    <PortalLayout activeTab="discover">
      <div className="flex flex-col gap-12">
        {/* Back Link */}
        <div>
          <Link href="/discover" className="group flex items-center gap-2 text-[12px] text-brand-secondary hover:text-brand-primary transition-colors uppercase tracking-wider">
            <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Directory
          </Link>
        </div>

        {/* Spotlight Hero Banner */}
        <div className="relative w-full h-[320px] sm:h-[400px] rounded-[32px] overflow-hidden border border-brand-border shadow-md bg-black">
          <img 
            src={(festival.bannerUrl && (festival.bannerUrl.startsWith("http") || festival.bannerUrl.startsWith("/") || festival.bannerUrl.startsWith("data:"))) ? festival.bannerUrl : getFallbackImage(festival.id)} 
            alt={festival.name} 
            className="w-full h-full object-cover opacity-75 object-center"
            onError={(e: any) => {
              e.target.onerror = null;
              e.target.src = getFallbackImage(festival.id);
            }}
          />
          {/* Subtle gradient overlay to keep text highly legible */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/20" />
          
          {/* Content overlay */}
          <div className="absolute inset-0 p-8 sm:p-12 flex flex-col justify-end gap-4">
            <div className="flex flex-col gap-2 max-w-2xl">
              <span className="text-[11px] font-sans font-bold uppercase tracking-[0.25em] text-[var(--gz-accent-gold-text)]">
                SPOTLIGHT LISTING
              </span>
              <h1 className="font-serif text-[36px] sm:text-[48px] md:text-[56px] leading-[1.1] font-semibold text-white tracking-tight">
                {festival.name}
              </h1>
              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-[13px] font-sans text-white/95">
                <span className="flex items-center gap-1.5"><MapPin size={14} className="text-[var(--gz-accent-gold-text)]" /> {festival.collegeName} &middot; {festival.location}</span>
                <span className="flex items-center gap-1.5"><Calendar size={14} className="text-[var(--gz-accent-gold-text)]" /> {startDateStr} – {endDateStr}</span>
              </div>
            </div>
          </div>

          {/* Glassmorphic Metrics Container overlay (hidden on mobile) */}
          <div className="absolute top-6 right-6 hidden md:flex gap-6 bg-black/40 backdrop-blur-md border border-white/10 rounded-[20px] p-5 shadow-lg text-white">
            <div className="flex flex-col gap-0.5">
              <span className="font-serif text-[26px] font-semibold text-[var(--gz-accent-gold-text)] text-right">{festival.opportunityScore}/100</span>
              <span className="font-sans text-[9px] uppercase tracking-wider text-white/70 text-right">OPPORTUNITY SCORE</span>
            </div>
            <div className="w-[1px] bg-white/20 self-stretch" />
            <div className="flex flex-col gap-0.5">
              <span className="font-serif text-[26px] font-semibold text-white text-right">
                {metrics.availableStalls} / {metrics.totalStalls}
              </span>
              <span className="font-sans text-[9px] uppercase tracking-wider text-white/70 text-right">BOOTHS/STALLS AVAILABLE</span>
            </div>
          </div>
        </div>

        {/* Small screen mobile metrics fallback */}
        <div className="grid grid-cols-2 gap-6 bg-brand-card border border-brand-border rounded-[20px] p-5 shadow-sm md:hidden">
          <div className="flex flex-col gap-0.5">
            <span className="font-serif text-[22px] font-semibold text-brand-primary">{festival.opportunityScore}/100</span>
            <span className="font-sans text-[9px] uppercase tracking-wider text-brand-secondary">OPPORTUNITY SCORE</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-serif text-[22px] font-semibold text-brand-primary">
              {metrics.availableStalls} / {metrics.totalStalls}
            </span>
            <span className="font-sans text-[9px] uppercase tracking-wider text-brand-secondary">BOOTHS/STALLS AVAILABLE</span>
          </div>
        </div>

        {/* Dynamic Splitscreen: Details vs Stall Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Block: Investment Prospectus Details */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="bg-brand-card border border-brand-border rounded-[24px] p-8 shadow-sm flex flex-col gap-8">
              <div className="flex justify-between items-center border-b border-brand-border pb-3">
                <h2 className="font-serif text-[20px] font-medium text-brand-primary">
                  Prospectus Details
                </h2>
                <span className="px-2.5 py-0.5 border border-brand-border rounded-full text-[9px] uppercase tracking-wider text-brand-secondary bg-brand-bg font-medium">
                  {festival.type || "FESTIVAL"}
                </span>
              </div>
              
              {/* Footfall */}
              <div className="flex gap-4 items-start">
                <div className="p-2 border border-brand-border rounded-lg bg-brand-bg">
                  <Users size={16} />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-sans text-[10px] uppercase tracking-wider text-brand-secondary">EXPECTED ATTENDANCE</span>
                  <span className="font-serif text-[18px] font-medium">{festival.expectedFootfall.toLocaleString("en-IN")}</span>
                  <p className="font-sans text-[11px] text-brand-secondary leading-5 mt-1">{festival.demographics}</p>
                </div>
              </div>

              {/* Headliners */}
              <div className="flex gap-4 items-start border-t border-brand-border pt-6">
                <div className="p-2 border border-brand-border rounded-lg bg-brand-bg">
                  <Award size={16} />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-sans text-[10px] uppercase tracking-wider text-brand-secondary">ARTIST LINEUP</span>
                  <p className="font-sans text-[13px] leading-6 text-brand-primary font-medium mt-1">
                    {festival.artistLineup || "To be announced"}
                  </p>
                </div>
              </div>

              {/* Instagram URL if present */}
              {festival.instagramUrl && (
                <div className="flex gap-4 items-start border-t border-brand-border pt-6">
                  <div className="p-2 border border-brand-border rounded-lg bg-brand-bg">
                    <span className="text-sm">📸</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-sans text-[10px] uppercase tracking-wider text-brand-secondary">SOCIAL HANDLE</span>
                    <a 
                      href={festival.instagramUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="font-sans text-[13px] text-brand-primary font-medium underline mt-1 break-all hover:opacity-85"
                    >
                      {festival.instagramUrl.replace("https://instagram.com/", "@").replace("https://www.instagram.com/", "@")}
                    </a>
                  </div>
                </div>
              )}

              {/* Schedule Timeline if present */}
              {festival.timeline && (
                <div className="flex gap-4 items-start border-t border-brand-border pt-6">
                  <div className="p-2 border border-brand-border rounded-lg bg-brand-bg">
                    <span className="text-sm">⏳</span>
                  </div>
                  <div className="flex flex-col gap-1 w-full">
                    <span className="font-sans text-[10px] uppercase tracking-wider text-brand-secondary">SCHEDULE / TIMELINE</span>
                    <div className="flex flex-col gap-1.5 mt-2 font-sans text-xs text-brand-primary">
                      {festival.timeline.split("\n").map((line: string, i: number) => (
                        <div key={i} className="flex gap-2 items-start bg-brand-bg p-2 rounded-lg border border-brand-border/40">
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-brand-border text-brand-secondary font-medium">#{i + 1}</span>
                          <span className="leading-tight">{line}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Host and Security */}
              <div className="flex gap-4 items-start border-t border-brand-border pt-6">
                <div className="p-2 border border-brand-border rounded-lg bg-brand-bg">
                  <ShieldCheck size={16} />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-sans text-[10px] uppercase tracking-wider text-brand-secondary">COMPLIANCE & LEGAL</span>
                  <span className="font-sans text-[13px] font-semibold text-brand-primary mt-1">Ground Zero Verified</span>
                  <p className="font-sans text-[11px] text-brand-secondary leading-5 mt-0.5">
                    Contracts generated automatically under standard GZ commercial license templates.
                  </p>
                </div>
              </div>

              {/* Sponsorship card banner */}
              <div className="mt-2 p-4 rounded-xl border border-dashed border-brand-border bg-brand-bg/50 text-center flex flex-col gap-1.5">
                <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-brand-secondary">Sponsorship & Marketing</span>
                <p className="text-[12px] text-brand-primary leading-normal">
                  For Sponsorship / Marketing / Offline Promotion, contact: <a href="mailto:marketing@thinkthrough.in" className="underline text-brand-primary hover:text-brand-primary/80">marketing@thinkthrough.in</a>
                </p>
              </div>
            </div>

            {/* Pitch Decks Section */}
            {(() => {
              try {
                if (festival.decks) {
                  const allDecks = JSON.parse(festival.decks);
                  const approvedDecks = allDecks.filter((d: any) => d.status === "APPROVED");
                  if (approvedDecks.length > 0) {
                    return (
                      <div className="bg-brand-card border border-brand-border rounded-[24px] p-8 shadow-sm flex flex-col gap-4">
                        <h2 className="font-serif text-[20px] font-medium text-brand-primary border-b border-brand-border pb-3">
                          Sponsorship Decks
                        </h2>
                        <div className="flex flex-col gap-3">
                          {approvedDecks.map((deck: any) => (
                            <a
                              key={deck.id}
                              href={deck.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-3 rounded-xl border border-brand-border bg-brand-bg hover:bg-brand-border/20 transition-all text-xs font-medium text-brand-primary group"
                            >
                              <div className="flex items-center gap-2.5">
                                <span className="text-base group-hover:scale-110 transition-transform">📄</span>
                                <span className="hover:underline">{deck.name}</span>
                              </div>
                              <span className="text-[10px] text-brand-secondary bg-brand-border/40 px-2.5 py-0.5 rounded font-sans uppercase tracking-wider">Download</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    );
                  }
                }
              } catch (e) {
                console.error("Error parsing festival decks", e);
              }
              return null;
            })()}

            {/* Gallery Section */}
            {festival.galleryUrls && (
              <div className="bg-brand-card border border-brand-border rounded-[24px] p-8 shadow-sm flex flex-col gap-4">
                <h2 className="font-serif text-[20px] font-medium text-brand-primary border-b border-brand-border pb-3">
                  Gallery & Past Events
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {festival.galleryUrls.split(",").map((url: string, index: number) => (
                    <div key={index} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-brand-border bg-brand-bg group">
                      <img 
                        src={url.trim()} 
                        alt={`${festival.name} Gallery ${index + 1}`} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Block: Stall map canvas & details panel */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* Interactive Canvas Container */}
            <div className="bg-brand-card border border-brand-border rounded-[24px] p-6 shadow-sm overflow-hidden flex flex-col gap-4">
              <div className="flex flex-wrap justify-between items-center border-b border-brand-border pb-4 gap-4">
                <h3 className="font-serif text-[18px] font-medium">Interactive Floor Plan</h3>
                
                {/* Real-time status legends */}
                <div className="flex flex-wrap items-center gap-4 text-[11px] font-sans text-brand-secondary">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/50" />
                    Available
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-blue-500/10 border border-dashed border-blue-500/50" />
                    Negotiating
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-amber-500/20 border border-amber-500" />
                    Selected
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-[#2D2A3E] border border-brand-border" />
                    Booked
                  </span>
                </div>
              </div>
              
              <StallMap 
                stalls={festival.stalls} 
                selectedStall={selectedStall} 
                onSelectStall={setSelectedStall} 
                layoutMapUrl={festival.layoutMapUrl}
                mapDimensions={festival.mapDimensions}
              />
            </div>

            {/* Selected Stall drawer */}
            {selectedStall && (
              <div id="stall-details-panel" className="bg-brand-card border border-brand-border rounded-[24px] p-8 shadow-md flex flex-col gap-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-brand-border pb-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <span className="font-serif text-[24px] font-semibold text-brand-primary">Stall/Booth {selectedStall.stallNumber}</span>
                      <span className={`px-2.5 py-0.5 border rounded-full text-[9px] uppercase tracking-wider font-semibold ${
                        selectedStall.status === "AVAILABLE" 
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500" 
                          : selectedStall.status === "NEGOTIATION"
                          ? "bg-blue-500/10 border-blue-500/30 text-blue-500"
                          : selectedStall.status === "RESERVED"
                          ? "bg-amber-500/10 border-amber-500/30 text-amber-500"
                          : "bg-[#2D2A3E] border-brand-border text-brand-secondary"
                      }`}>
                        {selectedStall.status}
                      </span>
                    </div>
                    {selectedStall.description && (
                      <p className="text-[12px] text-brand-secondary font-sans mt-1">
                        {selectedStall.description}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3 w-full md:w-auto">
                    {user && user.role !== "VENDOR" ? (
                      <div className="p-3 bg-red-950/20 border border-red-900/50 text-red-400 rounded-xl text-center w-full text-xs font-medium">
                        Bookings and negotiations are restricted to Brand/Vendor accounts only.
                      </div>
                    ) : (selectedStall.status === "AVAILABLE" || selectedStall.status === "NEGOTIATION") ? (
                      <>
                        <button
                          onClick={() => handleBookingAction(selectedStall.id, "negotiate")}
                          disabled={bookingLoading}
                          className="flex-1 md:flex-none btn-liquid-glass py-3 px-5 justify-center text-center text-xs cursor-pointer select-none"
                        >
                          Negotiate Price
                        </button>
                        <button
                          onClick={() => handleBookingAction(selectedStall.id, "book")}
                          disabled={bookingLoading}
                          className="flex-1 md:flex-none btn-liquid-glass-dark py-3 px-5 justify-center text-center text-xs flex items-center gap-2 cursor-pointer select-none"
                        >
                          {bookingLoading ? <Loader2 size={12} className="animate-spin" /> : `Book Space • ₹${selectedStall.publicPrice.toLocaleString("en-IN")}`}
                        </button>
                      </>
                    ) : (
                      <div className="p-3 bg-brand-primary/[0.02] border border-brand-border rounded-xl text-center w-full text-xs text-brand-secondary">
                        This stall/booth is currently locked under {selectedStall.status.toLowerCase()} status.
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 font-sans text-xs text-brand-secondary">
                  <div className="flex flex-col gap-0.5">
                    <span>Dimensions</span>
                    <strong className="text-brand-primary font-medium text-[13px]">{selectedStall.dimensions} ft</strong>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span>Power Grid Configuration</span>
                    <strong className="text-brand-primary font-medium text-[13px]">{selectedStall.powerGrid || "Standard (15A)"}</strong>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span>Visibility Score</span>
                    <strong className="text-brand-primary font-medium text-[13px] flex items-center gap-1"><Star size={12} className="text-brand-secondary" /> {selectedStall.visibilityScore}/10</strong>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span>Traffic Estimate</span>
                    <strong className="text-brand-primary font-medium text-[13px] flex items-center gap-1"><BarChart3 size={12} className="text-brand-secondary" /> {selectedStall.expectedTraffic}/10</strong>
                  </div>
                  <div className="flex flex-col gap-0.5 col-span-2 sm:col-span-1">
                    <span>ROI Potential</span>
                    <strong className="text-brand-primary font-medium text-[13px]">₹{(selectedStall.minSales/1000).toFixed(0)}k – ₹{(selectedStall.maxSales/1000).toFixed(0)}k</strong>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Tabular Stall Directory & Live Status */}
        <div className="bg-brand-card border border-brand-border rounded-[24px] p-8 shadow-sm flex flex-col gap-6 font-sans mt-12">
          <div className="flex flex-col gap-1 border-b border-brand-border pb-4">
            <h3 className="font-serif text-[20px] font-semibold text-brand-primary">Stall/Booth Directory & Live Booking Status</h3>
            <p className="text-xs text-brand-secondary">Inspect pricing, configuration, and current lock statuses for all mapped layout spots.</p>
          </div>
          {!festival.stalls || festival.stalls.length === 0 ? (
            <div className="text-brand-secondary/60 italic text-sm py-4">No stalls/booths mapped for this festival.</div>
          ) : (
            <div className="border border-brand-border rounded-xl overflow-hidden bg-brand-bg">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-brand-border bg-brand-card font-semibold text-[10px] uppercase tracking-wider text-brand-secondary">
                    <th className="p-4">Stall/Booth Number</th>
                    <th className="p-4">Dimensions</th>
                    <th className="p-4">Power Configuration</th>
                    <th className="p-4 text-right">Price</th>
                    <th className="p-4 text-center">Visibility</th>
                    <th className="p-4 text-center">Traffic</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border text-brand-secondary">
                  {festival.stalls.map((stall: any) => (
                    <tr key={stall.id} className={`hover:bg-brand-card/30 ${selectedStall?.id === stall.id ? 'bg-brand-primary/[0.04]' : ''}`}>
                      <td className="p-4 font-semibold text-brand-primary">Stall/Booth {stall.stallNumber}</td>
                      <td className="p-4">{stall.dimensions} ft</td>
                      <td className="p-4">{stall.powerGrid || "Standard (15A)"}</td>
                      <td className="p-4 text-right font-serif font-semibold text-brand-primary">₹{stall.publicPrice.toLocaleString("en-IN")}</td>
                      <td className="p-4 text-center">{stall.visibilityScore}/10</td>
                      <td className="p-4 text-center">{stall.expectedTraffic}/10</td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-0.5 border rounded-full text-[9px] uppercase tracking-wider font-semibold ${
                          stall.status === "AVAILABLE"
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                            : stall.status === "NEGOTIATION"
                            ? "bg-blue-500/10 border-blue-500/30 text-blue-500"
                            : stall.status === "RESERVED"
                            ? "bg-amber-500/10 border-amber-500/30 text-amber-500"
                            : "bg-[#2D2A3E] border-brand-border text-brand-secondary"
                        }`}>
                          {stall.status}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => {
                            setSelectedStall(stall);
                            const element = document.getElementById("stall-details-panel");
                            if (element) {
                              element.scrollIntoView({ behavior: "smooth" });
                            }
                          }}
                          className="px-3 py-1 bg-brand-primary text-brand-bg rounded font-semibold text-[10px] hover:opacity-90 cursor-pointer"
                        >
                          Select & Book
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </PortalLayout>
  );
}
