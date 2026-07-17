"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import PortalLayout from "@/components/PortalLayout";
import { Loader2, Plus, MapPin, Users } from "lucide-react";

export default function OrganizerFestivals() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedFests, setExpandedFests] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!user) return;
    const fetchFestivals = async () => {
      try {
        const response = await fetch(`/api/organizer/dashboard?organizerId=${user.id}`);
        if (response.ok) {
          const res = await response.json();
          setData(res);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFestivals();
  }, [user]);

  if (loading) {
    return (
      <PortalLayout activeTab="my festivals">
        <div className="flex h-96 items-center justify-center">
          <Loader2 size={32} className="animate-spin text-brand-secondary" />
        </div>
      </PortalLayout>
    );
  }

  const festivals = data?.festivals || [];

  return (
    <PortalLayout activeTab="my festivals">
      <div className="flex flex-col gap-12">
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-6">
          <div className="flex flex-col gap-3">
            <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-brand-secondary">
              PROPERTIES DIRECTORY
            </span>
            <h1 className="font-serif text-[40px] font-medium tracking-tight text-brand-primary">
              My Festivals
            </h1>
          </div>

          <Link href="/dashboard/organizer/create" className="btn-liquid-glass-dark text-xs flex items-center gap-2 self-start sm:self-auto">
            <Plus size={14} />
            Register New Festival
          </Link>
        </div>

        {festivals.length === 0 ? (
          <div className="bg-brand-card border border-brand-border rounded-[24px] p-16 text-center text-brand-secondary text-sm flex flex-col items-center gap-6">
            <span>You haven't registered any festivals yet. Register your property to secure stalls.</span>
            <Link href="/dashboard/organizer/create" className="btn-liquid-glass-dark text-xs py-2 px-6">
              Register Festival
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            {festivals.map((fest: any) => {
              const bookedCount = fest.bookings.filter((b: any) => b.status === "PAID").length;
              return (
                <div key={fest.id} className="bg-brand-card border border-brand-border rounded-[24px] p-8 shadow-sm flex flex-col justify-between min-h-[260px] hover:border-brand-primary/20 transition-all">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1.5">
                      <h3 className="font-serif text-[20px] font-medium text-brand-primary">
                        {fest.name}
                      </h3>
                      <span className="text-[12px] font-sans text-brand-secondary flex items-center gap-1.5">
                        <MapPin size={12} /> {fest.collegeName} &middot; {fest.location}
                      </span>
                    </div>
                    <span className={`px-2.5 py-0.5 border rounded-full text-[9px] uppercase tracking-wider font-semibold ${
                      fest.published 
                        ? "bg-brand-primary/5 border-brand-border text-brand-primary" 
                        : "bg-brand-primary/[0.02] border-dashed border-brand-border text-brand-secondary"
                    }`}>
                      {fest.published ? "Published" : "Pending Audit"}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 border-y border-brand-border py-4 font-sans text-[12px] text-brand-secondary my-4 font-sans text-[12px] text-brand-secondary my-4">
                    <div className="flex flex-col gap-0.5">
                      <span>Stalls</span>
                      <span className="font-serif text-[14px] font-medium text-brand-primary">
                        {bookedCount} / {fest.stalls.length} Booked
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span>Footfall</span>
                      <span className="font-serif text-[14px] font-medium text-brand-primary flex items-center gap-1">
                        <Users size={12} /> {fest.expectedFootfall.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span>GZ Score</span>
                      <span className="font-serif text-[14px] font-medium text-brand-primary">
                        {fest.opportunityScore}/100
                      </span>
                    </div>
                  </div>

                  {/* Share Event Link Row */}
                  <div className="flex items-center justify-between bg-brand-bg/50 border border-brand-border/60 rounded-xl px-4 py-3 text-xs font-sans mb-4">
                    <div className="flex flex-col gap-0.5 text-left">
                      <span className="text-[9px] uppercase tracking-wider text-brand-secondary font-semibold">Share Event Page Link</span>
                      <span className="font-semibold text-brand-primary">groundzero.thinkthrough.{fest.name.toLowerCase().replace(/[^a-z0-9]/g, "")}</span>
                    </div>
                    <button
                      onClick={() => {
                        const slug = fest.name.toLowerCase().replace(/[^a-z0-9]/g, "");
                        const url = `${window.location.origin}/festival/${slug}`;
                        navigator.clipboard.writeText(url);
                        alert("Share link copied to clipboard!");
                      }}
                      className="px-3 py-1.5 bg-brand-border text-brand-primary hover:bg-brand-primary hover:text-brand-bg rounded-lg text-[10px] font-semibold transition-all cursor-pointer"
                    >
                      Copy Link
                    </button>
                  </div>

                  <div className="flex justify-end gap-3 pt-2 flex-wrap">
                    <button 
                      onClick={() => setExpandedFests(prev => ({ ...prev, [fest.id]: !prev[fest.id] }))}
                      className="btn-liquid-glass text-xs py-2 px-4 cursor-pointer"
                    >
                      {expandedFests[fest.id] ? "Hide Stalls" : "Show Stalls List"}
                    </button>
                    <Link 
                      href={`/dashboard/organizer/mapper?festivalId=${fest.id}`}
                      className="btn-liquid-glass text-xs py-2 px-4 flex items-center gap-1"
                    >
                      🎨 Map Creator Canvas
                    </Link>
                    <Link 
                      href={`/festival/${fest.name.toLowerCase().replace(/[^a-z0-9]/g, "")}`}
                      className="btn-liquid-glass-dark text-xs py-2 px-4"
                    >
                      View Listing
                    </Link>
                  </div>

                  {expandedFests[fest.id] && (
                    <div className="border-t border-brand-border pt-6 mt-4 flex flex-col gap-4 font-sans text-xs">
                      <h4 className="font-serif text-[15px] font-medium text-brand-primary">Stall Directory & Real-time Allocation</h4>
                      {fest.stalls.length === 0 ? (
                        <div className="text-brand-secondary/60 italic py-2">No stalls mapped yet. Use the Map Creator Canvas to draw stalls.</div>
                      ) : (
                        <div className="border border-brand-border rounded-xl overflow-hidden bg-brand-bg/50 max-h-60 overflow-y-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="border-b border-brand-border bg-brand-card font-semibold text-[10px] uppercase tracking-wider text-brand-secondary">
                                <th className="p-3">Stall No</th>
                                <th className="p-3">Dimensions</th>
                                <th className="p-3 text-right">Target Base Price</th>
                                <th className="p-3 text-right">Public Selling Price</th>
                                <th className="p-3 text-center">Status</th>
                                <th className="p-3">Occupant / Live Proposal Info</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-brand-border text-brand-secondary">
                              {fest.stalls.map((stall: any) => {
                                const stallBookings = fest.bookings.filter((b: any) => b.stallId === stall.id && b.status !== "CANCELLED");
                                const bookedBooking = stallBookings.find((b: any) => b.status === "PAID" || b.status === "APPROVED");
                                const negotiatingBookings = stallBookings.filter((b: any) => b.status === "NEGOTIATING" || b.status === "PENDING");
                                
                                return (
                                  <tr key={stall.id} className="hover:bg-brand-card/45">
                                    <td className="p-3 font-semibold text-brand-primary">{stall.stallNumber}</td>
                                    <td className="p-3">{stall.dimensions} ft</td>
                                    <td className="p-3 text-right">₹{stall.basePrice.toLocaleString("en-IN")}</td>
                                    <td className="p-3 text-right text-brand-primary">₹{stall.publicPrice.toLocaleString("en-IN")}</td>
                                    <td className="p-3 text-center">
                                      <span className={`px-2 py-0.5 border rounded-full text-[9px] uppercase tracking-wider font-semibold ${
                                        stall.status === "BOOKED" 
                                          ? "bg-brand-primary text-brand-bg border-brand-primary" 
                                          : stall.status === "NEGOTIATION"
                                          ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                                          : stall.status === "RESERVED"
                                          ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                                          : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                      }`}>
                                        {stall.status}
                                      </span>
                                    </td>
                                    <td className="p-3 font-medium">
                                      {bookedBooking ? (
                                        <span className="text-brand-primary">
                                          ✅ Booked: {bookedBooking.vendor?.profile?.companyName || bookedBooking.vendor?.email} (₹{bookedBooking.finalPrice.toLocaleString("en-IN")})
                                        </span>
                                      ) : negotiatingBookings.length > 0 ? (
                                        <div className="flex flex-col gap-0.5">
                                          {negotiatingBookings.map((nb: any, i: number) => (
                                            <span key={i} className="text-brand-secondary text-[11px] block">
                                              💬 {nb.vendor?.profile?.companyName || nb.vendor?.email} (₹{nb.finalPrice.toLocaleString("en-IN")})
                                            </span>
                                          ))}
                                        </div>
                                      ) : (
                                        <span className="opacity-40 italic">Available</span>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
