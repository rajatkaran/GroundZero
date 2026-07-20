"use client";

import React from "react";
import { Building2, Calendar, Users, Megaphone } from "lucide-react";
import { motion } from "framer-motion";

export default function StatsRowSection() {
  const stats = [
    {
      icon: <Building2 strokeWidth={1.5} size={36} className="text-[#8b5cf6]" />,
      number: "100+",
      label: "Colleges",
      subLabel: "Across Delhi NCR"
    },
    {
      icon: <Calendar strokeWidth={1.5} size={36} className="text-[#8b5cf6]" />,
      number: "200+",
      label: "Events",
      subLabel: "Every Year"
    },
    {
      icon: <Users strokeWidth={1.5} size={36} className="text-[#8b5cf6]" />,
      number: "1M+",
      label: "Audience",
      subLabel: "Reached"
    },
    {
      icon: <Megaphone strokeWidth={1.5} size={36} className="text-[#8b5cf6]" />,
      number: "50+",
      label: "Campaigns",
      subLabel: "Executed Successfully"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-[#09080F] relative w-full border-b border-brand-border">
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-12 relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-[#fdfbf7] rounded-3xl shadow-xl p-8 md:p-12"
        >
          {/* Desktop: 4 columns, Mobile: 2x2 grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 md:gap-y-0 relative">
            
            {stats.map((stat, idx) => (
              <div 
                key={idx}
                className={`flex flex-col items-center text-center relative px-4
                  ${idx % 2 === 0 ? "border-r border-gray-200/80 md:border-transparent" : ""} 
                  ${idx < 3 ? "md:border-r md:border-gray-200/80" : ""}
                `}
              >
                {/* Icon */}
                <div className="mb-5 flex items-center justify-center h-16 w-16 rounded-full bg-[#8b5cf6]/10 border border-[#8b5cf6]/20">
                  {stat.icon}
                </div>
                
                {/* Number */}
                <h3 className="font-serif text-4xl sm:text-5xl font-bold text-[#111827] mb-2 leading-none">
                  {stat.number}
                </h3>
                
                {/* Label */}
                <div className="font-sans font-bold text-[#374151] text-sm sm:text-base uppercase tracking-wider mb-1">
                  {stat.label}
                </div>
                
                {/* Sub-label */}
                <div className="font-sans text-xs sm:text-sm text-[#6b7280] font-normal">
                  {stat.subLabel}
                </div>
              </div>
            ))}

            {/* Mobile horizontal divider */}
            <div className="md:hidden absolute top-1/2 left-0 right-0 h-px bg-gray-200/80 -translate-y-1/2" />
            
          </div>
        </motion.div>

      </div>
    </section>
  );
}
