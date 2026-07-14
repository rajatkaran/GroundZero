"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import PortalLayout from "@/components/PortalLayout";
import { Loader2, ArrowLeft, Send, Check, ShieldCheck, DollarSign, Calendar, MapPin, FileText, Lock } from "lucide-react";

function NegotiationForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const bookingId = searchParams.get("bookingId");

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Messaging inputs
  const [messageText, setMessageText] = useState("");
  const [counterPrice, setCounterPrice] = useState("");
  const [sendLoading, setSendLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);

  const fetchNegotiationThread = async () => {
    if (!bookingId) return;
    try {
      const response = await fetch(`/api/negotiation?bookingId=${bookingId}&requesterRole=${user?.role || ""}`);
      if (!response.ok) {
        throw new Error("Failed to load negotiation thread.");
      }
      const res = await response.json();
      setBooking(res.booking);
    } catch (err: any) {
      setError(err.message || "Failed to load thread.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchNegotiationThread();
  }, [bookingId, user]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!messageText.trim() && !counterPrice) return;

    setSendLoading(true);
    try {
      const response = await fetch("/api/negotiation/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          senderId: user.id,
          content: messageText.trim() || `Proposed pricing counter-offer of ₹${parseFloat(counterPrice).toLocaleString("en-IN")}.`,
          proposedPrice: counterPrice ? parseFloat(counterPrice) : null
        })
      });

      if (!response.ok) {
        throw new Error("Failed to send message proposal.");
      }

      await fetchNegotiationThread();
      setMessageText("");
      setCounterPrice("");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSendLoading(false);
    }
  };

  const handleApproveProposal = async () => {
    if (!user) return;
    setApproveLoading(true);
    try {
      const response = await fetch("/api/negotiation/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          userId: user.id
        })
      });

      if (!response.ok) {
        throw new Error("Failed to approve deal proposal.");
      }

      await fetchNegotiationThread();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setApproveLoading(false);
    }
  };

  const handleProcessPayment = async () => {
    setPaymentLoading(true);
    try {
      // 1. Load Razorpay script dynamically
      const scriptLoaded = await new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });

      if (!scriptLoaded) {
        throw new Error("Failed to load Razorpay checkout script. Check your internet connection.");
      }

      // 2. Create order on the backend
      const orderResponse = await fetch("/api/bookings/pay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId })
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.message || "Failed to initiate payment order.");
      }

      const orderData = await orderResponse.json();

      // 3. Initialize checkout options
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Ground Zero",
        description: `Stall space lease fee: ${orderData.bookingDetails.eventName}`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            setPaymentLoading(true);
            const verifyResponse = await fetch("/api/bookings/pay", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                bookingId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature
              })
            });

            if (!verifyResponse.ok) {
              const verifyError = await verifyResponse.json();
              throw new Error(verifyError.message || "Payment verification failed.");
            }

            await fetchNegotiationThread();
          } catch (verifyErr: any) {
            alert(verifyErr.message);
          } finally {
            setPaymentLoading(false);
          }
        },
        prefill: {
          name: orderData.bookingDetails.companyName,
          email: orderData.bookingDetails.email,
          contact: orderData.bookingDetails.phone
        },
        theme: {
          color: "#0F172A"
        },
        modal: {
          ondismiss: function() {
            setPaymentLoading(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (err: any) {
      alert(err.message);
      setPaymentLoading(false);
    }
  };

  if (loading || authLoading) {
    return (
      <PortalLayout activeTab="overview">
        <div className="flex h-96 items-center justify-center">
          <Loader2 size={32} className="animate-spin text-brand-secondary" />
        </div>
      </PortalLayout>
    );
  }

  if (!user) {
    return (
      <PortalLayout activeTab="overview">
        <div className="p-8 border border-brand-border bg-brand-card text-center rounded-2xl text-brand-secondary text-sm">
          Please log in to view this negotiation thread.
        </div>
      </PortalLayout>
    );
  }

  if (error || !booking) {
    return (
      <PortalLayout activeTab="overview">
        <div className="p-8 border border-brand-border bg-brand-card text-center rounded-2xl text-brand-secondary text-sm">
          {error || "Booking transaction not found."}
        </div>
      </PortalLayout>
    );
  }

  const messages = booking.negotiation?.messages || [];
  const oppositeRole = user.role === "VENDOR" ? "Organizer" : "Vendor";
  
  // Verify if we can approve (if last message has a proposedPrice and it wasn't sent by current user)
  const lastMessageWithPrice = [...messages]
    .reverse()
    .find((m: any) => m.proposedPrice !== null);
    
  const canApprove = 
    booking.status === "NEGOTIATING" && 
    lastMessageWithPrice && 
    lastMessageWithPrice.senderId !== user.id;

  return (
    <PortalLayout activeTab="overview">
      <div className="flex flex-col gap-12">
        {/* Navigation Backlink */}
        <div>
          <button 
            onClick={() => router.back()}
            className="group flex items-center gap-2 text-[12px] text-brand-secondary hover:text-brand-primary transition-colors uppercase tracking-wider focus:outline-none"
          >
            <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Dashboard
          </button>
        </div>

        {/* splitscreen timeline & deal sheet */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left: Deal Sheet Summary */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="bg-brand-card border border-brand-border rounded-[24px] p-8 shadow-sm flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <span className="font-sans text-[10px] uppercase tracking-wider text-brand-secondary">ACTIVE TRANSACTION</span>
                <h2 className="font-serif text-[24px] font-medium text-brand-primary leading-tight">
                  {booking.festival?.name}
                </h2>
                <div className="flex flex-col font-sans text-xs text-brand-secondary gap-1 mt-2">
                  <span className="flex items-center gap-1.5"><MapPin size={12} /> {booking.festival?.collegeName}</span>
                  <span className="flex items-center gap-1.5"><Calendar size={12} /> Stall {booking.stall?.stallNumber} ({booking.stall?.dimensions} ft)</span>
                </div>
              </div>

              {/* Deal Status and Financial Summary */}
              <div className="border-t border-brand-border pt-6 flex flex-col gap-5">
                <div className="flex justify-between items-center">
                  <span className="font-sans text-xs text-brand-secondary">Ledger Status</span>
                  <span className={`px-2.5 py-0.5 border rounded-full text-[9px] uppercase tracking-wider font-semibold ${
                    booking.status === "PAID" 
                      ? "bg-brand-primary/5 border-brand-border text-brand-primary" 
                      : "bg-brand-primary/[0.02] border-dashed border-brand-border text-brand-secondary"
                  }`}>
                    {booking.status}
                  </span>
                </div>

                <div className="flex justify-between items-center border-t border-brand-border pt-4">
                  <span className="font-sans text-xs text-brand-secondary">Public Listing Price</span>
                  <span className="font-sans text-[13px] text-brand-secondary">
                    ₹{booking.stall?.publicPrice.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between items-center border-t border-brand-border pt-4">
                  <span className="font-sans text-xs text-brand-secondary font-medium text-brand-primary">Locked / Proposed Price</span>
                  <span className="font-serif text-[18px] font-bold text-brand-primary">
                    ₹{booking.finalPrice.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Action Trigger based on status */}
              {booking.status === "APPROVED" && user.role === "VENDOR" && (
                <div className="border-t border-brand-border pt-6">
                  <button
                    onClick={handleProcessPayment}
                    disabled={paymentLoading}
                    className="w-full btn-liquid-glass-dark py-3.5 flex justify-center items-center gap-2"
                  >
                    {paymentLoading ? <Loader2 size={16} className="animate-spin" /> : <DollarSign size={15} />}
                    Proceed to Payment (₹{booking.finalPrice.toLocaleString("en-IN")})
                  </button>
                  <p className="font-sans text-[10px] text-brand-secondary mt-2 text-center">
                    Simulated payment checkout secure integration.
                  </p>
                </div>
              )}

              {booking.status === "PAID" && (
                <div className="border-t border-brand-border pt-6 flex flex-col gap-4">
                  <div className="p-4 border border-brand-border bg-brand-bg rounded-xl flex items-center gap-3">
                    <ShieldCheck className="text-brand-primary shrink-0" size={18} />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[12px] font-semibold text-brand-primary">Stall Secured</span>
                      <span className="text-[10px] text-brand-secondary">Licensing agreement is active.</span>
                    </div>
                  </div>
                  <a
                    href={booking.contractUrl || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full btn-liquid-glass py-3 justify-center items-center gap-2 text-xs"
                  >
                    <FileText size={14} />
                    Download PDF Agreement
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Right: Negotiation Timeline */}
          <div className="lg:col-span-8 flex flex-col gap-6 bg-brand-card border border-brand-border rounded-[24px] p-6 shadow-sm min-h-[500px] justify-between">
            
            {/* Scrollable Timeline */}
            <div className="flex flex-col gap-6 overflow-y-auto max-h-[420px] pr-2">
              <div className="text-center py-4 text-[10px] font-sans uppercase tracking-[0.2em] text-brand-secondary border-b border-brand-border">
                Timeline Created &middot; {new Date(booking.createdAt).toLocaleDateString("en-IN", { hour: "2-digit", minute: "2-digit" })}
              </div>

              {messages.map((msg: any) => {
                const isSystem = msg.senderId === "SYSTEM";
                const isMe = msg.senderId === user.id;
                
                if (isSystem) {
                  return (
                    <div key={msg.id} className="mx-auto max-w-md p-4 border border-brand-border bg-brand-bg rounded-xl text-center font-sans text-[11px] text-brand-secondary leading-5">
                      {msg.content}
                    </div>
                  );
                }

                return (
                  <div 
                    key={msg.id} 
                    className={`flex flex-col max-w-md ${isMe ? "self-end items-end" : "self-start items-start"}`}
                  >
                    <span className="font-sans text-[10px] text-brand-secondary mb-1">
                      {isMe ? "You" : oppositeRole}
                    </span>
                    <div className={`p-4 rounded-2xl border ${
                      isMe 
                        ? "bg-brand-primary text-brand-bg border-brand-primary" 
                        : "bg-brand-card text-brand-primary border-brand-border"
                    }`}>
                      <p className="font-sans text-[13px] leading-6">{msg.content}</p>
                      
                      {msg.proposedPrice && (
                        <div className={`mt-3 pt-2.5 border-t text-xs flex justify-between items-center gap-6 ${
                          isMe ? "border-brand-bg/15 text-brand-secondary/80" : "border-brand-border text-brand-secondary"
                        }`}>
                          <span>COUNTER OFFER:</span>
                          <strong className={isMe ? "text-brand-bg" : "text-brand-primary"}>
                            ₹{msg.proposedPrice.toLocaleString("en-IN")}
                          </strong>
                        </div>
                      )}
                    </div>
                    <span className="font-sans text-[9px] text-brand-secondary mt-1">
                      {new Date(msg.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Input Form Controls */}
            <div className="border-t border-brand-border pt-6 flex flex-col gap-4">
              
              {/* Accept offer banner if possible */}
              {canApprove && (
                <div className="p-4 bg-brand-primary/[0.02] border border-brand-border rounded-xl flex items-center justify-between gap-4 font-sans text-xs">
                  <span className="text-brand-secondary">
                    Accept current counter-offer of <strong className="text-brand-primary font-semibold">₹{booking.finalPrice.toLocaleString("en-IN")}</strong>?
                  </span>
                  <button
                    onClick={handleApproveProposal}
                    disabled={approveLoading}
                    className="btn-liquid-glass-dark text-[11px] py-1.5 px-4 flex items-center gap-1.5"
                  >
                    {approveLoading ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                    Accept Offer
                  </button>
                </div>
              )}

              {/* Main Typing inputs */}
              {booking.status !== "PAID" ? (
                <form onSubmit={handleSendMessage} className="flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      placeholder="Type your proposal message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      className="flex-grow px-4 py-3 rounded-xl border border-brand-border focus:outline-none focus:border-brand-primary text-[13px] bg-brand-bg"
                    />
                    
                    {/* Price Counter Field */}
                    <div className="relative flex items-center w-full sm:w-48 shrink-0">
                      <span className="absolute left-4 text-brand-secondary text-xs">₹</span>
                      <input
                        type="number"
                        placeholder="Counter offer"
                        value={counterPrice}
                        onChange={(e) => setCounterPrice(e.target.value)}
                        className="w-full pl-8 pr-4 py-3 rounded-xl border border-brand-border focus:outline-none focus:border-brand-primary text-[13px] bg-brand-bg"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end mt-1">
                    <button
                      type="submit"
                      disabled={sendLoading}
                      className="btn-liquid-glass-dark text-xs py-3 px-6 flex items-center gap-2"
                    >
                      {sendLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={12} />}
                      Submit Message & Offer
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-4 bg-brand-primary/[0.02] border border-brand-border rounded-xl text-center text-xs text-brand-secondary flex items-center justify-center gap-2">
                  <Lock size={12} />
                  Timeline locked. Stall secured successfully.
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </PortalLayout>
  );
}

export default function NegotiationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-brand-bg flex items-center justify-center text-brand-primary">
        <Loader2 size={32} className="animate-spin text-brand-secondary" />
      </div>
    }>
      <NegotiationForm />
    </Suspense>
  );
}
