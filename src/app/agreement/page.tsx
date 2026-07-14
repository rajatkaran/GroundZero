"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, Printer, ArrowLeft, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

function AgreementDocument() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const bookingId = searchParams.get("bookingId");

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!bookingId) return;

    const fetchBookingDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/bookings/detail?bookingId=${bookingId}&requesterRole=${user?.role || ""}`);
        if (!response.ok) {
          throw new Error("Failed to load agreement variables.");
        }
        const res = await response.json();
        setData(res);
      } catch (err: any) {
        setError(err.message || "Failed to fetch agreement details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId, user]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center text-brand-primary">
        <Loader2 size={32} className="animate-spin text-brand-secondary" />
      </div>
    );
  }

  // Pre-populated or fallback draft values
  const licensorName = data?.organizer?.profile?.companyName || "[IIT Bombay Mood Indigo Committee]";
  const licensorContact = data?.organizer?.profile?.contactPhone || "[+91 99999 88888]";
  const licenseeName = data?.booking?.vendor?.profile?.companyName || (user?.role === "ORGANIZER" ? `Vendor #${data?.booking?.vendor?.id?.substring(0, 8) || "Draft"}` : (data?.booking?.vendor?.email || "[Chaayos Teas Ltd]"));
  const licenseeEmail = user?.role === "ORGANIZER" ? "[Masked for Privacy]" : (data?.booking?.vendor?.email || "[partner@chaayos.in]");
  const licenseeContact = user?.role === "ORGANIZER" ? "[Masked for Privacy]" : (data?.booking?.vendor?.profile?.contactPhone || "[+91 98765 43210]");
  
  const festivalName = data?.booking?.festival?.name || "[Mood Indigo '26]";
  const festivalLocation = data?.booking?.festival?.location || "[IIT Bombay Venue, Powai, Mumbai]";
  const stallNumber = data?.booking?.stall?.stallNumber || "[A3]";
  const dimensions = data?.booking?.stall?.dimensions || "[10x10]";
  const finalPrice = data?.booking?.finalPrice 
    ? `₹${data.booking.finalPrice.toLocaleString("en-IN")}` 
    : "[₹45,000]";
  const finalPriceWords = data?.booking?.finalPrice 
    ? `Rupees ${data.booking.finalPrice.toLocaleString("en-IN")}` 
    : "[Forty-Five Thousand Rupees]";

  const currentDate = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#0B0A0F] py-12 px-6 sm:px-8 font-sans print:bg-white print:py-0 print:px-0">
      
      {/* Controls Header - Hidden on print */}
      <div className="max-w-4xl mx-auto mb-8 flex justify-between items-center gap-6 print:hidden">
        <Link 
          href="/" 
          className="group flex items-center gap-2 text-xs text-brand-secondary hover:text-brand-primary transition-colors uppercase tracking-wider"
        >
          <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
          Exit Document
        </Link>

        <button 
          onClick={handlePrint}
          className="btn-liquid-glass-dark text-xs py-2.5 px-5 flex items-center gap-2"
        >
          <Printer size={13} />
          Print Contract
        </button>
      </div>

      {error && (
        <div className="max-w-4xl mx-auto mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-500 font-medium print:hidden">
          {error} (Rendering default template draft below)
        </div>
      )}

      {/* Contract Layout Canvas */}
      <div className="max-w-4xl mx-auto bg-white text-black border border-neutral-200 p-12 sm:p-16 rounded-3xl shadow-lg font-serif leading-relaxed text-sm print:border-none print:shadow-none print:p-0">
        
        {/* Ground Zero Verification Watermark Header */}
        <div className="flex justify-between items-start border-b-2 border-neutral-900 pb-6 mb-8">
          <div className="flex flex-col gap-1">
            <span className="font-sans font-bold text-lg uppercase tracking-wide">Memorandum of Understanding</span>
            <span className="font-sans text-[10px] text-neutral-500 tracking-wider">STANDARD RETAIL SPACE LICENSE AGREEMENT</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 border border-neutral-300 rounded-full bg-neutral-50 text-[10px] font-sans font-semibold text-neutral-700">
            <ShieldCheck size={12} className="text-emerald-600" />
            GZ LEDGER VERIFIED
          </div>
        </div>

        {/* Preamble */}
        <p className="mb-6">
          This Memorandum of Understanding (hereinafter referred to as the <strong>"Agreement"</strong>) is entered into and made effective this <strong>{currentDate}</strong>, by and between:
        </p>

        {/* Parties block */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8 font-sans text-xs">
          <div className="p-5 border border-neutral-200 rounded-xl flex flex-col gap-1.5">
            <span className="font-bold text-neutral-500 uppercase tracking-wider text-[9px]">LICENSOR (EVENT HOST)</span>
            <strong className="text-sm font-serif text-black">{licensorName}</strong>
            <span>Contact: {licensorContact}</span>
            <span>Represented by the Cultural Committee Panel</span>
          </div>
          <div className="p-5 border border-neutral-200 rounded-xl flex flex-col gap-1.5">
            <span className="font-bold text-neutral-500 uppercase tracking-wider text-[9px]">LICENSEE (RETAIL VENDOR)</span>
            <strong className="text-sm font-serif text-black">{licenseeName}</strong>
            <span>Email: {licenseeEmail}</span>
            <span>Contact: {licenseeContact}</span>
          </div>
        </div>

        {/* Clauses */}
        <div className="flex flex-col gap-6">
          
          <div>
            <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-neutral-800 mb-2">1. Scope of Space & License</h3>
            <p>
              The Licensor hereby grants to the Licensee a temporary commercial occupancy license to set up a retail booth at the festival venue: <strong>{festivalName}</strong>, taking place at <strong>{festivalLocation}</strong>. The licensed area is specifically designated as <strong>Stall {stallNumber}</strong>, having physical dimensions of <strong>{dimensions} ft</strong>, as identified in the Ground Zero interactive mapping grid coordinates.
            </p>
          </div>

          <div>
            <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-neutral-800 mb-2">2. Fee Structure & Payment Terms</h3>
            <p>
              In consideration of the licensed retail space, the Licensee agrees to pay the final negotiated license fee of <strong>{finalPrice} ({finalPriceWords})</strong>. Payments must be processed through the Ground Zero payment gateway or logged as cleared offline via administrative override ledger action.
            </p>
          </div>

          <div>
            <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-neutral-800 mb-2">3. Logistics & Power Load</h3>
            <p>
              The Licensor agrees to provide the default power grid configuration allocated to Stall {stallNumber} (Standard 15A socket connection unless upgraded by the vendor or adjusted by the admin). The Licensee is solely responsible for compliance with fire department guidelines, sanitation requirements, and general cleanliness parameters of their respective stall property.
            </p>
          </div>

          <div>
            <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-neutral-800 mb-2">4. Terms of Operation</h3>
            <p>
              The Licensee shall occupy and use the licensed space exclusively for the retail operations listed under their onboarding company category. Operations must remain within the boundary coordinates of Stall {stallNumber} and comply with the official festival timelines.
            </p>
          </div>

          <div>
            <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-neutral-800 mb-2">5. Indemnity & Liability</h3>
            <p>
              Neither Ground Zero (ThinkThrough Operations) nor the Licensor shall be held liable for loss of merchandise, personal injury, or commercial sales loss due to weather disruptions. The Licensee agrees to hold harmless the Licensor committee from all actions, claims, and damages arising out of their stall setup.
            </p>
          </div>

        </div>

        {/* Signatures */}
        <div className="mt-16 pt-8 border-t border-neutral-200 grid grid-cols-2 gap-12 text-center font-sans text-xs">
          <div className="flex flex-col items-center gap-12">
            <span className="opacity-40 italic">Digitally Signed via Ground Zero Ledger</span>
            <div className="w-full border-b border-neutral-300 pb-2 font-semibold">
              Authorized Representative, Licensor
            </div>
          </div>
          <div className="flex flex-col items-center gap-12">
            <span className="opacity-40 italic">Digitally Signed via Ground Zero Ledger</span>
            <div className="w-full border-b border-neutral-300 pb-2 font-semibold">
              Authorized Representative, Licensee
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function AgreementPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#0B0A0F] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-brand-secondary" />
      </div>
    }>
      <AgreementDocument />
    </Suspense>
  );
}
