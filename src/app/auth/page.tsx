"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";

function AuthForm() {
  const searchParams = useSearchParams();
  
  const initialMode = searchParams.get("type") === "signup" ? "signup" : "login";
  const [mode, setMode] = useState<"login" | "signup" | "forgot_password">(initialMode);
  
  const initialRoleParam = searchParams.get("role")?.toUpperCase();
  const validRoles = ["VENDOR", "ORGANIZER", "BRAND", "ADMIN"];
  const initialRole = (validRoles.includes(initialRoleParam || "") ? initialRoleParam : "VENDOR") as any;

  // Password Reset States
  const [resetStep, setResetStep] = useState(1);
  const [resetEmail, setResetEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetSuccessMsg, setResetSuccessMsg] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const handleModeSwitch = (newMode: "login" | "signup" | "forgot_password") => {
    setMode(newMode);
    setResetStep(1);
    setResetEmail("");
    setResetOtp("");
    setNewPassword("");
    setResetSuccessMsg("");
    setResetError("");
  };

  const handleRequestResetOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      setResetError("Please enter your email.");
      return;
    }
    setResetLoading(true);
    setResetError("");
    setResetSuccessMsg("");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail, step: 1 })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to request reset OTP.");
      setResetStep(2);
      setResetSuccessMsg(`Verification code '654321' sent to your email!`);
    } catch (err: any) {
      setResetError(err.message);
    } finally {
      setResetLoading(false);
    }
  };

  const handleCompleteReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetOtp || !newPassword) {
      setResetError("All fields are required.");
      return;
    }
    setResetLoading(true);
    setResetError("");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail, step: 2, otp: resetOtp, newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to reset password.");
      
      alert("Password reset successfully! You can now log in.");
      setMode("login");
      // Reset states
      setResetStep(1);
      setResetEmail("");
      setResetOtp("");
      setNewPassword("");
      setResetSuccessMsg("");
    } catch (err: any) {
      setResetError(err.message);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09080F] relative flex flex-col justify-center py-12 px-6 sm:px-8 font-sans overflow-hidden">
      
      {/* Editorial Navigation Backlink */}
      <div className="absolute top-8 left-8 z-20">
        <Link href="/" className="group flex items-center gap-2 text-[12px] text-brand-secondary hover:text-white transition-colors uppercase tracking-wider font-semibold">
          <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform duration-300" />
          Back to Journal
        </Link>
      </div>

      {/* Logo & Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md text-center flex flex-col items-center justify-center gap-4 mb-8"
      >
        <Link href="/" className="group flex flex-col items-center justify-center gap-3 w-fit">
          <div className="relative h-20 w-20 sm:h-24 sm:w-24 overflow-hidden rounded-2xl border border-white/10 bg-[#4e4c4c] group-hover:border-white/30 transition-all duration-500">
            <img
              src="/logo.jpg"
              alt="Ground Zero Logo"
              className="h-full w-full object-cover transition-transform group-hover:scale-110 duration-700 dark:invert dark:hue-rotate-180 dark:brightness-110"
            />
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="font-serif text-[24px] sm:text-[28px] font-semibold tracking-tight text-white leading-none">
              Ground Zero
            </span>
            <span className="font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-brand-secondary/80 mt-1.5 font-medium">
              by ThinkThrough
            </span>
          </div>
        </Link>
      </motion.div>

      {/* Main Glassmorphism Card */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 sm:mx-auto sm:w-full sm:max-w-[540px]"
      >
        <div className="backdrop-blur-xl bg-[#09080F]/60 border border-white/5 py-10 px-8 sm:px-12 rounded-[28px] flex flex-col gap-8 relative overflow-hidden">
          
          {/* Section Heading */}
          <div className="text-center flex flex-col gap-2">
            <h2 className="font-serif text-[26px] sm:text-[30px] font-medium text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-300">
              {mode === "login" ? "Access the Network" : "Request Network Access"}
            </h2>
            <p className="text-[13px] text-brand-secondary/80 font-light">
              {mode === "login" 
                ? "Enter your registered credentials to enter your workspace." 
                : "Complete our onboarding process to verify your entity profile."
              }
            </p>
          </div>

          <AnimatePresence mode="wait">
            
            {/* LOGIN MODE */}
            {mode === "login" && (
              <LoginForm 
                key="login"
                handleModeSwitch={handleModeSwitch} 
                initialRole={initialRole}
              />
            )}

            {/* FORGOT PASSWORD MODE */}
            {mode === "forgot_password" && (
              <motion.div
                key="forgot"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-6"
              >
                <div className="text-center flex flex-col gap-2">
                  <h3 className="font-serif text-[22px] font-medium text-brand-primary">Reset Password</h3>
                  <p className="text-[12px] text-brand-secondary">Enter your registered email to request a simulated OTP reset verification code.</p>
                </div>

                {resetError && (
                  <div className="p-4 bg-black/[0.02] dark:bg-white/[0.02] border border-black/10 dark:border-white/10 rounded-xl text-xs text-brand-primary">
                    {resetError}
                  </div>
                )}

                {resetSuccessMsg && (
                  <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-xs text-emerald-500 font-medium font-sans">
                    {resetSuccessMsg}
                  </div>
                )}

                {resetStep === 1 ? (
                  <form onSubmit={handleRequestResetOtp} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="font-sans text-[11px] font-semibold uppercase tracking-wider text-brand-secondary">Account Email Address</label>
                      <input
                        type="email"
                        required
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="name@company.com"
                        className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg text-brand-primary placeholder:text-brand-secondary/40 focus:outline-none focus:border-brand-primary text-[14px]"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={resetLoading}
                      className="w-full btn-liquid-glass-dark py-3.5 flex justify-center items-center gap-2 text-xs"
                    >
                      {resetLoading ? <Loader2 size={14} className="animate-spin" /> : "Send Reset Code"}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleCompleteReset} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="font-sans text-[11px] font-semibold uppercase tracking-wider text-brand-secondary">Verification Code</label>
                      <input
                        type="text"
                        required
                        value={resetOtp}
                        onChange={(e) => setResetOtp(e.target.value)}
                        placeholder="Enter 654321 to test"
                        className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg text-brand-primary placeholder:text-brand-secondary/40 focus:outline-none focus:border-brand-primary text-[14px]"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="font-sans text-[11px] font-semibold uppercase tracking-wider text-brand-secondary">New Password</label>
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new account password"
                        className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg text-brand-primary placeholder:text-brand-secondary/40 focus:outline-none focus:border-brand-primary text-[14px]"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={resetLoading}
                      className="w-full btn-liquid-glass-dark py-3.5 flex justify-center items-center gap-2 text-xs"
                    >
                      {resetLoading ? <Loader2 size={14} className="animate-spin" /> : "Save New Password"}
                    </button>
                  </form>
                )}

                <div className="text-center mt-4 text-[12px] font-sans text-brand-secondary">
                  Remember your credentials?{" "}
                  <button
                    type="button"
                    onClick={() => handleModeSwitch("login")}
                    className="font-medium text-brand-primary underline cursor-pointer bg-transparent border-none"
                  >
                    Back to login
                  </button>
                </div>
              </motion.div>
            )}

            {/* SIGNUP MODE */}
            {mode === "signup" && (
              <SignupForm 
                key="signup"
                handleModeSwitch={handleModeSwitch}
                initialRole={initialRole}
              />
            )}
          </AnimatePresence>

        </div>
      </motion.div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-brand-primary" />
      </div>
    }>
      <AuthForm />
    </Suspense>
  );
}
