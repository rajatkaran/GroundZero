"use client";

import { useState, useEffect } from "react";
import { Quote, MapPin, Coffee, Shirt, ShoppingBag, Target } from "lucide-react";
import Link from "next/link";

const sampleFestivals = [
  {
    id: "nsut",
    name: "Garba Night — NSUT Delhi",
    location: "New Delhi",
    footfall: 45000,
    stallRent: 25000,
    testimonial: "We saw 3x our usual footfall conversion here.",
    brand: "Wow Momo",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1200"
  },
  {
    id: "iitb",
    name: "Mood Indigo — IIT Bombay",
    location: "Mumbai",
    footfall: 140000,
    stallRent: 60000,
    testimonial: "The crowd volume is unmatched. Best ROI we've seen all year.",
    brand: "Bira 91",
    image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1200"
  },
  {
    id: "iitd",
    name: "Rendezvous — IIT Delhi",
    location: "New Delhi",
    footfall: 90000,
    stallRent: 45000,
    testimonial: "Perfect demographic fit. We sold out by day two.",
    brand: "Chaayos",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200"
  },
  {
    id: "bhu",
    name: "Kashiyatra — BHU",
    location: "Varanasi",
    footfall: 65000,
    stallRent: 30000,
    testimonial: "Incredible engagement from students across North India.",
    brand: "The Burger Club",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200"
  },
  {
    id: "vit",
    name: "Riviera — VIT Vellore",
    location: "Vellore",
    footfall: 40000,
    stallRent: 35000,
    testimonial: "Highly organized layout resulted in non-stop customer flow.",
    brand: "Belgian Waffle Co.",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200"
  }
];

export default function FestivalStallYieldEstimator() {
  const [selectedFestId, setSelectedFestId] = useState(sampleFestivals[0].id);
  
  const [estCategory, setEstCategory] = useState<"FOOD" | "FASHION" | "MERCHANDISE" | "GAMING">("FOOD");
  const [estConversionRate, setEstConversionRate] = useState(4.5);
  const [estStallRent, setEstStallRent] = useState(sampleFestivals[0].stallRent);
  const [estTicketSize, setEstTicketSize] = useState(450);
  const [estDailyOpCost, setEstDailyOpCost] = useState(8000);
  const [estDuration, setEstDuration] = useState(3);
  const [estFootfall, setEstFootfall] = useState(sampleFestivals[0].footfall);
  
  // Calculate derived values
  const [estDailyCustomers, setEstDailyCustomers] = useState(Math.round(sampleFestivals[0].footfall * (4.5 / 100)));

  // When selected festival changes, update the relevant fields
  useEffect(() => {
    const fest = sampleFestivals.find(f => f.id === selectedFestId);
    if (fest) {
      setEstFootfall(fest.footfall);
      setEstStallRent(fest.stallRent);
      setEstDailyCustomers(Math.round(fest.footfall * (estConversionRate / 100)));
    }
  }, [selectedFestId]);

  const selectedFest = sampleFestivals.find(f => f.id === selectedFestId) || sampleFestivals[0];

  return (
    <section id="vendor-estimator" className="py-24 md:py-36 border-b border-brand-border bg-brand-card">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Revenue Estimator Header */}
        <div className="mb-12 text-center flex flex-col items-center gap-3">
          <span className="gz-eyebrow">Interactive Planning</span>
          <h3 className="font-serif text-[28px] sm:text-[36px] tracking-tight text-brand-primary font-medium">
            Land Your Perfect Stall Space
          </h3>
          <p className="font-sans text-[14px] text-brand-secondary max-w-lg font-light leading-relaxed">
            Estimate potential retail earnings, space booking overheads, cost of goods sold, and projected net profit margins for your brand at specific festivals.
          </p>
        </div>

        {/* Festival Selector */}
        <div className="flex overflow-x-auto gap-3 pb-6 mb-6 scrollbar-none snap-x snap-mandatory justify-start md:justify-center">
          {sampleFestivals.map((fest) => (
            <button
              key={fest.id}
              onClick={() => setSelectedFestId(fest.id)}
              className={`flex-shrink-0 snap-center px-5 py-2.5 rounded-full font-sans text-[13px] font-medium transition-all duration-300 border ${
                selectedFestId === fest.id
                  ? "bg-purple-500/20 border-purple-500/50 text-brand-primary shadow-[0_0_15px_rgba(139,92,246,0.15)]"
                  : "bg-brand-bg border-brand-border text-brand-secondary hover:border-brand-primary/30 hover:text-brand-primary"
              }`}
            >
              {fest.name}
            </button>
          ))}
        </div>

        {/* Selected Festival Context Panel */}
        <div className="mb-10 max-w-4xl mx-auto">
          <div className="bg-purple-900/10 border border-purple-500/20 rounded-[24px] overflow-hidden flex flex-col sm:flex-row">
            <div className="w-full sm:w-2/5 h-48 sm:h-auto relative">
              <img src={selectedFest.image} alt={selectedFest.name} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-5">
                <span className="text-white font-serif font-bold text-lg leading-tight">{selectedFest.name.split(' — ')[0]}</span>
                <span className="text-brand-secondary/90 text-xs flex items-center gap-1 mt-1"><MapPin size={12} className="text-purple-400" /> {selectedFest.location}</span>
              </div>
            </div>
            <div className="w-full sm:w-3/5 p-6 sm:p-8 flex gap-4 items-start">
              <Quote className="text-purple-400 opacity-50 flex-shrink-0" size={24} />
              <div className="flex flex-col gap-3 justify-center h-full">
                <p className="font-serif text-[16px] md:text-[18px] text-brand-primary italic leading-relaxed">
                  "{selectedFest.testimonial}"
                </p>
                <span className="font-sans text-[12px] font-bold tracking-wider uppercase text-purple-400">
                  — {selectedFest.brand}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-brand-bg border border-brand-border rounded-[28px] p-8 sm:p-12 shadow-md grid grid-cols-1 md:grid-cols-12 gap-10 font-sans">
          {/* Controls Panel */}
          <div className="md:col-span-7 flex flex-col gap-6">
            {/* Category */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-wider font-semibold text-brand-secondary">Stall Category</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: "FOOD", label: "F&B / Food", rate: 4.5, icon: <Coffee size={14} /> },
                  { id: "FASHION", label: "Apparel", rate: 2.0, icon: <Shirt size={14} /> },
                  { id: "MERCHANDISE", label: "Merchandise", rate: 1.5, icon: <ShoppingBag size={14} /> },
                  { id: "GAMING", label: "Activations", rate: 1.0, icon: <Target size={14} /> }
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
                    className={`py-3 px-4 rounded-xl border text-center font-medium transition-all cursor-pointer flex items-center justify-center gap-2 ${estCategory === cat.id
                        ? "bg-brand-primary text-brand-bg border-brand-primary"
                        : "border-brand-border bg-brand-card text-brand-secondary hover:text-brand-primary"
                      }`}
                  >
                    {cat.icon}
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
  );
}
