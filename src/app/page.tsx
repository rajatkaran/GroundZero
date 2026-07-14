"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Users, MapPin, DollarSign, Award, ArrowRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

// Soft slide-up motion variants
const fadeUp = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }
};

// Gentle float motion for dashboard mockups
const float = (delay = 0) => ({
  animate: {
    y: [0, -10, 0],
  },
  transition: {
    duration: 6,
    repeat: Infinity,
    ease: "easeInOut" as const,
    delay: delay
  }
});

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

// Demo stalls layout configuration for the interactive widget
const demoStalls = [
  // Row 1
  { stall: "A1", status: "available", dim: "10×8 ft", price: "₹18,000", traffic: "High", vis: "9.2/10", rev: "₹1.8–2.4L", type: "Standard" },
  { stall: "A2", status: "booked" },
  { stall: "A3", status: "available", dim: "10×8 ft", price: "₹18,000", traffic: "High", vis: "8.8/10", rev: "₹1.6–2.2L", type: "Standard" },
  { stall: "A4", status: "booked" },
  { stall: "A5", status: "negotiation", dim: "12×10 ft", price: "₹22,000", traffic: "Very High", vis: "9.6/10", rev: "₹2.2–3.0L", type: "Prime Center" },
  { stall: "A6", status: "available", dim: "10×8 ft", price: "₹18,000", traffic: "Medium", vis: "7.4/10", rev: "₹1.2–1.8L", type: "Standard" },
  // Row 2
  { stall: "B1", status: "reserved" },
  { stall: "B2", status: "available", dim: "10×10 ft", price: "₹20,000", traffic: "Very High", vis: "9.8/10", rev: "₹2.4–3.2L", type: "Prime Corner", isHighlight: true },
  { stall: "B3", status: "available", dim: "10×8 ft", price: "₹18,000", traffic: "High", vis: "9.1/10", rev: "₹1.8–2.4L", type: "Standard" },
  { stall: "B4", status: "negotiation" },
  { stall: "B5", status: "booked" },
  { stall: "B6", status: "available", dim: "10×8 ft", price: "₹16,000", traffic: "Medium", vis: "7.2/10", rev: "₹1.0–1.6L", type: "Standard" },
  // Walkway marker
  { stall: "walkway", status: "walkway" },
  // Row 3
  { stall: "C1", status: "booked" },
  { stall: "C2", status: "available", dim: "8×8 ft", price: "₹14,000", traffic: "High", vis: "8.5/10", rev: "₹1.4–2.0L", type: "Standard" },
  { stall: "C3", status: "booked" },
  { stall: "C4", status: "available", dim: "8×8 ft", price: "₹14,000", traffic: "High", vis: "8.3/10", rev: "₹1.3–1.9L", type: "Standard" },
  { stall: "C5", status: "reserved" },
  { stall: "C6", status: "available", dim: "8×8 ft", price: "₹14,000", traffic: "Medium", vis: "7.0/10", rev: "₹1.0–1.5L", type: "Standard" }
];

