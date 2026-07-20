"use client";

import { motion } from "framer-motion";
import { Users, TrendingUp, Tag, MapPin, ChevronRight, PieChart, Building2, Calendar, Megaphone, Tent, GraduationCap, Handshake, Store, Target, Award, IndianRupee } from "lucide-react";
import Link from "next/link";

const dummyColleges = [
  {
    id: "iitd",
    name: "IIT Delhi",
    location: "New Delhi",
    footfall: "40,000+",
    genderRatio: "65:35 M/F",
    reach: "85k+ Reach",
    pastSponsors: "Red Bull · Intel · Zomato",
    keyActivation: "Main Stage Naming Rights",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600"
  },
  {
    id: "iitb",
    name: "IIT Bombay",
    location: "Mumbai",
    footfall: "52,000+",
    genderRatio: "60:40 M/F",
    reach: "120k+ Reach",
    pastSponsors: "Coca-Cola · OnePlus · Jio",
    keyActivation: "Title Sponsorship",
    image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=600"
  },
  {
    id: "nsut",
    name: "NSUT Delhi",
    location: "New Delhi",
    footfall: "25,000+",
    genderRatio: "70:30 M/F",
    reach: "50k+ Reach",
    pastSponsors: "Monster · Lenovo · Swiggy",
    keyActivation: "EDM Night Co-Sponsor",
    image: "https://images.unsplash.com/photo-1555848962-6e79363ec58f?q=80&w=600"
  },
  {
    id: "bits",
    name: "BITS Pilani",
    location: "Pilani",
    footfall: "35,000+",
    genderRatio: "55:45 M/F",
    reach: "75k+ Reach",
    pastSponsors: "Pepsi · Dell · Uber",
    keyActivation: "Pro-Show Presenting Rights",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=600"
  }
];

