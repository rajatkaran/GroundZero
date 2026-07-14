"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import PortalLayout from "@/components/PortalLayout";
import { Loader2, FileText, CheckCircle2, AlertCircle, Mail, MapPin, Calendar, HelpCircle, ArrowRight } from "lucide-react";

export default function VendorBookings() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchBookings = async () => {
      try {
        const response = await fetch(`/api/vendor/dashboard?vendorId=${user.id}`);
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
    fetchBookings();
  }, [user]);

  if (loading) {
    return (
      <PortalLayout activeTab="my bookings">
        <div className="flex h-96 items-center justify-center">
          <Loader2 size={32} className="animate-spin text-brand-secondary" />
        </div>
      </PortalLayout>
    );
  }

  const bookings = data?.bookings || [];

  return (
    <PortalLayout activeTab="my bookings">
      <div className="flex flex-col gap-12 max-w-5xl mx-auto">
        {/* Header Block */}
        <div className="flex flex-col gap-3">
          <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-brand-secondary">
            SECURED STALLS DIRECTORY
          </span>
          <h1 className="font-serif text-[40px] font-medium tracking-tight text-brand-primary">
            My Bookings
          </h1>
          <p className="font-sans text-xs text-brand-secondary max-w-xl">
            Track your contracted retail spaces, review billing breakdowns, access digital MOUs, and coordinates with event hosts.
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-brand-card border border-brand-border rounded-[28px] p-16 text-center text-brand-secondary text-sm flex flex-col items-center gap-6 shadow-sm">
            <span className="max-w-xs leading-5">No confirmed bookings found. Initiate space bids or finalize negotiations to secure your stall.</span>
            <Link href="/discover" className="btn-liquid-glass text-xs py-2.5 px-6 flex items-center gap-1.5 font-medium">
              Browse Discover Directory
              <ArrowRight size={12} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {bookings.map((booking: any) => {
              const basePrice = booking.stall?.basePrice || (booking.finalPrice - 10000);
              const markupCommission = booking.stall?.commissionAmount || 10000;
              const isPaid = booking.status === "PAID";
              
              const startDateStr = new Date(booking.festival?.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
              const endDateStr = new Date(booking.festival?.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

              return (
                <div 
                  key={booking.id} 
                  className="bg-brand-card border border-brand-border rounded-[28px] p-8 shadow-sm flex flex-col gap-6 hover:border-brand-primary/20 transition-all duration-300"
                >
                  {/* Top: Status Badging */}
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex flex-col gap-1">
                      <h3 className="font-serif text-[20px] font-medium text-brand-primary leading-tight">
                        {booking.festival?.name}
                      </h3>
                      <span className="text-[12px] font-sans text-brand-secondary flex items-center gap-1.5">
                        <MapPin size={12} className="opacity-60" /> {booking.festival?.collegeName}
                      </span>
                    </div>

                    <span className={`px-2.5 py-0.5 border rounded-full text-[9px] uppercase tracking-wider font-bold flex items-center gap-1 shrink-0 ${
                      isPaid 
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500" 
                        : "bg-amber-500/10 border-amber-500/30 text-amber-500"
                    }`}>
                      {isPaid ? (
                        <>
                          <CheckCircle2 size={10} /> Paid & Secured
                        </>
                      ) : (
                        <>
                          <AlertCircle size={10} /> Pending Payment
                        </>
                      )}
                    </span>
                  </div>

                  {/* Body: Stall parameters */}
                  <div className="grid grid-cols-2 gap-4 bg-brand-bg/50 border border-brand-border/40 rounded-2xl p-4 font-sans text-xs text-brand-secondary">
                    <div className="flex flex-col gap-0.5">
                      <span className="opacity-60">Stall Allocation</span>
                      <strong className="text-brand-primary text-sm font-semibold">Stall {booking.stall?.stallNumber}</strong>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="opacity-60">Dimensions</span>
                      <strong className="text-brand-primary text-sm font-semibold">{booking.stall?.dimensions} ft</strong>
                    </div>
                    <div className="flex flex-col gap-0.5 mt-2 col-span-2">
                      <span className="opacity-60">Event Dates</span>
                      <span className="text-brand-primary font-medium flex items-center gap-1.5 mt-0.5">
                        <Calendar size={12} /> {startDateStr} – {endDateStr}
                      </span>
                    </div>
                  </div>

                  {/* Cost Invoice Breakdown */}
                  <div className="flex flex-col gap-2 border-t border-brand-border/40 pt-4 font-sans text-xs text-brand-secondary">
                    <span className="font-semibold text-brand-primary text-[10px] uppercase tracking-wider">Billing Breakdown</span>
                    <div className="flex justify-between items-center">
                      <span>Stall Base Price:</span>
                      <span>₹{basePrice.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>GZ Platform Commission:</span>
                      <span>₹{markupCommission.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-brand-border/40 pt-2 font-serif text-[15px] font-bold text-brand-primary mt-1">
                      <span>Final Net Amount:</span>
                      <span>₹{booking.finalPrice.toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap sm:flex-nowrap gap-3 border-t border-brand-border/40 pt-4 mt-2">
                    <a 
                      href={`mailto:coordination@thinkthrough.in?subject=Ground Zero Coordination: Booking #${booking.id}`}
                      className="flex-1 btn-liquid-glass py-2.5 px-4 text-xs flex justify-center items-center gap-1.5 cursor-pointer select-none"
                    >
                      <Mail size={12} />
                      Support
                    </a>

                    <Link 
                      href={`/agreement?bookingId=${booking.id}`}
                      target="_blank"
                      className="flex-1 btn-liquid-glass-dark py-2.5 px-4 text-xs flex justify-center items-center gap-1.5 cursor-pointer select-none"
                    >
                      <FileText size={12} />
                      View legal MOU
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
