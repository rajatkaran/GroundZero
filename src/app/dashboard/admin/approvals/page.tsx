"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import PortalLayout from "@/components/PortalLayout";
import { Loader2, Check, ShieldCheck, Mail, MapPin } from "lucide-react";

export default function AdminApprovals() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchAdminApprovals = async () => {
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

  useEffect(() => {
    if (!user) return;
    fetchAdminApprovals();
  }, [user]);

  const handleApproveFestival = async (festivalId: string) => {
    setActionLoading(`fest-${festivalId}`);
    try {
      const response = await fetch("/api/admin/approve-festival", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ festivalId }),
      });
      if (response.ok) {
        await fetchAdminApprovals();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleVerifyUser = async (userId: string) => {
    setActionLoading(`user-${userId}`);
    try {
      const response = await fetch("/api/admin/verify-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (response.ok) {
        await fetchAdminApprovals();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <PortalLayout activeTab="approvals">
        <div className="flex h-96 items-center justify-center">
          <Loader2 size={32} className="animate-spin text-brand-secondary" />
        </div>
      </PortalLayout>
    );
  }

  const pendingFestivals = data?.pendingFestivals || [];
  const pendingUsers = data?.pendingUsers || [];

  return (
    <PortalLayout activeTab="approvals">
      <div className="flex flex-col gap-12 max-w-5xl">
        <div className="flex flex-col gap-3">
          <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-brand-secondary">
            PENDING AUDITS QUEUES
          </span>
          <h1 className="font-serif text-[40px] font-medium tracking-tight text-brand-primary">
            Approvals & Verifications
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Festivals */}
          <div className="flex flex-col gap-6">
            <h2 className="font-serif text-[20px] font-medium text-brand-primary border-b border-black/[0.06] pb-3">
              Festival Approvals ({pendingFestivals.length})
            </h2>
            {pendingFestivals.length === 0 ? (
              <div className="bg-brand-card border border-brand-border rounded-2xl p-8 text-center text-brand-secondary text-sm">
                No festival listing requests pending administrative review.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {pendingFestivals.map((fest: any) => (
                  <div key={fest.id} className="bg-brand-card border border-brand-border rounded-[20px] p-6 shadow-sm flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-serif text-[16px] font-medium text-brand-primary">{fest.name}</span>
                      <span className="text-xs font-sans text-brand-secondary flex items-center gap-1.5"><MapPin size={12} /> {fest.collegeName} &middot; {fest.location}</span>
                    </div>
                    <div className="border-t border-black/[0.04] pt-4 mt-2 flex justify-end">
                      <button
                        onClick={() => handleApproveFestival(fest.id)}
                        disabled={actionLoading !== null}
                        className="btn-liquid-glass-dark text-xs py-2 px-6 flex items-center gap-1.5"
                      >
                        {actionLoading === `fest-${fest.id}` ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <>
                            <Check size={12} /> Approve & Publish
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Users */}
          <div className="flex flex-col gap-6">
            <h2 className="font-serif text-[20px] font-medium text-brand-primary border-b border-black/[0.06] pb-3">
              Merchant Verifications ({pendingUsers.length})
            </h2>
            {pendingUsers.length === 0 ? (
              <div className="bg-brand-card border border-brand-border rounded-2xl p-8 text-center text-brand-secondary text-sm">
                No user onboarding requests pending administrative verification.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {pendingUsers.map((u: any) => (
                  <div key={u.id} className="bg-brand-card border border-brand-border rounded-[20px] p-6 shadow-sm flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <span className="font-serif text-[16px] font-medium text-brand-primary">{u.profile?.companyName || "Unnamed Entity"}</span>
                      <span className="text-xs font-sans text-brand-secondary flex items-center gap-1.5"><Mail size={12} /> {u.email}</span>
                      <span className="text-[10px] font-sans text-brand-secondary uppercase mt-1">Category: {u.profile?.category || "Host"} &middot; Role: {u.role}</span>
                    </div>
                    <div className="border-t border-black/[0.04] pt-4 mt-2 flex justify-end">
                      <button
                        onClick={() => handleVerifyUser(u.id)}
                        disabled={actionLoading !== null}
                        className="btn-liquid-glass-dark text-xs py-2 px-6 flex items-center gap-1.5"
                      >
                        {actionLoading === `user-${u.id}` ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <>
                            <ShieldCheck size={12} /> Verify Account
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </PortalLayout>
  );
}