export default function Home() {
  const [festivals, setFestivals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStall, setSelectedStall] = useState<any>({
    stall: "B2",
    dim: "10×10 ft",
    price: "₹20,000",
    traffic: "Very High",
    vis: "9.8/10",
    rev: "₹2.4–3.2L",
    type: "Prime Corner"
  });

  // Animated morphing keywords for Hero headline
  const morphWords = ["Opportunity", "Revenue Stream", "Audience", "Partnership", "Campaign", "Activation", "Market"];
  const [morphIndex, setMorphIndex] = useState(0);

  // Past Event detail states
  const [selectedPastFest, setSelectedPastFest] = useState<any>(null);
  const [pastFestDetails, setPastFestDetails] = useState<any>(null);
  const [pastFestReviews, setPastFestReviews] = useState<any[]>([]);
  const [selectedPastStall, setSelectedPastStall] = useState<any>(null);
  const [loadingPastDetails, setLoadingPastDetails] = useState(false);

  // Revenue Estimator States
  const [estStallRent, setEstStallRent] = useState<number>(30000);
  const [estCategory, setEstCategory] = useState<"FOOD" | "FASHION" | "MERCHANDISE" | "GAMING">("FOOD");
  const [estTicketSize, setEstTicketSize] = useState<number>(350);
  const [estFootfall, setEstFootfall] = useState<number>(45000);
  const [estConversionRate, setEstConversionRate] = useState<number>(4.5);
  const [estDuration, setEstDuration] = useState<number>(3);
  const [estDailyCustomers, setEstDailyCustomers] = useState<number>(2025);
  const [estDailyOpCost, setEstDailyOpCost] = useState<number>(4000);

  useEffect(() => {
    const interval = setInterval(() => {
      setMorphIndex((prev) => (prev + 1) % morphWords.length);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch("/api/festivals")
      .then((res) => res.json())
      .then((data) => {
        if (data.festivals) {
          setFestivals(data.festivals);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleOpenPastFestModal = async (fest: any) => {
    setSelectedPastFest(fest);
    setLoadingPastDetails(true);
    setPastFestDetails(null);
    setPastFestReviews([]);
    setSelectedPastStall(null);
    try {
      const res = await fetch(`/api/festivals/${fest.id}`);
      const data = await res.json();
      setPastFestDetails(data.festival);

      const stalls = data.festival?.stalls || [];
      if (stalls.length > 0) {
        setSelectedPastStall(stalls[0]);
      }

      const revRes = await fetch(`/api/festivals/reviews?festivalId=${fest.id}`);
      const revData = await revRes.json();
      setPastFestReviews(revData.reviews || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingPastDetails(false);
    }
  };

  const activeFestivals = festivals.filter((f) => new Date(f.endDate) >= new Date());
  const pastFestivals = festivals.filter((f) => new Date(f.endDate) < new Date());

  return (
    <div className="min-h-screen bg-brand-bg text-brand-primary selection:bg-brand-primary selection:text-brand-bg flex flex-col">
      <Navigation />

      {/* SECTION 1: Hero Section */}
      <section id="hero" className="relative overflow-hidden pt-36 pb-24 md:pt-48 md:pb-32 border-b border-brand-border">
        {/* Deep Purple Glow & Concert backdrop for dark mode */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-1000 overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center mix-blend-luminosity opacity-[0.06] scale-105 blur-[2px]" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1200')` }} />
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/5 via-[#09080F]/50 to-[#09080F]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.12)_0%,rgba(139,92,246,0)_70%)] blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center">
            
            {/* Left Block: Text */}
            <div className="lg:col-span-6 flex flex-col gap-8">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-6"
              >
                <span className="gz-eyebrow">Ground Zero &middot; A ThinkThrough Product</span>
                <h1 className="font-serif text-[48px] sm:text-[64px] lg:text-[76px] leading-[1.05] tracking-[-0.03em] font-medium text-brand-primary">
                  Discover Your Next<br />
                  <span className="relative inline-block overflow-hidden h-[1.15em] align-bottom min-w-[280px]">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={morphIndex}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="font-accent italic font-light text-brand-secondary block"
                      >
                        {morphWords[morphIndex]}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                </h1>
                <p className="font-sans text-[16px] sm:text-[18px] leading-relaxed text-brand-secondary max-w-lg font-light">
                  <strong>Book festival stalls, discover sponsors, and monetize your event through one platform.</strong> India's premium marketplace for high-value festival business, sponsorship access, and verified audience intelligence.
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-wrap gap-4 items-center"
              >
                <Link href="/auth?type=signup" className="btn-liquid-glass-dark">
                  Apply for Access &rarr;
                </Link>
                <Link href="/discover" className="btn-liquid-glass">
                  Discover Opportunities
                </Link>
              </motion.div>
            </div>

            {/* Right Block: Dashboard Mockup & Orbiting Cards */}
            <div className="lg:col-span-6 relative w-full flex items-center justify-center min-h-[560px] py-12">
              
              {/* Outer Grid Bounds */}
              <div className="absolute inset-0 border border-dashed border-brand-border rounded-[32px] pointer-events-none" />

              {/* Main Central Dashboard Mockup */}
              <div className="w-full max-w-[400px] bg-brand-card border border-brand-border rounded-[20px] overflow-hidden shadow-2xl relative z-10">
                
                {/* Mockup Topbar */}
                <div className="px-5 py-4 border-b border-brand-border flex items-center gap-3 bg-brand-bg/50">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-brand-border" />
                    <div className="w-2.5 h-2.5 rounded-full bg-brand-border" />
                    <div className="w-2.5 h-2.5 rounded-full bg-brand-border" />
                  </div>
                  <span className="font-sans text-[11px] text-brand-secondary tracking-wide ml-2">Festival Opportunity Intelligence</span>
                </div>

                {/* Mockup Body */}
                <div className="p-5 flex flex-col gap-4 bg-brand-card">
                  {/* Grid of stats */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-brand-bg border border-brand-border rounded-xl p-2.5 flex flex-col">
                      <span className="font-sans text-[9px] uppercase tracking-wider text-brand-secondary">Expected Footfall</span>
                      <span className="font-serif text-[18px] sm:text-[20px] font-bold text-brand-primary mt-1">48K</span>
                      <span className="font-sans text-[8px] text-brand-secondary/60 mt-0.5">3-day</span>
                    </div>
                    <div className="bg-brand-bg border border-brand-border rounded-xl p-2.5 flex flex-col">
                      <span className="font-sans text-[9px] uppercase tracking-wider text-brand-secondary">Available Stalls</span>
                      <span className="font-serif text-[18px] sm:text-[20px] font-bold text-brand-primary mt-1">24</span>
                      <span className="font-sans text-[8px] text-brand-secondary/60 mt-0.5">of 60</span>
                    </div>
                    <div className="bg-brand-bg border border-brand-border rounded-xl p-2.5 flex flex-col">
                      <span className="font-sans text-[9px] uppercase tracking-wider text-brand-secondary">Opp. Score</span>
                      <span className="font-serif text-[18px] sm:text-[20px] font-bold text-brand-primary mt-1">9.1</span>
                      <span className="font-sans text-[8px] text-brand-secondary/60 mt-0.5">Top 5%</span>
                    </div>
                  </div>

                  {/* List items */}
                  <div className="flex flex-col gap-2">
                    <div className="bg-brand-bg border border-brand-border rounded-xl px-3.5 py-2.5 flex items-center justify-between">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-sans text-[11px] font-medium text-brand-primary">Mood Indigo — IIT Bombay</span>
                        <span className="font-sans text-[9px] text-brand-secondary">Mumbai &middot; Jan 17–19 &middot; 52k expected</span>
                      </div>
                      <span className="px-2 py-0.5 bg-brand-primary text-brand-bg text-[9px] font-bold rounded font-sans">9.4</span>
                    </div>

                    <div className="bg-brand-bg border border-brand-border rounded-xl px-3.5 py-2.5 flex items-center justify-between">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-sans text-[11px] font-medium text-brand-primary">Rendezvous — IIT Delhi</span>
                        <span className="font-sans text-[9px] text-brand-secondary">Delhi &middot; Oct 3–6 &middot; 40k expected</span>
                      </div>
                      <span className="px-2 py-0.5 bg-brand-primary text-brand-bg text-[9px] font-bold rounded font-sans">8.7</span>
                    </div>

                    <div className="bg-brand-bg border border-brand-border rounded-xl px-3.5 py-2.5 flex items-center justify-between">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-sans text-[11px] font-medium text-brand-primary">Saarang — IIT Madras</span>
                        <span className="font-sans text-[9px] text-brand-secondary">Chennai &middot; Jan 9–13 &middot; 35k expected</span>
                      </div>
                      <span className="px-2 py-0.5 bg-transparent border border-brand-border text-brand-secondary text-[9px] font-bold rounded font-sans">7.9</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Element 1: Opportunity Score Card */}
              <motion.div 
                {...float(0)}
                className="absolute -top-4 -left-6 w-[230px] p-5 bg-brand-card border border-brand-border rounded-[20px] shadow-lg z-20 hidden md:block"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex flex-col">
                    <span className="font-sans text-[9px] uppercase tracking-wider text-brand-secondary">OPPORTUNITY SCORE</span>
                    <span className="font-serif text-[24px] font-bold mt-0.5 text-brand-primary">94/100</span>
                  </div>
                  <span className="px-2 py-0.5 bg-brand-primary text-brand-bg text-[9px] uppercase tracking-wider rounded font-sans font-semibold">TIER-1</span>
                </div>
                <div className="flex flex-col gap-1.5 border-t border-brand-border pt-3 font-sans text-[11px] text-brand-secondary">
                  <div className="flex justify-between">
                    <span>Reputation</span>
                    <span className="font-medium text-brand-primary">Elite Class</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Audience Quality</span>
                    <span className="font-medium text-brand-primary">High Affluence</span>
                  </div>
                </div>
              </motion.div>

              {/* Floating Element 2: Revenue Projection Card */}
              <motion.div 
                {...float(1.5)}
                className="absolute -bottom-4 -left-2 w-[250px] p-5 bg-brand-card border border-brand-border rounded-[20px] shadow-lg z-20 hidden md:block"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-[9px] uppercase tracking-wider text-brand-secondary">REVENUE PROJECTION</span>
                    <TrendingUp size={12} className="text-brand-secondary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-serif text-[22px] font-bold text-brand-primary">₹1.8L – ₹2.5L</span>
                    <span className="font-sans text-[10px] text-brand-secondary mt-0.5">Stall Space A3 (Food City)</span>
                  </div>
                  <div className="flex gap-1.5 items-center text-[10px] font-sans border-t border-brand-border pt-2.5 text-brand-secondary">
                    <MapPin size={11} />
                    <span>Premium Gate 2 Entrance</span>
                  </div>
                </div>
              </motion.div>

              {/* Floating Element 3: Stall Map Preview Scheduler */}
              <motion.div 
                {...float(3)}
                className="absolute bottom-12 -right-8 w-[190px] p-4 bg-brand-card border border-brand-border rounded-[18px] shadow-lg z-20 hidden lg:block flex flex-col gap-2.5"
              >
                <span className="font-sans text-[9px] uppercase tracking-wider text-brand-secondary">STALL MAP PREVIEW</span>
                <div className="grid grid-cols-4 gap-1 h-12 bg-brand-bg p-1.5 rounded-lg border border-brand-border items-center justify-center">
                  <div className="h-full rounded bg-brand-primary flex items-center justify-center text-[9px] text-brand-bg font-medium">A1</div>
                  <div className="h-full rounded border border-brand-border bg-brand-card flex items-center justify-center text-[9px] text-brand-primary/40">A2</div>
                  <div className="h-full rounded bg-brand-primary/10 flex items-center justify-center text-[9px] text-brand-primary">A3</div>
                  <div className="h-full rounded border border-brand-border bg-brand-card flex items-center justify-center text-[9px] text-brand-primary/40">A4</div>
                </div>
                <div className="flex justify-between items-center text-[9px] font-sans text-brand-secondary mt-1">
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-brand-primary" /> Booked</span>
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-brand-primary/20" /> Available</span>
                </div>
              </motion.div>

              {/* Floating Element 4: Brand Emblem Badge */}
              <motion.div 
                {...float(2.2)}
                className="absolute top-[20%] -right-10 w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-brand-border bg-[#b1b3b3] dark:bg-[#4e4c4c] shadow-2xl z-20 hidden sm:block"
              >
                <img src="/logo.jpg" alt="Ground Zero Logo" className="w-full h-full object-cover dark:invert dark:hue-rotate-180 dark:brightness-110" />
              </motion.div>

            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Spotlight Festival Properties (moved immediately below Hero) */}
      <section className="py-24 md:py-36 border-b border-brand-border bg-brand-card">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <motion.div {...fadeUp} className="mb-20 text-center flex flex-col items-center gap-4">
            <span className="gz-eyebrow">The Spotlight</span>
            <h2 className="font-serif text-[36px] sm:text-[48px] tracking-tight text-brand-primary font-medium">
              Spotlight Festival Properties
            </h2>
            <p className="font-sans text-[15px] text-brand-secondary max-w-md font-light leading-relaxed">
              High-value festival properties currently accepting brand partnerships and commercial brands & vendors. Select an event to evaluate audience reach and secure your space.
            </p>
          </motion.div>

          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <span className="text-xs text-brand-secondary animate-pulse">Loading opportunities...</span>
            </div>
          ) : activeFestivals.length === 0 ? (
            <div className="bg-brand-bg border border-brand-border rounded-[24px] p-12 text-center font-sans text-xs text-brand-secondary">
              No active listings published on the network.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {activeFestivals.map((fest) => {
                const bookedCount = fest.stalls ? fest.stalls.filter((s: any) => s.status === "BOOKED").length : 0;
                const totalStalls = fest.stalls ? fest.stalls.length : 0;
                return (
                  <motion.div 
                    key={fest.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-brand-bg border border-brand-border rounded-[24px] overflow-hidden shadow-sm flex flex-col justify-between min-h-[440px] hover:border-brand-primary/20 dark:hover:border-purple-500/30 hover:shadow-md dark:hover:shadow-[0_0_25px_rgba(139,92,246,0.1)] transition-all duration-300 group cursor-pointer"
                  >
                    {/* Banner Image */}
                    <div className="relative h-48 w-full overflow-hidden bg-brand-bg">
                      <img 
                        src={(fest.bannerUrl && (fest.bannerUrl.startsWith("http") || fest.bannerUrl.startsWith("/") || fest.bannerUrl.startsWith("data:"))) ? fest.bannerUrl : getFallbackImage(fest.id)} 
                        alt={fest.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e: any) => {
                          e.target.onerror = null;
                          e.target.src = getFallbackImage(fest.id);
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      
                      {/* Quality Score Badge */}
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1.5 bg-brand-bg/90 backdrop-blur-sm border border-brand-border text-brand-primary font-sans text-[11px] font-semibold rounded-full flex items-center gap-1 shadow-sm">
                          ⚡ {fest.opportunityScore} Score
                        </span>
                      </div>
                    </div>

                    <div className="p-6 flex flex-col justify-between flex-1 gap-4 bg-brand-card">
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-serif text-[22px] font-semibold text-brand-primary leading-tight">{fest.name}</span>
                          <span className="font-sans text-[12px] text-brand-secondary flex items-center gap-1.5">
                            <MapPin size={12} className="text-brand-secondary/80" /> {fest.collegeName} &middot; {fest.location}
                          </span>
                        </div>

                        <p className="font-sans text-[13px] leading-6 text-brand-secondary">
                          🎸 Headliners: <strong className="text-brand-primary font-medium">{fest.artistLineup || "To be announced"}</strong>
                        </p>

                        <div className="grid grid-cols-3 gap-4 border-t border-brand-border pt-4 font-sans text-xs text-brand-secondary">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-semibold text-[10px] uppercase tracking-wider">🎟️ Booths/Stalls Booked</span>
                            <span className="font-serif text-[14px] font-medium text-brand-primary">
                              {bookedCount} / {totalStalls} Booths/Stalls
                            </span>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="font-semibold text-[10px] uppercase tracking-wider">👥 Expected Footfall</span>
                            <span className="font-serif text-[14px] font-medium text-brand-primary">
                              {fest.expectedFootfall ? fest.expectedFootfall.toLocaleString("en-IN") : "N/A"}
                            </span>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="font-semibold text-[10px] uppercase tracking-wider">🎯 Primary Audience</span>
                            <span className="font-serif text-[14px] font-medium text-brand-primary truncate max-w-[120px]" title={fest.demographics}>
                              {fest.demographics ? fest.demographics.split(",")[0] : "Youth Focus"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-brand-border pt-4 flex justify-end">
                        <Link
                          href={`/festival/${fest.id}`}
                          className="btn-liquid-glass-dark text-xs py-2 px-6 flex items-center gap-1.5"
                        >
                          Evaluate Opportunity
                          <ArrowRight size={12} />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* SECTION 3: Ticker Section (between Spotlight and Gallery as requested) */}
      <div className="ticker-wrap w-full select-none pointer-events-none">
        <div className="ticker-track">
          {[
            "Verified Festival Business Opportunities",
            "Premium Brand & Vendor Access",
            "Instant Stall/Booth Bookings",
            "Audience Yield & ROI Estimation",
            "Sponsorship & Brand Activation Portal",
            "Direct Negotiation & Fast Licensing",
            "High-Footfall Campaign Placements",
            "Commercial Space Marketplace"
          ].map((item, index) => (
            <span key={`ticker-1-${index}`} className="ticker-item">
              {item}
            </span>
          ))}
          {[
            "Verified Festival Business Opportunities",
            "Premium Brand & Vendor Access",
            "Instant Stall/Booth Bookings",
            "Audience Yield & ROI Estimation",
            "Sponsorship & Brand Activation Portal",
            "Direct Negotiation & Fast Licensing",
            "High-Footfall Campaign Placements",
            "Commercial Space Marketplace"
          ].map((item, index) => (
            <span key={`ticker-2-${index}`} className="ticker-item">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* SECTION 3B: Brands Grid */}
      <div className="w-full bg-brand-bg py-12 border-b border-brand-border select-none relative">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="mb-6 text-center">
            <span className="gz-eyebrow text-brand-secondary/60">Brands We've Worked For</span>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20">
            {[
              "/brands-1.jpg",
              "/brands-2.png",
              "/brands-3.png",
              "/brands-4.jpg",
              "/brands-5.png"
            ].map((imgUrl, idx) => (
              <div key={`brand-logo-${idx}`} className="flex items-center justify-center h-16 w-32">
                <img 
                  src={imgUrl} 
                  alt="Partner Brand" 
                  className="max-h-full max-w-full object-contain opacity-70 hover:opacity-100 transition-opacity duration-300 dark:brightness-200 dark:contrast-150" 
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 4: Gallery & Past Events (moved immediately below Ticker) */}
      <section className="py-24 md:py-36 border-b border-brand-border bg-brand-bg relative overflow-hidden">
        {/* Purple glow backdrop */}
        <div className="absolute inset-0 pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-1000">
          <div className="absolute -bottom-20 right-10 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.08)_0%,rgba(139,92,246,0)_75%)] blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 relative z-10">
          <motion.div {...fadeUp} className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col gap-4">
              <span className="gz-eyebrow">Ecosystem Gallery</span>
              <h2 className="font-serif text-[36px] sm:text-[48px] tracking-tight text-brand-primary font-medium">
                Gallery & Past Events
              </h2>
              <p className="font-sans text-[15px] text-brand-secondary max-w-md font-light leading-relaxed">
                A glance at high-yield activations, brand campaigns, and commercial stalls successfully executed on the Ground Zero opportunity network.
              </p>
            </div>
            
            {/* Quick stats tag */}
            <div className="flex items-center gap-2 px-4 py-2 border border-brand-border bg-brand-card rounded-full font-sans text-xs text-brand-secondary font-medium">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              <span>48 Live Campaigns this Week</span>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              {
                title: "Volkoder at Cosybox",
                type: "Music Event",
                location: "Cosy Box, Delhi/NCR",
                date: "Fri, 12 Jun 2026, 9:00 PM",
                status: "Concluded ⚡",
                img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600",
                tag: "High-Yield Activation ✅"
              },
              {
                title: "Nizami Bandhu Live",
                type: "Jashn-e-Qawwali",
                location: "KOPA, Lajpat Nagar",
                date: "Sat, 6 Jun 2026, 9:30 PM",
                status: "1.8x ROI Yield 🔥",
                img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600",
                tag: "Concluded 🎪"
              },
              {
                title: "Spotlight Comedy Club",
                type: "Standup Comedy",
                location: "Unplugged Courtyard, Delhi",
                date: "Sun, 7 Jun 2026, 7:00 PM",
                status: "100% Stall Occupancy 🎟️",
                img: "https://images.unsplash.com/photo-1516280440614-37939bbacd6a?q=80&w=600",
                tag: "Sold Out 🎙️"
              },
              {
                title: "Clay & Pottery Workshop",
                type: "Creative Masterclass",
                location: "Cafe Saka, Delhi/NCR",
                date: "Daily, 10–14 Jun 2026",
                status: "Success ✅",
                img: "https://images.unsplash.com/photo-1576016770956-debb63d90029?q=80&w=600",
                tag: "Max Traffic Capture 🏺"
              },
              {
                title: "Glow & Glam Ladies Night",
                type: "Nightlife",
                location: "Ivoryy Fusion Bar, Delhi",
                date: "Thu, 11 Jun 2026, 8:00 PM",
                status: "Full Capacity 🍸",
                img: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=600",
                tag: "Audience Sold Out 🍹"
              }
            ].map((evt, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="bg-brand-card border border-brand-border rounded-[20px] overflow-hidden flex flex-col justify-between hover:border-brand-primary/20 dark:hover:border-purple-500/40 hover:shadow-lg dark:hover:shadow-[0_0_25px_rgba(139,92,246,0.15)] transition-all duration-300 group cursor-pointer"
              >
                {/* Event Cover Photo */}
                <div className="relative h-44 w-full overflow-hidden bg-brand-bg">
                  <img
                    src={evt.img}
                    alt={evt.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09080F]/60 via-transparent to-transparent" />
                  
                  {/* Floating Highlight Tag */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 bg-[#09080F]/90 backdrop-blur-sm border border-brand-border text-brand-primary font-sans text-[9px] font-semibold rounded-full shadow-sm">
                      {evt.tag}
                    </span>
                  </div>
                </div>

                {/* Event Details */}
                <div className="p-4 flex flex-col justify-between flex-1 gap-2 bg-brand-card">
                  <div className="flex flex-col gap-1.5">
                    <span className="font-serif text-[15px] font-semibold text-brand-primary leading-tight group-hover:text-purple-400 transition-colors">{evt.title}</span>
                    <span className="font-sans text-[11px] text-brand-secondary/80 flex items-center gap-1">
                      📍 {evt.location}
                    </span>
                  </div>

                  <div className="border-t border-brand-border/40 pt-2.5 mt-1 flex flex-col gap-1 text-[11px] font-sans text-brand-secondary">
                    <div className="flex justify-between items-center">
                      <span>Date</span>
                      <span className="text-brand-primary font-medium">{evt.date.split(",")[0]}, {evt.date.split(",")[1]}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Status</span>
                      <span className="text-purple-400 font-semibold">{evt.status}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4B: Past Festivals Archive (linked to #past-events) */}
      <section id="past-events" className="py-24 md:py-36 border-b border-brand-border bg-brand-card relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <motion.div {...fadeUp} className="mb-20 text-center flex flex-col items-center gap-4">
            <span className="gz-eyebrow">The Performance Archive</span>
            <h2 className="font-serif text-[36px] sm:text-[48px] tracking-tight text-brand-primary font-medium">
              Past Festivals Registry
            </h2>
            <p className="font-sans text-[15px] text-brand-secondary max-w-md font-light leading-relaxed">
              Explore concluded event metrics. Audit verified footfall parameters, custom annotations, booth/stall pricing models, and actual brand & vendor revenue ranges.
            </p>
          </motion.div>

          {pastFestivals.length === 0 ? (
            <div className="bg-brand-bg border border-brand-border rounded-[24px] p-12 text-center font-sans text-xs text-brand-secondary">
              No past event registries published on the network yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pastFestivals.map((fest) => (
                <div 
                  key={fest.id}
                  onClick={() => handleOpenPastFestModal(fest)}
                  className="bg-brand-bg border border-brand-border rounded-[24px] overflow-hidden shadow-sm flex flex-col justify-between min-h-[380px] hover:border-brand-primary/20 dark:hover:border-purple-500/30 hover:shadow-md transition-all duration-300 group cursor-pointer"
                >
                  <div className="relative h-44 w-full overflow-hidden bg-brand-bg">
                    <img 
                      src={fest.bannerUrl || getFallbackImage(fest.id)} 
                      alt={fest.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    <div className="absolute top-4 right-4">
                      <span className="px-2.5 py-1 bg-brand-primary text-brand-bg font-sans text-[10px] font-bold uppercase rounded-full">
                        Concluded
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col justify-between flex-1 gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-serif text-[20px] font-semibold text-brand-primary group-hover:text-purple-400 transition-colors">{fest.name}</span>
                      <span className="font-sans text-[11px] text-brand-secondary flex items-center gap-1">
                        📍 {fest.collegeName} &middot; {fest.location}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-brand-border pt-4 font-sans text-[11px] text-brand-secondary">
                      <div>
                        <span className="block font-semibold uppercase text-[9px] tracking-wider text-brand-secondary/60">Actual Footfall</span>
                        <span className="text-[13px] font-medium text-brand-primary">{(fest.expectedFootfall || 135000).toLocaleString("en-IN")}</span>
                      </div>
                      <div>
                        <span className="block font-semibold uppercase text-[9px] tracking-wider text-brand-secondary/60">Stall Base Price</span>
                        <span className="text-[13px] font-medium text-brand-primary">₹{(fest.defaultStallPrice || 30000).toLocaleString("en-IN")}</span>
                      </div>
                    </div>

                    <div className="border-t border-brand-border pt-4 flex justify-end">
                      <span className="font-sans text-[11px] text-brand-secondary group-hover:text-brand-primary transition-colors flex items-center gap-1 font-semibold uppercase tracking-wider">
                        View Audited Performance &rarr;
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Revenue Estimator Header */}
          <div className="mt-24 mb-12 text-center flex flex-col items-center gap-3">
            <span className="gz-eyebrow">Interactive Planning</span>
            <h3 className="font-serif text-[28px] sm:text-[36px] tracking-tight text-brand-primary font-medium">
              Stall Yield & ROI Estimator
            </h3>
            <p className="font-sans text-[14px] text-brand-secondary max-w-lg font-light leading-relaxed">
              Estimate potential retail earnings, space booking overheads, cost of goods sold, and projected net profit margins for your brand.
            </p>
          </div>

          <div className="bg-brand-bg border border-brand-border rounded-[28px] p-8 sm:p-12 shadow-md grid grid-cols-1 md:grid-cols-12 gap-10 font-sans">
            {/* Controls Panel */}
            <div className="md:col-span-7 flex flex-col gap-6">
              {/* Category */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-brand-secondary">Stall Category</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: "FOOD", label: "🍔 F&B / Food", rate: 4.5 },
                    { id: "FASHION", label: "👗 Apparel", rate: 2.0 },
                    { id: "MERCHANDISE", label: "📚 Merchandise", rate: 1.5 },
                    { id: "GAMING", label: "🕹️ Activations", rate: 1.0 }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      suppressHydrationWarning
                      onClick={() => {
                        setEstCategory(cat.id as any);
                        setEstConversionRate(cat.rate);
                        setEstDailyCustomers(Math.round(estFootfall * (cat.rate / 100)));
                      }}
                      className={`py-3 px-4 rounded-xl border text-center font-medium transition-all cursor-pointer ${
                        estCategory === cat.id
                          ? "bg-brand-primary text-brand-bg border-brand-primary"
                          : "border-brand-border bg-brand-card text-brand-secondary hover:text-brand-primary"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size, Ticket & Operational Cost */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-brand-secondary">Stall Rent (₹)</label>
                  <input
                    type="number"
                    suppressHydrationWarning
                    value={estStallRent || ""}
                    onChange={(e) => setEstStallRent(e.target.value === "" ? 0 : parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-3 border border-brand-border bg-brand-card text-brand-primary rounded-xl focus:outline-none focus:border-brand-primary text-xs font-semibold"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-brand-secondary">Avg. Ticket Size (₹)</label>
                  <input
                    type="number"
                    suppressHydrationWarning
                    value={estTicketSize || ""}
                    onChange={(e) => setEstTicketSize(e.target.value === "" ? 0 : parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-3 border border-brand-border bg-brand-card text-brand-primary rounded-xl focus:outline-none focus:border-brand-primary text-xs font-semibold"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-brand-secondary">Daily Op. Cost (₹)</label>
                  <input
                    type="number"
                    suppressHydrationWarning
                    value={estDailyOpCost || ""}
                    onChange={(e) => setEstDailyOpCost(e.target.value === "" ? 0 : parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-3 border border-brand-border bg-brand-card text-brand-primary rounded-xl focus:outline-none focus:border-brand-primary text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Conversion Rate & Duration */}
              <div className="grid grid-cols-2 gap-4">
                {/* Conversion Rate Slider & Customers Input */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-[10px] font-semibold text-brand-secondary uppercase">
                    <span>Conversion Rate</span>
                    <span className="text-brand-primary text-xs font-bold font-serif">{estConversionRate}%</span>
                  </div>
                  <input
                    type="range"
                    suppressHydrationWarning
                    min="0.5"
                    max="15"
                    step="0.5"
                    value={estConversionRate}
                    onChange={(e) => {
                      const newRate = parseFloat(e.target.value);
                      setEstConversionRate(newRate);
                      setEstDailyCustomers(Math.round(estFootfall * (newRate / 100)));
                    }}
                    className="w-full h-1 bg-brand-border rounded-lg appearance-none cursor-pointer accent-brand-primary"
                  />
                  <div className="flex justify-between text-[8.5px] text-brand-secondary/60">
                    <span>0.5% (Low)</span>
                    <span>15% (High)</span>
                  </div>

                  {/* Avg. Customers Input */}
                  <div className="flex justify-between items-center mt-2 bg-brand-card/45 border border-brand-border/40 p-2 rounded-xl">
                    <label className="text-[9px] uppercase tracking-wider font-semibold text-brand-secondary">Avg. Customers/Day</label>
                    <input
                      type="number"
                      suppressHydrationWarning
                      value={estDailyCustomers || ""}
                      onChange={(e) => {
                        const val = e.target.value === "" ? 0 : parseInt(e.target.value) || 0;
                        setEstDailyCustomers(val);
                        if (estFootfall > 0) {
                          setEstConversionRate(Math.round(((val / estFootfall) * 100) * 10) / 10);
                        }
                      }}
                      className="w-20 px-2 py-1 text-right border border-brand-border bg-brand-bg text-brand-primary rounded-lg text-xs font-semibold focus:outline-none"
                    />
                  </div>
                </div>

                {/* Event Duration Slider */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-[10px] font-semibold text-brand-secondary uppercase">
                    <span>Event Duration</span>
                    <span className="text-brand-primary text-xs font-bold font-serif">{estDuration} {estDuration === 1 ? 'Day' : 'Days'}</span>
                  </div>
                  <input
                    type="range"
                    suppressHydrationWarning
                    min="1"
                    max="5"
                    step="1"
                    value={estDuration}
                    onChange={(e) => setEstDuration(parseInt(e.target.value))}
                    className="w-full h-1 bg-brand-border rounded-lg appearance-none cursor-pointer accent-brand-primary"
                  />
                  <div className="flex justify-between text-[8.5px] text-brand-secondary/60">
                    <span>1 Day</span>
                    <span>5 Days</span>
                  </div>
                </div>
              </div>

              {/* Footfall Slider */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-[10px] font-semibold text-brand-secondary uppercase">
                  <span>Festival Footfall</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      suppressHydrationWarning
                      value={estFootfall || ""}
                      onChange={(e) => {
                        const val = e.target.value === "" ? 0 : parseInt(e.target.value) || 0;
                        setEstFootfall(val);
                        setEstDailyCustomers(Math.round(val * (estConversionRate / 100)));
                      }}
                      className="w-24 px-2 py-1 text-right border border-brand-border bg-brand-card text-brand-primary rounded-lg text-xs font-bold focus:outline-none"
                    />
                    <span className="text-[10px] text-brand-secondary font-medium lowercase">att.</span>
                  </div>
                </div>
                <input
                  type="range"
                  suppressHydrationWarning
                  min="5000"
                  max="150000"
                  step="5000"
                  value={estFootfall}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setEstFootfall(val);
                    setEstDailyCustomers(Math.round(val * (estConversionRate / 100)));
                  }}
                  className="w-full h-1 bg-brand-border rounded-lg appearance-none cursor-pointer accent-brand-primary"
                />
                <div className="flex justify-between text-[9px] text-brand-secondary/60">
                  <span>5,000 (Local Event)</span>
                  <span>150,000 (Tier-1 College Fest)</span>
                </div>
              </div>
            </div>

            {/* Calculations Display Panel */}
            <div className="md:col-span-5 bg-brand-card border border-brand-border rounded-2xl p-6 flex flex-col justify-between gap-6 self-stretch">
              {(() => {
                // Use user-defined daily customer count and event duration
                const transactions = estDailyCustomers;
                // Total gross sales is daily transactions * ticket size * event duration
                const grossSales = transactions * estTicketSize * estDuration;
                
                const spacePrice = estStallRent;
                const operationalExpenses = estDailyOpCost * estDuration; // Staff, travel, logistics scales with duration
                
                const totalExpenses = spacePrice + operationalExpenses;
                const netProfit = grossSales - totalExpenses;
                const roiMultiplier = spacePrice > 0 ? (grossSales / spacePrice).toFixed(1) : "0";

                return (
                  <div className="flex flex-col justify-between h-full gap-4">
                    <div className="flex flex-col gap-3">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider font-semibold text-brand-secondary">Projected Turnover</span>
                        <h4 className="font-serif text-[28px] font-bold text-brand-primary leading-tight mt-0.5">
                          ₹{grossSales.toLocaleString("en-IN")}
                        </h4>
                        <span className="text-[10px] text-brand-secondary/60 font-sans block mt-0.5">
                          Based on {transactions * estDuration} total sales transactions ({transactions}/day)
                        </span>
                      </div>

                      <div className="border-t border-brand-border pt-3 mt-1 flex flex-col gap-2 text-[11.5px] text-brand-secondary">
                        <div className="flex justify-between">
                          <span>Stall Rent</span>
                          <span className="text-brand-primary">₹{spacePrice.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Operational Expenses</span>
                          <span className="text-brand-primary">₹{operationalExpenses.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex justify-between border-t border-brand-border/40 pt-2 mt-1">
                          <span>Estimated Net Margin</span>
                          <strong className={netProfit > 0 ? "text-emerald-500 font-bold" : "text-red-400"}>
                            ₹{Math.round(netProfit).toLocaleString("en-IN")}
                          </strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Projected Yield / ROI</span>
                          <strong className="text-brand-primary font-bold">{roiMultiplier}x stall rent</strong>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-2 border-t border-brand-border">
                      <Link
                        href="/auth?type=signup"
                        className="btn-liquid-glass-dark w-full text-center py-3 text-xs flex justify-center items-center gap-1.5"
                      >
                        Claim Your Stall Space &rarr;
                      </Link>
                      <span className="text-[9.5px] text-brand-secondary/50 text-center leading-relaxed">
                        * Calculations are estimates based on typical college fest retail margins. Actual parameters may vary.
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4.5: CAC Case Study / Brands Acquisition Metric Comparison */}
      <section className="py-24 md:py-36 border-b border-brand-border bg-brand-bg relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          
          {/* Tagline Header */}
          <div className="mb-16 flex flex-col gap-3">
            <span className="gz-eyebrow">Customer Acquisition Cost (CAC)</span>
            <h2 className="font-serif text-[32px] sm:text-[44px] tracking-tight leading-tight text-brand-primary font-medium">
              Your Customer Acquisition can be <span className="font-accent italic font-light text-brand-secondary">₹1 per customer.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Visual Dashboard Side-by-Side Comparison */}
            <div className="lg:col-span-5 flex flex-col gap-6 w-full">
              
              {/* Card 1: The Bot Trap (Digital Campaign) */}
              <motion.div 
                {...fadeUp}
                className="border border-red-950/20 bg-red-950/5 dark:bg-red-950/10 rounded-2xl p-6 flex flex-col gap-4"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-red-500 flex items-center gap-1.5">
                    ⚠️ Digital Ad Campaign (e.g. Instagram)
                  </span>
                  <span className="text-[10px] text-red-400 font-semibold bg-red-500/10 px-2 py-0.5 rounded-full">
                    Low Trust
                  </span>
                </div>
                
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-brand-secondary/60">Campaign Investment</span>
                  <h4 className="text-2xl font-bold font-serif text-red-400">₹40 Lakh</h4>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-red-950/10 pt-4 text-xs text-brand-secondary">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] uppercase tracking-wider text-brand-secondary/60">Fabricated Reach</span>
                    <strong className="text-red-400 font-bold">82% Bots 🤖</strong>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] uppercase tracking-wider text-brand-secondary/60">Real Imp. Cost</span>
                    <strong className="text-brand-primary font-bold">₹22 - ₹25 / view</strong>
                  </div>
                </div>
              </motion.div>

              {/* Card 2: Ground Zero Activation (Real Reach) */}
              <motion.div 
                {...fadeUp}
                className="border border-emerald-950/20 bg-emerald-950/5 dark:bg-emerald-950/10 rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-500 flex items-center gap-1.5">
                    ⚡ Ground Zero Fest Activation
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    100% Real Reach
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-brand-secondary/60">Activation Booth Cost</span>
                  <h4 className="text-2xl font-bold font-serif text-emerald-400">₹30,000</h4>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-emerald-950/10 pt-4 text-xs text-brand-secondary">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] uppercase tracking-wider text-brand-secondary/60">Real Students Met</span>
                    <strong className="text-emerald-400 font-bold">30,000+ Humans 👥</strong>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] uppercase tracking-wider text-brand-secondary/60">Effective CAC</span>
                    <strong className="text-brand-primary font-bold text-base font-serif">₹1 / customer</strong>
                  </div>
                </div>
              </motion.div>

              {/* Efficiency Gap Meter */}
              <div className="bg-brand-card border border-brand-border rounded-xl p-4 text-center">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-brand-secondary">Efficiency Multiplier</span>
                <div className="text-3xl font-serif font-bold text-brand-primary mt-1">20x - 25x</div>
                <div className="text-[10.5px] text-brand-secondary/70 font-sans mt-0.5">Higher offline engagement efficiency vs. digital ad spend</div>
              </div>

            </div>

            {/* Right Column: Case Storytelling Narrative */}
            <div className="lg:col-span-7 flex flex-col gap-8">
              
              {/* The Narrative Hook */}
              <div className="flex flex-col gap-4 font-sans font-light leading-relaxed text-brand-secondary text-[15px]">
                <p>
                  A brand invested <strong className="text-brand-primary font-medium">₹40 lakh</strong> in an Instagram campaign last month, but <strong className="text-brand-primary font-medium">82%</strong> of that &ldquo;reach&rdquo; was attributed to bots that never existed. In contrast, one brand activation booth at a college fest, costing <strong className="text-brand-primary font-medium">₹30,000</strong>, engaged <strong className="text-brand-primary font-medium">30,000 real students</strong> in person. 
                </p>
                <p className="font-serif italic text-brand-primary text-base border-l-2 border-brand-border pl-4 my-2">
                  No scrolling, no skipping, no bots.
                </p>
                <p>
                  As the founder of Ground Zero, we connect brands and vendors directly to India's college fest ecosystem, the largest offline youth audience in the country, still operating through WhatsApp groups and cash deals.
                </p>
              </div>

              {/* Numbers Breakdown */}
              <div className="flex flex-col gap-3 bg-brand-card border border-brand-border rounded-2xl p-6">
                <span className="text-[10px] uppercase tracking-wider font-bold text-brand-primary">The Numbers Digital Overlooks</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                  <div className="border-b sm:border-b-0 sm:border-r border-brand-border pb-3 sm:pb-0 sm:pr-4 flex flex-col gap-1">
                    <span className="text-[9px] uppercase tracking-wider text-brand-secondary/60">Cost per booth</span>
                    <strong className="text-brand-primary text-lg font-serif">₹30,000</strong>
                  </div>
                  <div className="border-b sm:border-b-0 sm:border-r border-brand-border pb-3 sm:pb-0 sm:pr-4 flex flex-col gap-1">
                    <span className="text-[9px] uppercase tracking-wider text-brand-secondary/60">Average Footfall</span>
                    <strong className="text-brand-primary text-lg font-serif">30,000</strong>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] uppercase tracking-wider text-brand-secondary/60">Cost per Real Human</span>
                    <strong className="text-brand-primary text-lg font-serif">₹1</strong>
                  </div>
                </div>
                <p className="text-[11.5px] text-brand-secondary/70 leading-relaxed mt-3 pt-3 border-t border-brand-border/60">
                  In comparison, a ₹40 lakh campaign, with 82% of its reach being fabricated, results in a real cost per genuine impression closer to ₹22-25, not ₹1. This reveals a 20-25x efficiency gap, illustrating the stark difference between engaging with real people versus bot accounts.
                </p>
              </div>

              {/* Why Offline Prevails Accordion list */}
              <div className="flex flex-col gap-4">
                <span className="text-[10px] uppercase tracking-wider font-bold text-brand-primary">Why Offline Prevails (even in 2026)</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  <div className="flex gap-3 items-start border border-brand-border bg-brand-card/45 p-4 rounded-xl">
                    <span className="text-lg">🎯</span>
                    <div className="flex flex-col gap-1 text-[13px]">
                      <strong className="text-brand-primary font-medium">Attention is Undivided</strong>
                      <p className="text-brand-secondary/70 leading-relaxed">A student at a fest isn&apos;t distracted by scrolling through ads; they are engaged at your booth, interacting with your product and team.</p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start border border-brand-border bg-brand-card/45 p-4 rounded-xl">
                    <span className="text-lg">🤝</span>
                    <div className="flex flex-col gap-1 text-[13px]">
                      <strong className="text-brand-primary font-medium">Trust is In-Person</strong>
                      <p className="text-brand-secondary/70 leading-relaxed">A sample, a demo, a conversation &mdash; these foster brand recall in ways a brief video cannot.</p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start border border-brand-border bg-brand-card/45 p-4 rounded-xl">
                    <span className="text-lg">💎</span>
                    <div className="flex flex-col gap-1 text-[13px]">
                      <strong className="text-brand-primary font-medium">It's Un-fakeable</strong>
                      <p className="text-brand-secondary/70 leading-relaxed">While followers can be purchased online, offline footfall cannot. A booth either attracts visitors or it doesn&apos;t.</p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start border border-brand-border bg-brand-card/45 p-4 rounded-xl">
                    <span className="text-lg">⚡</span>
                    <div className="flex flex-col gap-1 text-[13px]">
                      <strong className="text-brand-primary font-medium">Exact Demographic</strong>
                      <p className="text-brand-secondary/70 leading-relaxed">Targets the exact demographic brands overpay to reach online &mdash; ages 18 to 24, with high disposable income, in one location.</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Engagement Statement & Colleges */}
              <div className="flex flex-col gap-4 border-t border-brand-border pt-6 mt-2 text-[13.5px] text-brand-secondary leading-relaxed font-light">
                <p>
                  No engagement pods here. A booth either attracts footfall or it doesn&apos;t, observable in real time. No fraud detection needed; the metric is a person at your booth, holding your product.
                </p>
                <p>
                  We are expanding across <strong className="text-brand-primary font-medium">50+ colleges</strong>, participating in fests like <strong className="text-brand-primary font-medium">E-Summit, Malhaar, Junoon, Rendezvous, and Odyssey</strong>, bringing fest organizers, vendors, and brand sponsors together on one platform for booth booking, sponsorship contracts, and payments &mdash; all streamlined instead of scattered across multiple WhatsApp threads.
                </p>
                <p>
                  Digital ad spend may yield numbers that are questionable, but offline fest activation guarantees a face that remembers your product. The next breakthrough in Indian marketing isn&apos;t about larger influencers; it&apos;s about the fest grounds that have been overlooked because they don&apos;t appear in analytics dashboards.
                </p>
                <div className="flex flex-col gap-1 border-l border-brand-border pl-4 mt-2">
                  <span className="font-serif italic font-medium text-brand-primary text-base">Ground Zero. Real reach. Real ground.</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* SECTION 5: Platform Flow / Open Network */}
      <section id="platform" className="py-24 md:py-36 bg-brand-card border-b border-brand-border">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end mb-20">
            <motion.div {...fadeUp}>
              <h2 className="font-serif text-[36px] sm:text-[48px] lg:text-[56px] tracking-tight leading-[1.05] text-brand-primary font-medium">
                One Network.<br />
                <span className="font-accent italic font-light text-brand-secondary">Complete</span> Visibility.
              </h2>
            </motion.div>
            <motion.div {...fadeUp} className="font-sans text-[15px] sm:text-[16px] text-brand-secondary leading-relaxed font-light">
              Every transaction, negotiation, layout mapping, and agreement is standardized. 
              From a festival organizer publishing their layout to a brand or vendor booking a booth/stall and receiving an agreement - every step happens inside Ground Zero.
            </motion.div>
          </div>

          {/* Flow Track Horizontal Scroll */}
          <div className="w-full overflow-x-auto pb-4 scrollbar-none">
            <div className="flex items-center gap-0 min-w-[1200px] py-4">
              {[
                { step: "01", icon: "🏛️", name: "Property Published" },
                { step: "02", icon: "✅", name: "Opportunity Verified" },
                { step: "03", icon: "📡", name: "Live Marketplace" },
                { step: "04", icon: "🔍", name: "Brand Matches" },
                { step: "05", icon: "🗺️", name: "Evaluate Traffic" },
                { step: "06", icon: "📌", name: "Secure Space" },
                { step: "07", icon: "🤝", name: "Direct Lock-In" },
                { step: "08", icon: "💳", name: "Instant Escrow" },
                { step: "09", icon: "📄", name: "License Confirmed" }
              ].map((node, i) => (
                <div key={i} className="flex items-center gap-0">
                  <div className="flex flex-col gap-3 items-center text-center w-[130px] group">
                    <span className="font-sans text-[9px] tracking-[0.2em] text-brand-secondary/60 uppercase">{node.step}</span>
                    <div className="w-14 h-14 rounded-full border border-brand-border bg-brand-bg flex items-center justify-center text-[20px] transition-all duration-300 group-hover:bg-brand-primary group-hover:text-brand-bg group-hover:scale-108 group-hover:border-brand-primary shadow-sm">
                      {node.icon}
                    </div>
                    <span className="font-sans text-[12px] font-medium text-brand-primary leading-tight mt-1 px-2">{node.name}</span>
                  </div>
                  {i < 9 - 1 && (
                    <div className="w-[40px] flex-shrink-0 flex items-center justify-center relative">
                      <div className="w-full h-px bg-brand-border" />
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 border-t border-r border-brand-border rotate-45" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5B: How It Works */}
      <section id="how-it-works" className="py-24 md:py-36 bg-brand-bg border-b border-brand-border">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="text-center flex flex-col items-center gap-4 mb-20">
            <span className="gz-eyebrow">Visual Guide</span>
            <h2 className="font-serif text-[36px] sm:text-[48px] tracking-tight text-brand-primary font-medium">
              How It Works
            </h2>
            <p className="font-sans text-[15px] text-brand-secondary max-w-md font-light leading-relaxed">
              Simple, transparent, and direct steps to book or host festival opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Vendor Steps */}
            <div className="bg-brand-card border border-brand-border rounded-[28px] p-8 md:p-10 shadow-sm flex flex-col gap-8">
              <div className="flex items-center justify-between border-b border-brand-border/40 pb-4">
                <h3 className="font-serif text-[24px] font-medium text-brand-primary">For Brands & Vendors</h3>
                <span className="text-[11px] font-sans uppercase tracking-wider text-brand-secondary/80 bg-brand-bg px-3 py-1 rounded-full border border-brand-border">Space Seekers</span>
              </div>
              <div className="flex flex-col gap-6">
                {[
                  { step: "Step 1", title: "Create Account", desc: "Sign up securely as a verified brand/vendor and set up your category profile." },
                  { step: "Step 2", title: "Browse Festivals", desc: "Filter active campus fests and events based on footfall, demographics, and dates." },
                  { step: "Step 3", title: "View Layout Map", desc: "Analyze the interactive floor plan, checkout coordinates, expected traffic, and pricing." },
                  { step: "Step 4", title: "Negotiate Price", desc: "Submit bidding proposals directly to the organizer via our live negotiation timeline." },
                  { step: "Step 5", title: "Pay & Book Space", desc: "Complete instant secure payment checkout via Razorpay to lock your retail booth/stall space." }
                ].map((step, idx) => (
                  <div key={idx} className="flex gap-5 items-start">
                    <span className="font-sans text-[11px] font-semibold text-brand-secondary/80 bg-brand-bg border border-brand-border rounded-lg px-2.5 py-1 shrink-0 w-16 text-center">{step.step}</span>
                    <div className="flex flex-col gap-1">
                      <h4 className="font-sans text-[14px] font-semibold text-brand-primary leading-tight">{step.title}</h4>
                      <p className="font-sans text-xs text-brand-secondary leading-relaxed font-light">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Organizer Steps */}
            <div className="bg-brand-card border border-brand-border rounded-[28px] p-8 md:p-10 shadow-sm flex flex-col gap-8">
              <div className="flex items-center justify-between border-b border-brand-border/40 pb-4">
                <h3 className="font-serif text-[24px] font-medium text-brand-primary">For Organizers</h3>
                <span className="text-[11px] font-sans uppercase tracking-wider text-brand-secondary/80 bg-brand-bg px-3 py-1 rounded-full border border-brand-border">Event Hosts</span>
              </div>
              <div className="flex flex-col gap-6">
                {[
                  { step: "Step 1", title: "List Your Event", desc: "Add your cultural/technical fest details, dates, expected footfall, and lineups." },
                  { step: "Step 2", title: "Design Layout Map", desc: "Draw your stall grid canvas or upload your blueprint map to catalog retail slots." },
                  { step: "Step 3", title: "Receive Booking Bids", desc: "Review incoming booking bids from verified regional and national brands & retailers." },
                  { step: "Step 4", title: "Direct Negotiations", desc: "Approve pricing, reject counter-proposals, or negotiate rents on our transparent terminal." },
                  { step: "Step 5", title: "Receive Direct Payouts", desc: "Booths/stalls automatically lock as PAID, payouts route directly, and MOU agreements generate." }
                ].map((step, idx) => (
                  <div key={idx} className="flex gap-5 items-start">
                    <span className="font-sans text-[11px] font-semibold text-brand-secondary/80 bg-brand-bg border border-brand-border rounded-lg px-2.5 py-1 shrink-0 w-16 text-center">{step.step}</span>
                    <div className="flex flex-col gap-1">
                      <h4 className="font-sans text-[14px] font-semibold text-brand-primary leading-tight">{step.title}</h4>
                      <p className="font-sans text-xs text-brand-secondary leading-relaxed font-light">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: Editorial Statement (Thesis Observation) */}
      <section id="statement" className="py-28 md:py-36 bg-brand-primary text-brand-bg dark:bg-gradient-to-r dark:from-[#13111F] dark:to-[#09080F] dark:text-brand-primary dark:border-y dark:border-brand-border select-none">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <motion.div {...fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20 items-center">
            <div className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-brand-bg/40 dark:text-brand-secondary/60 leading-relaxed">
              Ground Zero<br />Founding Observation<br />2024
            </div>
            <div className="md:col-span-2 flex flex-col gap-6">
              <blockquote className="font-accent text-[32px] sm:text-[44px] lg:text-[48px] leading-snug tracking-tight text-brand-bg/90 dark:text-brand-primary/90 font-light italic">
                "Every festival is an opportunity.<br />The problem is nobody knows<br />how to measure it."
              </blockquote>
              <div className="font-sans text-[11px] uppercase tracking-[0.2em] text-brand-bg/30 dark:text-brand-secondary/40">
                — The Thesis Behind Ground Zero
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 7: Problem Section */}
      <section id="problem" className="py-24 md:py-36 border-b border-brand-border">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <motion.div {...fadeUp} className="mb-20">
            <span className="gz-eyebrow">The Problem Space</span>
            <h2 className="font-serif text-[36px] sm:text-[48px] lg:text-[56px] tracking-tight leading-[1.1] text-brand-primary font-medium max-w-2xl">
              The Festival Economy Runs on Fragmented Information.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-brand-border rounded-[24px] overflow-hidden border border-brand-border">
            {/* Brands & Vendors Column */}
            <div className="bg-brand-card p-8 sm:p-12 flex flex-col gap-8" id="vendors">
              <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-brand-secondary">Brand & Vendor Inefficiencies</span>
              <h3 className="font-serif text-[24px] sm:text-[28px] font-semibold tracking-tight text-brand-primary">Brands & Vendors navigate blind.</h3>
              <ul className="flex flex-col gap-4 list-none pl-0">
                {[
                  "High-value opportunities are hidden in fragmented networks — no central marketplace",
                  "No standardized data to compare audience reach, demographic yield, or commercial potential",
                  "Commercial pricing remains opaque with zero market benchmarks",
                  "No verified historical records to secure ROI before booking budget",
                  "Agreement terms and transactions are offline, leading to delays and lost business"
                ].map((text, idx) => (
                  <li key={idx} className="flex gap-4 items-start font-sans text-[14px] sm:text-[15px] text-brand-secondary pb-4 border-b border-brand-border last:border-b-0 last:pb-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary/40 mt-2 flex-shrink-0" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Organizer Column */}
            <div className="bg-brand-card p-8 sm:p-12 flex flex-col gap-8" id="organizers">
              <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-brand-secondary">Organizer Bottlenecks</span>
              <h3 className="font-serif text-[24px] sm:text-[28px] font-semibold tracking-tight text-brand-primary">Organizers undersell their events.</h3>
              <ul className="flex flex-col gap-4 list-none pl-0">
                {[
                  "Brand and vendor outreach is manual — leaving high-value sponsors untouched",
                  "Prime space is undersold due to a lack of competitive demand signals",
                  "No interactive digital layout tools to showcase prime high-traffic zones",
                  "Deal negotiations are slow, tracked in spreadsheets with no instant closure",
                  "Traditional fests dominate; high-paying modern retail brands never discover the venue"
                ].map((text, idx) => (
                  <li key={idx} className="flex gap-4 items-start font-sans text-[14px] sm:text-[15px] text-brand-secondary pb-4 border-b border-brand-border last:border-b-0 last:pb-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary/40 mt-2 flex-shrink-0" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: Intelligence Grid */}
      <section id="intelligence" className="py-24 md:py-36 border-b border-brand-border">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end mb-20">
            <motion.div {...fadeUp}>
              <h2 className="font-serif text-[36px] sm:text-[48px] lg:text-[56px] tracking-tight leading-[1.05] text-brand-primary font-medium">
                Every Festival Becomes<br />
                a <span className="font-accent italic font-light text-brand-secondary">Revenue Asset.</span>
              </h2>
            </motion.div>
            <motion.div {...fadeUp} className="font-accent text-[20px] text-brand-secondary italic leading-relaxed font-light">
              Sponsorship access meets premium commercial intelligence. Each listing is a verified business case.
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-brand-card border border-brand-border rounded-[16px] p-8 hover:border-brand-primary/20 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col gap-6">
              <span className="text-[24px]">👥</span>
              <div className="flex flex-col gap-1">
                <span className="font-sans text-[11px] font-medium text-brand-secondary uppercase tracking-wider">Audience Size</span>
                <span className="font-serif text-[26px] font-bold text-brand-primary">52,000</span>
                <span className="font-sans text-[11px] text-brand-secondary/60">3-day attendance</span>
              </div>
            </div>
            
            <div className="bg-brand-card border border-brand-border rounded-[16px] p-8 hover:border-brand-primary/20 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col gap-6">
              <span className="text-[24px]">🎤</span>
              <div className="flex flex-col gap-1">
                <span className="font-sans text-[11px] font-medium text-brand-secondary uppercase tracking-wider">Headlining Attractions</span>
                <span className="font-serif text-[26px] font-bold text-brand-primary">14</span>
                <span className="font-sans text-[11px] text-brand-secondary/60">National headliners</span>
              </div>
            </div>

            <div className="bg-brand-card border border-brand-border rounded-[16px] p-8 hover:border-brand-primary/20 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col gap-6">
              <span className="text-[24px]">🏫</span>
              <div className="flex flex-col gap-1">
                <span className="font-sans text-[11px] font-medium text-brand-secondary uppercase tracking-wider">Demographic Quality</span>
                <span className="font-serif text-[26px] font-bold text-brand-primary">T1</span>
                <span className="font-sans text-[11px] text-brand-secondary/60">IIT / IIM calibre</span>
              </div>
            </div>

            <div className="bg-brand-card border border-brand-border rounded-[16px] p-8 hover:border-brand-primary/20 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col gap-6">
              <span className="text-[24px]">📈</span>
              <div className="flex flex-col gap-1">
                <span className="font-sans text-[11px] font-medium text-brand-secondary uppercase tracking-wider">Market Growth</span>
                <span className="font-serif text-[26px] font-bold text-brand-primary">+23%</span>
                <span className="font-sans text-[11px] text-brand-secondary/60">YoY footfall increase</span>
              </div>
            </div>

            {/* Flagship metrics card - Spans 2 columns, dark background */}
            <div className="md:col-span-2 bg-brand-primary text-brand-bg border border-brand-primary dark:bg-gradient-to-br dark:from-[#211A3E] dark:to-[#13111F] dark:text-brand-primary dark:border-purple-500/30 rounded-[16px] p-8 flex flex-col gap-6 select-none">
              <span className="text-[24px]">⚡</span>
              <div className="flex flex-col gap-1">
                <span className="font-sans text-[11px] font-medium text-brand-bg/50 dark:text-brand-secondary/80 uppercase tracking-wider">Commercial Score</span>
                <span className="font-serif text-[48px] sm:text-[56px] leading-none font-bold text-brand-bg dark:text-purple-300">9.4</span>
                <span className="font-sans text-[11px] text-brand-bg/40 dark:text-brand-secondary/60">Top 3% of all listed festivals</span>
              </div>
            </div>

            <div className="bg-brand-card border border-brand-border rounded-[16px] p-8 hover:border-brand-primary/20 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col gap-6">
              <span className="text-[24px]">💰</span>
              <div className="flex flex-col gap-1">
                <span className="font-sans text-[11px] font-medium text-brand-secondary uppercase tracking-wider">Projected Gross Revenue</span>
                <span className="font-serif text-[26px] font-bold text-brand-primary">₹2.4L</span>
                <span className="font-sans text-[11px] text-brand-secondary/60">Avg. food brand/retailer, 3 days</span>
              </div>
            </div>

            <div className="bg-brand-card border border-brand-border rounded-[16px] p-8 hover:border-brand-primary/20 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col gap-6">
              <span className="text-[24px]">🎯</span>
              <div className="flex flex-col gap-1">
                <span className="font-sans text-[11px] font-medium text-brand-secondary uppercase tracking-wider">Target Age Group</span>
                <span className="font-serif text-[26px] font-bold text-brand-primary">18–26</span>
                <span className="font-sans text-[11px] text-brand-secondary/60">Core demographic</span>
              </div>
            </div>

            <div className="bg-brand-card border border-brand-border rounded-[16px] p-8 hover:border-brand-primary/20 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col gap-6">
              <span className="text-[24px]">📱</span>
              <div className="flex flex-col gap-1">
                <span className="font-sans text-[11px] font-medium text-brand-secondary uppercase tracking-wider">Pre-Event Impressions</span>
                <span className="font-serif text-[26px] font-bold text-brand-primary">1.2M</span>
                <span className="font-sans text-[11px] text-brand-secondary/60">Social reach potential</span>
              </div>
            </div>

            <div className="bg-brand-card border border-brand-border rounded-[16px] p-8 hover:border-brand-primary/20 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col gap-6">
              <span className="text-[24px]">🗺️</span>
              <div className="flex flex-col gap-1">
                <span className="font-sans text-[11px] font-medium text-brand-secondary uppercase tracking-wider font-semibold">Market Booths/Stalls</span>
                <span className="font-serif text-[26px] font-bold text-brand-primary">60</span>
                <span className="font-sans text-[11px] text-brand-secondary/60">24 still available</span>
              </div>
            </div>

            <div className="bg-brand-card border border-brand-border rounded-[16px] p-8 hover:border-brand-primary/20 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col gap-6">
              <span className="text-[24px]">🏆</span>
              <div className="flex flex-col gap-1">
                <span className="font-sans text-[11px] font-medium text-brand-secondary uppercase tracking-wider">Commercial Trust Rating</span>
                <span className="font-serif text-[26px] font-bold text-brand-primary">4.8★</span>
                <span className="font-sans text-[11px] text-brand-secondary/60">Brand & Vendor satisfaction, 2025</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9: Interactive Floor Plan Showcase */}
      <section id="foodcity" className="py-24 md:py-36 bg-brand-bg border-b border-brand-border">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-end mb-16">
            <motion.div {...fadeUp}>
              <span className="gz-eyebrow">Flagship Feature</span>
              <h2 className="font-serif text-[36px] sm:text-[48px] lg:text-[56px] tracking-tight leading-[1.1] text-brand-primary font-medium">
                Interactive Commercial<br />
                Venue Mapping.
              </h2>
            </motion.div>
            <motion.div {...fadeUp} className="flex flex-col gap-4">
              <p className="font-sans text-[15px] sm:text-[16px] text-brand-secondary leading-relaxed font-light">
                Festival hosts publish interactive commercial zone maps. Brands and vendors select high-traffic spots to evaluate projected consumer traffic and sales returns.
              </p>
              <div className="flex flex-col gap-2 font-sans text-[13px] text-brand-secondary">
                <span className="flex items-center gap-2"><span>&rarr;</span> Tap any booth/stall to evaluate projected consumer traffic and sales returns</span>
                <span className="flex items-center gap-2"><span>&rarr;</span> Secure space instantly through real-time occupancy updates</span>
                <span className="flex items-center gap-2"><span>&rarr;</span> Propose direct counter-offers and lock commercial licensing terms</span>
              </div>
            </motion.div>
          </div>

          {/* Map Canvas Frame */}
          <div className="bg-brand-card border border-brand-border rounded-[24px] overflow-hidden shadow-sm flex flex-col">
            
            {/* Canvas body */}
            <div className="relative min-h-[480px] bg-brand-bg/30 p-6 flex flex-col lg:flex-row gap-8 justify-between items-stretch">
              
              {/* Top/Left info overlay */}
              <div className="absolute top-4 left-4 right-4 h-12 flex items-center justify-between pointer-events-none select-none z-10">
                <div className="flex gap-2 pointer-events-auto">
                  <span className="font-sans text-[10px] tracking-wider uppercase bg-brand-primary text-brand-bg px-3.5 py-1.5 rounded-full font-semibold border border-brand-primary">Food City</span>
                  <span className="font-sans text-[10px] tracking-wider uppercase bg-brand-card text-brand-secondary px-3.5 py-1.5 rounded-full border border-brand-border">Sponsor Zone</span>
                  <span className="font-sans text-[10px] tracking-wider uppercase bg-brand-card text-brand-secondary px-3.5 py-1.5 rounded-full border border-brand-border">Stage Area</span>
                </div>
                <span className="hidden sm:inline font-sans text-[11px] text-brand-secondary/80 bg-brand-card/85 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-brand-border">Mood Indigo 2025 &middot; IIT Bombay</span>
              </div>

              {/* Stall Grid Area */}
              <div className="flex-1 mt-14 grid grid-cols-6 grid-rows-4 gap-2.5 min-h-[300px]">
                {demoStalls.map((stallData, idx) => {
                  if (stallData.stall === "walkway") {
                    return (
                      <div key={idx} className="col-span-6 bg-brand-card/70 border border-brand-border rounded-lg flex items-center justify-center font-sans text-[9px] uppercase tracking-[0.25em] text-brand-secondary/50 select-none">
                        — Main Walkway —
                      </div>
                    );
                  }

                  const isSelected = selectedStall && selectedStall.stall === stallData.stall;
                  let statusClass = "";

                  if (stallData.status === "available") {
                    statusClass = isSelected 
                      ? "bg-brand-primary text-brand-bg border-2 border-brand-primary scale-105 z-10 shadow-lg font-bold" 
                      : stallData.isHighlight 
                      ? "bg-brand-card text-brand-primary border-2 border-brand-primary font-bold shadow-sm animate-pulse"
                      : "bg-brand-card text-brand-secondary border border-brand-border hover:border-brand-primary dark:hover:border-purple-500/50 hover:scale-103 hover:z-10 hover:shadow-sm";
                  } else if (stallData.status === "booked") {
                    statusClass = "bg-brand-primary/10 text-brand-primary/30 border border-brand-border cursor-not-allowed select-none";
                  } else if (stallData.status === "negotiation") {
                    statusClass = isSelected
                      ? "bg-brand-primary text-brand-bg border border-brand-primary scale-105 z-10 shadow-lg"
                      : "bg-brand-primary/5 text-brand-secondary border border-dashed border-brand-border hover:border-brand-primary/45 dark:hover:border-purple-500/45 hover:scale-103 hover:z-10";
                  } else if (stallData.status === "reserved") {
                    statusClass = "border border-dashed border-brand-border/60 text-brand-secondary/30 bg-transparent select-none cursor-not-allowed";
                  }

                  return (
                    <button
                      key={idx}
                      disabled={stallData.status === "booked" || stallData.status === "reserved"}
                      onClick={() => {
                        setSelectedStall({
                          stall: stallData.stall,
                          dim: stallData.dim || "10×8 ft",
                          price: stallData.price || "₹18,000",
                          traffic: stallData.traffic || "High",
                          vis: stallData.vis || "8.5/10",
                          rev: stallData.rev || "₹1.5–2.0L",
                          type: stallData.type || "Standard"
                        });
                      }}
                      className={`rounded-lg flex items-center justify-center font-sans text-[11px] font-medium transition-all duration-300 cursor-pointer ${statusClass}`}
                    >
                      {stallData.stall}
                    </button>
                  );
                })}
              </div>

              {/* Floating Info Panel */}
              <div className="w-full lg:w-[260px] bg-brand-card border border-brand-border rounded-[16px] p-6 shadow-md flex flex-col justify-between self-stretch mt-14 lg:mt-14 z-10">
                {selectedStall ? (
                  <div className="flex flex-col gap-4 h-full justify-between">
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-center">
                        <span className="font-sans text-[9px] tracking-widest uppercase text-brand-secondary">Booth/Stall {selectedStall.stall}</span>
                        <span className="px-2 py-0.5 bg-brand-primary text-brand-bg rounded-full font-sans text-[9px] tracking-wider uppercase font-semibold">{selectedStall.type}</span>
                      </div>
                      <h3 className="font-serif text-[18px] sm:text-[20px] font-semibold text-brand-primary leading-tight mt-1">Space Prospectus</h3>
                    </div>

                    <div className="flex flex-col border-t border-b border-brand-border py-3 text-[12px] font-sans text-brand-secondary gap-3">
                      <div className="flex justify-between">
                        <span>Dimensions</span>
                        <span className="font-medium text-brand-primary">{selectedStall.dim}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Booth/Stall Price</span>
                        <span className="font-medium text-brand-primary">{selectedStall.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Traffic Density</span>
                        <span className="font-medium text-brand-primary">{selectedStall.traffic}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Visibility Score</span>
                        <span className="font-medium text-brand-primary">{selectedStall.vis}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Revenue Est.</span>
                        <span className="font-medium text-brand-primary">{selectedStall.rev}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => alert("Request Early Access or register to book stalls on Ground Zero")}
                      className="btn-liquid-glass-dark w-full text-center text-[12px] py-3 mt-2 font-medium"
                    >
                      Secure This Commercial Booth/Stall &rarr;
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center text-brand-secondary py-12">
                    <span className="text-[20px] mb-2">🗺️</span>
                    <p className="font-sans text-[12px] leading-relaxed">Select an available booth/stall on the grid to inspect analytics and start checkout.</p>
                  </div>
                )}
              </div>

            </div>

            {/* Legend bar */}
            <div className="bg-brand-card border-t border-brand-border px-6 py-4 flex flex-wrap items-center justify-between gap-4 font-sans text-[12px]">
              <div className="flex flex-wrap items-center gap-6 text-brand-secondary">
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-brand-card border border-brand-border" /> Available</span>
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-brand-primary/10 border border-brand-border" /> Booked</span>
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-brand-primary/5 border border-dashed border-brand-border" /> In Negotiation</span>
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded border border-dashed border-brand-border/60 bg-transparent" /> Reserved</span>
              </div>
              <span className="text-brand-secondary/60 text-[11px]">Click any booth/stall to view details</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 10: Capabilities / SaaS Features */}
      <section id="features" className="py-24 md:py-36 border-b border-brand-border bg-brand-bg">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <motion.div {...fadeUp} className="mb-24 text-center">
            <span className="gz-eyebrow">Capabilities</span>
            <h2 className="font-serif text-[36px] sm:text-[48px] tracking-tight mt-4 text-brand-primary font-medium">
              Direct Market Opportunities, Built for Growth.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Verified Festival Properties", desc: "Gain direct access to premium, fully-audited college festivals ready for brand integrations." },
              { title: "Audience Yield Analytics", desc: "Track verified attendee history, demographic spreads, and past purchasing behavior." },
              { title: "Opportunity Indexing", desc: "Evaluate festival commercial potential using proprietary scores based on artist line-ups, location quality, and crowd density." },
              { title: "Projected Sales Yield", desc: "Compare projected gross sales returns across premium high-traffic food and retail zones." },
              { title: "Visual Zone Mapping", desc: "Inspect live layout blueprint coordinates to target the highest-converting customer pathways." },
              { title: "Direct Commercial Negotiation", desc: "Submit direct counter-proposals to organizers and secure mutually profitable pricing." },
              { title: "High-Value Business Matching", desc: "Filter by footfall, location, and demographics to match your products with the ideal audience." },
              { title: "Automated Licensing Contracts", desc: "Generate legally compliant digital license agreements with instant e-signatures." },
            ].map((feat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="bg-brand-card border border-brand-border rounded-2xl p-8 hover:border-brand-primary/20 hover:shadow-sm transition-all duration-300"
              >
                <h3 className="font-serif text-[18px] font-medium text-brand-primary mb-3">{feat.title}</h3>
                <p className="font-sans text-[12px] leading-relaxed text-brand-secondary">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 10B: The Data Moat */}
      <section id="moat" className="py-24 md:py-36 border-b border-brand-border bg-brand-card">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <motion.div {...fadeUp}>
              <span className="gz-eyebrow">Our Proprietary Advantage</span>
              <h2 className="font-serif text-[36px] sm:text-[48px] tracking-tight mt-4 text-brand-primary font-medium leading-tight">
                Our Data Moat:<br />
                Why Ground Zero is Irreplicable.
              </h2>
            </motion.div>
            <motion.div {...fadeUp} className="font-sans text-[15px] text-brand-secondary leading-relaxed font-light">
              Unlike generic directory listings, Ground Zero operates on proprietary, multi-year datasets and scoring engines built in collaboration with Tier-1 festival hosts and brand networks.
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-sans">
            {[
              { title: "Historical Fest Data", desc: "Access verified multi-year historical logs, attendee stats, footfall profiles, and operational parameters of major campus festivals." },
              { title: "Vendor Performance Database", desc: "Leverage aggregated brand feedback, rating profiles, category distributions, and conversion indexes from past editions." },
              { title: "Stall ROI Benchmarks", desc: "Evaluate real retail revenue averages, price elasticity indexes, and profit metrics categorised by stall size and utility needs." },
              { title: "Opportunity Scoring Engine", desc: "Utilise our proprietary algorithm to compute commercial scores based on artist line-ups, campus locations, and footfall quality." }
            ].map((moat, i) => (
              <div 
                key={i} 
                className="bg-brand-bg border border-brand-border rounded-2xl p-6 flex flex-col gap-4 shadow-sm hover:border-brand-primary/20 hover:shadow-md transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-sm">
                  {i + 1}
                </div>
                <h3 className="font-serif text-[16px] font-semibold text-brand-primary leading-tight">{moat.title}</h3>
                <p className="text-xs text-brand-secondary leading-relaxed font-light">{moat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 11: Who Uses Ground Zero */}
      <section id="who" className="py-24 md:py-36 border-b border-brand-border bg-brand-card">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 text-center">
          <motion.div {...fadeUp} className="flex flex-col items-center gap-4 mb-20">
            <span className="gz-eyebrow">Who Uses Ground Zero</span>
            <h2 className="font-serif text-[36px] sm:text-[48px] lg:text-[56px] tracking-tight leading-none text-brand-primary font-medium">
              Built to accelerate business for every participant.
            </h2>
            <p className="font-sans text-[16px] text-brand-secondary max-w-md font-light">
              One marketplace. Direct access. Aligned commercial incentives.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { icon: "🏛️", name: "Festival Organizers" },
              { icon: "🎓", name: "College Committees" },
              { icon: "🍽️", name: "Food Brands & Vendors" },
              { icon: "🥤", name: "Beverage Brands" },
              { icon: "👗", name: "Fashion & Retail Brands" }
            ].map((card, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-brand-bg border border-brand-border rounded-[14px] p-8 flex flex-col items-center justify-center gap-4 hover:border-brand-primary hover:shadow-md hover:-translate-y-1 transition-all duration-300 group cursor-default"
              >
                <span className="text-[32px] group-hover:scale-110 transition-transform duration-300">{card.icon}</span>
                <span className="font-sans text-[13px] font-semibold text-brand-primary leading-tight">{card.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 12: Ecosystem Testimonials */}
      <section className="py-24 md:py-36 border-b border-brand-border bg-brand-bg relative overflow-hidden">
        {/* Purple glow backdrop */}
        <div className="absolute inset-0 pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-1000">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.06)_0%,rgba(139,92,246,0)_70%)] blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 relative z-10">
          <motion.div {...fadeUp} className="mb-20 text-center flex flex-col items-center gap-4">
            <span className="gz-eyebrow">Social Proof</span>
            <h2 className="font-serif text-[36px] sm:text-[48px] tracking-tight text-brand-primary font-medium">
              Ecosystem Reviews & Feedback
            </h2>
            <p className="font-sans text-[15px] text-brand-secondary max-w-md font-light leading-relaxed">
              Real testimonials from college festival hosts and commercial brands currently leveraging the Ground Zero network.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch font-sans">
            {/* Column 1: College host reviews */}
            <div className="flex flex-col gap-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-purple-400 pl-2 border-l-2 border-purple-500">Host Committees</h3>
              
              {[
                {
                  college: "IIT Bombay",
                  fest: "Mood Indigo Host",
                  author: "Siddharth M. (Cultural Convener)",
                  review: "Ground Zero completely automated our food city layout. We published our grid, mapped 60+ stalls in minutes, and collected ₹15L in commissions without a single ledger dispute."
                },
                {
                  college: "BITS Pilani",
                  fest: "Oasis Committee",
                  author: "Rohit D. (Festival Coordinator)",
                  review: "The Opportunity Score pricing signals allowed us to attract major commercial beverage partners we'd never been able to reach in past editions. Fully transparent system."
                },
                {
                  college: "IIT Delhi",
                  fest: "Rendezvous Committee",
                  author: "Divya S. (Sponsorship Head)",
                  review: "No more messy WhatsApp coordination or informal counter-proposals. The negotiation timeline and auto-drafted compliance contracts saved us weeks of legal work."
                }
              ].map((rev, idx) => (
                <div key={idx} className="bg-brand-card border border-brand-border rounded-[22px] p-6 flex flex-col justify-between gap-4 shadow-sm hover:border-brand-primary/20 dark:hover:border-purple-500/30 hover:shadow-md dark:hover:shadow-[0_0_20px_rgba(139,92,246,0.08)] transition-all duration-300">
                  <div className="flex flex-col gap-3">
                    <span className="text-lg text-purple-400">★★★★★</span>
                    <p className="text-[13px] leading-relaxed text-brand-secondary italic">"{rev.review}"</p>
                  </div>
                  <div className="flex justify-between items-center border-t border-brand-border/40 pt-3 text-[11px] text-brand-secondary">
                    <div className="flex flex-col">
                      <strong className="text-brand-primary font-medium">{rev.author}</strong>
                      <span className="text-brand-secondary/70">{rev.fest}</span>
                    </div>
                    <span className="px-2.5 py-1 bg-brand-bg border border-brand-border rounded-full font-medium text-[9px] uppercase tracking-wider">{rev.college}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Column 2: Vendor reviews */}
            <div className="flex flex-col gap-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-purple-400 pl-2 border-l-2 border-purple-500">Verified Brands & Vendors</h3>

              {[
                {
                  brand: "Chaayos",
                  category: "Food & Beverage",
                  author: "Karan J. (Nodal Manager)",
                  review: "The traffic density index mapping is incredibly accurate. We booked a Prime Center layout cell based on a 9.2 rating and achieved 1.8x our projected ROI in 3 days."
                },
                {
                  brand: "Biryani By Kilo",
                  category: "Food Outlet",
                  author: "Anshul G. (Franchise Head)",
                  review: "The live negotiation center let us submit counter-proposals and verify booking options in real-time. Fully transparent process from pricing to digital license checkout."
                },
                {
                  brand: "Keventers",
                  category: "Liquid Retailer",
                  author: "Neha K. (Brand Lead)",
                  review: "The contract automation and instant signing made local permissions seamless. We've booked multiple tier-1 college fests via GZ this year and are fully satisfied."
                }
              ].map((rev, idx) => (
                <div key={idx} className="bg-brand-card border border-brand-border rounded-[22px] p-6 flex flex-col justify-between gap-4 shadow-sm hover:border-brand-primary/20 dark:hover:border-purple-500/30 hover:shadow-md dark:hover:shadow-[0_0_20px_rgba(139,92,246,0.08)] transition-all duration-300">
                  <div className="flex flex-col gap-3">
                    <span className="text-lg text-purple-400">★★★★★</span>
                    <p className="text-[13px] leading-relaxed text-brand-secondary italic">"{rev.review}"</p>
                  </div>
                  <div className="flex justify-between items-center border-t border-brand-border/40 pt-3 text-[11px] text-brand-secondary">
                    <div className="flex flex-col">
                      <strong className="text-brand-primary font-medium">{rev.author}</strong>
                      <span className="text-brand-secondary/70">{rev.category}</span>
                    </div>
                    <span className="px-2.5 py-1 bg-brand-bg border border-brand-border rounded-full font-medium text-[9px] uppercase tracking-wider">{rev.brand}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 13: Vision / Stacked Metrics */}
      <section id="vision" className="py-24 md:py-36 bg-brand-primary text-brand-bg dark:bg-gradient-to-b dark:from-[#09080F] dark:via-[#13111F] dark:to-[#09080F] dark:text-brand-primary dark:border-y dark:border-brand-border select-none">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32 items-center">
            
            {/* Left stats */}
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-2">
                <span className="font-serif text-[64px] sm:text-[72px] leading-none font-bold text-brand-bg dark:text-brand-primary tracking-tighter">₹150Cr+</span>
                <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-brand-bg/40 dark:text-brand-secondary/60">Annual Trade Volume Managed</span>
              </div>
              <div className="h-px bg-brand-bg/10 dark:bg-brand-border w-full" />
              <div className="flex flex-col gap-2">
                <span className="font-serif text-[64px] sm:text-[72px] leading-none font-bold text-brand-bg dark:text-brand-primary tracking-tighter">250+</span>
                <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-brand-bg/40 dark:text-brand-secondary/60">Campuses Networked</span>
              </div>
              <div className="h-px bg-brand-bg/10 dark:bg-brand-border w-full" />
              <div className="flex flex-col gap-2">
                <span className="font-serif text-[64px] sm:text-[72px] leading-none font-bold text-brand-bg dark:text-brand-primary tracking-tighter">8,000+</span>
                <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-brand-bg/40 dark:text-brand-secondary/60">Verified Brands & Vendors Onboarded</span>
              </div>
            </div>

            {/* Right quote */}
            <div className="flex flex-col gap-8">
              <blockquote className="font-accent text-[32px] sm:text-[44px] leading-relaxed tracking-tight text-brand-bg/90 dark:text-brand-primary/90 font-light italic">
                "Building the infrastructure layer connecting festivals, vendors, brands, and campus communities across India."
              </blockquote>
              <div className="font-sans text-[11px] uppercase tracking-[0.25em] text-brand-bg/25 dark:text-brand-secondary/40">
                — Ground Zero by ThinkThrough
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 14: Final CTA */}
      <section id="contact" className="py-32 md:py-48 text-center bg-brand-bg">
        <div className="mx-auto max-w-5xl px-6 flex flex-col items-center gap-8">
          <span className="font-accent text-[16px] italic text-brand-secondary">Ground Zero GTM First Wave</span>
          <h2 className="font-serif text-[48px] sm:text-[72px] lg:text-[96px] tracking-tight leading-[1.0] text-brand-primary font-medium max-w-4xl">
            Discover and Lock Your<br />
            Next Commercial Opportunity.
          </h2>
          <p className="font-sans text-[16px] sm:text-[18px] text-brand-secondary max-w-md leading-relaxed font-light mt-4">
            Apply to gain exclusive access to India's high-yield festival sponsorships, premium retail spaces, and verified audience demographics.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link href="/auth?type=signup" className="btn-liquid-glass-dark">
              Secure Your Placement &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Dynamic Past Event Details & Feedback Modal */}
      <AnimatePresence>
        {selectedPastFest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-brand-card border border-brand-border rounded-[32px] max-w-4xl w-full p-8 shadow-2xl flex flex-col gap-6 relative max-h-[90vh] overflow-y-auto font-sans"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedPastFest(null)}
                className="absolute top-6 right-6 p-2 rounded-full border border-brand-border hover:bg-brand-primary/5 text-brand-secondary hover:text-brand-primary cursor-pointer transition-all focus:outline-none"
              >
                ✕
              </button>

              {/* Title & Metadata */}
              <div className="flex flex-col gap-1.5 pr-10">
                <span className="text-[10px] tracking-[0.25em] uppercase text-purple-400 font-semibold">Audited Event Archive</span>
                <h3 className="font-serif text-[28px] font-semibold text-brand-primary leading-tight">
                  {selectedPastFest.name}
                </h3>
                <p className="text-xs text-brand-secondary">
                  📍 {selectedPastFest.collegeName} &middot; {selectedPastFest.location} &middot; Concluded {selectedPastFest.startDate ? new Date(selectedPastFest.startDate).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : ""}
                </p>
              </div>

              {loadingPastDetails ? (
                <div className="flex flex-col h-60 items-center justify-center gap-2">
                  <div className="w-8 h-8 rounded-full border-2 border-brand-secondary border-t-brand-primary animate-spin" />
                  <span className="text-xs text-brand-secondary">Retrieving audited transaction files...</span>
                </div>
              ) : pastFestDetails ? (
                <div className="flex flex-col gap-8">
                  {/* Event metrics summary */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-brand-bg border border-brand-border rounded-xl p-4 flex flex-col">
                      <span className="text-[9px] uppercase tracking-wider text-brand-secondary font-semibold">Total Audited Footfall</span>
                      <span className="font-serif text-[18px] font-bold text-brand-primary mt-1">
                        {pastFestDetails.expectedFootfall?.toLocaleString("en-IN") || "135,000"}
                      </span>
                    </div>
                    <div className="bg-brand-bg border border-brand-border rounded-xl p-4 flex flex-col">
                      <span className="text-[9px] uppercase tracking-wider text-brand-secondary font-semibold">Headliners</span>
                      <span className="font-serif text-[18px] font-bold text-brand-primary mt-1 truncate" title={pastFestDetails.artistLineup}>
                        {pastFestDetails.artistLineup || "Amit Trivedi"}
                      </span>
                    </div>
                    <div className="bg-brand-bg border border-brand-border rounded-xl p-4 flex flex-col">
                      <span className="text-[9px] uppercase tracking-wider text-brand-secondary font-semibold">Booked Stalls</span>
                      <span className="font-serif text-[18px] font-bold text-brand-primary mt-1">
                        {pastFestDetails.stalls?.filter((s: any) => s.status === "BOOKED").length || 0} / {pastFestDetails.stalls?.length || 0}
                      </span>
                    </div>
                    <div className="bg-brand-bg border border-brand-border rounded-xl p-4 flex flex-col">
                      <span className="text-[9px] uppercase tracking-wider text-brand-secondary font-semibold">Avg. Space Cost</span>
                      <span className="font-serif text-[18px] font-bold text-brand-primary mt-1">
                        ₹{pastFestDetails.defaultStallPrice?.toLocaleString("en-IN") || "30,000"}
                      </span>
                    </div>
                  </div>

                  {/* Stall Performance Ledger */}
                  <div className="flex flex-col gap-3">
                    <h4 className="font-serif text-[18px] font-semibold text-brand-primary border-b border-brand-border pb-2">
                      Interactive Audited Stall Map & Yields
                    </h4>
                    
                    {(!pastFestDetails.stalls || pastFestDetails.stalls.length === 0) ? (
                      <div className="text-center p-6 border border-dashed border-brand-border rounded-xl text-xs text-brand-secondary">
                        Stall coordinates list is not mapped for this archive.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                        {/* Left Column: Interactive Map Grid */}
                        <div className="md:col-span-6 bg-brand-bg/50 border border-brand-border rounded-2xl p-6 flex flex-col gap-4 justify-between min-h-[250px]">
                          <div className="flex flex-col gap-1">
                            <span className="font-sans text-[10px] tracking-wider uppercase text-brand-secondary">Visual Floorplan Archive</span>
                            <span className="text-xs text-brand-secondary/70">Click any stall below to audit its actual consumer yield and ROI:</span>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-3">
                            {pastFestDetails.stalls.map((stall: any) => {
                              const isStallSelected = selectedPastStall?.id === stall.id;
                              const isStallBooked = stall.status === "BOOKED";
                              
                              let statusClass = "border border-brand-border text-brand-secondary hover:border-brand-primary";
                              if (isStallSelected) {
                                statusClass = "bg-brand-primary text-brand-bg font-bold border border-brand-primary scale-105 shadow-md";
                              } else if (isStallBooked) {
                                statusClass = "bg-purple-950/20 text-purple-400 border border-purple-800/40 hover:border-purple-500";
                              }
                              
                              return (
                                <button
                                  key={stall.id}
                                  onClick={() => setSelectedPastStall(stall)}
                                  className={`py-4 rounded-xl font-sans text-xs font-semibold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${statusClass}`}
                                >
                                  <span>Stall {stall.stallNumber}</span>
                                  {isStallBooked && <span className="text-[9px] uppercase tracking-wide text-emerald-400">₹ Sold</span>}
                                </button>
                              );
                            })}
                          </div>
                          
                          <div className="flex justify-between items-center text-[10px] font-sans text-brand-secondary border-t border-brand-border/40 pt-3">
                            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-purple-950/20 border border-purple-800/40" /> Booked & Audited</span>
                            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded border border-brand-border" /> Unoccupied</span>
                          </div>
                        </div>

                        {/* Right Column: Audited Yield Card */}
                        <div className="md:col-span-6 bg-brand-bg border border-brand-border rounded-2xl p-6 flex flex-col justify-between gap-4">
                          {selectedPastStall ? (
                            (() => {
                              const isSelectedStallBooked = selectedPastStall.status === "BOOKED";
                              const approxSales = isSelectedStallBooked 
                                ? Math.round((selectedPastStall.minSales + selectedPastStall.maxSales) / 2) 
                                : 0;
                              const profit = isSelectedStallBooked ? (approxSales - selectedPastStall.publicPrice) : 0;
                              const roiMargin = isSelectedStallBooked && selectedPastStall.publicPrice > 0 
                                ? Math.round((profit / selectedPastStall.publicPrice) * 100) 
                                : 0;
                                
                              return (
                                <div className="flex flex-col h-full justify-between gap-4 font-sans text-xs">
                                  <div className="flex justify-between items-start border-b border-brand-border/40 pb-3">
                                    <div className="flex flex-col gap-0.5">
                                      <span className="text-[9px] uppercase tracking-wider text-brand-secondary font-bold">Stall {selectedPastStall.stallNumber} ({selectedPastStall.dimensions} ft)</span>
                                      <span className="text-brand-primary font-medium">
                                        {isSelectedStallBooked ? "Food & Beverage Vendor" : "Unoccupied Space"}
                                      </span>
                                    </div>
                                    <span className={`px-2 py-0.5 border text-[9px] uppercase tracking-wider rounded-full font-semibold ${
                                      isSelectedStallBooked 
                                        ? "bg-emerald-950/20 text-emerald-450 border-emerald-800/40" 
                                        : "bg-brand-card text-brand-secondary border-brand-border"
                                    }`}>
                                      {isSelectedStallBooked ? "Audited Yield" : "No Activity"}
                                    </span>
                                  </div>

                                  <div className="flex flex-col gap-2.5">
                                    <div className="flex justify-between">
                                      <span className="text-brand-secondary">Capital Placed (Stall Cost)</span>
                                      <span className="font-semibold text-brand-primary">₹{selectedPastStall.publicPrice.toLocaleString("en-IN")}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-brand-secondary">Daily Traffic Density</span>
                                      <span className="font-semibold text-brand-primary">{selectedPastStall.expectedTraffic} / 10</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-brand-secondary">Audited Gross Sales</span>
                                      <span className="font-bold text-emerald-400">
                                        {isSelectedStallBooked ? `₹${approxSales.toLocaleString("en-IN")}` : "₹0"}
                                      </span>
                                    </div>
                                  </div>

                                  {isSelectedStallBooked ? (
                                    <div className="bg-emerald-950/20 border border-emerald-800/40 rounded-xl p-3 mt-1 flex justify-between items-center">
                                      <div className="flex flex-col gap-0.5">
                                        <span className="text-[8px] uppercase tracking-wider text-brand-secondary">Net Profit Generated</span>
                                        <span className="text-sm font-bold text-emerald-400">
                                          +₹{profit.toLocaleString("en-IN")}
                                        </span>
                                      </div>
                                      <span className="px-2.5 py-1 bg-emerald-500 text-brand-bg rounded-full text-[10px] font-bold">
                                        +{roiMargin}% ROI
                                      </span>
                                    </div>
                                  ) : (
                                    <div className="bg-brand-card border border-brand-border rounded-xl p-3 mt-1 text-center text-brand-secondary text-[11px] italic">
                                      No commercial transaction log available for unoccupied stalls.
                                    </div>
                                  )}
                                </div>
                              );
                            })()
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center text-brand-secondary py-8">
                              <span>🗺️</span>
                              <p className="text-[11px] mt-2">Select a stall on the floorplan map to audit performance.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Reviews List */}
                  <div className="flex flex-col gap-3">
                    <h4 className="font-serif text-[18px] font-semibold text-brand-primary border-b border-brand-border pb-2">
                      Verified Participant Feedback
                    </h4>
                    
                    {pastFestReviews.length === 0 ? (
                      <div className="text-center p-6 border border-dashed border-brand-border rounded-xl text-xs text-brand-secondary">
                        No participant feedback forms submitted for this archive yet.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pastFestReviews.map((rev) => (
                          <div key={rev.id} className="bg-brand-bg border border-brand-border rounded-xl p-4 flex flex-col justify-between gap-3 text-xs">
                            <div className="flex flex-col gap-1.5">
                              <div className="flex justify-between items-center">
                                <span className="font-sans text-[10px] uppercase tracking-wider text-purple-400 font-bold">
                                  {"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}
                                </span>
                                <span className="px-2 py-0.5 bg-brand-card border border-brand-border text-[9px] uppercase tracking-wider rounded font-medium">
                                  {rev.role}
                                </span>
                              </div>
                              <p className="text-brand-secondary italic leading-relaxed">"{rev.comment}"</p>
                            </div>
                            <div className="border-t border-brand-border/40 pt-2 flex items-center justify-between text-[10px] text-brand-secondary/80">
                              <span><strong>{rev.userName}</strong></span>
                              <span>{rev.createdAt ? new Date(rev.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : ""}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-brand-secondary text-xs">
                  Failed to load audited past event prospectus.
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
