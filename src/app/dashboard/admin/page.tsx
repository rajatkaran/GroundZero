"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import PortalLayout from "@/components/PortalLayout";
import { Loader2, TrendingUp, DollarSign, MessageSquare, Check, Landmark, ShieldCheck, Mail, MapPin, X, Users, ClipboardList, ArrowLeft, Phone, Info, Lock, Unlock, FileDown, CheckCircle2, XCircle, Map, Plus } from "lucide-react";
import StallMap from "@/components/StallMap";

const getFallbackImage = (id: string | number) => {
  const fallbacks = [
    "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1200",
    "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1200",
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200",
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200",
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200"
  ];
  const str = String(id);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % fallbacks.length;
  return fallbacks[index];
};

const getDecksList = (fest: any) => {
  if (!fest || !fest.decks) return [];
  try {
    return JSON.parse(fest.decks);
  } catch (e) {
    return [];
  }
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Sub-view panel state
  const [activeSubView, setActiveSubView] = useState<"revenue" | "occupancy" | "deals" | "listings" | "reports">("revenue");
  const [selectedStall, setSelectedStall] = useState<any>(null);
  const [occupancyViewMode, setOccupancyViewMode] = useState<"directory" | "map">("directory");

  // User Dossier / Search Filter States
  const [selectedDirectoryUserId, setSelectedDirectoryUserId] = useState<string | null>(null);
  const [directorySearchQuery, setDirectorySearchQuery] = useState("");
  const [directoryRoleFilter, setDirectoryRoleFilter] = useState<"ALL" | "VENDOR" | "ORGANIZER" | "ADMIN">("ALL");

  // Manual Force Booking States
  const [showManualBookModal, setShowManualBookModal] = useState(false);
  const [manualBookStallId, setManualBookStallId] = useState("");
  const [manualBookVendorId, setManualBookVendorId] = useState("");
  const [manualBookPrice, setManualBookPrice] = useState("");
  const [manualBookLoading, setManualBookLoading] = useState(false);

  // Approval Commission inputs per pending festival
  const [defaultCommissions, setDefaultCommissions] = useState<Record<string, string>>({});

  // Adjustment States for commissions editor
  const [selectedFestId, setSelectedFestId] = useState("");
  const [opportunityScoreInput, setOpportunityScoreInput] = useState<number>(50);
  const [editingStallId, setEditingStallId] = useState<string | null>(null);
  const [stallCommissionInput, setStallCommissionInput] = useState<string>("");

  // CRM feedback edit states
  const [editingCrmUserId, setEditingCrmUserId] = useState<string | null>(null);
  const [crmFeedbackInput, setCrmFeedbackInput] = useState("");

  // Financial Reports States
  const [reportType, setReportType] = useState<"monthly" | "event">("monthly");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedFestivalReportId, setSelectedFestivalReportId] = useState<string>("");
  const [miscExpenses, setMiscExpenses] = useState<string>("0");
  const [generatedReport, setGeneratedReport] = useState<any | null>(null);
  const [savedReports, setSavedReports] = useState<any[]>([]);

  const fetchAdminData = async () => {
    try {
      const response = await fetch("/api/admin/dashboard");
      if (!response.ok) {
        throw new Error("Failed to fetch administrative intelligence.");
      }
      const res = await response.json();
      setData(res);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async () => {
    try {
      const response = await fetch("/api/admin/reports");
      if (response.ok) {
        const res = await response.json();
        setSavedReports(res.reports || []);
      }
    } catch (err) {
      console.error("Error fetching reports:", err);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchAdminData();
    fetchReports();
  }, [user]);

  const handleApproveFestival = async (festivalId: string) => {
    setActionLoading(`fest-${festivalId}`);
    const commission = defaultCommissions[festivalId] || "2000";
    try {
      const response = await fetch("/api/admin/approve-festival", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ festivalId, defaultCommission: commission }),
      });
      if (!response.ok) {
        throw new Error("Failed to approve festival listing.");
      }
      await fetchAdminData();
    } catch (err: any) {
      alert(err.message);
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
      if (!response.ok) {
        throw new Error("Failed to verify user profile.");
      }
      await fetchAdminData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  // Negotiation Deal Approval from dashboard
  const handleApproveDeal = async (bookingId: string) => {
    setActionLoading(`deal-${bookingId}`);
    try {
      const response = await fetch("/api/negotiation/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, userId: user?.id }),
      });
      if (!response.ok) {
        throw new Error("Failed to approve deal proposal.");
      }
      await fetchAdminData();
      alert("Negotiation deal approved successfully! Price locked.");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  // Negotiation Deal Rejection from dashboard
  const handleRejectDeal = async (bookingId: string) => {
    if (!confirm("Are you sure you want to reject and cancel this deal proposal?")) return;
    setActionLoading(`deal-${bookingId}`);
    try {
      const response = await fetch("/api/negotiation/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, userId: user?.id }),
      });
      if (!response.ok) {
        throw new Error("Failed to reject deal proposal.");
      }
      await fetchAdminData();
      alert("Negotiation deal rejected. Stall released back to pool.");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateOpportunityScore = async () => {
    if (!selectedFestId) return;
    setActionLoading(`score-${selectedFestId}`);
    try {
      const response = await fetch("/api/admin/adjust-festival", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ festivalId: selectedFestId, opportunityScore: opportunityScoreInput }),
      });
      if (!response.ok) throw new Error("Failed to update opportunity score.");
      await fetchAdminData();
      alert("Opportunity Score updated successfully!");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateStallCommission = async (stallId: string) => {
    setActionLoading(`stall-${stallId}`);
    const commission = parseFloat(stallCommissionInput);
    if (isNaN(commission)) {
      alert("Please enter a valid numeric commission.");
      setActionLoading(null);
      return;
    }
    try {
      const response = await fetch("/api/admin/adjust-festival", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stallId, commissionAmount: commission }),
      });
      if (!response.ok) throw new Error("Failed to update stall commission.");
      await fetchAdminData();
      setEditingStallId(null);
      alert("Stall pricing and commission adjusted!");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleMarkPaidOffline = async (bookingId: string) => {
    setActionLoading(`pay-${bookingId}`);
    try {
      const response = await fetch("/api/admin/mark-paid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });
      if (!response.ok) {
        throw new Error("Failed to mark booking as paid.");
      }
      await fetchAdminData();
      alert("Booking marked as PAID offline successfully!");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleSaveCrmFeedback = async (userId: string) => {
    setActionLoading(`crm-${userId}`);
    try {
      const response = await fetch("/api/admin/save-crm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, adminFeedback: crmFeedbackInput }),
      });

      if (!response.ok) {
        throw new Error("Failed to save CRM feedback.");
      }

      await fetchAdminData();
      setEditingCrmUserId(null);
      alert("CRM feedback notes updated!");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleMapLock = async (festId: string) => {
    setActionLoading(`maplock-${festId}`);
    try {
      const response = await fetch("/api/admin/adjust-festival", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ festivalId: festId, action: "toggle_map_lock" }),
      });
      if (!response.ok) throw new Error("Failed to toggle map lock.");
      await fetchAdminData();
      alert("Map lock status updated successfully!");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleApproveLineup = async (festId: string) => {
    setActionLoading(`lineup-${festId}`);
    try {
      const response = await fetch("/api/admin/adjust-festival", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ festivalId: festId, action: "approve_lineup" }),
      });
      if (!response.ok) throw new Error("Failed to approve artist lineup change.");
      await fetchAdminData();
      alert("Artist lineup change approved successfully!");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectLineup = async (festId: string) => {
    setActionLoading(`lineup-${festId}`);
    try {
      const response = await fetch("/api/admin/adjust-festival", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ festivalId: festId, action: "reject_lineup" }),
      });
      if (!response.ok) throw new Error("Failed to reject artist lineup change.");
      await fetchAdminData();
      alert("Artist lineup change rejected and cleared.");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleApproveDeck = async (festId: string, deckId: string) => {
    setActionLoading(`deck-${deckId}`);
    try {
      const response = await fetch("/api/admin/adjust-festival", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ festivalId: festId, action: "approve_deck", deckId }),
      });
      if (!response.ok) throw new Error("Failed to approve deck.");
      await fetchAdminData();
      alert("Festival deck has been approved and published!");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectDeck = async (festId: string, deckId: string) => {
    setActionLoading(`deck-${deckId}`);
    try {
      const response = await fetch("/api/admin/adjust-festival", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ festivalId: festId, action: "reject_deck", deckId }),
      });
      if (!response.ok) throw new Error("Failed to reject deck.");
      await fetchAdminData();
      alert("Festival deck has been rejected.");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleManualBookStall = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFestId || !manualBookVendorId || !manualBookStallId || !manualBookPrice) {
      alert("Please fill in all manual booking fields.");
      return;
    }
    setManualBookLoading(true);
    try {
      const response = await fetch("/api/admin/manual-book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          festivalId: selectedFestId,
          vendorId: manualBookVendorId,
          stallId: manualBookStallId,
          finalPrice: manualBookPrice
        })
      });

      const res = await response.json();
      if (!response.ok) {
        throw new Error(res.message || "Failed to book stall manually.");
      }

      alert("Stall manually booked successfully!");
      setShowManualBookModal(false);
      setManualBookVendorId("");
      setManualBookStallId("");
      setManualBookPrice("");
      await fetchAdminData();
    } catch (err: any) {
      alert(err.message || "Something went wrong.");
    } finally {
      setManualBookLoading(false);
    }
  };

  // Helper to fetch users directly from local profile data
  const getAllUsers = () => {
    return (data?.allUsers || []).map((u: any) => ({
      id: u.id,
      email: u.email,
      role: u.role,
      companyName: u.profile?.companyName || (u.role === "ADMIN" ? "Super Admin" : "Awaiting Onboarding"),
      phone: u.profile?.contactPhone || "N/A",
      category: u.profile?.category || (u.role === "ORGANIZER" ? "FESTIVAL_HOST" : u.role === "ADMIN" ? "ADMIN" : "N/A"),
      verified: u.profile?.verified || false,
      adminFeedback: u.profile?.adminFeedback || "",
      bookings: u.bookings || [],
      festivals: u.festivals || [],
      createdAt: u.createdAt
    }));
  };

  const stats = data?.stats || { totalVolume: 0, totalProfit: 0, vendorCount: 0, organizerCount: 0, pendingFestivalsCount: 0, pendingUsersCount: 0, activeNegotiationsCount: 0 };
  const pendingFestivals = data?.pendingFestivals || [];
  const pendingUsers = data?.pendingUsers || [];
  const publishedFestivals = data?.publishedFestivals || [];
  const bookings = data?.bookings || [];

  const selectedFest = publishedFestivals.find((f: any) => f.id === selectedFestId) || publishedFestivals[0];

  // Set defaults once data loads
  useEffect(() => {
    if (publishedFestivals.length > 0 && !selectedFestId) {
      setSelectedFestId(publishedFestivals[0].id);
      setOpportunityScoreInput(publishedFestivals[0].opportunityScore);
    }
  }, [publishedFestivals, selectedFestId]);

  // Sync score when fest changes
  useEffect(() => {
    if (selectedFest) {
      setOpportunityScoreInput(selectedFest.opportunityScore);
    }
  }, [selectedFestId, selectedFest]);

  // Months list derived from bookings
  const uniqueMonths = Array.from(new Set(bookings.map((b: any) => b.createdAt.substring(0, 7)))).sort().reverse() as string[];
  const currentMonthStr = new Date().toISOString().substring(0, 7);
  const derivedMonths = (uniqueMonths.length > 0 ? uniqueMonths : [currentMonthStr]) as string[];

  // Set defaults for reports panel
  useEffect(() => {
    if (bookings.length > 0) {
      const months = Array.from(new Set(bookings.map((b: any) => b.createdAt.substring(0, 7)))).sort().reverse();
      if (months.length > 0 && !selectedMonth) {
        setSelectedMonth(months[0] as string);
      }
    } else {
      setSelectedMonth(currentMonthStr);
    }
  }, [bookings]);

  useEffect(() => {
    if (publishedFestivals.length > 0 && !selectedFestivalReportId) {
      setSelectedFestivalReportId(publishedFestivals[0].id);
    }
  }, [publishedFestivals]);

  const handleGenerateReport = () => {
    let title = "";
    let bookingsToSummarize = [];
    let period = "";

    if (reportType === "monthly") {
      const month = (selectedMonth || (derivedMonths[0] || "")) as string;
      if (!month) {
        alert("No month selected or available.");
        return;
      }
      period = month;
      title = `Monthly Statement - ${month}`;
      bookingsToSummarize = bookings.filter((b: any) => 
        (b.status === "PAID" || b.status === "APPROVED") && 
        b.createdAt.startsWith(month)
      );
    } else {
      const festId = (selectedFestivalReportId || (publishedFestivals[0]?.id || "")) as string;
      if (!festId) {
        alert("No festival selected or available.");
        return;
      }
      const fest = publishedFestivals.find((f: any) => f.id === festId);
      period = festId;
      title = `Event Ledger - ${fest?.name || "Festival"}`;
      bookingsToSummarize = bookings.filter((b: any) => 
        (b.status === "PAID" || b.status === "APPROVED") && 
        b.festivalId === festId
      );
    }

    const gnv = bookingsToSummarize.reduce((sum: number, b: any) => sum + b.finalPrice, 0);
    const rentBase = bookingsToSummarize.reduce((sum: number, b: any) => sum + (b.stall?.basePrice || 0), 0);
    const commissionMargin = gnv - rentBase;
    const misc = parseFloat(miscExpenses) || 0;
    const netProfit = commissionMargin - misc;

    setGeneratedReport({
      title,
      type: reportType.toUpperCase(),
      period,
      gnv,
      rentBase,
      commissionMargin,
      miscExpenses: misc,
      netProfit,
      bookingsCount: bookingsToSummarize.length
    });
  };

  const handleSaveReport = async () => {
    if (!generatedReport) return;
    setActionLoading("save-report");
    try {
      const response = await fetch("/api/admin/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: generatedReport.type,
          period: generatedReport.period,
          title: generatedReport.title,
          data: generatedReport
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save report.");
      }

      await fetchReports();
      alert("Statement saved to database successfully!");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleExportCSV = () => {
    if (!generatedReport) return;
    
    const rows = [
      ["Ground Zero Financial Statement", ""],
      ["Report Title", generatedReport.title],
      ["Report Type", generatedReport.type === "MONTHLY" ? "Monthly Report" : "Event-Wise Report"],
      ["Period/Target ID", generatedReport.period],
      ["Generated At", new Date().toLocaleString("en-IN")],
      ["", ""],
      ["Financial Metrics", "Value (INR)"],
      ["Gross Merchandise Value (GNV)", generatedReport.gnv],
      ["Base Stall Rent (Organizer Share)", generatedReport.rentBase],
      ["Commission Gross Margin", generatedReport.commissionMargin],
      ["Miscellaneous Overheads", generatedReport.miscExpenses],
      ["Net Profit / (Loss)", generatedReport.netProfit],
      ["Total Bookings Aggregated", generatedReport.bookingsCount]
    ];

    const csvContent = "data:text/csv;charset=utf-8," 
      + rows.map(e => e.map(val => `"${val}"`).join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${generatedReport.title.replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLoadSavedReport = (report: any) => {
    try {
      const parsedData = typeof report.data === "string" ? JSON.parse(report.data) : report.data;
      setGeneratedReport(parsedData);
      setReportType(report.type.toLowerCase() as any);
      if (report.type === "MONTHLY") {
        setSelectedMonth(report.period);
      } else {
        setSelectedFestivalReportId(report.period);
      }
      setMiscExpenses(parsedData.miscExpenses?.toString() || "0");
      setActiveSubView("reports");
    } catch (err) {
      alert("Failed to parse report data.");
    }
  };

  if (loading) {
    return (
      <PortalLayout activeTab="control room">
        <div className="flex h-96 items-center justify-center">
          <Loader2 size={32} className="animate-spin text-brand-secondary" />
        </div>
      </PortalLayout>
    );
  }

  // --- Calculate rich visual stats for subviews ---
  const allUsers = getAllUsers();
  const totalUsersCount = allUsers.length;
  const verifiedUsersCount = allUsers.filter((u: any) => u.verified).length;
  const verificationRate = totalUsersCount > 0 ? ((verifiedUsersCount / totalUsersCount) * 100).toFixed(0) : "0";

  const vendors = allUsers.filter((u: any) => u.role === "VENDOR");
  const foodVendorsCount = vendors.filter((u: any) => u.category === "FOOD").length;
  const beverageVendorsCount = vendors.filter((u: any) => u.category === "BEVERAGE").length;
  const fashionVendorsCount = vendors.filter((u: any) => u.category === "FASHION").length;
  const otherVendorsCount = vendors.length - foodVendorsCount - beverageVendorsCount - fashionVendorsCount;

  // --- Revenue Subview stats ---
  const festivalRevenueData = publishedFestivals.map((fest: any) => {
    let gnv = 0;
    let profit = 0;
    let bookedStallsCount = 0;

    for (const stall of (fest.stalls || [])) {
      const activeBooking = bookings.find((b: any) => b.stallId === stall.id && (b.status === "PAID" || b.status === "APPROVED"));
      if (stall.status === "BOOKED" || activeBooking) {
        bookedStallsCount++;
        const finalPrice = activeBooking ? activeBooking.finalPrice : stall.publicPrice;
        const profitVal = activeBooking ? (activeBooking.finalPrice - stall.basePrice) : (stall.publicPrice - stall.basePrice);
        gnv += finalPrice;
        profit += profitVal;
      }
    }

    return {
      id: fest.id,
      name: fest.name,
      gnv,
      profit,
      bookingsCount: bookedStallsCount
    };
  });
  const totalGnvCalculated = festivalRevenueData.reduce((sum: number, f: any) => sum + f.gnv, 0);
  const topRevenueEvent = festivalRevenueData.reduce(
    (prev: any, current: any) => (current.gnv > prev.gnv ? current : prev),
    { name: "None", gnv: 0 }
  );
  const avgCommissionRate = totalGnvCalculated > 0 
    ? ((festivalRevenueData.reduce((sum: number, f: any) => sum + f.profit, 0) / totalGnvCalculated) * 100).toFixed(1)
    : "0";

  // --- Occupancy Subview stats ---
  const selectedFestStalls = selectedFest?.stalls || [];
  const totalStallsCount = selectedFestStalls.length;
  const bookedStallsCount = selectedFestStalls.filter((s: any) => s.status === "BOOKED").length;
  const negotiationStallsCount = selectedFestStalls.filter((s: any) => s.status === "NEGOTIATION").length;
  const reservedStallsCount = selectedFestStalls.filter((s: any) => s.status === "RESERVED").length;
  const availableStallsCount = selectedFestStalls.filter((s: any) => s.status === "AVAILABLE").length;
  const occupancyRate = totalStallsCount > 0 ? ((bookedStallsCount / totalStallsCount) * 100).toFixed(0) : "0";

  // --- Deals Subview stats ---
  const activeDeals = bookings.filter((b: any) => b.status === "NEGOTIATING" || b.status === "PENDING" || b.status === "APPROVED");
  const totalDealsCount = activeDeals.length;
  const approvedDealsCount = activeDeals.filter((b: any) => b.status === "APPROVED").length;
  const negotiatingDealsCount = activeDeals.filter((b: any) => b.status === "NEGOTIATING").length;
  const pendingDealsCount = activeDeals.filter((b: any) => b.status === "PENDING").length;
  const totalDiscount = activeDeals.reduce((sum: number, b: any) => {
    const listPrice = b.stall?.publicPrice || 0;
    if (listPrice > 0) {
      return sum + ((listPrice - b.finalPrice) / listPrice) * 100;
    }
    return sum;
  }, 0);
  const avgDiscount = totalDealsCount > 0 ? (totalDiscount / totalDealsCount).toFixed(1) : "0";

  // Filtered users for left-side directory
  const filteredUsers = allUsers.filter((u: any) => {
    const searchLower = directorySearchQuery.toLowerCase();
    const matchesSearch = 
      u.companyName.toLowerCase().includes(searchLower) ||
      u.email.toLowerCase().includes(searchLower) ||
      u.phone.toLowerCase().includes(searchLower);
      
    const matchesRole = 
      directoryRoleFilter === "ALL" || 
      u.role === directoryRoleFilter;
      
    return matchesSearch && matchesRole;
  });

  const selectedDirectoryUser = allUsers.find((u: any) => u.id === selectedDirectoryUserId);

  // Payment statuses metrics
  const totalBookingsCount = bookings.length;
  const paidBookingsCount = bookings.filter((b: any) => b.status === "PAID").length;
  const approvedBookingsCount = bookings.filter((b: any) => b.status === "APPROVED").length;
  const negotiatingBookingsCount = bookings.filter((b: any) => b.status === "NEGOTIATING").length;
  const pendingBookingsCount = bookings.filter((b: any) => b.status === "PENDING").length;
  const cancelledBookingsCount = bookings.filter((b: any) => b.status === "CANCELLED").length;

  const paidRatio = totalBookingsCount > 0 ? ((paidBookingsCount / totalBookingsCount) * 100).toFixed(0) : "0";

  return (
    <PortalLayout activeTab="control room">
      <div className="flex flex-col gap-16">
        
        {/* Header Title */}
        <div className="flex flex-col gap-3">
          <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-brand-secondary">
            SUPER ADMINISTRATOR CHANNEL
          </span>
          <h1 className="font-serif text-[40px] font-medium tracking-tight text-brand-primary">
            Control Room
          </h1>
        </div>

        {/* Stats Grid - Clickable buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {[
            { 
              key: "revenue",
              label: "Gross Revenue", 
              value: `₹${stats.totalVolume.toLocaleString("en-IN")}`, 
              emoji: "💰", 
              bgClass: "bg-[var(--gz-accent-gold)] border-[var(--gz-border)] text-[var(--gz-accent-gold-text)]",
              activeClass: "ring-2 ring-brand-primary scale-[1.02] shadow-md"
            },
            { 
              key: "occupancy",
              label: "Stall Occupancy Ratio", 
              value: `${bookings.filter((b: any) => b.status === "PAID").length} Stalls`, 
              emoji: "🎪", 
              bgClass: "bg-[var(--gz-accent-green)] border-[var(--gz-border)] text-[var(--gz-accent-green-text)]",
              activeClass: "ring-2 ring-brand-primary scale-[1.02] shadow-md"
            },
            { 
              key: "deals",
              label: "Pending Proposals", 
              value: `${stats.activeNegotiationsCount} Deals`, 
              emoji: "🤝", 
              bgClass: "bg-[var(--gz-accent-blue)] border-[var(--gz-border)] text-[var(--gz-accent-blue-text)]",
              activeClass: "ring-2 ring-brand-primary scale-[1.02] shadow-md"
            },
            { 
              key: "listings",
              label: "Directory & Users", 
              value: `${publishedFestivals.length} Fests / ${stats.vendorCount + stats.organizerCount} Users`, 
              emoji: "🏢", 
              bgClass: "bg-[var(--gz-accent-warm)] border-[var(--gz-border)] text-[var(--gz-accent-warm-text)]",
              activeClass: "ring-2 ring-brand-primary scale-[1.02] shadow-md"
            },
            {
              key: "reports",
              label: "Financial Statements",
              value: "P&L Reports",
              emoji: "📊",
              bgClass: "bg-indigo-950/40 border-[var(--gz-border)] text-indigo-300",
              activeClass: "ring-2 ring-brand-primary scale-[1.02] shadow-md"
            }
          ].map((stat, i) => {
            const isActive = activeSubView === stat.key;
            return (
              <button 
                key={i} 
                onClick={() => setActiveSubView(stat.key as any)}
                className={`${stat.bgClass} border rounded-[20px] p-6 shadow-sm flex flex-col justify-between h-36 text-left transition-all hover:scale-[1.02] cursor-pointer ${isActive ? stat.activeClass : ""}`}
              >
                <div className="flex justify-between items-center opacity-85 w-full">
                  <span className="font-sans text-[11px] uppercase tracking-wider font-semibold">{stat.label}</span>
                  <span className="text-lg">{stat.emoji}</span>
                </div>
                <span className="font-serif text-[22px] font-semibold mt-4">
                  {stat.value}
                </span>
              </button>
            );
          })}
        </div>

        {/* Dynamic metrics slide-down sub-views */}
        <div className="bg-brand-card border border-brand-border rounded-[28px] p-8 shadow-sm">
          
          {/* Subview A: Revenue */}
          {activeSubView === "revenue" && (
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-1 border-b border-brand-border pb-4">
                <span className="font-sans text-[9px] uppercase tracking-wider text-brand-secondary">Sub-view 1</span>
                <h3 className="font-serif text-[20px] font-semibold text-brand-primary flex items-center gap-2">
                  <TrendingUp size={20} className="text-brand-secondary" /> Event-Wise Revenue Breakdown
                </h3>
              </div>

              {/* Rich Visual Cards for Revenue */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
                <div className="border border-brand-border rounded-2xl p-5 bg-brand-bg/50">
                  <span className="text-[10px] uppercase tracking-wider text-brand-secondary font-semibold">Top Performing Event</span>
                  <div className="font-serif text-[20px] font-semibold text-brand-primary mt-2">
                    {topRevenueEvent.name}
                  </div>
                  <span className="text-xs text-brand-secondary block mt-1">
                    Gross Volume: ₹{topRevenueEvent.gnv.toLocaleString("en-IN")}
                  </span>
                </div>
                
                <div className="border border-brand-border rounded-2xl p-5 bg-brand-bg/50">
                  <span className="text-[10px] uppercase tracking-wider text-brand-secondary font-semibold">Average Commission Rate</span>
                  <div className="font-serif text-[20px] font-semibold text-brand-primary mt-2">
                    {avgCommissionRate}%
                  </div>
                  <span className="text-xs text-brand-secondary block mt-1">
                    Markup margin share
                  </span>
                </div>

                <div className="border border-brand-border rounded-2xl p-5 bg-brand-bg/50">
                  <span className="text-[10px] uppercase tracking-wider text-brand-secondary font-semibold">Gross Commission Profit</span>
                  <div className="font-serif text-[20px] font-semibold text-brand-primary mt-2">
                    ₹{stats.totalProfit.toLocaleString("en-IN")}
                  </div>
                  <span className="text-xs text-brand-secondary block mt-1">
                    Platform direct profit
                  </span>
                </div>
              </div>

              {/* Visual Contribution Bar */}
              <div className="flex flex-col gap-3 font-sans border border-brand-border rounded-2xl p-5 bg-brand-bg/20">
                <span className="text-[10px] uppercase tracking-wider text-brand-secondary font-semibold">GNV Contribution Share</span>
                <div className="h-3.5 w-full bg-brand-border rounded-full overflow-hidden flex">
                  {festivalRevenueData.map((f: any, idx: number) => {
                    const share = totalGnvCalculated > 0 ? (f.gnv / totalGnvCalculated) * 100 : 0;
                    if (share === 0) return null;
                    const colors = ["bg-amber-500", "bg-emerald-500", "bg-blue-500", "bg-purple-500"];
                    const colorClass = colors[idx % colors.length];
                    return (
                      <div 
                        key={f.id} 
                        style={{ width: `${share}%` }} 
                        className={`${colorClass} h-full transition-all`}
                        title={`${f.name}: ${share.toFixed(1)}%`}
                      />
                    );
                  })}
                </div>
                <div className="flex flex-wrap gap-4 mt-1">
                  {festivalRevenueData.map((f: any, idx: number) => {
                    const share = totalGnvCalculated > 0 ? (f.gnv / totalGnvCalculated) * 100 : 0;
                    if (share === 0) return null;
                    const colors = ["bg-amber-500", "bg-emerald-500", "bg-blue-500", "bg-purple-500"];
                    const colorClass = colors[idx % colors.length];
                    return (
                      <div key={f.id} className="flex items-center gap-1.5 text-xs text-brand-secondary">
                        <span className={`w-2.5 h-2.5 rounded-full ${colorClass}`} />
                        <span>{f.name} ({share.toFixed(0)}%)</span>
                      </div>
                    );
                  })}
                  {totalGnvCalculated === 0 && <span className="text-xs text-brand-secondary/60">No revenue data logged yet.</span>}
                </div>
              </div>

              {/* Detailed Breakdown Table */}
              <div className="border border-brand-border rounded-xl overflow-hidden bg-brand-bg">
                <table className="w-full text-left border-collapse font-sans text-xs">
                  <thead>
                    <tr className="border-b border-brand-border bg-brand-card font-semibold text-[10px] uppercase tracking-wider text-brand-secondary">
                      <th className="p-4">Festival Opportunity</th>
                      <th className="p-4">Location</th>
                      <th className="p-4 text-center">Occupied Stalls</th>
                      <th className="p-4 text-right">Gross GNV Value</th>
                      <th className="p-4 text-right">Commission Collected</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border text-brand-secondary">
                    {publishedFestivals.map((fest: any) => {
                      const festBookings = bookings.filter((b: any) => b.festivalId === fest.id && (b.status === "PAID" || b.status === "APPROVED"));
                      const gnv = festBookings.reduce((sum: number, b: any) => sum + b.finalPrice, 0);
                      const profit = festBookings.reduce((sum: number, b: any) => sum + (b.stall?.commissionAmount || 0), 0);
                      
                      return (
                        <tr key={fest.id} className="hover:bg-brand-card/30">
                          <td className="p-4 font-serif text-sm font-semibold text-brand-primary">{fest.name}</td>
                          <td className="p-4">{fest.collegeName} ({fest.location})</td>
                          <td className="p-4 text-center font-medium text-brand-primary">{festBookings.length} stalls</td>
                          <td className="p-4 text-right font-serif font-semibold text-brand-primary">₹{gnv.toLocaleString("en-IN")}</td>
                          <td className="p-4 text-right font-serif font-semibold text-brand-primary">₹{profit.toLocaleString("en-IN")}</td>
                        </tr>
                      );
                    })}
                    {publishedFestivals.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-brand-secondary/60">No published festivals found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Subview B: Occupancy */}
          {activeSubView === "occupancy" && (
            <div className="flex flex-col gap-6 font-sans">
              <div className="flex flex-col gap-1 border-b border-brand-border pb-4">
                <span className="font-sans text-[9px] uppercase tracking-wider text-brand-secondary">Sub-view 2</span>
                <h3 className="font-serif text-[20px] font-semibold text-brand-primary flex items-center gap-2">
                  <Landmark size={20} className="text-brand-secondary" /> 
                  {occupancyViewMode === "directory" ? "Published Festivals Directory" : "Interactive Stall Floorplan & Inspector"}
                </h3>
              </div>

              {publishedFestivals.length === 0 ? (
                <div className="text-center py-8 text-brand-secondary text-sm">No published properties available.</div>
              ) : occupancyViewMode === "directory" ? (
                <div className="flex flex-col gap-4">
                  <span className="text-[11px] font-sans text-brand-secondary font-semibold uppercase tracking-wider">
                    Ecosystem Directory Overview ({publishedFestivals.length} active listings)
                  </span>
                  
                  {/* User-style cards directory for fests */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mt-4 text-left">
                    {publishedFestivals.map((fest: any) => {
                      const festRevenue = festivalRevenueData.find((f: any) => f.id === fest.id) || { gnv: 0, profit: 0, bookingsCount: 0 };
                      const totalStalls = fest.stalls?.length || 0;
                      
                      return (
                        <div 
                          key={fest.id} 
                          className="bg-brand-card border border-brand-border rounded-[24px] overflow-hidden flex flex-col hover:border-brand-primary/20 transition-all duration-300 group animate-fadeIn"
                        >
                          {/* Banner Image */}
                          <div 
                            className="relative w-full aspect-[16/10] bg-brand-bg/80 overflow-hidden cursor-pointer flex items-center justify-center border-b border-brand-border/40"
                            onClick={() => {
                              setSelectedFestId(fest.id);
                              setOccupancyViewMode("map");
                              setSelectedStall(null);
                            }}
                          >
                            <img 
                              src={(fest.bannerUrl && (fest.bannerUrl.startsWith("http") || fest.bannerUrl.startsWith("/") || fest.bannerUrl.startsWith("data:"))) ? fest.bannerUrl : getFallbackImage(fest.id)} 
                              alt={fest.name} 
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                              onError={(e: any) => {
                                e.target.onerror = null;
                                e.target.src = getFallbackImage(fest.id);
                              }}
                            />
                            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-brand-border/40 px-3 py-1 rounded-full text-[11px] font-semibold text-brand-primary flex items-center gap-1 shadow-sm">
                              ⚡ {fest.opportunityScore} Score
                            </div>
                            {fest.mapLocked && (
                              <div className="absolute top-4 left-4 bg-amber-950/80 backdrop-blur-md border border-amber-500/30 px-3 py-1 rounded-full text-[11px] font-semibold text-amber-400 flex items-center gap-1.5 shadow-sm">
                                <Lock size={10} /> Map Locked
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="p-6 flex flex-col gap-4 text-left flex-1 justify-between">
                            <div className="flex flex-col gap-2">
                              <h3 
                                className="font-serif text-[22px] font-semibold text-brand-primary cursor-pointer hover:text-purple-400 transition-colors leading-tight"
                                onClick={() => {
                                  setSelectedFestId(fest.id);
                                  setOccupancyViewMode("map");
                                  setSelectedStall(null);
                                }}
                              >
                                {fest.name}
                              </h3>
                              <div className="flex items-center gap-1 text-brand-secondary text-[12px] font-sans">
                                <MapPin size={12} />
                                <span>{fest.collegeName} &middot; {fest.location}</span>
                              </div>
                              <div className="flex items-start gap-1.5 text-[11px] text-brand-secondary font-sans mt-1 leading-relaxed">
                                <span>🎸</span>
                                <span>
                                  <strong>Lineup:</strong> {fest.artistLineup || "TBA"}
                                </span>
                              </div>
                            </div>

                            {/* Metrics Footer */}
                            <div className="border-t border-brand-border/40 pt-4 mt-2 grid grid-cols-2 gap-4 text-left font-sans text-xs">
                              <div className="flex flex-col gap-0.5">
                                <span className="text-[9px] uppercase tracking-wider text-brand-secondary font-semibold">Booked Ratio</span>
                                <span className="font-semibold text-brand-primary">
                                  {festRevenue.bookingsCount} / {totalStalls} Booked
                                </span>
                              </div>
                              <div className="flex flex-col gap-0.5">
                                <span className="text-[9px] uppercase tracking-wider text-brand-secondary font-semibold">Footfall</span>
                                <span className="font-semibold text-brand-primary">
                                  {fest.expectedFootfall.toLocaleString("en-IN")}
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                setSelectedFestId(fest.id);
                                setOccupancyViewMode("map");
                                setSelectedStall(null);
                              }}
                              className="mt-4 w-full btn-liquid-glass-dark text-xs py-2.5 flex items-center justify-center gap-2 cursor-pointer"
                            >
                              <Map size={14} /> Inspect Stall Layout Map
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-6 animate-fadeIn">
                  {/* Back button & dropdown selector */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <button 
                      onClick={() => setOccupancyViewMode("directory")} 
                      className="flex items-center gap-1 text-xs text-brand-secondary hover:text-brand-primary transition-colors cursor-pointer"
                    >
                      <ArrowLeft size={14} /> Back to Festival Directory
                    </button>

                    <div className="flex items-center gap-2.5 max-w-xs w-full">
                      <select
                        value={selectedFestId}
                        onChange={(e) => {
                          setSelectedFestId(e.target.value);
                          setSelectedStall(null);
                        }}
                        className="gz-select border border-brand-border rounded-xl px-4 py-2.5 bg-brand-bg text-brand-primary text-sm focus:outline-none focus:border-brand-primary w-full"
                      >
                        {publishedFestivals.map((f: any) => (
                          <option key={f.id} value={f.id}>{f.name} ({f.collegeName})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {selectedFest && (
                    <div className="flex flex-col gap-6">
                      
                      {/* Festival Control Actions Bar */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-brand-bg/50 border border-brand-border rounded-2xl p-6 text-left">
                        
                        {/* 1. Map lock configuration */}
                        <div className="lg:col-span-4 flex flex-col gap-3 font-sans">
                          <span className="text-[10px] uppercase tracking-wider text-brand-secondary font-semibold">Map & Pricing Control</span>
                          <div className="flex items-center justify-between border border-brand-border bg-brand-card/40 rounded-xl p-3.5 mt-1">
                            <div className="flex items-center gap-2">
                              {selectedFest.mapLocked ? (
                                <Lock size={16} className="text-amber-500" />
                              ) : (
                                <Unlock size={16} className="text-emerald-500" />
                              )}
                              <span className="text-xs font-semibold text-brand-primary">
                                {selectedFest.mapLocked ? "Map layout locked" : "Map layout open"}
                              </span>
                            </div>
                            <button
                              onClick={() => handleToggleMapLock(selectedFest.id)}
                              disabled={actionLoading !== null}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold cursor-pointer transition-colors ${
                                selectedFest.mapLocked 
                                  ? "bg-emerald-600 hover:bg-emerald-500 text-white" 
                                  : "bg-amber-600 hover:bg-amber-500 text-white"
                              }`}
                            >
                              {actionLoading === `maplock-${selectedFest.id}` ? (
                                <Loader2 size={10} className="animate-spin" />
                              ) : selectedFest.mapLocked ? (
                                "Unlock Editing"
                              ) : (
                                "Lock Map & Prices"
                              )}
                            </button>
                          </div>
                        </div>

                        {/* 2. Artist Lineup requests panel */}
                        <div className="lg:col-span-4 flex flex-col gap-3 font-sans border-t lg:border-t-0 lg:border-x border-brand-border pt-4 lg:pt-0 lg:px-6">
                          <span className="text-[10px] uppercase tracking-wider text-brand-secondary font-semibold">Artist Lineup Approvals</span>
                          {selectedFest.proposedArtistLineup ? (
                            <div className="border border-brand-border bg-brand-card/40 rounded-xl p-3 mt-1 flex flex-col gap-2.5">
                              <span className="text-[11px] text-brand-secondary">
                                Proposed: <strong className="text-brand-primary">{selectedFest.proposedArtistLineup}</strong>
                              </span>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleApproveLineup(selectedFest.id)}
                                  disabled={actionLoading !== null}
                                  className="flex-1 py-1 px-2.5 bg-brand-primary text-brand-bg rounded font-semibold text-[10px] hover:opacity-90 cursor-pointer flex items-center justify-center gap-1"
                                >
                                  {actionLoading === `lineup-${selectedFest.id}` ? <Loader2 size={10} className="animate-spin" /> : "Approve"}
                                </button>
                                <button
                                  onClick={() => handleRejectLineup(selectedFest.id)}
                                  disabled={actionLoading !== null}
                                  className="flex-1 py-1 px-2.5 border border-brand-border text-brand-primary rounded font-medium text-[10px] hover:bg-brand-card cursor-pointer"
                                >
                                  Reject
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center border border-brand-border border-dashed bg-brand-bg/20 rounded-xl p-4 mt-1 text-center text-brand-secondary/50 text-[11px] h-[58px]">
                              No lineup changes pending approval
                            </div>
                          )}
                        </div>

                        {/* 3. Festival Sponsorship Decks Queue */}
                        <div className="lg:col-span-4 flex flex-col gap-3 font-sans border-t lg:border-t-0 border-brand-border pt-4 lg:pt-0">
                          <span className="text-[10px] uppercase tracking-wider text-brand-secondary font-semibold">Decks Verification Queue</span>
                          {(() => {
                            const decks = getDecksList(selectedFest);
                            const pendingDecks = decks.filter((d: any) => d.status === "PENDING");
                            
                            if (pendingDecks.length === 0) {
                              return (
                                <div className="flex items-center justify-center border border-brand-border border-dashed bg-brand-bg/20 rounded-xl p-4 mt-1 text-center text-brand-secondary/50 text-[11px] h-[58px]">
                                  No pitch decks pending verification
                                </div>
                              );
                            }

                            return (
                              <div className="flex flex-col gap-2 mt-1 max-h-24 overflow-y-auto">
                                {pendingDecks.map((deck: any) => (
                                  <div key={deck.id} className="border border-brand-border bg-brand-card/40 rounded-xl p-2.5 flex items-center justify-between gap-2 text-xs">
                                    <a 
                                      href={deck.url} 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="text-purple-400 hover:underline truncate max-w-[140px] flex items-center gap-1 font-semibold"
                                      title={deck.name}
                                    >
                                      <FileDown size={12} /> {deck.name}
                                    </a>
                                    <div className="flex gap-1.5 shrink-0">
                                      <button
                                        onClick={() => handleApproveDeck(selectedFest.id, deck.id)}
                                        disabled={actionLoading !== null}
                                        className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-500 cursor-pointer"
                                        title="Approve & Publish"
                                      >
                                        <CheckCircle2 size={12} />
                                      </button>
                                      <button
                                        onClick={() => handleRejectDeck(selectedFest.id, deck.id)}
                                        disabled={actionLoading !== null}
                                        className="p-1 bg-red-600 text-white rounded hover:bg-red-500 cursor-pointer"
                                        title="Reject"
                                      >
                                        <XCircle size={12} />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            );
                          })()}
                        </div>

                      </div>

                      {/* Main floorplan and inspector segment */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-2">
                        
                        {/* Interactive Stall Map Canvas */}
                        <div className="lg:col-span-8 flex flex-col gap-4">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-brand-secondary font-semibold uppercase tracking-wider text-[10px]">Stall Map Floorplan</span>
                            <span className="text-brand-secondary flex items-center gap-2">
                              Occupancy Rate: <strong>{occupancyRate}%</strong>
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            </span>
                          </div>
                          
                          <StallMap
                            stalls={selectedFestStalls}
                            selectedStall={selectedStall}
                            onSelectStall={(stall: any) => {
                              setSelectedStall(stall);
                            }}
                            layoutMapUrl={selectedFest.layoutMapUrl}
                            mapDimensions={selectedFest.mapDimensions}
                          />

                          {/* Map Legends */}
                          <div className="flex flex-wrap gap-4 text-[10px] text-brand-secondary justify-center uppercase tracking-wider font-semibold">
                            <div className="flex items-center gap-1">
                              <span className="w-2.5 h-2.5 rounded bg-emerald-500/10 border border-emerald-500/50" />
                              <span>Available</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="w-2.5 h-2.5 rounded bg-[#2D2A3E] border border-[#4B5563]" />
                              <span>Booked</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="w-2.5 h-2.5 rounded bg-blue-500/10 border border-dashed border-blue-500/50" />
                              <span>Negotiation</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="w-2.5 h-2.5 rounded bg-amber-500/10 border border-amber-500/50" />
                              <span>Reserved</span>
                            </div>
                          </div>
                        </div>

                        {/* Stall Inspector Card Side Panel */}
                        <div className="lg:col-span-4 flex flex-col gap-4">
                          <span className="text-brand-secondary font-semibold uppercase tracking-wider text-[10px]">Stall Inspector Panel</span>
                          {selectedStall ? (() => {
                            const stallBookings = bookings.filter((b: any) => b.stallId === selectedStall.id && b.status !== "CANCELLED");
                            
                            return (
                              <div className="border border-brand-border rounded-[24px] p-6 bg-brand-card/50 flex flex-col gap-6 w-full text-left font-sans shadow-sm animate-fadeIn">
                                <div className="flex justify-between items-start border-b border-brand-border pb-3">
                                  <div className="flex flex-col gap-0.5">
                                    <span className="text-[10px] uppercase tracking-wider text-brand-secondary font-semibold">Inspecting</span>
                                    <h4 className="font-serif text-[18px] font-bold text-brand-primary">Stall {selectedStall.stallNumber}</h4>
                                  </div>
                                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-semibold border ${
                                    selectedStall.status === "BOOKED" 
                                      ? "bg-brand-primary text-brand-bg border-brand-primary" 
                                      : selectedStall.status === "NEGOTIATION"
                                      ? "bg-[var(--gz-accent-blue)] border-[var(--gz-border-md)] text-[var(--gz-accent-blue-text)]"
                                      : selectedStall.status === "RESERVED"
                                      ? "bg-transparent border-dashed border-brand-border text-brand-secondary/50"
                                      : "bg-[var(--gz-accent-green)] border-[var(--gz-border-md)] text-[var(--gz-accent-green-text)]"
                                  }`}>
                                    {selectedStall.status}
                                  </span>
                                </div>

                                {/* Metadata Grid */}
                                <div className="grid grid-cols-2 gap-4 text-xs">
                                  <div className="flex flex-col gap-0.5">
                                    <span className="text-brand-secondary">Dimensions</span>
                                    <span className="font-semibold text-brand-primary">{selectedStall.dimensions} ft</span>
                                  </div>
                                  <div className="flex flex-col gap-0.5">
                                    <span className="text-brand-secondary">Power Grid</span>
                                    <span className="font-semibold text-brand-primary">{selectedStall.powerGrid || "Standard (15A)"}</span>
                                  </div>
                                  <div className="flex flex-col gap-0.5">
                                    <span className="text-brand-secondary">Base Price (Org)</span>
                                    <span className="font-semibold text-brand-primary">₹{selectedStall.basePrice.toLocaleString("en-IN")}</span>
                                  </div>
                                  <div className="flex flex-col gap-0.5">
                                    <span className="text-brand-secondary">Public Price (GZ)</span>
                                    <span className="font-semibold text-brand-primary">₹{selectedStall.publicPrice.toLocaleString("en-IN")}</span>
                                  </div>
                                </div>

                                {selectedStall.description && (
                                  <div className="text-xs text-brand-secondary border-t border-brand-border pt-3">
                                    <span className="block font-semibold text-brand-primary mb-1">Description</span>
                                    <p className="italic">"{selectedStall.description}"</p>
                                  </div>
                                )}

                                {/* Bookings and proposals logs inside the inspector */}
                                <div className="border-t border-brand-border pt-4 flex flex-col gap-4">
                                  <h5 className="font-serif text-sm font-semibold text-brand-primary">Stall Bookings & Live Proposals</h5>
                                  
                                  {stallBookings.length === 0 ? (
                                    <div className="text-brand-secondary/60 italic text-xs">No active bookings or negotiations for this stall.</div>
                                  ) : (
                                    <div className="flex flex-col gap-5 max-h-80 overflow-y-auto pr-1">
                                      {stallBookings.map((booking: any) => {
                                        const isPaidOrApproved = booking.status === "PAID" || booking.status === "APPROVED";
                                        const isNegotiating = booking.status === "NEGOTIATING" || booking.status === "PENDING";
                                        
                                        return (
                                          <div key={booking.id} className="border border-brand-border bg-brand-bg/50 rounded-xl p-3.5 flex flex-col gap-3">
                                            <div className="flex justify-between items-center border-b border-brand-border/40 pb-2">
                                              <span className={`text-[9px] uppercase font-bold tracking-wider ${
                                                isPaidOrApproved ? "text-emerald-400" : "text-blue-400"
                                              }`}>
                                                {booking.status}
                                              </span>
                                              <span className="font-serif font-bold text-brand-primary">₹{booking.finalPrice.toLocaleString("en-IN")}</span>
                                            </div>

                                            {/* Vendor Contact detail logs */}
                                            <div className="flex flex-col gap-1 text-[11px]">
                                              <span className="font-bold text-brand-primary text-xs">{booking.vendor?.profile?.companyName || "Vendor Outlet"}</span>
                                              <div className="flex items-center gap-1.5 text-brand-secondary">
                                                <Mail size={10} /> <span>{booking.vendor?.email}</span>
                                              </div>
                                              <div className="flex items-center gap-1.5 text-brand-secondary">
                                                <Phone size={10} /> <span>{booking.vendor?.profile?.contactPhone || "N/A"}</span>
                                              </div>
                                            </div>

                                            {/* Chat timeline message logs */}
                                            {booking.negotiation?.messages && booking.negotiation.messages.length > 0 && (
                                              <div className="border-t border-brand-border/40 pt-2.5 mt-1 flex flex-col gap-2">
                                                <span className="text-[9px] uppercase tracking-wider text-brand-secondary font-semibold">Negotiation Timeline Log</span>
                                                <div className="flex flex-col gap-2 font-sans text-[11px] max-h-40 overflow-y-auto bg-brand-bg rounded-xl p-3 border border-brand-border/45">
                                                  {booking.negotiation.messages.map((msg: any) => {
                                                    const isVendorSender = msg.senderId === booking.vendorId;
                                                    return (
                                                      <div key={msg.id} className="flex flex-col gap-0.5 text-left border-b border-brand-border/10 last:border-b-0 pb-1.5 mb-1.5 last:pb-0 last:mb-0">
                                                        <div className="flex justify-between text-[9px] font-semibold">
                                                          <span className={isVendorSender ? "text-blue-400" : "text-brand-primary"}>
                                                            {isVendorSender ? "Vendor" : "Organizer/Admin"}
                                                          </span>
                                                          <span className="text-brand-secondary">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                        </div>
                                                        <p className="text-brand-primary/95 font-light mt-0.5">{msg.content}</p>
                                                        {msg.proposedPrice && (
                                                          <span className="text-[10px] text-amber-500 font-semibold mt-0.5">Proposed Price: ₹{msg.proposedPrice.toLocaleString("en-IN")}</span>
                                                        )}
                                                      </div>
                                                    );
                                                  })}
                                                </div>
                                              </div>
                                            )}

                                            {/* Action buttons */}
                                            <div className="flex gap-2 justify-end mt-2 pt-2 border-t border-brand-border/40">
                                              {isNegotiating && (
                                                <>
                                                  <button
                                                    onClick={() => handleApproveDeal(booking.id)}
                                                    disabled={actionLoading !== null}
                                                    className="px-2.5 py-1 bg-brand-primary text-brand-bg rounded font-semibold text-[10px] hover:opacity-90 cursor-pointer flex items-center justify-center gap-1"
                                                  >
                                                    {actionLoading === `deal-${booking.id}` ? (
                                                      <Loader2 size={10} className="animate-spin" />
                                                    ) : (
                                                      "Approve Deal"
                                                    )}
                                                  </button>
                                                  <button
                                                    onClick={() => handleRejectDeal(booking.id)}
                                                    disabled={actionLoading !== null}
                                                    className="px-2.5 py-1 border border-brand-border text-brand-primary rounded font-medium text-[10px] hover:bg-brand-card cursor-pointer"
                                                  >
                                                    Reject
                                                  </button>
                                                </>
                                              )}
                                              {booking.status === "APPROVED" && (
                                                <button
                                                  onClick={() => handleMarkPaidOffline(booking.id)}
                                                  disabled={actionLoading !== null}
                                                  className="px-3 py-1 bg-emerald-600 text-white rounded font-semibold text-[10px] hover:bg-emerald-500 cursor-pointer"
                                                >
                                                  {actionLoading === `pay-${booking.id}` ? (
                                                    <Loader2 size={10} className="animate-spin" />
                                                  ) : (
                                                    "Mark Paid (Offline)"
                                                  )}
                                                </button>
                                              )}
                                            </div>

                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })() : (
                            <div className="border border-brand-border border-dashed rounded-[24px] p-8 bg-brand-bg/30 flex flex-col items-center justify-center text-center text-brand-secondary min-h-[300px] font-sans">
                              <Info size={32} className="text-brand-secondary/40 mb-3" />
                              <span className="text-xs font-semibold text-brand-primary">No Stall Selected</span>
                              <p className="text-[11px] max-w-[200px] mt-1.5 leading-relaxed">Tap any stall polygon on the SVG floorplan map to audit active bookings, view vendor contacts, and inspect proposals timeline logs.</p>
                            </div>
                          )}
                        </div>

                      </div>

                      {/* Stall Grid List View */}
                      <div className="flex flex-col gap-3 mt-6">
                        <span className="text-brand-secondary font-semibold uppercase tracking-wider text-[10px]">Stalls List Ledger</span>
                        <div className="border border-brand-border rounded-xl overflow-hidden bg-brand-bg">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="border-b border-brand-border bg-brand-card font-semibold text-[10px] uppercase tracking-wider text-brand-secondary">
                                <th className="p-4">Stall ID</th>
                                <th className="p-4">Dimensions</th>
                                <th className="p-4 text-right">Base Price</th>
                                <th className="p-4 text-right">Markup Price</th>
                                <th className="p-4 text-center">Status</th>
                                <th className="p-4">Occupant / Bidding Vendor</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-brand-border text-brand-secondary">
                              {selectedFestStalls.map((stall: any) => {
                                const stallBookings = bookings.filter((b: any) => b.stallId === stall.id && b.status !== "CANCELLED");
                                const occupiedBooking = stallBookings.find((b: any) => b.status === "PAID" || b.status === "APPROVED");
                                const negotiatingBookings = stallBookings.filter((b: any) => b.status === "NEGOTIATING" || b.status === "PENDING");
                                
                                return (
                                  <tr key={stall.id} className="hover:bg-brand-card/30">
                                    <td className="p-4 font-semibold text-brand-primary">{stall.stallNumber}</td>
                                    <td className="p-4">{stall.dimensions}</td>
                                    <td className="p-4 text-right">₹{stall.basePrice.toLocaleString("en-IN")}</td>
                                    <td className="p-4 text-right text-brand-primary">₹{stall.publicPrice.toLocaleString("en-IN")}</td>
                                    <td className="p-4 text-center">
                                      <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-semibold border ${
                                        stall.status === "BOOKED" 
                                          ? "bg-brand-primary text-brand-bg border-brand-primary" 
                                          : stall.status === "NEGOTIATION"
                                          ? "bg-[var(--gz-accent-blue)] border-[var(--gz-border-md)] text-[var(--gz-accent-blue-text)]"
                                          : stall.status === "RESERVED"
                                          ? "bg-transparent border-dashed border-brand-border text-brand-secondary/50"
                                          : "bg-[var(--gz-accent-green)] border-[var(--gz-border-md)] text-[var(--gz-accent-green-text)]"
                                      }`}>
                                        {stall.status}
                                      </span>
                                    </td>
                                    <td className="p-4 font-medium">
                                      {occupiedBooking ? (
                                        <span className="text-brand-primary font-semibold">
                                          ✅ Booked: {occupiedBooking.vendor?.profile?.companyName || occupiedBooking.vendor?.email}
                                        </span>
                                      ) : negotiatingBookings.length > 0 ? (
                                        <div className="flex flex-col gap-0.5">
                                          {negotiatingBookings.map((nb: any, i: number) => (
                                            <span key={i} className="text-brand-secondary/80 text-[11px] block">
                                              💬 {nb.vendor?.profile?.companyName || nb.vendor?.email} (₹{nb.finalPrice.toLocaleString("en-IN")})
                                            </span>
                                          ))}
                                        </div>
                                      ) : (
                                        <span className="opacity-40 italic">Available for booking</span>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                              {selectedFestStalls.length === 0 && (
                                <tr>
                                  <td colSpan={6} className="p-8 text-center text-brand-secondary/60">No stalls mapped for this festival.</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Subview C: Deals (Negotiation approvals/rejections) */}
          {activeSubView === "deals" && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1 border-b border-brand-border pb-4">
                <span className="font-sans text-[9px] uppercase tracking-wider text-brand-secondary">Sub-view 3</span>
                <h3 className="font-serif text-[20px] font-semibold text-brand-primary flex items-center gap-2">
                  <MessageSquare size={20} className="text-brand-secondary" /> Active Negotiations Control Center
                </h3>
              </div>

              {/* Rich Visual Indicators for Deals */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
                <div className="border border-brand-border rounded-2xl p-5 bg-brand-bg/50">
                  <span className="text-[10px] uppercase tracking-wider text-brand-secondary font-semibold">Average Negotiation Discount</span>
                  <div className="font-serif text-[20px] font-semibold text-brand-primary mt-2">
                    {avgDiscount}%
                  </div>
                  <span className="text-xs text-brand-secondary block mt-1">
                    Off-list price savings
                  </span>
                </div>

                <div className="border border-brand-border rounded-2xl p-5 bg-brand-bg/50">
                  <span className="text-[10px] uppercase tracking-wider text-brand-secondary font-semibold">Approved Locked Deals</span>
                  <div className="font-serif text-[20px] font-semibold text-brand-primary mt-2">
                    {approvedDealsCount} Deals
                  </div>
                  <span className="text-xs text-brand-secondary block mt-1">
                    Awaiting final payment
                  </span>
                </div>

                <div className="border border-brand-border rounded-2xl p-5 bg-brand-bg/50">
                  <span className="text-[10px] uppercase tracking-wider text-brand-secondary font-semibold">Negotiating / Pending</span>
                  <div className="font-serif text-[20px] font-semibold text-brand-primary mt-2">
                    {negotiatingDealsCount + pendingDealsCount} Deals
                  </div>
                  <span className="text-xs text-brand-secondary block mt-1">
                    Live bidding proposals
                  </span>
                </div>
              </div>

              {/* Deal Status Distribution Bar */}
              <div className="flex flex-col gap-3 font-sans border border-brand-border rounded-2xl p-5 bg-brand-bg/20">
                <span className="text-[10px] uppercase tracking-wider text-brand-secondary font-semibold">Live Proposal Status Breakdown</span>
                <div className="h-3.5 w-full bg-brand-border rounded-full overflow-hidden flex">
                  <div title={`Approved: ${approvedDealsCount}`} style={{ width: totalDealsCount > 0 ? `${(approvedDealsCount / totalDealsCount) * 100}%` : "0%" }} className="bg-amber-500 h-full" />
                  <div title={`Negotiating: ${negotiatingDealsCount}`} style={{ width: totalDealsCount > 0 ? `${(negotiatingDealsCount / totalDealsCount) * 100}%` : "0%" }} className="bg-blue-500 h-full" />
                  <div title={`Pending Review: ${pendingDealsCount}`} style={{ width: totalDealsCount > 0 ? `${(pendingDealsCount / totalDealsCount) * 100}%` : "0%" }} className="bg-neutral-600/30 h-full" />
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-brand-secondary mt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-amber-500" />
                    <span>Approved ({approvedDealsCount})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-blue-500" />
                    <span>In Negotiation ({negotiatingDealsCount})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-neutral-600/30 border border-brand-border" />
                    <span>Pending Review ({pendingDealsCount})</span>
                  </div>
                </div>
              </div>

              <div className="border border-brand-border rounded-xl overflow-hidden bg-brand-bg">
                <table className="w-full text-left border-collapse font-sans text-xs">
                  <thead>
                    <tr className="border-b border-brand-border bg-brand-card font-semibold text-[10px] uppercase tracking-wider text-brand-secondary">
                      <th className="p-4">Vendor Partner</th>
                      <th className="p-4">Festival Property</th>
                      <th className="p-4 text-center">Stall No.</th>
                      <th className="p-4 text-right">Listing Price</th>
                      <th className="p-4 text-right">Negotiated Price</th>
                      <th className="p-4 text-center">Admin Access & Options</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border text-brand-secondary">
                    {bookings.filter((b: any) => b.status === "NEGOTIATING" || b.status === "PENDING" || b.status === "APPROVED").map((booking: any) => (
                      <tr key={booking.id} className="hover:bg-brand-card/30">
                        <td className="p-4 font-medium text-brand-primary">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-semibold text-brand-primary">{booking.vendor?.profile?.companyName || "Vendor"}</span>
                            <span className="text-[10px] text-brand-secondary">{booking.vendor?.email}</span>
                          </div>
                        </td>
                        <td className="p-4">{booking.festival?.name}</td>
                        <td className="p-4 text-center font-bold text-brand-primary">{booking.stall?.stallNumber}</td>
                        <td className="p-4 text-right">₹{booking.stall?.publicPrice.toLocaleString("en-IN")}</td>
                        <td className="p-4 text-right font-serif font-bold text-brand-primary">₹{booking.finalPrice.toLocaleString("en-IN")}</td>
                        <td className="p-4 text-center">
                          {booking.status === "APPROVED" ? (
                            <span className="text-[10px] font-semibold text-brand-secondary bg-brand-card border border-brand-border px-3 py-1 rounded-full uppercase">Approved (Awaiting Checkout)</span>
                          ) : (
                            <div className="flex gap-2 justify-center">
                              <button
                                onClick={() => handleApproveDeal(booking.id)}
                                disabled={actionLoading !== null}
                                className="px-3 py-1 bg-brand-primary text-brand-bg rounded font-semibold text-[11px] hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-1"
                              >
                                {actionLoading === `deal-${booking.id}` ? (
                                  <Loader2 size={10} className="animate-spin" />
                                ) : (
                                  "Approve Deal"
                                )}
                              </button>
                              <button
                                onClick={() => handleRejectDeal(booking.id)}
                                disabled={actionLoading !== null}
                                className="px-3 py-1 border border-brand-border text-brand-primary rounded font-medium text-[11px] hover:bg-brand-card transition-colors cursor-pointer"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                    {bookings.filter((b: any) => b.status === "NEGOTIATING" || b.status === "PENDING" || b.status === "APPROVED").length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-brand-secondary/60">No pending negotiations or booking requests found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Subview D: Published Listings & Vendor Directory */}
          {activeSubView === "listings" && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-brand-border pb-4">
                <div className="flex flex-col gap-1">
                  <span className="font-sans text-[9px] uppercase tracking-wider text-brand-secondary">Sub-view 4</span>
                  <h3 className="font-serif text-[20px] font-semibold text-brand-primary flex items-center gap-2">
                    <Users size={20} className="text-brand-secondary" /> Ecosystem Directory & User Dossier
                  </h3>
                  <p className="text-xs text-brand-secondary">
                    Browse profiles, analyze event participation ledger, audit payments status, and perform manual booking overrides.
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (publishedFestivals.length > 0 && !selectedFestId) {
                      setSelectedFestId(publishedFestivals[0].id);
                    }
                    setShowManualBookModal(true);
                  }}
                  className="px-4 py-2 bg-brand-primary text-brand-bg rounded-xl font-semibold text-xs hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-lg shadow-brand-primary/10 cursor-pointer"
                >
                  <Plus size={14} /> Force Book Stall (Offline Cash)
                </button>
              </div>

              {/* Ecosystem & Payments Overview (Visualisations) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
                {/* Visual Category Distribution Bar */}
                <div className="flex flex-col gap-3 border border-brand-border rounded-2xl p-5 bg-brand-bg/50">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase tracking-wider text-brand-secondary font-semibold">Vendor Category Distribution</span>
                    <span className="text-xs font-semibold text-brand-primary">{vendors.length} Total Vendors</span>
                  </div>
                  <div className="h-3 w-full bg-brand-border rounded-full overflow-hidden flex">
                    <div title={`Food: ${foodVendorsCount}`} style={{ width: vendors.length > 0 ? `${(foodVendorsCount / vendors.length) * 100}%` : "0%" }} className="bg-emerald-500 h-full" />
                    <div title={`Beverage: ${beverageVendorsCount}`} style={{ width: vendors.length > 0 ? `${(beverageVendorsCount / vendors.length) * 100}%` : "0%" }} className="bg-blue-500 h-full" />
                    <div title={`Fashion: ${fashionVendorsCount}`} style={{ width: vendors.length > 0 ? `${(fashionVendorsCount / vendors.length) * 100}%` : "0%" }} className="bg-amber-500 h-full" />
                    <div title={`Other: ${otherVendorsCount}`} style={{ width: vendors.length > 0 ? `${(otherVendorsCount / vendors.length) * 100}%` : "0%" }} className="bg-purple-500 h-full" />
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-brand-secondary mt-1">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded bg-emerald-500 block shrink-0" />
                      <span className="truncate">Food ({foodVendorsCount})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded bg-blue-500 block shrink-0" />
                      <span className="truncate">Bev ({beverageVendorsCount})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded bg-amber-500 block shrink-0" />
                      <span className="truncate">Fashion ({fashionVendorsCount})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded bg-purple-500 block shrink-0" />
                      <span className="truncate">Other ({otherVendorsCount})</span>
                    </div>
                  </div>
                </div>

                {/* Payments & Bookings Status Dashboard */}
                <div className="flex flex-col gap-3 border border-brand-border rounded-2xl p-5 bg-brand-bg/50">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase tracking-wider text-brand-secondary font-semibold">Bookings Payment Status Dashboard</span>
                    <span className="text-xs font-semibold text-brand-primary">{totalBookingsCount} Total Bookings</span>
                  </div>
                  <div className="h-3 w-full bg-brand-border rounded-full overflow-hidden flex">
                    <div title={`Paid: ${paidBookingsCount}`} style={{ width: totalBookingsCount > 0 ? `${(paidBookingsCount / totalBookingsCount) * 100}%` : "0%" }} className="bg-emerald-500 h-full" />
                    <div title={`Approved: ${approvedBookingsCount}`} style={{ width: totalBookingsCount > 0 ? `${(approvedBookingsCount / totalBookingsCount) * 100}%` : "0%" }} className="bg-amber-500 h-full" />
                    <div title={`Negotiating: ${negotiatingBookingsCount}`} style={{ width: totalBookingsCount > 0 ? `${(negotiatingBookingsCount / totalBookingsCount) * 100}%` : "0%" }} className="bg-blue-500 h-full" />
                    <div title={`Pending: ${pendingBookingsCount}`} style={{ width: totalBookingsCount > 0 ? `${(pendingBookingsCount / totalBookingsCount) * 100}%` : "0%" }} className="bg-neutral-500 h-full" />
                    <div title={`Cancelled: ${cancelledBookingsCount}`} style={{ width: totalBookingsCount > 0 ? `${(cancelledBookingsCount / totalBookingsCount) * 100}%` : "0%" }} className="bg-red-500 h-full" />
                  </div>
                  <div className="grid grid-cols-5 gap-1 text-[9px] text-brand-secondary mt-1">
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded bg-emerald-500 block shrink-0" />
                      <span className="truncate">Paid ({paidBookingsCount})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded bg-amber-500 block shrink-0" />
                      <span className="truncate">Appr ({approvedBookingsCount})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded bg-blue-500 block shrink-0" />
                      <span className="truncate">Nego ({negotiatingBookingsCount})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded bg-neutral-500 block shrink-0" />
                      <span className="truncate">Pend ({pendingBookingsCount})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded bg-red-500 block shrink-0" />
                      <span className="truncate">Canc ({cancelledBookingsCount})</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Split Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Column: User Explorer Navigation (Col Span 4) */}
                <div className="lg:col-span-4 flex flex-col gap-4 bg-brand-bg/30 border border-brand-border rounded-2xl p-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-wider text-brand-secondary font-semibold font-sans">Search Accounts</label>
                    <input
                      type="text"
                      value={directorySearchQuery}
                      onChange={(e) => setDirectorySearchQuery(e.target.value)}
                      placeholder="Search company, name, email..."
                      className="w-full px-3 py-2 border border-brand-border rounded-xl bg-brand-bg text-brand-primary text-xs focus:outline-none focus:border-brand-primary font-sans"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-wider text-brand-secondary font-semibold font-sans">Filter by Role</label>
                    <div className="flex bg-brand-bg border border-brand-border rounded-xl p-0.5 font-sans">
                      {(["ALL", "VENDOR", "ORGANIZER", "ADMIN"] as const).map((role) => (
                        <button
                          key={role}
                          type="button"
                          onClick={() => setDirectoryRoleFilter(role)}
                          className={`flex-1 py-1.5 text-[10px] font-semibold rounded-lg transition-all cursor-pointer text-center ${
                            directoryRoleFilter === role 
                              ? "bg-brand-primary text-brand-bg" 
                              : "text-brand-secondary hover:text-brand-primary"
                          }`}
                        >
                          {role === "ALL" ? "All" : role === "VENDOR" ? "Vendors" : role === "ORGANIZER" ? "Hosts" : "Admins"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border border-brand-border rounded-xl overflow-hidden bg-brand-bg">
                    <div className="flex flex-col max-h-[500px] overflow-y-auto divide-y divide-brand-border scrollbar-thin">
                      {filteredUsers.map((u: any) => {
                        const isSelected = selectedDirectoryUserId === u.id;
                        return (
                          <button
                            key={u.id}
                            type="button"
                            onClick={() => setSelectedDirectoryUserId(u.id)}
                            className={`p-3 text-left transition-all hover:bg-brand-card/30 flex flex-col gap-1 w-full cursor-pointer font-sans ${
                              isSelected ? "bg-brand-card border-l-2 border-brand-primary" : ""
                            }`}
                          >
                            <div className="flex justify-between items-center w-full gap-2">
                              <span className="font-semibold text-brand-primary text-xs truncate max-w-[150px]">{u.companyName}</span>
                              <span className={`px-1.5 py-0.5 rounded text-[8px] font-medium uppercase shrink-0 ${
                                u.role === "VENDOR" 
                                  ? "bg-green-500/10 text-green-400 border border-green-500/20" 
                                  : u.role === "ORGANIZER"
                                  ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                                  : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                              }`}>
                                {u.role === "VENDOR" ? "Vendor" : u.role === "ORGANIZER" ? "Host" : "Admin"}
                              </span>
                            </div>
                            <div className="flex justify-between items-center w-full text-[10px] text-brand-secondary">
                              <span className="truncate max-w-[140px]">{u.email}</span>
                              <span className="flex items-center gap-0.5 font-sans">
                                {u.verified ? (
                                  <ShieldCheck size={10} className="text-green-500" />
                                ) : (
                                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 block shrink-0" />
                                )}
                                {u.verified ? "Verified" : "Pending"}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                      {filteredUsers.length === 0 && (
                        <div className="p-6 text-center text-brand-secondary/60 text-xs font-sans">No accounts match the criteria.</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column: Detailed Ecosystem Dossier (Col Span 8) */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                  {selectedDirectoryUser ? (
                    <div className="bg-brand-bg/40 border border-brand-border rounded-2xl p-6 flex flex-col gap-6 animate-fadeIn">
                      
                      {/* Dossier Header */}
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-brand-border pb-4">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2.5">
                            <h4 className="font-serif text-[18px] font-semibold text-brand-primary">
                              {selectedDirectoryUser.companyName}
                            </h4>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider font-sans ${
                              selectedDirectoryUser.role === "VENDOR" 
                                ? "bg-green-500/15 text-green-400 border border-green-500/30" 
                                : selectedDirectoryUser.role === "ORGANIZER"
                                ? "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30"
                                : "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                            }`}>
                              {selectedDirectoryUser.role} Account Dossier
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-brand-secondary font-sans">
                            <span className="flex items-center gap-1"><Mail size={12} /> {selectedDirectoryUser.email}</span>
                            <span className="flex items-center gap-1"><Phone size={12} /> {selectedDirectoryUser.phone}</span>
                            <span className="text-[10px] text-brand-secondary/70">Joined: {new Date(selectedDirectoryUser.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div className="flex gap-2 shrink-0">
                          {selectedDirectoryUser.verified ? (
                            <div className="flex items-center gap-1 px-3 py-1 bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg text-xs font-semibold font-sans">
                              <ShieldCheck size={14} /> Profile Verified
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleVerifyUser(selectedDirectoryUser.id)}
                              disabled={actionLoading !== null}
                              className="px-3 py-1 bg-brand-primary text-brand-bg rounded-lg text-xs font-semibold hover:opacity-90 transition-all cursor-pointer flex items-center gap-1 font-sans"
                            >
                              {actionLoading === `user-${selectedDirectoryUser.id}` ? (
                                <Loader2 size={12} className="animate-spin" />
                              ) : (
                                <>Verify Profile</>
                              )}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* CRM Notes Section */}
                      <div className="bg-brand-bg border border-brand-border rounded-xl p-4 flex flex-col gap-3 font-sans">
                        <span className="text-[10px] uppercase tracking-wider text-brand-secondary font-semibold">CRM Feedback & Interaction Log</span>
                        {editingCrmUserId === selectedDirectoryUser.id ? (
                          <div className="flex gap-2 items-center">
                            <input
                              type="text"
                              value={crmFeedbackInput}
                              onChange={(e) => setCrmFeedbackInput(e.target.value)}
                              placeholder="Add feedback, negotiations terms, credit comments..."
                              className="flex-1 px-3 py-2 border border-brand-border rounded-lg bg-brand-bg text-brand-primary text-xs focus:outline-none focus:border-brand-primary"
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveCrmFeedback(selectedDirectoryUser.id)}
                              disabled={actionLoading === `crm-${selectedDirectoryUser.id}`}
                              className="px-3 py-2 bg-brand-primary text-brand-bg text-xs font-semibold rounded-lg hover:opacity-90 cursor-pointer flex items-center justify-center min-w-[60px]"
                            >
                              {actionLoading === `crm-${selectedDirectoryUser.id}` ? <Loader2 size={12} className="animate-spin" /> : "Save"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingCrmUserId(null)}
                              className="px-3 py-2 border border-brand-border text-xs text-brand-primary rounded-lg hover:bg-brand-card cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-4 items-center justify-between">
                            <p className="text-xs text-brand-primary italic leading-relaxed">
                              {selectedDirectoryUser.adminFeedback || "No interactions recorded. Click Edit Note to log negotiation guidelines or partner status."}
                            </p>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCrmUserId(selectedDirectoryUser.id);
                                setCrmFeedbackInput(selectedDirectoryUser.adminFeedback || "");
                              }}
                              className="px-3 py-1.5 border border-brand-border text-xs font-medium rounded-lg hover:bg-brand-card text-brand-secondary hover:text-brand-primary transition-all cursor-pointer shrink-0"
                            >
                              Edit Note
                            </button>
                          </div>
                        )}
                      </div>

                      {/* VENDOR SPECIFIC DOSSIER DATA */}
                      {selectedDirectoryUser.role === "VENDOR" && (() => {
                        const vendorBookings = bookings.filter((b: any) => b.vendorId === selectedDirectoryUser.id);
                        const paidBookings = vendorBookings.filter((b: any) => b.status === "PAID");
                        const totalPaidAmount = paidBookings.reduce((sum: number, b: any) => sum + b.finalPrice, 0);
                        const platformRevenue = vendorBookings.reduce((sum: number, b: any) => {
                          if (b.status === "PAID" || b.status === "APPROVED") {
                            return sum + (b.finalPrice - (b.stall?.basePrice || 0));
                          }
                          return sum;
                        }, 0);

                        return (
                          <div className="flex flex-col gap-6 font-sans">
                            {/* Performance indicators */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div className="bg-brand-bg/50 border border-brand-border rounded-xl p-4">
                                <span className="text-[9px] uppercase tracking-wider text-brand-secondary block font-semibold">Stalls Booked Till Now</span>
                                <div className="font-serif text-lg font-semibold text-brand-primary mt-1">
                                  {vendorBookings.length} Stalls
                                </div>
                                <span className="text-[10px] text-brand-secondary block mt-0.5">
                                  {paidBookings.length} Paid / {vendorBookings.filter((b: any) => b.status === "APPROVED").length} Approved Bids
                                </span>
                              </div>

                              <div className="bg-brand-bg/50 border border-brand-border rounded-xl p-4">
                                <span className="text-[9px] uppercase tracking-wider text-brand-secondary block font-semibold">Amount Paid Stallwise</span>
                                <div className="font-serif text-lg font-semibold text-brand-primary mt-1">
                                  ₹{totalPaidAmount.toLocaleString("en-IN")}
                                </div>
                                <span className="text-[10px] text-brand-secondary block mt-0.5">
                                  Direct cash/offline checkout volume
                                </span>
                              </div>

                              <div className="bg-brand-bg/50 border border-brand-border rounded-xl p-4">
                                <span className="text-[9px] uppercase tracking-wider text-brand-secondary block font-semibold">Revenue Generated Stallwise</span>
                                <div className="font-serif text-lg font-semibold text-brand-primary mt-1">
                                  ₹{platformRevenue.toLocaleString("en-IN")}
                                </div>
                                <span className="text-[10px] text-brand-secondary block mt-0.5">
                                  Total platform yield generated
                                </span>
                              </div>
                            </div>

                            {/* Bookings Ledger */}
                            <div className="flex flex-col gap-3">
                              <h5 className="font-serif text-sm font-semibold text-brand-primary border-b border-brand-border pb-1">
                                Event-wise & Stall-wise Bookings Ledger
                              </h5>
                              <div className="border border-brand-border rounded-xl overflow-hidden bg-brand-bg">
                                <div className="overflow-x-auto max-h-[300px]">
                                  <table className="w-full text-left border-collapse text-xs">
                                    <thead>
                                      <tr className="border-b border-brand-border bg-brand-card font-semibold text-[9px] uppercase tracking-wider text-brand-secondary">
                                        <th className="p-3">Stall No.</th>
                                        <th className="p-3">Festival Event</th>
                                        <th className="p-3 text-right">Amount Paid</th>
                                        <th className="p-3 text-right">Base Rent</th>
                                        <th className="p-3 text-right">Revenue Generated</th>
                                        <th className="p-3 text-center">Status</th>
                                        <th className="p-3 text-center">Operations</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-brand-border text-brand-secondary">
                                      {vendorBookings.map((b: any) => {
                                        const basePrice = b.stall?.basePrice || 0;
                                        const yieldPrice = b.finalPrice - basePrice;
                                        return (
                                          <tr key={b.id} className="hover:bg-brand-card/20">
                                            <td className="p-3 font-semibold text-brand-primary">Stall {b.stall?.stallNumber}</td>
                                            <td className="p-3 font-medium text-brand-primary">{b.festival?.name}</td>
                                            <td className="p-3 text-right font-serif font-semibold text-brand-primary">₹{b.finalPrice.toLocaleString("en-IN")}</td>
                                            <td className="p-3 text-right">₹{basePrice.toLocaleString("en-IN")}</td>
                                            <td className="p-3 text-right text-emerald-500 font-semibold">₹{yieldPrice.toLocaleString("en-IN")}</td>
                                            <td className="p-3 text-center">
                                              <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                                                b.status === "PAID" 
                                                  ? "bg-green-500/10 text-green-400" 
                                                  : b.status === "APPROVED"
                                                  ? "bg-amber-500/10 text-amber-400"
                                                  : b.status === "NEGOTIATING"
                                                  ? "bg-blue-500/10 text-blue-400"
                                                  : "bg-neutral-500/10 text-neutral-400"
                                              }`}>
                                                {b.status}
                                              </span>
                                            </td>
                                            <td className="p-3 text-center">
                                              {b.status !== "PAID" && b.status !== "CANCELLED" ? (
                                                <button
                                                  type="button"
                                                  onClick={() => handleMarkPaidOffline(b.id)}
                                                  disabled={actionLoading !== null}
                                                  className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 rounded text-[9px] hover:bg-emerald-500/20 font-semibold cursor-pointer"
                                                >
                                                  {actionLoading === `pay-${b.id}` ? (
                                                    <Loader2 size={8} className="animate-spin" />
                                                  ) : (
                                                    "Mark Paid (Cash)"
                                                  )}
                                                </button>
                                              ) : (
                                                <span className="opacity-40 text-[9px] italic">No overrides</span>
                                              )}
                                            </td>
                                          </tr>
                                        );
                                      })}
                                      {vendorBookings.length === 0 && (
                                        <tr>
                                          <td colSpan={7} className="p-6 text-center text-brand-secondary/60">This vendor has not booked any stalls yet.</td>
                                        </tr>
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                      {/* ORGANIZER SPECIFIC DOSSIER DATA */}
                      {selectedDirectoryUser.role === "ORGANIZER" && (() => {
                        const orgFests = publishedFestivals.filter((f: any) => f.organizerId === selectedDirectoryUser.id);
                        
                        let totalRentRevenue = 0;
                        let totalPlatformProfit = 0;
                        let totalBookings = 0;

                        orgFests.forEach((fest: any) => {
                          const festBookings = bookings.filter((b: any) => b.festivalId === fest.id && (b.status === "PAID" || b.status === "APPROVED"));
                          totalBookings += festBookings.length;
                          festBookings.forEach((b: any) => {
                            totalRentRevenue += b.stall?.basePrice || 0;
                            totalPlatformProfit += b.finalPrice - (b.stall?.basePrice || 0);
                          });
                        });

                        return (
                          <div className="flex flex-col gap-6 font-sans">
                            {/* Performance indicators */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div className="bg-brand-bg/50 border border-brand-border rounded-xl p-4">
                                <span className="text-[9px] uppercase tracking-wider text-brand-secondary block font-semibold">Fest Names Hosted</span>
                                <div className="font-serif text-lg font-semibold text-brand-primary mt-1">
                                  {orgFests.length} Festivals
                                </div>
                                <span className="text-[10px] text-brand-secondary block mt-0.5">
                                  Active campaign operations
                                </span>
                              </div>

                              <div className="bg-brand-bg/50 border border-brand-border rounded-xl p-4">
                                <span className="text-[9px] uppercase tracking-wider text-brand-secondary block font-semibold">Revenue Generated</span>
                                <div className="font-serif text-lg font-semibold text-brand-primary mt-1">
                                  ₹{totalRentRevenue.toLocaleString("en-IN")}
                                </div>
                                <span className="text-[10px] text-brand-secondary block mt-0.5">
                                  Earned base rents from {totalBookings} bookings
                                </span>
                              </div>

                              <div className="bg-brand-bg/50 border border-brand-border rounded-xl p-4">
                                <span className="text-[9px] uppercase tracking-wider text-brand-secondary block font-semibold">Profit Generated</span>
                                <div className="font-serif text-lg font-semibold text-brand-primary mt-1">
                                  ₹{totalPlatformProfit.toLocaleString("en-IN")}
                                </div>
                                <span className="text-[10px] text-brand-secondary block mt-0.5">
                                  Platform commission margin yield
                                </span>
                              </div>
                            </div>

                            {/* Festivals Ledger */}
                            <div className="flex flex-col gap-4">
                              <h5 className="font-serif text-sm font-semibold text-brand-primary border-b border-brand-border pb-1">
                                Campaign Details & Stallwise Booking Matrix
                              </h5>
                              
                              {orgFests.map((fest: any) => {
                                const festBookings = bookings.filter((b: any) => b.festivalId === fest.id);
                                return (
                                  <div key={fest.id} className="border border-brand-border rounded-xl bg-brand-bg/20 p-4 flex flex-col gap-3">
                                    <div className="flex justify-between items-center border-b border-brand-border/50 pb-2">
                                      <div className="flex flex-col">
                                        <span className="font-serif font-bold text-brand-primary text-sm">{fest.name}</span>
                                        <span className="text-[10px] text-brand-secondary">
                                          Dates: {new Date(fest.startDate).toLocaleDateString()} to {new Date(fest.endDate).toLocaleDateString()} &middot; Location: {fest.location}
                                        </span>
                                      </div>
                                      <span className="text-xs bg-brand-card px-2.5 py-1 border border-brand-border rounded-full text-brand-primary font-semibold">
                                        {fest.stalls?.length || 0} Total Stalls Mapped
                                      </span>
                                    </div>

                                    {/* Table of who booked which stall */}
                                    <div className="overflow-x-auto">
                                      <table className="w-full text-left text-xs">
                                        <thead>
                                          <tr className="text-[8px] uppercase tracking-wider text-brand-secondary border-b border-brand-border/40 bg-brand-card/10">
                                            <th className="p-2">Stall No.</th>
                                            <th className="p-2">Dims</th>
                                            <th className="p-2">Status</th>
                                            <th className="p-2 text-right">Price</th>
                                            <th className="p-2">Vendor Name</th>
                                            <th className="p-2">Vendor Contact Details</th>
                                            <th className="p-2 text-center">Cash Booking</th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-brand-border/30 text-brand-secondary">
                                          {(fest.stalls || []).map((stall: any) => {
                                            const activeStallBooking = festBookings.find(
                                              (b: any) => b.stallId === stall.id && (b.status === "PAID" || b.status === "APPROVED" || b.status === "NEGOTIATING" || b.status === "PENDING")
                                            );
                                            return (
                                              <tr key={stall.id} className="hover:bg-brand-card/10">
                                                <td className="p-2 font-bold text-brand-primary">Stall {stall.stallNumber}</td>
                                                <td className="p-2">{stall.dimensions}</td>
                                                <td className="p-2">
                                                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-medium uppercase ${
                                                    stall.status === "BOOKED" 
                                                      ? "bg-green-500/10 text-green-400" 
                                                      : stall.status === "NEGOTIATION"
                                                      ? "bg-blue-500/10 text-blue-400"
                                                      : "bg-neutral-500/10 text-neutral-400"
                                                  }`}>
                                                    {stall.status}
                                                  </span>
                                                </td>
                                                <td className="p-2 text-right font-serif">
                                                  ₹{(activeStallBooking ? activeStallBooking.finalPrice : stall.publicPrice).toLocaleString("en-IN")}
                                                </td>
                                                <td className="p-2 font-semibold text-brand-primary">
                                                  {activeStallBooking ? (activeStallBooking.vendor?.profile?.companyName || "Vendor Account") : (
                                                    <span className="opacity-40 italic">Available</span>
                                                  )}
                                                </td>
                                                <td className="p-2">
                                                  {activeStallBooking ? (
                                                    <div className="flex flex-col text-[10px]">
                                                      <span>{activeStallBooking.vendor?.profile?.contactPhone || "No Phone"}</span>
                                                      <span className="opacity-60 text-[9px]">{activeStallBooking.vendor?.email}</span>
                                                    </div>
                                                  ) : (
                                                    <span className="opacity-40 italic">N/A</span>
                                                  )}
                                                </td>
                                                <td className="p-2 text-center">
                                                  {!activeStallBooking ? (
                                                    <button
                                                      type="button"
                                                      onClick={() => {
                                                        setSelectedFestId(fest.id);
                                                        setManualBookStallId(stall.id);
                                                        setManualBookPrice(stall.publicPrice.toString());
                                                        setShowManualBookModal(true);
                                                      }}
                                                      className="px-2 py-0.5 border border-brand-primary/30 text-brand-primary rounded text-[9px] hover:bg-brand-primary hover:text-brand-bg transition-all font-semibold cursor-pointer"
                                                    >
                                                      Book (Offline)
                                                    </button>
                                                  ) : (
                                                    activeStallBooking.status !== "PAID" ? (
                                                      <button
                                                        type="button"
                                                        onClick={() => handleMarkPaidOffline(activeStallBooking.id)}
                                                        disabled={actionLoading !== null}
                                                        className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded text-[9px] hover:bg-emerald-500/20 font-semibold cursor-pointer"
                                                      >
                                                        Mark Paid
                                                      </button>
                                                    ) : (
                                                      <span className="text-[9px] opacity-40 italic">Paid (Cash)</span>
                                                    )
                                                  )}
                                                </td>
                                              </tr>
                                            );
                                          })}
                                          {(fest.stalls || []).length === 0 && (
                                            <tr>
                                              <td colSpan={7} className="p-4 text-center text-brand-secondary/60">No stalls layout has been created for this festival property.</td>
                                            </tr>
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                );
                              })}
                              {orgFests.length === 0 && (
                                <p className="text-xs text-brand-secondary/60 italic text-center p-6 bg-brand-bg border border-brand-border rounded-xl">This host has not published any festival events yet.</p>
                              )}
                            </div>
                          </div>
                        );
                      })()}

                      {/* ADMIN SPECIFIC DOSSIER DATA */}
                      {selectedDirectoryUser.role === "ADMIN" && (
                        <div className="flex flex-col gap-4 font-sans text-xs">
                          <p className="text-brand-primary font-semibold font-sans">Super Administrator Account privileges enabled.</p>
                          <ul className="list-disc pl-4 text-brand-secondary flex flex-col gap-2 font-sans">
                            <li>Manual override actions: Force bookings offline, manual checkout overrides.</li>
                            <li>Commission margins adjuster across individual stalls.</li>
                            <li>Festivals reviews, line-up change approvals, decks verify blocks.</li>
                            <li>Profiles verify, CRM guidelines override, system configurations control.</li>
                          </ul>
                        </div>
                      )}

                    </div>
                  ) : (
                    <div className="bg-brand-bg/10 border border-dashed border-brand-border rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-4 h-full min-h-[400px]">
                      <div className="w-16 h-16 rounded-full bg-brand-card flex items-center justify-center border border-brand-border text-brand-secondary">
                        <Users size={32} />
                      </div>
                      <div className="flex flex-col gap-1 max-w-sm">
                        <h4 className="font-serif text-base font-semibold text-brand-primary">Select Profile for Ecosystem Dossier</h4>
                        <p className="text-xs text-brand-secondary">
                          Select any vendor partner, event host, or administrator from the left menu to view verified status, chronological bookings history, P&L stats, and cash overrides.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* Subview E: Reports */}
          {activeSubView === "reports" && (
            <div className="flex flex-col gap-8 animate-fadeIn font-sans">
              <div className="flex flex-col gap-1 border-b border-brand-border pb-4">
                <span className="font-sans text-[9px] uppercase tracking-wider text-brand-secondary">Sub-view 5</span>
                <h3 className="font-serif text-[20px] font-semibold text-brand-primary flex items-center gap-2">
                  <ClipboardList size={20} className="text-brand-secondary" /> Financial Statements & Reports
                </h3>
                <p className="text-xs text-brand-secondary">
                  Generate monthly statements or event-wise P&L sheets. Deduct miscellaneous costs to see platform net profitability.
                </p>
              </div>

              {/* Setup Panel */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-brand-bg/50 border border-brand-border rounded-2xl p-6">
                
                {/* 1. Report Type Toggle */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-wider text-brand-secondary font-semibold">1. Report Category</label>
                  <div className="flex bg-brand-bg border border-brand-border rounded-xl p-1">
                    <button
                      onClick={() => setReportType("monthly")}
                      className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                        reportType === "monthly" 
                          ? "bg-brand-primary text-brand-bg" 
                          : "text-brand-secondary hover:text-brand-primary"
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setReportType("event")}
                      className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                        reportType === "event" 
                          ? "bg-brand-primary text-brand-bg" 
                          : "text-brand-secondary hover:text-brand-primary"
                      }`}
                    >
                      Event-Wise
                    </button>
                  </div>
                </div>

                {/* 2. Month Selector or Festival Selector */}
                {reportType === "monthly" ? (
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-wider text-brand-secondary font-semibold">2. Target Month</label>
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="gz-select border border-brand-border rounded-xl px-4 py-2.5 bg-brand-bg text-brand-primary text-xs focus:outline-none focus:border-brand-primary"
                    >
                      {derivedMonths.map((m: string) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-wider text-brand-secondary font-semibold">2. Target Festival</label>
                    <select
                      value={selectedFestivalReportId}
                      onChange={(e) => setSelectedFestivalReportId(e.target.value)}
                      className="gz-select border border-brand-border rounded-xl px-4 py-2.5 bg-brand-bg text-brand-primary text-xs focus:outline-none focus:border-brand-primary"
                    >
                      {publishedFestivals.map((f: any) => (
                        <option key={f.id} value={f.id}>{f.name} ({f.collegeName})</option>
                      ))}
                      {publishedFestivals.length === 0 && <option value="">No published events</option>}
                    </select>
                  </div>
                )}

                {/* 3. Miscellaneous Expenses */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-wider text-brand-secondary font-semibold">3. Miscellaneous Costs (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={miscExpenses}
                    onChange={(e) => setMiscExpenses(e.target.value)}
                    className="border border-brand-border rounded-xl px-4 py-2 bg-brand-bg text-brand-primary text-xs focus:outline-none focus:border-brand-primary font-semibold"
                    placeholder="0"
                  />
                </div>

                {/* 4. Action Buttons */}
                <div className="flex items-end">
                  <button
                    onClick={handleGenerateReport}
                    className="w-full btn-liquid-glass-dark py-2.5 px-4 text-xs font-semibold justify-center text-center cursor-pointer"
                  >
                    Generate Statement
                  </button>
                </div>

              </div>

              {/* Report Output Details */}
              {generatedReport && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
                  
                  {/* Left Side: Summary Card */}
                  <div className="lg:col-span-7 border border-brand-border rounded-[24px] p-8 bg-brand-card/50 shadow-sm flex flex-col gap-6">
                    <div className="flex justify-between items-start border-b border-brand-border pb-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase tracking-wider text-brand-secondary font-semibold">
                          {generatedReport.type} REPORT STATEMENT
                        </span>
                        <h4 className="font-serif text-[22px] font-semibold text-brand-primary">
                          {generatedReport.title}
                        </h4>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveReport}
                          disabled={actionLoading === "save-report"}
                          className="px-3.5 py-1.5 bg-brand-primary text-brand-bg text-[11px] font-semibold rounded-lg hover:opacity-90 cursor-pointer flex items-center justify-center gap-1"
                        >
                          {actionLoading === "save-report" ? <Loader2 size={12} className="animate-spin" /> : "Save Report"}
                        </button>
                        <button
                          onClick={handleExportCSV}
                          className="px-3.5 py-1.5 border border-brand-border text-brand-primary text-[11px] font-medium rounded-lg hover:bg-brand-card cursor-pointer"
                        >
                          Export CSV
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 font-sans text-xs text-brand-secondary border-b border-brand-border pb-6">
                      <div className="flex flex-col gap-0.5">
                        <span>Gross GNV</span>
                        <strong className="text-brand-primary font-medium text-[16px]">₹{generatedReport.gnv.toLocaleString("en-IN")}</strong>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span>Organizer Rent Share</span>
                        <strong className="text-brand-primary font-medium text-[16px]">₹{generatedReport.rentBase.toLocaleString("en-IN")}</strong>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span>Gross Commission Margin</span>
                        <strong className="text-brand-primary font-medium text-[16px]">₹{generatedReport.commissionMargin.toLocaleString("en-IN")}</strong>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span>Aggregated Bookings</span>
                        <strong className="text-brand-primary font-medium text-[16px]">{generatedReport.bookingsCount} bookings</strong>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-brand-secondary">Platform Gross Margin:</span>
                        <span className="text-brand-primary font-semibold">₹{generatedReport.commissionMargin.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-red-400">
                        <span>Deductions (Misc Costs):</span>
                        <span>- ₹{generatedReport.miscExpenses.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="h-px bg-brand-border w-full" />
                      <div className="flex justify-between items-center text-sm font-semibold border-t border-brand-border pt-4">
                        <span className="text-brand-primary">Ground Zero Net Profit:</span>
                        <span className={`font-serif text-lg ${generatedReport.netProfit >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                          ₹{generatedReport.netProfit.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Quick Stats breakdown */}
                  <div className="lg:col-span-5 border border-brand-border rounded-[24px] p-6 bg-brand-bg flex flex-col gap-6">
                    <h5 className="font-serif text-sm font-semibold text-brand-primary border-b border-brand-border pb-2">
                      Statement Breakdown Notes
                    </h5>
                    <ul className="text-xs text-brand-secondary flex flex-col gap-4 list-disc pl-4 leading-relaxed">
                      <li>Gross GNV captures the total final contract values locked in paid and approved bookings for the target period.</li>
                      <li>Organizer Rent represents the base floor pricing going directly to the hosting institution.</li>
                      <li>Miscellaneous Costs reflect marketing, legal, or logistical overheads manually recorded.</li>
                      <li>Saved reports are archived permanently in the SQLite data table and can be recalled in the registry log below.</li>
                    </ul>
                  </div>

                </div>
              )}

              {/* Saved Reports Database Registry */}
              <div className="flex flex-col gap-4">
                <h4 className="font-serif text-[16px] font-semibold text-brand-primary">Archived Statements Log</h4>
                
                <div className="border border-brand-border rounded-xl overflow-hidden bg-brand-bg text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-brand-border bg-brand-card font-semibold text-[10px] uppercase tracking-wider text-brand-secondary">
                        <th className="p-4">Report Title</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Period / ID</th>
                        <th className="p-4 text-right">GNV Value</th>
                        <th className="p-4 text-right">Net Profit</th>
                        <th className="p-4 text-center">Archived Date</th>
                        <th className="p-4 text-center">Option</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-border text-brand-secondary">
                      {savedReports.map((report: any) => {
                        let rData: any = {};
                        try {
                          rData = typeof report.data === "string" ? JSON.parse(report.data) : report.data;
                        } catch (e) {}

                        return (
                          <tr key={report.id} className="hover:bg-brand-card/30">
                            <td className="p-4 font-semibold text-brand-primary">{report.title}</td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase ${
                                report.type === "MONTHLY" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                              }`}>
                                {report.type}
                              </span>
                            </td>
                            <td className="p-4 font-mono text-[10px]">{report.period}</td>
                            <td className="p-4 text-right font-serif">₹{(rData.gnv || 0).toLocaleString("en-IN")}</td>
                            <td className="p-4 text-right font-serif font-bold text-brand-primary">₹{(rData.netProfit || 0).toLocaleString("en-IN")}</td>
                            <td className="p-4 text-center">{new Date(report.createdAt).toLocaleDateString("en-IN")}</td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => handleLoadSavedReport(report)}
                                className="px-2.5 py-1 bg-brand-primary text-brand-bg text-[10px] font-semibold rounded hover:opacity-90 cursor-pointer"
                              >
                                Load View
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                      {savedReports.length === 0 && (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-brand-secondary/60">No financial statement reports saved in database yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Splitscreen Approvals & Verifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Festival Approvals Queue */}
          <div className="flex flex-col gap-6">
            <h2 className="font-serif text-[20px] font-medium text-brand-primary border-b border-brand-border pb-3 flex items-center justify-between">
              <span>Festival Listings Queue</span>
              <span className="px-2 py-0.5 bg-brand-card border border-brand-border rounded-full text-[10px] font-sans text-brand-secondary">
                {pendingFestivals.length} Awaiting Audit
              </span>
            </h2>

            {pendingFestivals.length === 0 ? (
              <div className="bg-brand-card border border-brand-border rounded-2xl p-10 text-center text-brand-secondary text-sm">
                No festival listing requests pending administrative review.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {pendingFestivals.map((fest: any) => {
                  const defaultCommValue = defaultCommissions[fest.id] || "2000";
                  return (
                    <div key={fest.id} className="bg-brand-card border border-brand-border rounded-[20px] p-6 shadow-sm flex flex-col gap-4">
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-1.5">
                          <span className="font-serif text-[16px] font-medium text-brand-primary">
                            {fest.name}
                          </span>
                          <span className="text-[12px] font-sans text-brand-secondary flex items-center gap-1">
                            <MapPin size={12} /> {fest.collegeName} &middot; {fest.location}
                          </span>
                          <span className="text-[11px] font-sans text-brand-secondary mt-1">
                            Host: <strong className="text-brand-primary font-medium">{fest.organizer?.profile?.companyName || fest.organizer?.email}</strong>
                          </span>
                        </div>
                      </div>

                      {/* On-the-fly commission markup entry */}
                      <div className="border-t border-brand-border pt-4 mt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-2 font-sans text-xs">
                          <label className="text-brand-secondary font-semibold uppercase tracking-wider text-[9px] whitespace-nowrap">Stall Markup (₹):</label>
                          <input
                            type="number"
                            value={defaultCommValue}
                            onChange={(e) => setDefaultCommissions({ ...defaultCommissions, [fest.id]: e.target.value })}
                            placeholder="2000"
                            className="w-24 px-3 py-1.5 border border-brand-border rounded-lg bg-brand-bg text-brand-primary text-right text-xs focus:outline-none focus:border-brand-primary font-semibold"
                          />
                        </div>

                        <button
                          onClick={() => handleApproveFestival(fest.id)}
                          disabled={actionLoading !== null}
                          className="btn-liquid-glass-dark text-xs py-2 px-6 flex items-center justify-center gap-1.5 cursor-pointer"
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
                  );
                })}
              </div>
            )}
          </div>

          {/* User Verification Queue */}
          <div className="flex flex-col gap-6">
            <h2 className="font-serif text-[20px] font-medium text-brand-primary border-b border-brand-border pb-3 flex items-center justify-between">
              <span>Registry Verification Queue</span>
              <span className="px-2 py-0.5 bg-brand-card border border-brand-border rounded-full text-[10px] font-sans text-brand-secondary">
                {pendingUsers.length} Awaiting Verification
              </span>
            </h2>

            {pendingUsers.length === 0 ? (
              <div className="bg-brand-card border border-brand-border rounded-2xl p-10 text-center text-brand-secondary text-sm">
                No user onboarding requests pending administrative verification.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {pendingUsers.map((u: any) => (
                  <div key={u.id} className="bg-brand-card border border-brand-border rounded-[20px] p-6 shadow-sm flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col gap-1.5">
                        <span className="font-serif text-[16px] font-medium text-brand-primary">
                          {u.profile?.companyName || "Unnamed Entity"}
                        </span>
                        <span className="text-[12px] font-sans text-brand-secondary flex items-center gap-1">
                          <Mail size={12} /> {u.email}
                        </span>
                        <span className="text-[11px] font-sans text-brand-secondary uppercase tracking-wider mt-1.5">
                          Category: <strong className="text-brand-primary font-medium">{u.profile?.category || "Host"}</strong> &middot; Role: <strong className="text-brand-primary font-medium">{u.role}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-brand-border pt-4 mt-2 flex justify-end">
                      <button
                        onClick={() => handleVerifyUser(u.id)}
                        disabled={actionLoading !== null}
                        className="btn-liquid-glass-dark text-xs py-2 px-6 flex items-center gap-1.5 cursor-pointer"
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

        {/* Platform Commissions & Score Adjuster */}
        {publishedFestivals.length > 0 && (
          <div className="flex flex-col gap-8 bg-brand-card border border-brand-border rounded-[28px] p-8 shadow-sm">
            <div className="flex flex-col gap-2 border-b border-brand-border pb-6">
              <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-brand-secondary">Platform Adjustments Panel</span>
              <h2 className="font-serif text-[24px] font-medium text-brand-primary">
                Commissions & Opportunity Scores Editor
              </h2>
              <p className="font-sans text-xs text-brand-secondary max-w-2xl leading-relaxed">
                Select an active, published festival to adjust its overall GZ Opportunity Score, audit base prices, and modify the platform commission markup on individual stalls.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Festival Selector & Opportunity score */}
              <div className="lg:col-span-4 flex flex-col gap-6 font-sans">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-wider text-brand-secondary font-semibold">1. Select Published Festival</label>
                  <select
                    value={selectedFestId}
                    onChange={(e) => setSelectedFestId(e.target.value)}
                    className="gz-select border border-brand-border rounded-xl px-4 py-3 bg-brand-bg text-brand-primary text-sm focus:outline-none focus:border-brand-primary"
                  >
                    {publishedFestivals.map((f: any) => (
                      <option key={f.id} value={f.id}>{f.name} ({f.collegeName})</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-3 p-5 bg-brand-bg border border-brand-border rounded-[20px]">
                  <div className="flex justify-between items-center text-[10px] uppercase tracking-wider text-brand-secondary font-semibold">
                    <span>Opportunity Score</span>
                    <span className="text-brand-primary font-medium text-xs">{opportunityScoreInput}/100</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="100"
                    value={opportunityScoreInput}
                    onChange={(e) => setOpportunityScoreInput(parseInt(e.target.value))}
                    className="w-full h-1 bg-brand-border rounded-lg appearance-none cursor-pointer accent-brand-primary"
                  />
                  <button
                    onClick={handleUpdateOpportunityScore}
                    disabled={actionLoading === `score-${selectedFestId}`}
                    className="w-full btn-liquid-glass-dark text-xs py-2 mt-2 flex justify-center items-center gap-1.5 cursor-pointer"
                  >
                    {actionLoading === `score-${selectedFestId}` ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      "Apply New Score"
                    )}
                  </button>
                </div>
              </div>

              {/* Right Column: Stalls Commission List */}
              <div className="lg:col-span-8 flex flex-col gap-4">
                <label className="font-sans text-[10px] uppercase tracking-wider text-brand-secondary font-semibold">2. Stall Commissions Directory</label>
                
                {(!selectedFest || !selectedFest.stalls || selectedFest.stalls.length === 0) ? (
                  <div className="bg-brand-bg border border-brand-border rounded-[20px] p-6 text-center text-brand-secondary text-xs font-sans">
                    No mapped stalls found for this festival property. Use organizer mapper to create layout cells.
                  </div>
                ) : (
                  <div className="border border-brand-border rounded-2xl overflow-hidden bg-brand-bg">
                    <div className="overflow-x-auto max-h-[300px]">
                      <table className="w-full text-left border-collapse font-sans text-xs">
                        <thead>
                          <tr className="border-b border-brand-border bg-brand-card font-semibold text-[10px] uppercase tracking-wider text-brand-secondary opacity-80">
                            <th className="p-4">Stall No.</th>
                            <th className="p-4">Dims</th>
                            <th className="p-4 text-right">Base Price (Host)</th>
                            <th className="p-4 text-right">Commission</th>
                            <th className="p-4 text-right">Public Price</th>
                            <th className="p-4 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-border text-brand-secondary">
                          {selectedFest.stalls.map((stall: any) => {
                            const isEditing = editingStallId === stall.id;
                            return (
                              <tr key={stall.id} className="hover:bg-brand-card/50">
                                <td className="p-4 font-semibold text-brand-primary">{stall.stallNumber}</td>
                                <td className="p-4">{stall.dimensions}</td>
                                <td className="p-4 text-right">₹{stall.basePrice.toLocaleString("en-IN")}</td>
                                <td className="p-4 text-right text-brand-primary">
                                  {isEditing ? (
                                    <input
                                      type="number"
                                      value={stallCommissionInput}
                                      onChange={(e) => setStallCommissionInput(e.target.value)}
                                      className="w-20 px-2 py-1 border border-brand-border rounded text-right text-xs bg-brand-bg text-brand-primary focus:outline-none focus:border-brand-primary"
                                    />
                                  ) : (
                                    `₹${(stall.commissionAmount || 0).toLocaleString("en-IN")}`
                                  )}
                                </td>
                                <td className="p-4 text-right font-serif font-semibold text-brand-primary">
                                  {isEditing ? (
                                    `₹${(stall.basePrice + (parseFloat(stallCommissionInput) || 0)).toLocaleString("en-IN")}`
                                  ) : (
                                    `₹${stall.publicPrice.toLocaleString("en-IN")}`
                                  )}
                                </td>
                                <td className="p-4 text-center">
                                  {isEditing ? (
                                    <div className="flex gap-2 justify-center">
                                      <button
                                        onClick={() => handleUpdateStallCommission(stall.id)}
                                        disabled={actionLoading === `stall-${stall.id}`}
                                        className="px-2.5 py-1 bg-brand-primary text-brand-bg text-[10px] font-semibold rounded hover:opacity-90 transition-opacity cursor-pointer"
                                      >
                                        Save
                                      </button>
                                      <button
                                        onClick={() => setEditingStallId(null)}
                                        className="px-2.5 py-1 border border-brand-border text-[10px] font-medium rounded hover:bg-brand-card transition-colors cursor-pointer"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        setEditingStallId(stall.id);
                                        setStallCommissionInput((stall.commissionAmount || 0).toString());
                                      }}
                                      className="px-3 py-1 border border-brand-border text-[10px] font-medium rounded hover:bg-brand-card transition-colors cursor-pointer"
                                    >
                                      Edit Markup
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Global Transaction Ledger */}
        <div className="flex flex-col gap-6">
          <h2 className="font-serif text-[20px] font-medium text-brand-primary border-b border-brand-border pb-3">
            Global Network Ledger
          </h2>

          {bookings.length === 0 ? (
            <div className="bg-brand-card border border-brand-border rounded-2xl p-12 text-center text-brand-secondary text-sm">
              No transactions have been recorded on the network.
            </div>
          ) : (
            <div className="bg-brand-card border border-brand-border rounded-[24px] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-brand-border bg-brand-bg font-sans text-[11px] uppercase tracking-wider text-brand-secondary">
                      <th className="p-5 font-semibold">Vendor Entity</th>
                      <th className="p-5 font-semibold">Festival Property</th>
                      <th className="p-5 font-semibold">Stall Details</th>
                      <th className="p-5 font-semibold text-right">Transaction Value</th>
                      <th className="p-5 font-semibold text-center">Status</th>
                      <th className="p-5 font-semibold text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border font-sans text-[13px] text-brand-secondary bg-brand-card">
                    {bookings.map((booking: any) => (
                      <tr key={booking.id} className="hover:bg-brand-bg/40">
                        <td className="p-5 font-medium text-brand-primary">
                          {booking.vendor?.profile?.companyName || booking.vendor?.email}
                        </td>
                        <td className="p-5 text-brand-secondary">
                          {booking.festival?.name}
                        </td>
                        <td className="p-5 text-brand-secondary">
                          Stall {booking.stall?.stallNumber} ({booking.stall?.dimensions} ft)
                        </td>
                        <td className="p-5 text-right font-serif font-semibold text-brand-primary">
                          ₹{booking.finalPrice.toLocaleString("en-IN")}
                        </td>
                        <td className="p-5 text-center">
                          <span className={`px-2.5 py-0.5 border rounded-full text-[9px] uppercase tracking-wider font-semibold ${
                            booking.status === "PAID" 
                              ? "bg-brand-primary text-brand-bg border-brand-primary" 
                              : booking.status === "NEGOTIATING" || booking.status === "PENDING" || booking.status === "APPROVED"
                              ? "bg-brand-bg border-dashed border-brand-border text-brand-secondary"
                              : "bg-red-950/20 border-red-900/50 text-red-400"
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="p-5 text-center">
                          {booking.status !== "PAID" && booking.status !== "CANCELLED" ? (
                            <button
                              onClick={() => handleMarkPaidOffline(booking.id)}
                              disabled={actionLoading !== null}
                              className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 rounded font-semibold text-[11px] hover:bg-emerald-500/20 transition-all cursor-pointer flex items-center gap-1 justify-center mx-auto"
                            >
                              {actionLoading === `pay-${booking.id}` ? (
                                <Loader2 size={10} className="animate-spin" />
                              ) : (
                                "Mark Paid (Offline)"
                              )}
                            </button>
                          ) : (
                            <span className="text-[11px] opacity-40 italic">Ledger Locked</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Manual Booking Modal */}
      {showManualBookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg border border-brand-border bg-brand-card rounded-3xl p-8 shadow-2xl relative font-sans">
            <button
              type="button"
              onClick={() => {
                setShowManualBookModal(false);
                setManualBookVendorId("");
                setManualBookStallId("");
                setManualBookPrice("");
              }}
              className="absolute top-6 right-6 text-brand-secondary hover:text-brand-primary transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col gap-2 border-b border-brand-border pb-4 mb-6">
              <span className="text-[9px] uppercase tracking-wider text-brand-secondary">Override Console</span>
              <h4 className="font-serif text-[22px] font-semibold text-brand-primary flex items-center gap-2">
                <Landmark size={22} className="text-brand-secondary" /> Force Book Stall (Offline Cash)
              </h4>
              <p className="text-xs text-brand-secondary">
                Directly record a cash or offline payment for a vendor, bypassing the negotiation/online checkout flow. Competing bids on this stall will be auto-cancelled.
              </p>
            </div>

            <form onSubmit={handleManualBookStall} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-wider text-brand-secondary font-semibold">1. Select Event Festival</label>
                <select
                  value={selectedFestId}
                  onChange={(e) => {
                    setSelectedFestId(e.target.value);
                    setManualBookStallId("");
                  }}
                  className="gz-select border border-brand-border rounded-xl px-4 py-3 bg-brand-bg text-brand-primary text-sm focus:outline-none focus:border-brand-primary"
                  required
                >
                  <option value="" disabled>-- Choose Published Fest --</option>
                  {publishedFestivals.map((f: any) => (
                    <option key={f.id} value={f.id}>{f.name} ({f.collegeName})</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-wider text-brand-secondary font-semibold">2. Target Stall</label>
                <select
                  value={manualBookStallId}
                  onChange={(e) => {
                    setManualBookStallId(e.target.value);
                    const stall = selectedFest?.stalls?.find((s: any) => s.id === e.target.value);
                    if (stall) {
                      setManualBookPrice(stall.publicPrice.toString());
                    }
                  }}
                  className="gz-select border border-brand-border rounded-xl px-4 py-3 bg-brand-bg text-brand-primary text-sm focus:outline-none focus:border-brand-primary"
                  required
                >
                  <option value="" disabled>-- Choose Mapped Stall --</option>
                  {selectedFest?.stalls?.map((stall: any) => (
                    <option 
                      key={stall.id} 
                      value={stall.id}
                      disabled={stall.status === "BOOKED"}
                    >
                      Stall {stall.stallNumber} ({stall.dimensions} ft) - Base: ₹{stall.basePrice.toLocaleString("en-IN")} {stall.status === "BOOKED" ? "[BOOKED]" : stall.status === "NEGOTIATION" ? "[IN NEGOTIATION]" : "[AVAILABLE]"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-wider text-brand-secondary font-semibold">3. Select Vendor Partner</label>
                <select
                  value={manualBookVendorId}
                  onChange={(e) => setManualBookVendorId(e.target.value)}
                  className="gz-select border border-brand-border rounded-xl px-4 py-3 bg-brand-bg text-brand-primary text-sm focus:outline-none focus:border-brand-primary"
                  required
                >
                  <option value="" disabled>-- Select Vendor Profile --</option>
                  {vendors.map((v: any) => (
                    <option key={v.id} value={v.id}>
                      {v.companyName} ({v.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-wider text-brand-secondary font-semibold">4. Deal Checkout Price (₹ INR)</label>
                <input
                  type="number"
                  value={manualBookPrice}
                  onChange={(e) => setManualBookPrice(e.target.value)}
                  placeholder="Enter final cash amount paid..."
                  className="w-full px-4 py-3 border border-brand-border rounded-xl bg-brand-bg text-brand-primary text-sm focus:outline-none focus:border-brand-primary"
                  required
                />
                <span className="text-[10px] text-brand-secondary">
                  Recommendation: Base Rent is ₹{selectedFest?.stalls?.find((s: any) => s.id === manualBookStallId)?.basePrice?.toLocaleString("en-IN") || "0"}. Yield commission will adjust accordingly.
                </span>
              </div>

              <div className="flex gap-4 border-t border-brand-border pt-6 mt-2 font-sans">
                <button
                  type="button"
                  onClick={() => {
                    setShowManualBookModal(false);
                    setManualBookVendorId("");
                    setManualBookStallId("");
                    setManualBookPrice("");
                  }}
                  className="flex-1 py-3 border border-brand-border rounded-xl text-brand-primary text-sm font-semibold hover:bg-brand-card transition-colors cursor-pointer text-center"
                >
                  Cancel override
                </button>
                <button
                  type="submit"
                  disabled={manualBookLoading}
                  className="flex-1 py-3 bg-brand-primary text-brand-bg rounded-xl text-sm font-bold hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-brand-primary/10"
                >
                  {manualBookLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 size={16} /> Force Cash Booking
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
