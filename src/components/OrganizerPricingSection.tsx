import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function OrganizerPricingSection() {
  return (
    <section className="pb-16 md:pb-24 bg-brand-bg relative w-full overflow-hidden">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full max-w-6xl bg-brand-card/80 border border-brand-border rounded-[24px] overflow-hidden flex flex-col lg:flex-row shadow-sm"
        >
          {/* Left Side: Tag Badge & Heading */}
          <div className="lg:w-[35%] bg-[#1c1236]/60 p-8 lg:p-10 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-brand-border relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5">
              <Sparkles size={160} className="text-purple-300" />
            </div>
            
            <div className="inline-flex items-center gap-2 bg-purple-600 text-white font-sans font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-full -rotate-2 w-max mb-6 shadow-md border border-purple-500 relative z-10">
              <Sparkles size={14} className="text-purple-200" />
              NO LISTING CHARGES!
            </div>
            
            <h3 className="font-serif text-[28px] md:text-[36px] font-bold text-white leading-[1.1] relative z-10">
              SIMPLE.<br/>FAIR.<br/>TRANSPARENT.
            </h3>
          </div>

          {/* Right Side: 3 Columns */}
          <div className="lg:w-[65%] p-8 lg:p-10 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            
            {/* Column 1 */}
            <div className="flex flex-col">
              <span className="font-sans text-[11px] font-bold text-brand-secondary/80 uppercase tracking-widest mb-2">
                LIST YOUR EVENT
              </span>
              <h4 className="font-serif text-[28px] font-bold text-emerald-400 mb-2 leading-tight">
                100% FREE
              </h4>
              <p className="font-sans text-[13px] text-brand-secondary leading-relaxed">
                No listing fees. No hidden charges.
              </p>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col">
              <span className="font-sans text-[11px] font-bold text-brand-secondary/80 uppercase tracking-widest mb-2">
                PAY ONLY ON SUCCESS
              </span>
              <h4 className="font-serif text-[24px] font-bold text-emerald-400 mb-2 leading-tight">
                COMMISSION MODEL
              </h4>
              <p className="font-sans text-[13px] text-brand-secondary leading-relaxed mt-1">
                We charge a small commission only on confirmed activations.
              </p>
            </div>

            {/* Column 3 */}
            <div className="flex flex-col">
              <span className="font-sans text-[11px] font-bold text-brand-secondary/80 uppercase tracking-widest mb-2">
                WHAT WE CHARGE ON
              </span>
              <h4 className="font-serif text-[24px] font-bold text-emerald-400 mb-2 leading-tight">
                ACTIVATIONS ONLY
              </h4>
              <p className="font-sans text-[13px] text-brand-secondary leading-relaxed mt-1">
                Commission is applicable only on Sponsors/Brand or Food Stalls you get through us.
              </p>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
