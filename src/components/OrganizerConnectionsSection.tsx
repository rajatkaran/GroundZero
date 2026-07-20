import React from 'react';
import { Handshake, Store, Building2, Megaphone, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function OrganizerConnectionsSection() {
  const cards = [
    {
      icon: <Handshake size={24} />,
      label: 'BRANDS & SPONSORS',
      desc: 'Find sponsors and brand partners for collaborations and activations.'
    },
    {
      icon: <Store size={24} />,
      label: 'FOOD VENDORS',
      desc: 'Connect with verified food vendors for stalls and F&B experiences.'
    },
    {
      icon: <Building2 size={24} />,
      label: 'EXHIBITORS',
      desc: 'Onboard exhibitors and showcase opportunities for your event.'
    },
    {
      icon: <Megaphone size={24} />,
      label: 'MEDIA PARTNERS',
      desc: 'Collaborate with media & digital partners to boost your reach.'
    },
    {
      icon: <Users size={24} />,
      label: 'AUDIENCE & MORE',
      desc: 'Reach the right audience and build stronger event communities.'
    }
  ];

  return (
    <section id="organizer-brand-cluster" className="py-16 md:py-24 bg-brand-bg relative w-full overflow-hidden border-t border-brand-border">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">

        {/* Header matching other sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 w-full flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div className="flex flex-col text-left">
            <h2 className="font-serif text-[24px] sm:text-[30px] tracking-tight text-brand-primary font-medium max-w-2xl">
              Who You Can Connect With
            </h2>
          </div>

          <div className="flex flex-col items-start md:items-end text-left md:text-right shrink-0">
            <p className="font-serif italic text-brand-secondary/80 text-sm mb-3">
              "Join us to reach great brands"
            </p>
            <Link href="/auth?type=login" className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-white px-8 py-2.5 text-white transition-all duration-300">
              <span className="absolute inset-0 bg-white translate-y-[100%] transition-transform duration-300 ease-out group-hover:translate-y-0" />
              <span className="relative z-10 font-sans font-bold text-[13px] uppercase tracking-wider group-hover:text-[#09080F] transition-colors duration-300">
                Log In
              </span>
            </Link>
          </div>
        </motion.div>

        {/* Cards Row */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-brand-card/80 border border-brand-border/50 rounded-[20px] p-6 flex flex-col items-center text-center hover:border-purple-500/50 transition-colors shadow-sm"
            >
              <div className="text-purple-400 mb-5">
                {card.icon}
              </div>
              <h3 className="font-sans font-bold text-[14px] text-purple-400 mb-3 tracking-wide">
                {card.label}
              </h3>
              <p className="font-sans text-[13px] text-brand-secondary/90 leading-relaxed">
                {card.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
