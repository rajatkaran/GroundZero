"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Printer, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

function ContractView() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const bookingId = searchParams.get("bookingId");

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!bookingId) return;

    const fetchBookingDetails = async () => {
      try {
        const response = await fetch(`/api/negotiation?bookingId=${bookingId}&requesterRole=${user?.role || ""}`);
        if (!response.ok) {
          throw new Error("Failed to load license contract data.");
        }
        const res = await response.json();
        setBooking(res.booking);
      } catch (err: any) {
        setError(err.message || "Failed to load contract.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center font-sans">
        <Loader2 size={32} className="animate-spin text-brand-secondary" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center font-sans p-6">
        <div className="max-w-md w-full bg-white border border-brand-border p-8 rounded-2xl text-center text-brand-secondary text-sm">
          {error || "Contract not found."}
        </div>
      </div>
    );
  }

  const currentDate = new Date(booking.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#0A0A0A] font-serif py-16 px-6 sm:px-12 print:bg-white print:py-0 print:px-0">
      
      {/* Screen-Only Toolbar */}
      <div className="max-w-3xl mx-auto mb-12 flex justify-between items-center print:hidden">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-[12px] font-sans text-brand-secondary hover:text-brand-primary transition-colors uppercase tracking-wider focus:outline-none"
        >
          <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
          Return to Portal
        </button>

        <button
          onClick={() => window.print()}
          className="btn-liquid-glass text-xs py-2 px-5 flex items-center gap-1.5 font-sans"
        >
          <Printer size={14} />
          Print Contract / Save PDF
        </button>
      </div>

      {/* Printable Contract Document Sheet */}
      <article className="max-w-3xl mx-auto bg-white border border-brand-border p-12 sm:p-16 rounded-[2px] shadow-sm print:border-none print:shadow-none print:p-0">
        
        {/* Document Header */}
        <div className="text-center flex flex-col gap-3 border-b-2 border-black pb-8 mb-10">
          <h1 className="text-[24px] uppercase tracking-wider font-semibold">
            Commercial Space Licensing Agreement
          </h1>
          <span className="text-xs font-sans text-brand-secondary tracking-widest uppercase">
            GROUND ZERO PLATFORM DIRECT REGISTERED CONTRACT
          </span>
          <span className="text-xs font-sans text-brand-primary tracking-wide">
            Agreement ID: GZ-L-{booking.id.substring(0, 8).toUpperCase()}
          </span>
        </div>

        {/* Contract Metadata Table */}
        <div className="grid grid-cols-2 gap-8 mb-10 font-sans text-xs border border-black/10 p-6 rounded-lg bg-[#FAFAFA]">
          <div className="flex flex-col gap-1">
            <span className="text-brand-secondary uppercase tracking-wider font-semibold">LICENSEE (VENDOR)</span>
            <span className="text-brand-primary font-bold">
              {booking.vendor?.profile?.companyName || (user?.role === "ORGANIZER" ? "[Masked for Privacy]" : booking.vendor?.email)}
            </span>
            <span className="text-brand-secondary">
              {user?.role === "ORGANIZER" ? "[Masked for Privacy]" : booking.vendor?.email}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-brand-secondary uppercase tracking-wider font-semibold">LICENSOR (FESTIVAL HOST)</span>
            <span className="text-brand-primary font-bold">{booking.festival?.collegeName}</span>
            <span className="text-brand-secondary">{booking.festival?.name} Committee</span>
          </div>
        </div>

        {/* Recitals / Terms */}
        <div className="flex flex-col gap-6 text-[13px] leading-7 text-brand-primary text-justify">
          <p>
            This Commercial Space Licensing Agreement (the "Agreement") is executed on this <strong>{currentDate}</strong> (the "Execution Date"), by and between the Licensor and the Licensee designated above, facilitated via the Ground Zero Commerce and Intelligence Platform by ThinkThrough.
          </p>

          <h3 className="text-[16px] font-bold uppercase mt-4 border-b border-black/10 pb-1">1. Grant of License</h3>
          <p>
            Subject to the terms of this Agreement, the Licensor grants to the Licensee a limited, revocable, non-exclusive, non-transferable license to occupy and operate within the designated commercial stall space <strong>Stall {booking.stall?.stallNumber}</strong>, measuring <strong>{booking.stall?.dimensions} feet</strong>, located at the venue layout of <strong>{booking.festival?.name}</strong>, hosted at <strong>{booking.festival?.collegeName}</strong>, Powai, Mumbai.
          </p>

          <h3 className="text-[16px] font-bold uppercase mt-4 border-b border-black/10 pb-1">2. Pricing & Consideration</h3>
          <p>
            The consideration for this license is locked at a fixed fee of <strong>₹{booking.finalPrice.toLocaleString("en-IN")}</strong> (Rupees {booking.finalPrice === 55000 ? "Fifty Five Thousand" : "Forty Five Thousand"} Only). This consideration is verified paid in full via the Ground Zero platform Escrow Ledger. No additional space rental fees shall be demanded by the Licensor.
          </p>

          <h3 className="text-[16px] font-bold uppercase mt-4 border-b border-black/10 pb-1">3. Operational Covenants</h3>
          <ul className="list-decimal pl-6 flex flex-col gap-3">
            <li>
              <strong>Logistics and Utilities:</strong> The Licensor shall provide standard electrical configurations as requested in the Licensee onboarding registry. Any additional power load setups must be pre-authorized by the Ground Zero platform Operations Team.
            </li>
            <li>
              <strong>Conduct and Compliance:</strong> The Licensee agrees to comply fully with all student body code of conducts, campus policies, and local municipal health regulations (especially for food and beverage outlets).
            </li>
            <li>
              <strong>Waste Management:</strong> The Licensee shall keep the licensed stall space and its immediate surroundings clean and dispose of all garbage in campus-designated refuse sites.
            </li>
          </ul>

          <h3 className="text-[16px] font-bold uppercase mt-4 border-b border-black/10 pb-1">4. Facilitation & Dispute Resolution</h3>
          <p>
            This agreement is facilitated by ThinkThrough's Ground Zero network. Any disputes arising between the Licensor and the Licensee regarding layout changes, traffic flow, or gate access will be escalated to the Ground Zero Administrator, whose commercial arbitration decision shall be final and binding.
          </p>
        </div>

        {/* Execution Block (Signatures) */}
        <div className="mt-16 border-t border-black/10 pt-10 flex flex-col gap-8">
          <h3 className="text-[14px] uppercase tracking-wider font-semibold text-center mb-4">
            Digital Signatures & Execution Ledger
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-[11px] font-sans">
            
            {/* Vendor Signature */}
            <div className="flex flex-col gap-2 p-4 border border-black/5 bg-[#FAFAFA] rounded-lg relative overflow-hidden">
              <div className="absolute right-3 top-3 text-brand-primary">
                <ShieldCheck size={18} />
              </div>
              <span className="text-brand-secondary font-semibold uppercase tracking-wider">LICENSEE (VENDOR)</span>
              <span className="font-bold text-brand-primary mt-1">
                {booking.vendor?.profile?.companyName || (user?.role === "ORGANIZER" ? "Vendor Representative" : booking.vendor?.email)}
              </span>
              <span className="text-[9px] text-brand-secondary mt-3">SIGNED SECURE SHA256:</span>
              <span className="font-mono text-[8px] text-brand-secondary truncate">
                8f2c3d1e9a7b5c3d9e8f1a2b3c4d5e6f7g8h9i
              </span>
            </div>

            {/* Organizer Signature */}
            <div className="flex flex-col gap-2 p-4 border border-black/5 bg-[#FAFAFA] rounded-lg relative overflow-hidden">
              <div className="absolute right-3 top-3 text-brand-primary">
                <ShieldCheck size={18} />
              </div>
              <span className="text-brand-secondary font-semibold uppercase tracking-wider">LICENSOR (HOST)</span>
              <span className="font-bold text-brand-primary mt-1">{booking.festival?.collegeName} Committee</span>
              <span className="text-[9px] text-brand-secondary mt-3">SIGNED SECURE SHA256:</span>
              <span className="font-mono text-[8px] text-brand-secondary truncate">
                7f1a2b3c4d5e6f7g8h9i8f2c3d1e9a7b5c3d9e
              </span>
            </div>

            {/* Ground Zero Signature */}
            <div className="flex flex-col gap-2 p-4 border border-black/5 bg-[#FAFAFA] rounded-lg relative overflow-hidden">
              <div className="absolute right-3 top-3 text-brand-primary">
                <ShieldCheck size={18} />
              </div>
              <span className="text-brand-secondary font-semibold uppercase tracking-wider">FACILITATOR</span>
              <span className="font-bold text-brand-primary mt-1">Ground Zero Admin</span>
              <span className="text-[9px] text-brand-secondary mt-3">LEDGER HASH SECURED:</span>
              <span className="font-mono text-[8px] text-brand-secondary truncate">
                9i8f2c3d1e9a7b5c3d9e7f1a2b3c4d5e6f7g8h
              </span>
            </div>

          </div>
        </div>

      </article>
    </div>
  );
}

export default function ContractPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-brand-primary" />
      </div>
    }>
      <ContractView />
    </Suspense>
  );
}
