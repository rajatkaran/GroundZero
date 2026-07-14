"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import PortalLayout from "@/components/PortalLayout";
import { Loader2, ChevronRight } from "lucide-react";

export default function AdminNegotiations() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchAdminData = async () => {
      try {
        const response = await fetch("/api/admin/dashboard");
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
    fetchAdminData();
  }, [user]);

  if (loading) {
    return (
      <PortalLayout activeTab="negotiations center">
        <div className="flex h-96 items-center justify-center">
          <Loader2 size={32} className="animate-spin text-brand-secondary" />
        </div>
      </PortalLayout>
    );
  }

  // Filter negotiations from active bookings
  const bookings = data?.bookings || [];
  const activeNegotiations = bookings.filter(
    (b: any) => b.status === "NEGOTIATING" || b.status === "PENDING"
  );

  return (
    <PortalLayout activeTab="negotiations center">
      <div className="flex flex-col gap-12 max-w-4xl">
        <div className="flex flex-col gap-3">
          <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-brand-secondary">
            COMMERCIAL ARBITRATION
          </span>
          <h1 className="font-serif text-[40px] font-medium tracking-tight text-brand-primary">
            Active System Negotiations
          </h1>
        </div>

        {activeNegotiations.length === 0 ? (
          <div className="bg-brand-card border border-brand-border rounded-[24px] p-16 text-center text-brand-secondary text-sm">
            No active negotiations are currently registered on the network.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {activeNegotiations.map((neg: any) => (
              <div key={neg.id} className="bg-brand-card border border-brand-border rounded-[20px] p-6 shadow-sm hover:border-brand-primary/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-[16px] font-medium text-brand-primary">
                      {neg.vendor?.profile?.companyName || neg.vendor?.email}
                    </span>
                    <span className="px-2 py-0.5 border border-brand-border rounded-full text-[9px] uppercase tracking-wider text-brand-secondary bg-brand-bg">
                      Stall {neg.stall?.stallNumber}
                    </span>
                  </div>
                  <span className="text-[12px] font-sans text-brand-secondary">
                    {neg.festival?.name} &middot; {neg.festival?.collegeName}
                  </span>
                </div>

                <div className="flex items-center gap-6 self-end sm:self-center">
                  <div className="flex flex-col text-right">
                    <span className="text-[10px] font-sans text-brand-secondary uppercase tracking-wider">OFFERED PRICE</span>
                    <span className="font-serif text-[15px] font-semibold text-brand-primary">
                      ₹{neg.finalPrice.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <Link 
                    href={`/dashboard/negotiations?bookingId=${neg.id}`}
                    className="btn-liquid-glass text-xs py-2 px-4 flex items-center gap-1.5"
                  >
                    Enter Hub
                    <ChevronRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