export default function BrandSection() {
  return (
    <section id="sponsor-showcase" className="py-10 md:py-12 bg-brand-bg border-b border-brand-border overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div className="flex flex-col">
            <h2 className="font-serif text-[24px] sm:text-[30px] tracking-tight text-brand-primary font-medium">
              Looking for Reach?
            </h2>
            <h3 className="font-serif text-[16px] sm:text-[18px] text-white font-medium mt-1">
              Colleges affiliated to Ground Zero
            </h3>
            <p className="font-sans text-[13px] text-brand-secondary font-light mt-1">
              Top college sponsorship opportunities tailored for maximum visibility.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end text-left md:text-right">
            <p className="font-serif italic text-brand-secondary/80 text-sm mb-3">
              "Join us to get more eyeballs."
            </p>
            <Link href="/auth?type=login" className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-white px-8 py-2.5 text-white transition-all duration-300">
              <span className="absolute inset-0 bg-white translate-y-[100%] transition-transform duration-300 ease-out group-hover:translate-y-0" />
              <span className="relative z-10 font-sans font-bold text-[13px] uppercase tracking-wider group-hover:text-[#09080F] transition-colors duration-300">
                Log In
              </span>
            </Link>
          </div>
        </motion.div>

        {/* Dark Mode Stats Row */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-brand-card/50 backdrop-blur-sm border border-brand-border rounded-[20px] p-4 md:p-6 shadow-md mb-6"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 md:gap-y-0 relative">
            
            {[
              { icon: <Building2 strokeWidth={1.5} size={20} className="text-purple-400" />, number: "100+", label: "Colleges", subLabel: "Across Delhi NCR" },
              { icon: <Calendar strokeWidth={1.5} size={20} className="text-purple-400" />, number: "200+", label: "Events", subLabel: "Every Year" },
              { icon: <Users strokeWidth={1.5} size={20} className="text-purple-400" />, number: "1M+", label: "Audience", subLabel: "Reached" },
              { icon: <Megaphone strokeWidth={1.5} size={20} className="text-purple-400" />, number: "50+", label: "Campaigns", subLabel: "Executed Successfully" }
            ].map((stat, idx) => (
              <div 
                key={idx}
                className={`flex flex-col items-center text-center relative px-2
                  ${idx % 2 === 0 ? "border-r border-brand-border/40 md:border-transparent" : ""} 
                  ${idx < 3 ? "md:border-r md:border-brand-border/40" : ""}
                `}
              >
                {/* Icon */}
                <div className="mb-2 flex items-center justify-center h-10 w-10 rounded-full bg-purple-500/10 border border-purple-500/20">
                  {stat.icon}
                </div>
                
                {/* Number */}
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-1 leading-none">
                  {stat.number}
                </h3>
                
                {/* Label */}
                <div className="font-sans font-bold text-brand-primary text-[11px] sm:text-xs uppercase tracking-wider mb-0.5">
                  {stat.label}
                </div>
                
                {/* Sub-label */}
                <div className="font-sans text-[9px] sm:text-[10px] text-brand-secondary font-normal">
                  {stat.subLabel}
                </div>
              </div>
            ))}

            {/* Mobile horizontal divider */}
            <div className="md:hidden absolute top-1/2 left-0 right-0 h-px bg-brand-border/40 -translate-y-1/2" />
            
          </div>
        </motion.div>

        {/* SECTION 1: We Cover Every Type of Event */}
        <div className="mb-6 mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center mb-4"
          >
            <h2 className="font-serif text-[20px] sm:text-[24px] tracking-tight text-white font-medium">
              We Cover <span className="underline decoration-purple-500 underline-offset-4">Every</span> Type of Event
            </h2>
            <div className="w-full max-w-lg h-px bg-brand-border/40 mt-3" />
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { icon: <Tent strokeWidth={1.5} size={18} className="text-purple-400" />, label: "College Fests", desc: "Cultural, Tech, Management, Sports & more." },
              { icon: <GraduationCap strokeWidth={1.5} size={18} className="text-purple-400" />, label: "Paid Events", desc: "Concerts, Shows, Workshops, Conferences." },
              { icon: <Handshake strokeWidth={1.5} size={18} className="text-purple-400" />, label: "Commercial Events", desc: "Product Launches, Brand Promotions, Roadshows." },
              { icon: <Store strokeWidth={1.5} size={18} className="text-purple-400" />, label: "Exhibitions", desc: "Trade Shows, Pop-up Events, and more." },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="bg-brand-card/60 backdrop-blur-sm border border-brand-border rounded-[16px] p-4 flex flex-col items-center text-center hover:border-purple-500/30 transition-all duration-300 shadow-sm hover:shadow-md hover:bg-brand-card"
              >
                <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-2">
                  {item.icon}
                </div>
                <h3 className="font-sans font-bold text-brand-primary text-sm mb-1">{item.label}</h3>
                <p className="font-sans text-[10px] text-brand-secondary leading-snug">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* SECTION 2: Why Brands Choose Ground Zero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-purple-900/15 to-brand-card border border-brand-border rounded-[20px] p-5 md:p-6 shadow-md mb-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.08)_0%,rgba(139,92,246,0)_70%)] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col xl:flex-row gap-6 xl:gap-8 items-start xl:items-center">
            {/* Left: Heading */}
            <div className="xl:w-1/3 flex flex-col">
              <h2 className="font-serif text-[20px] sm:text-[24px] tracking-tight text-white font-medium leading-[1.15]">
                Why Brands Choose Ground Zero
              </h2>
              <div className="w-8 h-[2px] bg-purple-500 rounded-full mt-3 opacity-80" />
            </div>

            {/* Right: 4 Columns */}
            <div className="xl:w-2/3 w-full grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-4">
              {[
                { icon: <Target strokeWidth={1.5} size={14} className="text-white/90" />, label: "Wider Reach", desc: "All colleges, one circuit." },
                { icon: <Award strokeWidth={1.5} size={14} className="text-white/90" />, label: "Professional Execution", desc: "Structured, reliable & seamless." },
                { icon: <IndianRupee strokeWidth={1.5} size={14} className="text-white/90" />, label: "Value for Money", desc: "Best pricing. Better results." },
                { icon: <TrendingUp strokeWidth={1.5} size={14} className="text-white/90" />, label: "Measurable Results", desc: "Data-backed impact." },
              ].map((reason, idx) => (
                <div key={idx} className="flex flex-col gap-2 group">
                  <div className="w-8 h-8 rounded-full border border-brand-border bg-white/5 flex items-center justify-center group-hover:border-purple-500/40 group-hover:bg-purple-500/10 transition-colors duration-300">
                    {reason.icon}
                  </div>
                  <div className="flex flex-col gap-0.5 mt-0.5">
                    <span className="font-sans font-bold text-white text-[11px] leading-tight">{reason.label}</span>
                    <span className="font-sans text-[9px] text-brand-secondary leading-snug">{reason.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Horizontal Scroll Container (Hidden but preserved in codebase) */}
        {false && (
          <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-brand-border scrollbar-track-transparent pr-12">
          {dummyColleges.map((college, idx) => (
            <motion.div
              key={college.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex-shrink-0 w-[340px] sm:w-[380px] snap-center bg-brand-card border border-brand-border rounded-[20px] overflow-hidden flex flex-col group hover:border-brand-primary/30 transition-all duration-300"
            >
              {/* Image & Main Badge */}
              <div className="relative h-[160px] w-full overflow-hidden">
                <img
                  src={college.image}
                  alt={college.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#09080F]/80 via-[#09080F]/20 to-transparent" />
                
                {/* Primary Metric Badge - Top Right */}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-brand-border/40 px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
                  <Users size={14} className="text-purple-400" />
                  <span className="font-serif text-[13px] font-bold text-brand-primary tracking-wide">
                    {college.footfall} Footfall
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-serif text-[22px] font-semibold text-brand-primary leading-tight">
                    {college.name}
                  </h3>
                  <div className="flex items-center gap-1 text-brand-secondary/90 text-[11px] mt-1">
                    <MapPin size={12} /> {college.location}
                  </div>
                </div>
              </div>

              {/* Data Content */}
              <div className="p-5 flex flex-col flex-1 gap-5">
                {/* Highlighted Activation */}
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg px-3 py-2 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-purple-400/80 font-bold">
                    <Tag size={12} /> Key Activation
                  </div>
                  <div className="font-sans text-[13px] font-medium text-brand-primary">
                    {college.keyActivation}
                  </div>
                </div>

                {/* Grid Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] uppercase tracking-wider text-brand-secondary font-bold">
                      <TrendingUp size={12} /> Reach
                    </div>
                    <div className="font-serif text-[15px] sm:text-[18px] font-bold text-brand-primary">
                      {college.reach.replace(" Reach", "")}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 border-l border-brand-border/50 pl-3">
                    <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] uppercase tracking-wider text-brand-secondary font-bold">
                      <Users size={12} /> Footfall
                    </div>
                    <div className="font-serif text-[15px] sm:text-[18px] font-bold text-brand-primary leading-tight">
                      {college.footfall}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 border-l border-brand-border/50 pl-3">
                    <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] uppercase tracking-wider text-brand-secondary font-bold">
                      <PieChart size={12} /> Gender
                    </div>
                    <div className="font-sans text-[11px] sm:text-[12px] font-medium text-brand-primary/90 leading-tight pt-1">
                      {college.genderRatio}
                    </div>
                  </div>
                </div>

                {/* Past Sponsors */}
                <div className="flex flex-col gap-1.5 pt-4 border-t border-brand-border/40">
                  <span className="text-[10px] uppercase tracking-wider text-brand-secondary font-bold">
                    Past Sponsors
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {college.pastSponsors.split(" · ").map((sponsor, i) => (
                      <span key={i} className="text-[10px] px-2 py-1 bg-brand-bg rounded-md text-brand-secondary/80 border border-brand-border/50">
                        {sponsor}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-auto pt-4">
                  <Link href="/discover" className="btn-liquid-glass w-full text-center flex items-center justify-center gap-2 py-2.5 text-[13px]">
                    View Sponsorship Packages <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Show More Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex-shrink-0 w-[240px] snap-center bg-brand-bg border border-brand-border border-dashed rounded-[20px] flex items-center justify-center p-6 group hover:border-brand-primary/50 transition-all duration-300 cursor-pointer"
          >
            <Link href="/discover" className="flex flex-col items-center gap-3 text-brand-secondary group-hover:text-brand-primary transition-colors">
              <div className="w-12 h-12 rounded-full border border-brand-border bg-brand-card flex items-center justify-center group-hover:scale-110 group-hover:bg-purple-500/10 group-hover:border-purple-500/30 transition-all duration-300">
                <ChevronRight size={24} />
              </div>
              <span className="font-sans text-[14px] font-semibold">View All Opportunities</span>
            </Link>
          </motion.div>
        </div>
        )}
      </div>
    </section>
  );
}
