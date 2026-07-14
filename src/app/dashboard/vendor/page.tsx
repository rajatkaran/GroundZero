"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import PortalLayout from "@/components/PortalLayout";
import { Loader2, TrendingUp, DollarSign, MessageSquare, Briefcase, ChevronRight, FileText, MapPin } from "lucide-react";

export default function VendorDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [allFestivals, setAllFestivals] = useState<any[]>([]);
  const [userReviews, setUserReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Review states
  const [submittingReviewFestivalId, setSubmittingReviewFestivalId] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState("");

  useEffect(() => {
    if (!user) return;
    
    const fetchDashboardData = async () => {
      try {
        const [dashRes, festsRes] = await Promise.all([
          fetch(`/api/vendor/dashboard?vendorId=${user.id}`),
          fetch("/api/festivals")
        ]);

        if (!dashRes.ok || !festsRes.ok) {
          throw new Error("Failed to fetch dashboard intelligence.");
        }

        const dashData = await dashRes.json();
        const festsData = await festsRes.json();

        setData(dashData);
        setAllFestivals(festsData.festivals || []);
        setUserReviews(dashData.reviews || []);
      } catch (err: any) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // Simulator State
  const [simulatorFestId, setSimulatorFestId] = useState("");
  const [simulatorFootfall, setSimulatorFootfall] = useState(50000);
  const [simulatorDuration, setSimulatorDuration] = useState(3);
  const [simulatorStallPrice, setSimulatorStallPrice] = useState(45000);
  const [ticketSize, setTicketSize] = useState(250); // average spend in Rs
  const [conversionRate, setConversionRate] = useState(2.0); // 2.0% buy rate
  const [dailyExpense, setDailyExpense] = useState(5000);
  const [simulatorDailyCustomers, setSimulatorDailyCustomers] = useState(1000);

  // Sync simulator values when selected festival changes
  useEffect(() => {
    if (allFestivals.length === 0) return;

    const selected = allFestivals.find(f => f.id === simulatorFestId) || allFestivals[0];
    if (selected) {
      if (!simulatorFestId) {
        setSimulatorFestId(selected.id);
      }
      setSimulatorFootfall(selected.expectedFootfall);
      const start = new Date(selected.startDate);
      const end = new Date(selected.endDate);
      const diffDays = Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) || 1;
      setSimulatorDuration(diffDays);
      
      // Find default stall price for this festival or default to 45k
      const defaultPrice = selected.stalls?.length > 0 ? selected.stalls[0].publicPrice : 45000;
      setSimulatorStallPrice(defaultPrice);

      // Compute daily customers based on new footfall and current conversionRate
      setSimulatorDailyCustomers(Math.round(selected.expectedFootfall * (conversionRate / 100)));
    }
  }, [simulatorFestId, allFestivals]);

  // Recalculations
  const totalTransactions = simulatorDailyCustomers * simulatorDuration;
  const projectedGrossSales = totalTransactions * ticketSize;
  const totalOperatingCosts = (dailyExpense * simulatorDuration) + simulatorStallPrice;
  const projectedNetProfit = projectedGrossSales - totalOperatingCosts;
  const roi = totalOperatingCosts > 0 ? Math.round((projectedNetProfit / totalOperatingCosts) * 100) : 0;
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

  if (loading) {
    return (
      <PortalLayout activeTab="overview">
        <div className="flex h-96 items-center justify-center">
          <Loader2 size={32} className="animate-spin text-brand-secondary" />
        </div>
      </PortalLayout>
    );
  }

  const stats = data?.stats || { totalInvested: 0, bookedCount: 0, activeNegotiationsCount: 0, averageScore: 92 };
  const recommended = data?.recommended || [];
  const activeNegotiations = data?.activeNegotiations || [];
  const bookings = data?.bookings || [];

  const now = new Date();
  const activeBookings = bookings.filter((b: any) => b.festival ? new Date(b.festival.endDate) >= now : true);
  const concludedBookings = bookings.filter((b: any) => b.festival ? new Date(b.festival.endDate) < now : false);

  return (
    <PortalLayout activeTab="overview">
      <div className="flex flex-col gap-16">
        
        {/* Header Title */}
        <div className="flex flex-col gap-3">
          <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-brand-secondary">
            INTELLIGENCE CONSOLE
          </span>
          <h1 className="font-serif text-[40px] font-medium tracking-tight text-brand-primary">
            Commerce Portfolio
          </h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: "Placed Capital", value: `₹${stats.totalInvested.toLocaleString("en-IN")}`, emoji: "💰", bgClass: "bg-[var(--gz-accent-gold)] border-[var(--gz-border)] text-[var(--gz-accent-gold-text)]" },
            { label: "Secured Stalls", value: stats.bookedCount, emoji: "🎟️", bgClass: "bg-[var(--gz-accent-green)] border-[var(--gz-border)] text-[var(--gz-accent-green-text)]" },
            { label: "Active Negotiations", value: stats.activeNegotiationsCount, emoji: "💬", bgClass: "bg-[var(--gz-accent-blue)] border-[var(--gz-border)] text-[var(--gz-accent-blue-text)]" },
            { label: "GZ Quality Score", value: `${stats.averageScore}/100`, emoji: "📈", bgClass: "bg-[var(--gz-accent-warm)] border-[var(--gz-border)] text-[var(--gz-accent-warm-text)]" }
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

        {/* Dynamic Splitscreen: Active Negotiations & Secured Portfolios */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Active Negotiations Panel */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <h2 className="font-serif text-[20px] font-medium text-brand-primary border-b border-brand-border pb-3">
              Active Negotiations
            </h2>

            {activeNegotiations.length === 0 ? (
              <div className="bg-brand-card border border-brand-border rounded-2xl p-8 text-center text-brand-secondary text-sm">
                No active negotiation threads found. Explore festival maps to lock stall bookings.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {activeNegotiations.map((neg: any) => (
                  <div key={neg.id} className="bg-brand-card border border-brand-border rounded-[20px] p-6 shadow-sm hover:border-brand-primary/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-[16px] font-medium text-brand-primary">
                          {neg.festival?.name}
                        </span>
                        <span className="px-2 py-0.5 border border-brand-border rounded-full text-[9px] uppercase tracking-wider text-brand-secondary bg-brand-bg">
                          Stall {neg.stall?.stallNumber}
                        </span>
                      </div>
                      <span className="text-[12px] font-sans text-brand-secondary">
                        {neg.festival?.collegeName} &middot; {neg.festival?.location}
                      </span>
                    </div>

                    <div className="flex items-center gap-6 self-end sm:self-center">
                      <div className="flex flex-col text-right">
                        <span className="text-[11px] font-sans text-brand-secondary uppercase tracking-wider">OFFERED PRICE</span>
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

          {/* Secured Portfolios Panel */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <h2 className="font-serif text-[20px] font-medium text-brand-primary border-b border-brand-border pb-3">
              Secured Portfolios
            </h2>

            {bookings.length === 0 ? (
              <div className="bg-brand-card border border-brand-border rounded-2xl p-8 text-center text-brand-secondary text-sm">
                No finalized bookings yet. Approved contracts will appear here.
              </div>
            ) : (
              <div className="flex flex-col gap-8">
                {/* Active Bookings Sub-section */}
                <div className="flex flex-col gap-4">
                  <span className="font-sans text-[11px] uppercase tracking-wider text-brand-secondary font-semibold">
                    Active Festivals ({activeBookings.length})
                  </span>
                  {activeBookings.length === 0 ? (
                    <div className="bg-brand-card border border-brand-border rounded-2xl p-4 text-center text-brand-secondary text-xs">
                      No upcoming active festivals.
                    </div>
                  ) : (
                    activeBookings.map((booking: any) => (
                      <div key={booking.id} className="bg-brand-card border border-brand-border rounded-[20px] p-6 shadow-sm flex items-center justify-between gap-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-serif text-[15px] font-medium text-brand-primary">
                            {booking.festival?.name}
                          </span>
                          <span className="text-[11px] font-sans text-brand-secondary">
                            Stall {booking.stall?.stallNumber} &middot; {booking.stall?.dimensions} ft
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-serif text-[15px] font-semibold text-brand-primary">
                            ₹{booking.finalPrice.toLocaleString("en-IN")}
                          </span>
                          <a 
                            href={booking.contractUrl || "#"} 
                            target="_blank" 
                            rel="noreferrer"
                            className="p-2 border border-brand-border rounded-full hover:bg-brand-primary/5 text-brand-secondary hover:text-brand-primary transition-all"
                            title="Download Signed Contract"
                          >
                            <FileText size={14} />
                          </a>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Concluded Bookings Sub-section */}
                <div className="flex flex-col gap-4">
                  <span className="font-sans text-[11px] uppercase tracking-wider text-brand-secondary font-semibold">
                    Concluded & ROI Feedback ({concludedBookings.length})
                  </span>
                  {concludedBookings.length === 0 ? (
                    <div className="bg-brand-card border border-brand-border rounded-2xl p-4 text-center text-brand-secondary text-xs">
                      No concluded events in your history.
                    </div>
                  ) : (
                    concludedBookings.map((booking: any) => {
                      const hasReviewed = userReviews.some((r: any) => r.festivalId === booking.festivalId);
                      const review = userReviews.find((r: any) => r.festivalId === booking.festivalId);
                      const isFormOpen = submittingReviewFestivalId === booking.festivalId;

                      return (
                        <div key={booking.id} className="bg-brand-card border border-brand-border rounded-[20px] p-6 shadow-sm flex flex-col gap-4">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex flex-col gap-1">
                              <span className="font-serif text-[15px] font-medium text-brand-primary">
                                {booking.festival?.name}
                              </span>
                              <span className="text-[11px] font-sans text-brand-secondary">
                                Stall {booking.stall?.stallNumber} &middot; Concluded
                              </span>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="font-serif text-[15px] font-semibold text-brand-primary">
                                ₹{booking.finalPrice.toLocaleString("en-IN")}
                              </span>
                              {!hasReviewed && !isFormOpen && (
                                <button
                                  onClick={() => {
                                    setSubmittingReviewFestivalId(booking.festivalId);
                                    setReviewRating(5);
                                    setReviewComment("");
                                    setReviewError("");
                                  }}
                                  className="btn-liquid-glass text-[11px] py-1.5 px-3"
                                >
                                  Rate Event
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Review Submitted State */}
                          {hasReviewed && review && (
                            <div className="mt-2 pt-2 border-t border-brand-border flex flex-col gap-1.5 font-sans">
                              <div className="flex items-center justify-between text-xs text-brand-secondary">
                                <span>Your Audited Review</span>
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
                            <div className="mt-2 pt-4 border-t border-brand-border flex flex-col gap-4 font-sans text-xs">
                              <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] uppercase tracking-wider text-brand-secondary font-semibold">
                                  ROI Rating (Stars)
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
                                  ROI Comment & Details
                                </label>
                                <textarea
                                  placeholder="e.g. Generated 3x ROI. Footfall was amazing, clean organization."
                                  value={reviewComment}
                                  onChange={(e) => setReviewComment(e.target.value)}
                                  rows={3}
                                  className="border border-brand-border rounded-lg p-2 bg-brand-bg text-brand-primary placeholder:text-brand-secondary/60 focus:outline-none focus:border-brand-primary"
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
                                  onClick={() => handleSubmitReview(booking.festivalId)}
                                  className="btn-liquid-glass-dark text-[11px] py-1.5 px-3 flex items-center gap-1.5"
                                  disabled={reviewLoading}
                                >
                                  {reviewLoading ? (
                                    <>
                                      <Loader2 size={12} className="animate-spin" /> Submitting...
                                    </>
                                  ) : (
                                    "Post Review"
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

        </div>

        {/* Revenue Projection Simulator Panel */}
        <div className="flex flex-col gap-8 bg-brand-card border border-brand-border rounded-[28px] p-8 md:p-10 shadow-sm">
          <div className="flex flex-col gap-2 border-b border-brand-border pb-6">
            <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-brand-secondary">ROI CALCULATOR ENGINE</span>
            <h2 className="font-serif text-[24px] font-medium text-brand-primary">
              Brand Revenue Projection Simulator
            </h2>
            <p className="font-sans text-xs text-brand-secondary max-w-2xl leading-relaxed">
              Select any listed festival and simulate financial returns based on your ticket size, expected traffic conversion rate, and operating expenses.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Sliders/Inputs */}
            <div className="lg:col-span-7 flex flex-col gap-6 font-sans">
              <div className="flex flex-col gap-2">
                <label className="text-[11px] uppercase tracking-wider text-brand-secondary font-semibold">1. Select target festival</label>
                <select
                  value={simulatorFestId}
                  onChange={(e) => setSimulatorFestId(e.target.value)}
                  className="gz-select border border-brand-border rounded-xl px-4 py-3 bg-brand-bg text-brand-primary text-sm focus:outline-none focus:border-brand-primary w-full"
                >
                  {allFestivals.length === 0 ? (
                    <option value="" disabled>No published festivals found on the network</option>
                  ) : (
                    allFestivals.map((f) => (
                      <option key={f.id} value={f.id}>{f.name} ({f.collegeName})</option>
                    ))
                  )}
                </select>
              </div>

              {/* Festival Footfall Input */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-[11px] uppercase tracking-wider text-brand-secondary font-semibold">
                  <span>Festival Footfall</span>
                  <input
                    type="number"
                    value={simulatorFootfall || ""}
                    onChange={(e) => {
                      const val = e.target.value === "" ? 0 : parseInt(e.target.value) || 0;
                      setSimulatorFootfall(val);
                      setSimulatorDailyCustomers(Math.round(val * (conversionRate / 100)));
                    }}
                    className="w-32 px-3 py-1.5 border border-brand-border bg-brand-bg text-brand-primary rounded-xl focus:outline-none focus:border-brand-primary text-xs font-semibold text-right"
                  />
                </div>
                <input
                  type="range"
                  min="5000"
                  max="150000"
                  step="5000"
                  value={simulatorFootfall}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setSimulatorFootfall(val);
                    setSimulatorDailyCustomers(Math.round(val * (conversionRate / 100)));
                  }}
                  className="w-full h-1 bg-brand-border rounded-lg appearance-none cursor-pointer accent-brand-primary"
                />
              </div>

              {/* Event Duration Input */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-[11px] uppercase tracking-wider text-brand-secondary font-semibold">
                  <span>Event Duration (Days)</span>
                  <input
                    type="number"
                    value={simulatorDuration || ""}
                    onChange={(e) => setSimulatorDuration(e.target.value === "" ? 0 : parseInt(e.target.value) || 0)}
                    className="w-20 px-3 py-1.5 border border-brand-border bg-brand-bg text-brand-primary rounded-xl focus:outline-none focus:border-brand-primary text-xs font-semibold text-right"
                  />
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={simulatorDuration}
                  onChange={(e) => setSimulatorDuration(parseInt(e.target.value))}
                  className="w-full h-1 bg-brand-border rounded-lg appearance-none cursor-pointer accent-brand-primary"
                />
              </div>

              {/* Stall Rent (₹) Input */}
              <div className="flex flex-col gap-2">
                <label className="text-[11px] uppercase tracking-wider text-brand-secondary font-semibold">Stall Rent (₹)</label>
                <input
                  type="number"
                  value={simulatorStallPrice || ""}
                  onChange={(e) => setSimulatorStallPrice(e.target.value === "" ? 0 : parseInt(e.target.value) || 0)}
                  className="border border-brand-border rounded-xl px-4 py-3 bg-brand-bg text-brand-primary text-sm focus:outline-none focus:border-brand-primary w-full font-semibold"
                />
              </div>

              {/* Conversion Rate Slider & Customers Input */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-[11px] uppercase tracking-wider text-brand-secondary font-semibold">
                  <span>Conversion Rate</span>
                  <span className="text-brand-primary font-medium">{conversionRate.toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="15.0"
                  step="0.1"
                  value={conversionRate}
                  onChange={(e) => {
                    const rate = parseFloat(e.target.value);
                    setConversionRate(rate);
                    setSimulatorDailyCustomers(Math.round(simulatorFootfall * (rate / 100)));
                  }}
                  className="w-full h-1 bg-brand-border rounded-lg appearance-none cursor-pointer accent-brand-primary"
                />
                
                {/* Avg. Customers Input */}
                <div className="flex justify-between items-center mt-2 bg-brand-card/45 border border-brand-border/40 p-3 rounded-xl">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-brand-secondary">Avg. Customers/Day</label>
                  <input
                    type="number"
                    value={simulatorDailyCustomers || ""}
                    onChange={(e) => {
                      const val = e.target.value === "" ? 0 : parseInt(e.target.value) || 0;
                      setSimulatorDailyCustomers(val);
                      if (simulatorFootfall > 0) {
                        setConversionRate(Math.round(((val / simulatorFootfall) * 100) * 10) / 10);
                      }
                    }}
                    className="w-24 px-3 py-1.5 text-right border border-brand-border bg-brand-bg text-brand-primary rounded-xl text-xs font-semibold focus:outline-none"
                  />
                </div>
              </div>

              {/* Ticket Size Input */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-[11px] uppercase tracking-wider text-brand-secondary font-semibold">
                  <span>Avg. Customer Ticket Size (Spend)</span>
                  <input
                    type="number"
                    value={ticketSize || ""}
                    onChange={(e) => setTicketSize(e.target.value === "" ? 0 : parseInt(e.target.value) || 0)}
                    className="w-24 px-3 py-1.5 text-right border border-brand-border bg-brand-bg text-brand-primary rounded-xl text-xs font-semibold focus:outline-none"
                  />
                </div>
                <input
                  type="range"
                  min="50"
                  max="2000"
                  step="50"
                  value={ticketSize}
                  onChange={(e) => setTicketSize(parseInt(e.target.value))}
                  className="w-full h-1 bg-brand-border rounded-lg appearance-none cursor-pointer accent-brand-primary"
                />
              </div>

              {/* Daily Operating Expense Input */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-[11px] uppercase tracking-wider text-brand-secondary font-semibold">
                  <span>Daily Operating Expense (₹)</span>
                  <input
                    type="number"
                    value={dailyExpense || ""}
                    onChange={(e) => setDailyExpense(e.target.value === "" ? 0 : parseInt(e.target.value) || 0)}
                    className="w-28 px-3 py-1.5 text-right border border-brand-border bg-brand-bg text-brand-primary rounded-xl text-xs font-semibold focus:outline-none"
                  />
                </div>
                <input
                  type="range"
                  min="500"
                  max="30000"
                  step="500"
                  value={dailyExpense}
                  onChange={(e) => setDailyExpense(parseInt(e.target.value))}
                  className="w-full h-1 bg-brand-border rounded-lg appearance-none cursor-pointer accent-brand-primary"
                />
              </div>
            </div>

            {/* Right Column: Dynamic Results Cards */}
            <div className="lg:col-span-5 bg-brand-bg border border-brand-border rounded-[20px] p-6 flex flex-col justify-between gap-6">
              <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-brand-secondary">PROSPECTUS SUMMARY</span>
              
              <div className="flex flex-col gap-4 font-sans text-xs border-b border-brand-border pb-4">
                <div className="flex justify-between">
                  <span className="text-brand-secondary">Expected Total Footfall</span>
                  <span className="font-semibold text-brand-primary">{simulatorFootfall.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-secondary">Festival Duration</span>
                  <span className="font-semibold text-brand-primary">{simulatorDuration} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-secondary">Stall Space Rental</span>
                  <span className="font-semibold text-brand-primary">₹{simulatorStallPrice.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-secondary">Projected Total Transactions</span>
                  <span className="font-semibold text-brand-primary">{totalTransactions.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Output Results */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col">
                  <span className="font-sans text-[10px] uppercase tracking-wider text-brand-secondary">Projected Gross Sales</span>
                  <span className="font-serif text-[28px] font-semibold text-brand-primary">₹{projectedGrossSales.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-sans text-[10px] uppercase tracking-wider text-brand-secondary">Total Costs (Stall + Ops)</span>
                  <span className="font-serif text-[20px] font-semibold text-brand-secondary">₹{totalOperatingCosts.toLocaleString("en-IN")}</span>
                </div>
                
                <div className="border-t border-brand-border pt-4 mt-2 flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="font-sans text-[10px] uppercase tracking-wider text-brand-secondary">Estimated Net Profit</span>
                    <span className={`font-serif text-[24px] font-semibold ${projectedNetProfit >= 0 ? "text-brand-primary" : "text-red-500"}`}>
                      {projectedNetProfit >= 0 ? "+" : ""}₹{projectedNetProfit.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <span className={`px-3 py-1 border rounded-full text-xs font-semibold ${roi >= 0 ? "bg-[var(--gz-accent-green)] text-[var(--gz-accent-green-text)] border-[var(--gz-accent-green-text)]" : "bg-red-500/10 text-red-500 border-red-500/20"}`}>
                    {roi >= 0 ? `+${roi}% ROI` : `${roi}% ROI`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Curated Recommendations */}
        <div className="flex flex-col gap-6">
          <h2 className="font-serif text-[20px] font-medium text-brand-primary border-b border-brand-border pb-3">
            Elite Opportunities on the Network
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recommended.map((fest: any) => (
              <div key={fest.id} className="editorial-card p-6 bg-brand-card border border-brand-border flex flex-col justify-between min-h-[200px]">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <span className="font-serif text-[18px] font-medium text-brand-primary">{fest.name}</span>
                    <span className="px-2 py-0.5 bg-black text-[#FAFAFA] font-medium text-[9px] rounded-full tracking-wider uppercase">
                      Score {fest.opportunityScore}
                    </span>
                  </div>
                  <div className="flex flex-col font-sans text-xs text-brand-secondary gap-1">
                    <span className="flex items-center gap-1.5"><MapPin size={12} /> {fest.collegeName}, {fest.location.split(",")[0]}</span>
                    <span>Expected Footfall: <strong className="text-brand-primary font-medium">{fest.expectedFootfall.toLocaleString("en-IN")}</strong></span>
                  </div>
                </div>

                <div className="border-t border-black/[0.04] pt-4 mt-6 flex justify-end">
                  <Link 
                    href={`/festival/${fest.id}`} 
                    className="flex items-center gap-1.5 font-sans text-xs font-semibold text-brand-primary hover:gap-2 transition-all"
                  >
                    Evaluate Stalls <ChevronRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </PortalLayout>
  );
}
