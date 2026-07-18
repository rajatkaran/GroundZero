"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import PortalLayout from "@/components/PortalLayout";
import { Loader2, TrendingUp, DollarSign, MessageSquare, Landmark, Plus, ChevronRight, MapPin, Users } from "lucide-react";

export default function OrganizerDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [userReviews, setUserReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Review states
  const [submittingReviewFestivalId, setSubmittingReviewFestivalId] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [expandedFests, setExpandedFests] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!user) return;
    
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`/api/organizer/dashboard?organizerId=${user.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch organizer dashboard analytics.");
        }
        const res = await response.json();
        setData(res);
        setUserReviews(res.reviews || []);
      } catch (err: any) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const handleSubmitReview = async (festivalId: string) => {
    if (!user) return;
    setReviewLoading(true);
    setReviewError("");
    try {
      const response = await fetch("/api/festivals/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          festivalId,
          userId: user.id,
          rating: reviewRating,
          comment: reviewComment
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit review.");
      }

      const resData = await response.json();
      
      // Update local state with the new review
      setUserReviews(prev => [...prev, resData.review]);
      
      // Reset form states
      setSubmittingReviewFestivalId(null);
      setReviewComment("");
      setReviewRating(5);
    } catch (err: any) {
      setReviewError(err.message || "An unexpected error occurred.");
    } finally {
      setReviewLoading(false);
    }
  };

  const [showDirectBookModal, setShowDirectBookModal] = useState(false);
  const [selectedStallForDirect, setSelectedStallForDirect] = useState<any>(null);
  const [directVendorEmail, setDirectVendorEmail] = useState("");
  const [directFinalPrice, setDirectFinalPrice] = useState("");
  const [directBookingLoading, setDirectBookingLoading] = useState(false);

  const handleConfirmDirectBook = async () => {
    if (!selectedStallForDirect || !user) return;
    setDirectBookingLoading(true);
    try {
      const response = await fetch("/api/organizer/direct-book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stallId: selectedStallForDirect.id,
          vendorEmail: directVendorEmail,
          finalPrice: directFinalPrice || selectedStallForDirect.publicPrice,
          organizerId: user.id
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to mark stall as booked.");
      }
      alert("Stall successfully booked and allocated!");
      setShowDirectBookModal(false);
      setSelectedStallForDirect(null);
      setDirectVendorEmail("");
      setDirectFinalPrice("");
      window.location.reload();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setDirectBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <PortalLayout activeTab="overview">
        <div className="flex h-96 items-center justify-center">
          <Loader2 size={32} className="animate-spin text-brand-secondary" />
        </div>
      </PortalLayout>
    );
  }

  const stats = data?.stats || { totalRevenue: 0, occupancy: 0, pendingRequestsCount: 0, liveListingsCount: 0 };
  const festivals = data?.festivals || [];
  const pendingRequests = data?.pendingRequests || [];

  const now = new Date();
  const activeFestivals = festivals.filter((fest: any) => new Date(fest.endDate) >= now);
  const concludedFestivals = festivals.filter((fest: any) => new Date(fest.endDate) < now);

  return (
    <PortalLayout activeTab="overview">
      <div className="flex flex-col gap-16">
        
        {/* Header Title with quick CTA */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-6">
          <div className="flex flex-col gap-3">
            <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-brand-secondary">
              ORGANIZER CONTROL ROOM
            </span>
            <h1 className="font-serif text-[40px] font-medium tracking-tight text-brand-primary">
              Festival Directory
            </h1>
          </div>

          <Link href="/dashboard/organizer/create" className="btn-liquid-glass-dark text-xs flex items-center gap-2 self-start sm:self-auto">
            <Plus size={14} />
            Register New Festival
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: "Gross Revenue Collected", value: `₹${stats.totalRevenue.toLocaleString("en-IN")}`, emoji: "💰", bgClass: "bg-[var(--gz-accent-gold)] border-[var(--gz-border)] text-[var(--gz-accent-gold-text)]" },
            { label: "Stall Occupancy Index", value: `${stats.occupancy}%`, emoji: "📈", bgClass: "bg-[var(--gz-accent-green)] border-[var(--gz-border)] text-[var(--gz-accent-green-text)]" },
            { label: "Pending Deal Proposals", value: stats.pendingRequestsCount, emoji: "💬", bgClass: "bg-[var(--gz-accent-blue)] border-[var(--gz-border)] text-[var(--gz-accent-blue-text)]" },
            { label: "Published Listings", value: stats.liveListingsCount, emoji: "🎪", bgClass: "bg-[var(--gz-accent-warm)] border-[var(--gz-border)] text-[var(--gz-accent-warm-text)]" }
          ].map((stat, i) => (
            <div key={i} className={`${stat.bgClass} border rounded-[20px] p-6 shadow-sm flex flex-col justify-between h-36 transition-all hover:scale-[1.02]`}>
              <div className="flex justify-between items-center opacity-80">
                <span className="font-sans text-[11px] uppercase tracking-wider font-semibold">{stat.label}</span>
                <span className="text-lg">{stat.emoji}</span>
              </div>
              <span className="font-serif text-[28px] font-semibold mt-4">
                {stat.value}
              </span>
            </div>
          ))}
        </div>

        {/* splitscreen properties & requests */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Registered Properties List */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <h2 className="font-serif text-[20px] font-medium text-brand-primary border-b border-brand-border pb-3">
              Registered Festival Properties
            </h2>

            {festivals.length === 0 ? (
              <div className="bg-brand-card border border-brand-border rounded-2xl p-12 text-center text-brand-secondary text-sm flex flex-col items-center gap-6">
                <span>You haven't registered any festivals yet. Publish your first property to start vendor discovery.</span>
                <Link href="/dashboard/organizer/create" className="btn-liquid-glass text-xs py-2 px-6">
                  Register Festival
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-10">
                {/* Active Properties */}
                <div className="flex flex-col gap-6">
                  <span className="font-sans text-[11px] uppercase tracking-wider text-brand-secondary font-semibold">
                    Active Festival Properties ({activeFestivals.length})
                  </span>
                  {activeFestivals.length === 0 ? (
                    <div className="bg-brand-card border border-brand-border rounded-2xl p-6 text-center text-brand-secondary text-xs">
                      No active properties listing. Register one above.
                    </div>
                  ) : (
                    activeFestivals.map((fest: any) => {
                      const bookedCount = fest.bookings.filter((b: any) => b.status === "PAID").length;
                      return (
                        <div key={fest.id} className="bg-brand-card border border-brand-border rounded-[24px] p-4 sm:p-6 md:p-8 shadow-sm flex flex-col justify-between gap-6 hover:border-brand-primary/20 transition-all">
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

                          <div className="grid grid-cols-3 gap-4 border-y border-brand-border py-4 font-sans text-[12px] text-brand-secondary">
                            <div className="flex flex-col gap-0.5">
                              <span>Stalls Inventory</span>
                              <span className="font-serif text-[15px] font-medium text-brand-primary">
                                {bookedCount} / {fest.stalls.length} Booked
                              </span>
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <span>Footfall Rating</span>
                              <span className="font-serif text-[15px] font-medium text-brand-primary flex items-center gap-1">
                                <Users size={12} /> {fest.expectedFootfall.toLocaleString("en-IN")}
                              </span>
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <span>Opportunity Index</span>
                              <span className="font-serif text-[15px] font-medium text-brand-primary">
                                {fest.opportunityScore}/100
                              </span>
                            </div>
                          </div>

                          {/* Share Event Link Row */}
                          <div className="flex items-center justify-between bg-brand-bg/50 border border-brand-border/60 rounded-xl px-4 py-3 text-xs font-sans gap-3 w-full min-w-0">
                            <div className="flex flex-col gap-0.5 text-left min-w-0 flex-1">
                              <span className="text-[9px] uppercase tracking-wider text-brand-secondary font-semibold">Share Event Page Link</span>
                              <span className="font-semibold text-brand-primary truncate block">groundzero.thinkthrough.{fest.name.toLowerCase().replace(/[^a-z0-9]/g, "")}</span>
                            </div>
                            <button
                              onClick={() => {
                                const slug = fest.name.toLowerCase().replace(/[^a-z0-9]/g, "");
                                const url = `${window.location.origin}/festival/${slug}`;
                                navigator.clipboard.writeText(url);
                                alert("Share link copied to clipboard!");
                              }}
                              className="px-3 py-1.5 bg-brand-border text-brand-primary hover:bg-brand-primary hover:text-brand-bg rounded-lg text-[10px] font-semibold transition-all cursor-pointer flex-shrink-0"
                            >
                              Copy Link
                            </button>
                          </div>

                          <div className="grid grid-cols-2 md:flex md:justify-end gap-3 w-full">
                            <button 
                              onClick={() => setExpandedFests(prev => ({ ...prev, [fest.id]: !prev[fest.id] }))}
                              className="btn-liquid-glass text-xs py-2 px-3 cursor-pointer flex items-center justify-center text-center"
                            >
                              {expandedFests[fest.id] ? "Hide Stalls" : "Show Stalls"}
                            </button>
                            <Link 
                              href={`/dashboard/organizer/edit?festivalId=${fest.id}`}
                              className="btn-liquid-glass text-xs py-2 px-3 flex items-center justify-center text-center"
                            >
                              Edit Details
                            </Link>
                            <Link 
                              href={`/dashboard/organizer/mapper?festivalId=${fest.id}`}
                              className="btn-liquid-glass text-xs py-2 px-3 flex items-center justify-center text-center gap-1"
                            >
                              🎨 Map Canvas
                            </Link>
                            <Link 
                              href={`/festival/${fest.name.toLowerCase().replace(/[^a-z0-9]/g, "")}`}
                              className="btn-liquid-glass-dark text-xs py-2 px-3 flex items-center justify-center text-center"
                            >
                              View Live
                            </Link>
                          </div>

                          {expandedFests[fest.id] && (
                            <div className="border-t border-brand-border pt-6 mt-4 flex flex-col gap-4 font-sans text-xs">
                              <h4 className="font-serif text-[15px] font-medium text-brand-primary">Stall Directory & Real-time Allocation</h4>
                              {fest.stalls.length === 0 ? (
                                <div className="text-brand-secondary/60 italic py-2">No stalls mapped yet. Use the Map Creator Canvas to draw stalls.</div>
                              ) : (
                                <div className="border border-brand-border rounded-xl bg-brand-bg/50 max-h-60 overflow-y-auto overflow-x-auto w-full min-w-full">
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
                                                    <Link 
                                                      key={i} 
                                                      href={`/dashboard/negotiations?bookingId=${nb.id}`}
                                                      className="text-brand-secondary hover:text-brand-primary text-[11px] block transition-colors underline decoration-brand-border/60 hover:decoration-brand-primary/50"
                                                    >
                                                      💬 {nb.vendor?.profile?.companyName || nb.vendor?.email} (₹{nb.finalPrice.toLocaleString("en-IN")})
                                                    </Link>
                                                  ))}
                                                </div>
                                              ) : (
                                                <div className="flex items-center justify-between gap-2">
                                                  <span className="opacity-40 italic">Available</span>
                                                  {fest.allowOrganizerDirectBook && stall.status !== "BOOKED" && (
                                                    <button
                                                      onClick={() => {
                                                        setSelectedStallForDirect(stall);
                                                        setShowDirectBookModal(true);
                                                      }}
                                                      className="text-[9px] bg-purple-600 hover:bg-purple-500 text-white px-2 py-1 rounded font-semibold cursor-pointer uppercase tracking-wider transition-all"
                                                    >
                                                      Direct Book
                                                    </button>
                                                  )}
                                                </div>
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
                    })
                  )}
                </div>

                {/* Concluded Properties & Feedback */}
                <div className="flex flex-col gap-6">
                  <span className="font-sans text-[11px] uppercase tracking-wider text-brand-secondary font-semibold">
                    Concluded & GZ Experience Feedback ({concludedFestivals.length})
                  </span>
                  {concludedFestivals.length === 0 ? (
                    <div className="bg-brand-card border border-brand-border rounded-2xl p-6 text-center text-brand-secondary text-xs">
                      No concluded festival history.
                    </div>
                  ) : (
                    concludedFestivals.map((fest: any) => {
                      const hasReviewed = userReviews.some((r: any) => r.festivalId === fest.id);
                      const review = userReviews.find((r: any) => r.festivalId === fest.id);
                      const isFormOpen = submittingReviewFestivalId === fest.id;
                      const bookedCount = fest.bookings.filter((b: any) => b.status === "PAID").length;

                      return (
                        <div key={fest.id} className="bg-brand-card border border-brand-border rounded-[24px] p-8 shadow-sm flex flex-col gap-6">
                          <div className="flex justify-between items-start">
                            <div className="flex flex-col gap-1.5">
                              <h3 className="font-serif text-[18px] font-medium text-brand-primary">
                                {fest.name}
                              </h3>
                              <span className="text-[12px] font-sans text-brand-secondary flex items-center gap-1.5">
                                <MapPin size={12} /> Concluded
                              </span>
                            </div>
                            {!hasReviewed && !isFormOpen && (
                              <button
                                onClick={() => {
                                  setSubmittingReviewFestivalId(fest.id);
                                  setReviewRating(5);
                                  setReviewComment("");
                                  setReviewError("");
                                }}
                                className="btn-liquid-glass text-xs py-1.5 px-4"
                              >
                                Submit Experience Feedback
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-4 border-y border-brand-border py-4 font-sans text-[12px] text-brand-secondary">
                            <div className="flex flex-col gap-0.5">
                              <span>Total Stalls Booked</span>
                              <span className="font-serif text-[15px] font-medium text-brand-primary">
                                {bookedCount} Stalls
                              </span>
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <span>Final Footfall</span>
                              <span className="font-serif text-[15px] font-medium text-brand-primary">
                                {fest.expectedFootfall.toLocaleString("en-IN")} (Expected)
                              </span>
                            </div>
                          </div>

                          {/* Review Submitted State */}
                          {hasReviewed && review && (
                            <div className="pt-2 flex flex-col gap-1.5 font-sans">
                              <div className="flex items-center justify-between text-xs text-brand-secondary">
                                <span>Your Experience Review</span>
                                <div className="flex text-amber-500 font-semibold gap-0.5">
                                  {Array.from({ length: 5 }).map((_, idx) => (
                                    <span key={idx}>{idx < review.rating ? "★" : "☆"}</span>
                                  ))}
                                </div>
                              </div>
                              <p className="text-xs italic text-brand-primary/80 bg-brand-bg/50 border border-brand-border rounded-lg p-2.5">
                                "{review.comment}"
                              </p>
                            </div>
                          )}

                          {/* Review Input Form */}
                          {isFormOpen && (
                            <div className="pt-4 border-t border-brand-border flex flex-col gap-4 font-sans text-xs">
                              <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] uppercase tracking-wider text-brand-secondary font-semibold">
                                  Overall Experience (Stars)
                                </label>
                                <div className="flex gap-2">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                      key={star}
                                      type="button"
                                      onClick={() => setReviewRating(star)}
                                      className={`text-xl transition-all ${
                                        star <= reviewRating ? "text-amber-500 hover:scale-110" : "text-brand-secondary hover:text-amber-500"
                                      }`}
                                    >
                                      ★
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] uppercase tracking-wider text-brand-secondary font-semibold">
                                  Experience Feedback
                                </label>
                                <textarea
                                  placeholder="e.g. GZ made our stall management fully digital and easy. Highly recommended!"
                                  value={reviewComment}
                                  onChange={(e) => setReviewComment(e.target.value)}
                                  rows={3}
                                  className="border border-brand-border rounded-lg p-2.5 bg-brand-bg text-brand-primary placeholder:text-brand-secondary/60 focus:outline-none focus:border-brand-primary"
                                />
                              </div>

                              {reviewError && (
                                <p className="text-red-500 text-[11px]">{reviewError}</p>
                              )}

                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => setSubmittingReviewFestivalId(null)}
                                  className="px-3 py-1.5 border border-brand-border rounded-lg hover:bg-brand-primary/5 transition-all text-[11px] text-brand-secondary"
                                  disabled={reviewLoading}
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSubmitReview(fest.id)}
                                  className="btn-liquid-glass-dark text-[11px] py-1.5 px-3 flex items-center gap-1.5"
                                  disabled={reviewLoading}
                                >
                                  {reviewLoading ? (
                                    <>
                                      <Loader2 size={12} className="animate-spin" /> Submitting...
                                    </>
                                  ) : (
                                    "Submit Review"
                                  )}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Incoming Proposals Queue */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <h2 className="font-serif text-[20px] font-medium text-brand-primary border-b border-brand-border pb-3">
              Incoming Deal Proposals
            </h2>

            {pendingRequests.length === 0 ? (
              <div className="bg-brand-card border border-brand-border rounded-2xl p-8 text-center text-brand-secondary text-sm">
                No active booking requests or price negotiations awaiting review.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {pendingRequests.map((req: any) => (
                  <div key={req.id} className="bg-brand-card border border-brand-border rounded-[20px] p-6 shadow-sm flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col gap-1">
                        <span className="font-serif text-[15px] font-medium text-brand-primary">
                          {req.vendorName}
                        </span>
                        <span className="text-[11px] font-sans text-brand-secondary">
                          {req.festivalName} &middot; Stall {req.stallNumber} ({req.dimensions} ft)
                        </span>
                      </div>
                      <span className="px-2 py-0.5 border border-brand-border rounded-full text-[8px] uppercase tracking-wider font-semibold bg-brand-bg text-brand-secondary">
                        {req.status}
                      </span>
                    </div>

                    <div className="flex justify-between items-center border-t border-brand-border pt-4 mt-2">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-sans text-brand-secondary uppercase tracking-wider">PROPOSED PRICE</span>
                        <span className="font-serif text-[16px] font-semibold text-brand-primary">
                          ₹{req.finalPrice.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <Link 
                        href={`/dashboard/negotiations?bookingId=${req.id}`}
                        className="btn-liquid-glass text-xs py-1.5 px-4 flex items-center gap-1.5"
                      >
                        Negotiate
                        <ChevronRight size={12} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Direct Booking Modal */}
      {showDirectBookModal && selectedStallForDirect && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-brand-bg border border-brand-border w-full max-w-md rounded-2xl p-6 shadow-2xl flex flex-col gap-5">
            <div className="flex justify-between items-center border-b border-brand-border/40 pb-3">
              <h3 className="font-serif font-medium text-lg text-brand-primary">
                Direct Stall Allocation (Stall {selectedStallForDirect.stallNumber})
              </h3>
              <button 
                onClick={() => {
                  setShowDirectBookModal(false);
                  setSelectedStallForDirect(null);
                  setDirectVendorEmail("");
                  setDirectFinalPrice("");
                }}
                className="text-brand-secondary hover:text-brand-primary text-xs cursor-pointer font-bold bg-transparent border-none"
              >
                Close
              </button>
            </div>

            <div className="flex flex-col gap-4 font-sans text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-semibold tracking-wider text-brand-secondary">Vendor Email</label>
                <input
                  type="email"
                  value={directVendorEmail}
                  onChange={(e) => setDirectVendorEmail(e.target.value)}
                  placeholder="vendor@company.com (optional)"
                  className="w-full px-3 py-2.5 rounded-xl border border-brand-border bg-brand-card text-brand-primary focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-semibold tracking-wider text-brand-secondary">Final Allocation Price (₹)</label>
                <input
                  type="number"
                  value={directFinalPrice}
                  onChange={(e) => setDirectFinalPrice(e.target.value)}
                  placeholder={`Default: ₹${selectedStallForDirect.publicPrice}`}
                  className="w-full px-3 py-2.5 rounded-xl border border-brand-border bg-brand-card text-brand-primary focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>

            <button
              onClick={handleConfirmDirectBook}
              disabled={directBookingLoading}
              className="btn-liquid-glass-dark w-full py-3 mt-2 flex justify-center items-center gap-1.5 text-xs font-semibold"
            >
              {directBookingLoading ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                "Confirm & Mark Booked"
              )}
            </button>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
