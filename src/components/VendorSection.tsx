"use client";

import React from "react";
import { motion } from "framer-motion";
import { XCircle, CheckCircle2, Search, CalendarCheck, MapPin, Calculator, Rocket } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import oldIllustration from "../../public/illustration/illustration-old.png";
import newIllustration from "../../public/illustration/illustration-new.png";

export default function VendorSection() {
  const oldWayItems = [
    "Search multiple sources",
    "Contact POCs & wait",
    "No price transparency",
    "Unclear footfall & profits",
    "High risk, low predictability"
  ];

  const gzWayItems = [
    "All events on one platform",
    "Live map & real-time availability",
    "Transparent bidding — you decide",
    "Last year data & footfall insights",
    "Revenue calculator for profit estimate",
    "Book with confidence & grow"
  ];

  const steps = [
    { icon: <Search size={24} className="text-white" />, label: "1. DISCOVER", desc: "Find events near you with filters & insights" },
    { icon: <CalendarCheck size={24} className="text-white" />, label: "2. SELECT", desc: "Choose events that fit your menu & capacity" },
    { icon: <MapPin size={24} className="text-white" />, label: "3. BID", desc: "View stall location on map & bid your best price" },
    { icon: <Calculator size={24} className="text-white" />, label: "4. CALCULATE", desc: "Use revenue calculator to estimate profitability" },
    { icon: <Rocket size={24} className="text-white" />, label: "5. BOOK & GROW", desc: "Book the stall, prepare & serve thousands!" }
  ];

  return (
    <section id="vendor-comparison-section" className="py-12 md:py-20 bg-brand-bg relative w-full overflow-hidden border-t border-brand-border mt-8">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8 w-full flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div className="flex flex-col text-left">
            <h2 className="font-serif text-[24px] sm:text-[30px] tracking-tight text-brand-primary font-medium max-w-2xl">
              Land your stalls at ease with Ground Zero
            </h2>
          </div>
          
          <div className="flex flex-col items-start md:items-end text-left md:text-right shrink-0">
            <p className="font-serif italic text-brand-secondary/80 text-sm mb-3">
              "Join us for more revenue"
            </p>
            <Link href="/auth?type=login" className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-white px-8 py-2.5 text-white transition-all duration-300">
              <span className="absolute inset-0 bg-white translate-y-[100%] transition-transform duration-300 ease-out group-hover:translate-y-0" />
              <span className="relative z-10 font-sans font-bold text-[13px] uppercase tracking-wider group-hover:text-[#09080F] transition-colors duration-300">
                Log In
              </span>
            </Link>
          </div>
        </motion.div>

        {/* SECTION 1: THE OLD WAY vs THE GROUND ZERO WAY */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 w-full"
        >
          <div className="flex flex-col lg:flex-row items-stretch justify-center relative gap-6 lg:gap-0">

            {/* Left Card - The Old Way */}
            <div className="lg:w-1/2 bg-[#2d1b2e]/40 border border-red-900/30 rounded-[20px] p-5 md:p-6 lg:rounded-r-none relative z-0 flex justify-between">
              <div className="flex flex-col flex-1 pr-4">
                <h3 className="font-serif text-lg md:text-xl text-red-400 font-bold mb-1 uppercase text-center md:text-left">
                  THE OLD WAY
                </h3>
                <p className="font-sans text-brand-secondary/80 text-[11px] md:text-xs mb-4 text-center md:text-left">
                  Time consuming. Uncertain. Risky.
                </p>
                <ul className="space-y-2.5">
                  {oldWayItems.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <XCircle size={14} className="text-red-500 shrink-0" />
                      <span className="font-sans text-brand-secondary/90 text-[11px] md:text-xs">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="hidden sm:flex items-center justify-center w-[200px] md:w-[180px] shrink-0 pl-2">
                <Image src={oldIllustration} alt="Old Way" className="max-h-[160px] md:max-h-[280px] w-full object-contain" />
              </div>
            </div>

            {/* VS Badge */}
            <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#1e1160] items-center justify-center z-20">
              <span className="font-sans font-bold text-white text-base">VS</span>
            </div>
            {/* Mobile VS Badge */}
            <div className="lg:hidden flex justify-center -my-6 relative z-20">
              <div className="w-10 h-10 rounded-full bg-[#1e1160] flex items-center justify-center">
                <span className="font-sans font-bold text-white text-sm">VS</span>
              </div>
            </div>

            {/* Right Card - The Ground Zero Way */}
            <div className="lg:w-1/2 bg-[#1b193f]/40 border border-purple-500/30 rounded-[20px] p-5 md:p-6 lg:rounded-l-none relative z-10 flex justify-between">
              <div className="flex flex-col flex-1 pr-4">
                <h3 className="font-serif text-lg md:text-xl text-purple-400 font-bold mb-1 uppercase text-center md:text-left">
                  THE GROUND ZERO WAY
                </h3>
                <p className="font-sans text-brand-secondary text-[11px] md:text-xs mb-4 text-center md:text-left">
                  Simple. Smart. Profitable.
                </p>
                <ul className="space-y-2.5">
                  {gzWayItems.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      <span className="font-sans text-white/90 text-[11px] md:text-xs">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="hidden sm:flex items-center justify-center w-[120px] md:w-[350px] shrink-0 pl-2">
                <Image src={newIllustration} alt="Ground Zero Way" className="max-h-[160px] md:max-h-[300px] w-full object-contain" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* SECTION 2: HOW IT WORKS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center w-full"
        >
          <div className="flex items-center w-full mb-8">
            <div className="flex-1 border-t border-[#3c2476]" />
            <h2 className="px-4 font-serif text-[16px] sm:text-[20px] text-purple-400 font-bold uppercase tracking-widest text-center">
              HOW IT WORKS
            </h2>
            <div className="flex-1 border-t border-[#3c2476]" />
          </div>

          <div className="relative z-0 w-full flex flex-col md:flex-row justify-between items-start md:items-center">

            {steps.map((step, idx) => (
              <div key={idx} className="relative flex flex-row md:flex-col items-center md:text-center gap-4 mb-6 md:mb-0 w-full md:w-1/5 group">

                {/* Dashed Line connecting nodes with arrow */}
                {idx > 0 && (
                  <div className="hidden md:block absolute top-[24px] right-[50%] w-[100%] border-t-2 border-dashed border-[#4a2e8c] z-0" />
                )}
                {/* Arrow head for desktop */}
                {idx > 0 && (
                  <div className="hidden md:block absolute top-[19px] left-[0px] w-0 h-0 border-t-[6px] border-t-transparent border-l-[8px] border-l-[#5b38a6] border-b-[6px] border-b-transparent z-0 -translate-x-[200%]" />
                )}

                {/* Mobile dashed line */}
                {idx < steps.length - 1 && (
                  <div className="md:hidden absolute left-[24px] top-[48px] h-full border-l-2 border-dashed border-[#4a2e8c] z-0" />
                )}

                {/* Solid Purple Circle */}
                <div className="relative z-20 w-12 h-12 shrink-0 rounded-full bg-[#271465] border border-[#4a2e8c] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>

                <div className="flex flex-col md:items-center mt-1">
                  <h4 className="font-sans font-bold text-white text-[12px] mb-1 uppercase tracking-wider">
                    {step.label}
                  </h4>
                  <p className="font-sans text-brand-secondary text-[10px] leading-snug max-w-[160px]">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}

          </div>
        </motion.div>

      </div>
    </section>
  );
}
