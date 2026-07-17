"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Script from "next/script";

function AuthForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login, signup, loginWithGoogle } = useAuth();
  
  const initialMode = searchParams.get("type") === "signup" ? "signup" : "login";
  const [mode, setMode] = useState<"login" | "signup" | "forgot_password">(initialMode);
  
  // Password Reset States
  const [resetStep, setResetStep] = useState(1);
  const [resetEmail, setResetEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetSuccessMsg, setResetSuccessMsg] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  
  // Registration Role Selection
  const [selectedRole, setSelectedRole] = useState<"VENDOR" | "ORGANIZER" | "ADMIN" | null>(null);

  const initGoogleAuth = () => {
    if (typeof window !== "undefined" && (window as any).google) {
      (window as any).google.accounts.id.initialize({
        client_id: "369989823612-dummyclientid.apps.googleusercontent.com",
        callback: handleGoogleCredentialResponse
      });
      
      const container = document.getElementById("google-signin-btn");
      if (container) {
        (window as any).google.accounts.id.renderButton(container, {
          theme: "outline",
          size: "large",
          width: container.getBoundingClientRect().width || 380,
          text: "continue_with"
        });
      }
    }
  };

  const handleGoogleCredentialResponse = async (response: any) => {
    setLoading(true);
    setError("");
    try {
      await loginWithGoogle(response.credential, selectedRole || "VENDOR");
    } catch (err: any) {
      setError(err.message || "Google authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const container = document.getElementById("google-signin-btn");
      if (container && (window as any).google) {
        initGoogleAuth();
        clearInterval(interval);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [mode, selectedRole]);
  
  // Onboarding Step state
  const [step, setStep] = useState(1);
  
  // Shared Form Fields
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  
  // Login Specific fields
  const [loginMethod, setLoginMethod] = useState<"password" | "otp">("password");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpMessage, setOtpMessage] = useState("");
  
  // Vendor-specific fields
  const [vendorCategory, setVendorCategory] = useState("FOOD");
  const [ticketSize, setTicketSize] = useState("Under ₹500");
  const [stallSizePreference, setStallSizePreference] = useState("10x10");
  const [powerRequirement, setPowerRequirement] = useState("Standard (15A)");
  const [avgRevenue, setAvgRevenue] = useState("Under ₹1L");
  
  // Organizer-specific fields
  const [festivalName, setFestivalName] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [location, setLocation] = useState("");
  const [footfallEstimate, setFootfallEstimate] = useState("5,000 - 10,000");
  const [demographics, setDemographics] = useState("80% student youth, 20% external public");
  const [stallCapacity, setStallCapacity] = useState("20 - 50");
  const [layoutBlueprintName, setLayoutBlueprintName] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Reset states
  const handleModeSwitch = (newMode: "login" | "signup" | "forgot_password") => {
    setMode(newMode);
    setSelectedRole(null);
    setStep(1);
    setError("");
    setPassword("");
    setOtp("");
    setIsOtpSent(false);
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
      setEmail(resetEmail); // autofill login email
      setPassword(newPassword); // autofill login password
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

  const handleSendOtp = () => {
    if (!email) {
      setError("Please enter your email address first.");
      return;
    }
    setError("");
    setIsOtpSent(true);
    setOtpMessage("Simulated OTP '123456' sent to your email!");
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email.");
      return;
    }
    if (!selectedRole) {
      setError("Please select your platform access role.");
      return;
    }
    if (loginMethod === "password" && !password) {
      setError("Please enter your password.");
      return;
    }
    if (loginMethod === "otp" && !otp) {
      setError("Please enter the verification code.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (loginMethod === "password") {
        await login(email, selectedRole, password);
      } else {
        await login(email, selectedRole, undefined, otp);
      }
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please verify your role or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardingSubmit = async () => {
    if (!email || !companyName) {
      setError("Email and Entity Name are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let metadata = {};
      let category = null;

      if (selectedRole === "VENDOR") {
        category = vendorCategory;
        metadata = {
          ticketSize,
          stallSizePreference,
          powerRequirement,
          avgRevenue
        };
      } else if (selectedRole === "ORGANIZER") {
        category = "FESTIVAL_HOST";
        metadata = {
          festivalName,
          collegeName,
          location,
          footfallEstimate,
          demographics,
          stallCapacity,
          layoutBlueprintName: layoutBlueprintName || "mock_layout_blueprint.pdf"
        };
      }

      await signup(email, selectedRole!, { companyName, contactPhone: phone, category }, metadata, password || undefined);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    setError("");
    // Basic step validation
    if (step === 1) {
      if (!email || !companyName) {
        setError("Please fill out your Email and Entity Name.");
        return;
      }
      if (!phone) {
        setError("Please fill out your Phone number.");
        return;
      }
    }
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setError("");
    setStep((prev) => prev - 1);
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col justify-center py-12 px-6 sm:px-8 font-sans">
      
      {/* Editorial Navigation Backlink */}
      <div className="absolute top-8 left-8">
        <Link href="/" className="group flex items-center gap-2 text-[12px] text-brand-secondary hover:text-brand-primary transition-colors uppercase tracking-wider">
          <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Journal
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center flex flex-col items-center justify-center gap-4 mb-6">
        <Link href="/" className="group flex flex-col items-center justify-center gap-3 w-fit">
          <div className="relative h-24 w-24 overflow-hidden rounded-2xl border-2 border-brand-border bg-[#b1b3b3] dark:bg-[#4e4c4c] shadow-md group-hover:border-brand-primary/40 group-hover:shadow-lg transition-all duration-300">
            <img
              src="/logo.jpg"
              alt="Ground Zero Logo"
              className="h-full w-full object-cover transition-transform group-hover:scale-105 duration-300 dark:invert dark:hue-rotate-180 dark:brightness-110"
            />
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="font-serif text-[26px] font-semibold tracking-tight text-brand-primary leading-none">
              Ground Zero
            </span>
            <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-brand-secondary mt-1.5 font-medium">
              by ThinkThrough
            </span>
          </div>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-brand-card border border-brand-border py-12 px-8 sm:px-12 rounded-[28px] shadow-sm flex flex-col gap-8">
          
          {/* Section Heading */}
          <div className="text-center flex flex-col gap-2">
            <h2 className="font-serif text-[28px] font-medium text-brand-primary">
              {mode === "login" ? "Access the Network" : "Request Network Access"}
            </h2>
            <p className="text-[13px] text-brand-secondary">
              {mode === "login" 
                ? "Enter your registered credentials to enter your workspace." 
                : "Complete our onboarding process to verify your entity profile."
              }
            </p>
          </div>

          {error && (
            <div className="p-4 bg-black/[0.02] dark:bg-white/[0.02] border border-black/10 dark:border-white/10 rounded-xl text-xs text-brand-primary">
              {error}
            </div>
          )}

          {success ? (
            <div className="flex flex-col items-center gap-6 py-8 text-center">
              <CheckCircle2 size={48} className="text-brand-primary" />
              <div className="flex flex-col gap-2">
                <h3 className="font-serif text-[20px] font-medium">Verification Initiated</h3>
                <p className="font-sans text-xs text-brand-secondary max-w-xs leading-5">
                  Your registration has been created. Our verification team is auditing your details. Redirecting to workspace...
                </p>
              </div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              
              {/* LOGIN MODE */}
              {mode === "login" && (
                <motion.form 
                  key="login"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleLoginSubmit}
                  className="flex flex-col gap-6"
                >
                  <div className="flex flex-col gap-2">
                    <label className="font-sans text-[11px] font-semibold uppercase tracking-wider text-brand-secondary">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      suppressHydrationWarning={true}
                      className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg text-brand-primary placeholder:text-brand-secondary/40 focus:outline-none focus:border-brand-primary text-[14px]"
                    />
                  </div>

                  {/* Access Mode Selector */}
                  <div className="flex gap-4 border-b border-brand-border pb-2">
                    <button
                      type="button"
                      onClick={() => { setLoginMethod("password"); setError(""); }}
                      className={`font-sans text-xs pb-2 border-b-2 font-medium transition-all cursor-pointer ${
                        loginMethod === "password" 
                          ? "border-brand-primary text-brand-primary font-semibold" 
                          : "border-transparent text-brand-secondary hover:text-brand-primary"
                      }`}
                    >
                      Password Access
                    </button>
                    <button
                      type="button"
                      onClick={() => { setLoginMethod("otp"); setError(""); }}
                      className={`font-sans text-xs pb-2 border-b-2 font-medium transition-all cursor-pointer ${
                        loginMethod === "otp" 
                          ? "border-brand-primary text-brand-primary font-semibold" 
                          : "border-transparent text-brand-secondary hover:text-brand-primary"
                      }`}
                    >
                      OTP Verification
                    </button>
                  </div>

                  {loginMethod === "password" ? (
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <label className="font-sans text-[11px] font-semibold uppercase tracking-wider text-brand-secondary">Password</label>
                        <button
                          type="button"
                          onClick={() => handleModeSwitch("forgot_password")}
                          className="text-[11px] font-sans text-brand-secondary hover:text-brand-primary transition-colors focus:outline-none cursor-pointer underline bg-transparent border-none"
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        suppressHydrationWarning={true}
                        className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg text-brand-primary placeholder:text-brand-secondary/40 focus:outline-none focus:border-brand-primary text-[14px]"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-2">
                        <label className="font-sans text-[11px] font-semibold uppercase tracking-wider text-brand-secondary">OTP Verification Code</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            required={isOtpSent}
                            disabled={!isOtpSent}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder={isOtpSent ? "Enter 6-digit code" : "Click 'Send OTP' first"}
                            suppressHydrationWarning={true}
                            className="flex-grow px-4 py-3 rounded-xl border border-brand-border bg-brand-bg text-brand-primary placeholder:text-brand-secondary/40 focus:outline-none focus:border-brand-primary text-[14px] disabled:opacity-50"
                          />
                          <button
                            type="button"
                            onClick={handleSendOtp}
                            className="btn-liquid-glass px-4 py-3 text-xs cursor-pointer select-none"
                          >
                            {isOtpSent ? "Resend" : "Send OTP"}
                          </button>
                        </div>
                      </div>
                      {isOtpSent && (
                        <div className="text-[11.5px] text-emerald-500 font-sans font-medium px-1 bg-emerald-500/5 py-1.5 rounded-lg border border-emerald-500/10">
                          {otpMessage}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex flex-col gap-3">
                    <label className="font-sans text-[11px] font-semibold uppercase tracking-wider text-brand-secondary">Select Access Channel</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { role: "VENDOR", label: "Vendor", emoji: "🏪" },
                        { role: "ORGANIZER", label: "Organizer", emoji: "🎪" },
                        { role: "ADMIN", label: "Admin", emoji: "⚙️" }
                      ].map((item) => (
                        <button
                          key={item.role}
                          type="button"
                          onClick={() => setSelectedRole(item.role as any)}
                          className={`py-3 rounded-xl border text-[13px] font-sans font-medium transition-all cursor-pointer ${
                            selectedRole === item.role 
                              ? item.role === "VENDOR"
                                ? "bg-[var(--gz-accent-green)] text-[var(--gz-accent-green-text)] border-[var(--gz-accent-green-text)]"
                                : item.role === "ORGANIZER"
                                ? "bg-[var(--gz-accent-gold)] text-[var(--gz-accent-gold-text)] border-[var(--gz-accent-gold-text)]"
                                : "bg-[var(--gz-accent-blue)] text-[var(--gz-accent-blue-text)] border-[var(--gz-accent-blue-text)]"
                              : "border-brand-border bg-brand-bg text-brand-secondary hover:text-brand-primary hover:border-brand-primary"
                          }`}
                        >
                          <span className="mr-1">{item.emoji}</span> {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-liquid-glass-dark py-3.5 mt-4 flex justify-center items-center gap-2"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : "Access Workspace"}
                    {!loading && <ArrowRight size={14} />}
                  </button>

                  {/* Google Login Container */}
                  <div className="flex flex-col gap-3 mt-4 items-center">
                    <div className="flex items-center w-full gap-2 text-brand-secondary text-[11px] uppercase tracking-wider font-semibold font-sans">
                      <div className="flex-1 h-px bg-brand-border/40"></div>
                      <span>Or</span>
                      <div className="flex-1 h-px bg-brand-border/40"></div>
                    </div>
                    <div 
                      id="google-signin-btn" 
                      className="w-full flex justify-center items-center rounded-xl overflow-hidden hover:brightness-105 transition-all"
                      style={{ minHeight: "44px" }}
                    ></div>
                    <Script 
                      src="https://accounts.google.com/gsi/client" 
                      strategy="afterInteractive" 
                      onLoad={initGoogleAuth} 
                    />
                  </div>

                  <div className="text-center mt-4 text-[12px] font-sans text-brand-secondary">
                    Don't have access?{" "}
                    <button
                      type="button"
                      onClick={() => handleModeSwitch("signup")}
                      className="font-medium text-brand-primary underline cursor-pointer bg-transparent border-none"
                    >
                      Request access here
                    </button>
                  </div>
                </motion.form>
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
                <motion.div
                  key="signup"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col gap-6"
                >
                  
                  {/* Step 0: Role Selection */}
                  {selectedRole === null && (
                    <div className="flex flex-col gap-6">
                      <label className="font-sans text-[11px] font-semibold uppercase tracking-wider text-brand-secondary text-center">Which best describes your entity?</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                          onClick={() => setSelectedRole("VENDOR")}
                          className="p-6 rounded-2xl border border-brand-border bg-[var(--gz-accent-green)] text-left hover:shadow-md transition-all flex flex-col gap-3 text-[var(--gz-accent-green-text)] hover:scale-[1.02] cursor-pointer"
                        >
                          <span className="font-serif text-[18px] font-semibold flex items-center gap-2">🏪 Commercial Vendor</span>
                          <span className="font-sans text-[12px] opacity-90 leading-5">
                            Food stalls, beverages, fashion brands, experience zones, and corporate sponsors.
                          </span>
                        </button>
                        <button
                          onClick={() => setSelectedRole("ORGANIZER")}
                          className="p-6 rounded-2xl border border-brand-border bg-[var(--gz-accent-gold)] text-left hover:shadow-md transition-all flex flex-col gap-3 text-[var(--gz-accent-gold-text)] hover:scale-[1.02] cursor-pointer"
                        >
                          <span className="font-serif text-[18px] font-semibold flex items-center gap-2">🎪 Festival Organizer</span>
                          <span className="font-sans text-[12px] opacity-90 leading-5">
                            College cultural & technical committees, student bodies, and event agencies.
                          </span>
                        </button>
                      </div>

                      <div className="text-center mt-4 text-[12px] font-sans text-brand-secondary">
                        Already have access?{" "}
                        <button
                          onClick={() => handleModeSwitch("login")}
                          className="font-medium text-brand-primary underline cursor-pointer bg-transparent border-none"
                        >
                          Log in here
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Multi-step Onboarding Forms */}
                  {selectedRole !== null && (
                    <div className="flex flex-col gap-6">
                      {/* Step Indicator */}
                      <div className="flex justify-between items-center text-[11px] font-sans text-brand-secondary uppercase tracking-wider">
                        <span>{selectedRole === "VENDOR" ? "Vendor Profile" : "Organizer Profile"}</span>
                        <span>Step {step} of 3</span>
                      </div>

                      {/* VENDOR ONBOARDING FLOW */}
                      {selectedRole === "VENDOR" && (
                        <div className="flex flex-col gap-6">
                          {step === 1 && (
                            <motion.div key="v1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-5">
                              <div className="flex flex-col gap-2">
                                <label className="font-sans text-[11px] uppercase tracking-wider text-brand-secondary">Brand / Company Name</label>
                                <input
                                  type="text"
                                  value={companyName}
                                  onChange={(e) => setCompanyName(e.target.value)}
                                  placeholder="e.g. Brew Craft Cafe"
                                  className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg text-brand-primary placeholder:text-brand-secondary/40 focus:outline-none focus:border-brand-primary text-[14px]"
                                />
                              </div>
                              <div className="flex flex-col gap-2">
                                <label className="font-sans text-[11px] uppercase tracking-wider text-brand-secondary">Onboarding Email</label>
                                <input
                                  type="email"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  placeholder="e.g. partner@brewcraft.in"
                                  className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg text-brand-primary placeholder:text-brand-secondary/40 focus:outline-none focus:border-brand-primary text-[14px]"
                                />
                              </div>
                              <div className="flex flex-col gap-2">
                                <label className="font-sans text-[11px] uppercase tracking-wider text-brand-secondary">Contact Phone</label>
                                <input
                                  type="tel"
                                  value={phone}
                                  onChange={(e) => setPhone(e.target.value)}
                                  placeholder="e.g. +91 98765 43210"
                                  className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg text-brand-primary placeholder:text-brand-secondary/40 focus:outline-none focus:border-brand-primary text-[14px]"
                                />
                              </div>
                              <div className="flex flex-col gap-2">
                                <label className="font-sans text-[11px] uppercase tracking-wider text-brand-secondary">Set Password</label>
                                <input
                                  type="password"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  placeholder="Choose a password"
                                  className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg text-brand-primary placeholder:text-brand-secondary/40 focus:outline-none focus:border-brand-primary text-[14px]"
                                />
                              </div>
                            </motion.div>
                          )}

                          {step === 2 && (
                            <motion.div key="v2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-5">
                              <div className="flex flex-col gap-2">
                                <label className="font-sans text-[11px] uppercase tracking-wider text-brand-secondary">Core Category</label>
                                <select
                                  value={vendorCategory}
                                  onChange={(e) => setVendorCategory(e.target.value)}
                                  className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg text-brand-primary focus:outline-none focus:border-brand-primary text-[14px]"
                                >
                                  <option value="FOOD">Food & Beverage (QSR/Outlets)</option>
                                  <option value="FASHION">Fashion & Apparel</option>
                                  <option value="MERCHANDISE">Custom Merchandise & Books</option>
                                  <option value="GAMING">Gaming & Activations</option>
                                  <option value="SPONSOR">Corporate Sponsor Brand</option>
                                </select>
                              </div>
                              <div className="flex flex-col gap-2">
                                <label className="font-sans text-[11px] uppercase tracking-wider text-brand-secondary">Average Consumer Ticket Size</label>
                                <select
                                  value={ticketSize}
                                  onChange={(e) => setTicketSize(e.target.value)}
                                  className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg text-brand-primary focus:outline-none focus:border-brand-primary text-[14px]"
                                >
                                  <option>Under ₹200</option>
                                  <option>₹200 – ₹500</option>
                                  <option>₹500 – ₹1000</option>
                                  <option>Above ₹1000</option>
                                </select>
                              </div>
                            </motion.div>
                          )}

                          {step === 3 && (
                            <motion.div key="v3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-5">
                              <div className="flex flex-col gap-2">
                                <label className="font-sans text-[11px] uppercase tracking-wider text-brand-secondary">Preferred Stall Dimensions</label>
                                <select
                                  value={stallSizePreference}
                                  onChange={(e) => setStallSizePreference(e.target.value)}
                                  className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg text-brand-primary focus:outline-none focus:border-brand-primary text-[14px]"
                                >
                                  <option value="10x10">Standard Stall (10x10 ft)</option>
                                  <option value="12x12">Medium Canopy (12x12 ft)</option>
                                  <option value="20x20">Large Experience Zone (20x20 ft)</option>
                                </select>
                              </div>
                              <div className="flex flex-col gap-2">
                                <label className="font-sans text-[11px] uppercase tracking-wider text-brand-secondary">Logistical Power Load</label>
                                <select
                                  value={powerRequirement}
                                  onChange={(e) => setPowerRequirement(e.target.value)}
                                  className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg text-brand-primary focus:outline-none focus:border-brand-primary text-[14px]"
                                >
                                  <option value="Standard (15A)">Standard 15A Socket</option>
                                  <option value="Heavy (32A)">Heavy-duty 32A Single Phase</option>
                                  <option value="Three Phase">Three Phase Power Grid Setup</option>
                                </select>
                              </div>
                              <div className="flex flex-col gap-2">
                                <label className="font-sans text-[11px] uppercase tracking-wider text-brand-secondary">Avg. Revenue per Festival</label>
                                <select
                                  value={avgRevenue}
                                  onChange={(e) => setAvgRevenue(e.target.value)}
                                  className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg text-brand-primary focus:outline-none focus:border-brand-primary text-[14px]"
                                >
                                  <option value="Under ₹1L">Under ₹1 Lakh</option>
                                  <option value="₹1L - ₹3L">₹1 Lakh – ₹3 Lakhs</option>
                                  <option value="₹3L - ₹5L">₹3 Lakhs – ₹5 Lakhs</option>
                                  <option value="Above ₹5L">Above ₹5 Lakhs</option>
                                </select>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      )}

                      {/* ORGANIZER ONBOARDING FLOW */}
                      {selectedRole === "ORGANIZER" && (
                        <div className="flex flex-col gap-6">
                          {step === 1 && (
                            <motion.div key="o1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-5">
                              <div className="flex flex-col gap-2">
                                <label className="font-sans text-[11px] uppercase tracking-wider text-brand-secondary">Organizing Committee / Agency Name</label>
                                <input
                                  type="text"
                                  value={companyName}
                                  onChange={(e) => setCompanyName(e.target.value)}
                                  placeholder="e.g. IITB Cultural Committee"
                                  className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg text-brand-primary placeholder:text-brand-secondary/40 focus:outline-none focus:border-brand-primary text-[14px]"
                                />
                              </div>
                              <div className="flex flex-col gap-2">
                                <label className="font-sans text-[11px] uppercase tracking-wider text-brand-secondary">Official Contact Email</label>
                                <input
                                  type="email"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  placeholder="e.g. convener@moodindigo.org"
                                  className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg text-brand-primary placeholder:text-brand-secondary/40 focus:outline-none focus:border-brand-primary text-[14px]"
                                />
                              </div>
                              <div className="flex flex-col gap-2">
                                <label className="font-sans text-[11px] uppercase tracking-wider text-brand-secondary">Contact Phone</label>
                                <input
                                  type="tel"
                                  value={phone}
                                  onChange={(e) => setPhone(e.target.value)}
                                  placeholder="e.g. +91 99999 88888"
                                  className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg text-brand-primary placeholder:text-brand-secondary/40 focus:outline-none focus:border-brand-primary text-[14px]"
                                />
                              </div>
                              <div className="flex flex-col gap-2">
                                <label className="font-sans text-[11px] uppercase tracking-wider text-brand-secondary">Set Password</label>
                                <input
                                  type="password"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  placeholder="Choose a password"
                                  className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg text-brand-primary placeholder:text-brand-secondary/40 focus:outline-none focus:border-brand-primary text-[14px]"
                                />
                              </div>
                            </motion.div>
                          )}

                          {step === 2 && (
                            <motion.div key="o2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-5">
                              <div className="flex flex-col gap-2">
                                <label className="font-sans text-[11px] uppercase tracking-wider text-brand-secondary">Flagship Festival Name</label>
                                <input
                                  type="text"
                                  value={festivalName}
                                  onChange={(e) => setFestivalName(e.target.value)}
                                  placeholder="e.g. Annual Cultural Fest"
                                  className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg text-brand-primary placeholder:text-brand-secondary/40 focus:outline-none focus:border-brand-primary text-[14px]"
                                />
                              </div>
                              <div className="flex flex-col gap-2">
                                <label className="font-sans text-[11px] uppercase tracking-wider text-brand-secondary">Venue / Organization Name</label>
                                <input
                                  type="text"
                                  value={collegeName}
                                  onChange={(e) => setCollegeName(e.target.value)}
                                  placeholder="e.g. IIT Bombay / NESCO Center"
                                  className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg text-brand-primary placeholder:text-brand-secondary/40 focus:outline-none focus:border-brand-primary text-[14px]"
                                />
                              </div>
                              <div className="flex flex-col gap-2">
                                <label className="font-sans text-[11px] uppercase tracking-wider text-brand-secondary">City, State</label>
                                <input
                                  type="text"
                                  value={location}
                                  onChange={(e) => setLocation(e.target.value)}
                                  placeholder="e.g. Mumbai, Maharashtra"
                                  className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg text-brand-primary placeholder:text-brand-secondary/40 focus:outline-none focus:border-brand-primary text-[14px]"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                  <label className="font-sans text-[11px] uppercase tracking-wider text-brand-secondary">Expected Footfall</label>
                                  <select
                                    value={footfallEstimate}
                                    onChange={(e) => setFootfallEstimate(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg text-brand-primary focus:outline-none focus:border-brand-primary text-[14px]"
                                  >
                                    <option>Under 5,000</option>
                                    <option>5,000 - 10,000</option>
                                    <option>10,000 - 30,000</option>
                                    <option>Above 30,000</option>
                                  </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                  <label className="font-sans text-[11px] uppercase tracking-wider text-brand-secondary">Audience Demographics</label>
                                  <input
                                    type="text"
                                    value={demographics}
                                    onChange={(e) => setDemographics(e.target.value)}
                                    placeholder="e.g. 90% students, 10% outer"
                                    className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg text-brand-primary placeholder:text-brand-secondary/40 focus:outline-none focus:border-brand-primary text-[14px]"
                                  />
                                </div>
                              </div>
                            </motion.div>
                          )}

                          {step === 3 && (
                            <motion.div key="o3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-5">
                              <div className="flex flex-col gap-2">
                                <label className="font-sans text-[11px] uppercase tracking-wider text-brand-secondary">Target Stall Capacity</label>
                                <select
                                  value={stallCapacity}
                                  onChange={(e) => setStallCapacity(e.target.value)}
                                  className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg text-brand-primary focus:outline-none focus:border-brand-primary text-[14px]"
                                >
                                  <option>Under 20 stalls</option>
                                  <option>20 - 50 stalls</option>
                                  <option>50 - 100 stalls</option>
                                  <option>Above 100 stalls</option>
                                </select>
                              </div>
                              <div className="flex flex-col gap-2">
                                <label className="font-sans text-[11px] uppercase tracking-wider text-brand-secondary">Venue layout blueprint filename (mock)</label>
                                <input
                                  type="text"
                                  value={layoutBlueprintName}
                                  onChange={(e) => setLayoutBlueprintName(e.target.value)}
                                  placeholder="e.g. mood_indigo_ground_plan_2026.pdf"
                                  className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg text-brand-primary placeholder:text-brand-secondary/40 focus:outline-none focus:border-brand-primary text-[14px]"
                                />
                              </div>
                              <div className="p-4 border border-dashed border-brand-border bg-brand-bg rounded-xl flex items-center justify-between text-xs text-brand-secondary">
                                <span>Supported blueprints: PDF, CAD, PNG</span>
                                <span className="font-semibold text-brand-primary">GZ Parser Ready</span>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      )}

                      {/* Navigation controls */}
                      <div className="flex justify-between items-center gap-4 mt-6">
                        {step > 1 ? (
                          <button
                            onClick={prevStep}
                            className="flex-1 btn-liquid-glass py-3 justify-center text-center text-xs cursor-pointer"
                          >
                            Back
                          </button>
                        ) : (
                          <button
                            onClick={() => setSelectedRole(null)}
                            className="flex-1 btn-liquid-glass py-3 justify-center text-center text-xs cursor-pointer"
                          >
                            Reset Role
                          </button>
                        )}

                        {step < 3 ? (
                          <button
                            onClick={nextStep}
                            className="flex-1 btn-liquid-glass-dark py-3 justify-center text-center text-xs flex items-center gap-2 cursor-pointer"
                          >
                            Next Step
                            <ArrowRight size={12} />
                          </button>
                        ) : (
                          <button
                            onClick={handleOnboardingSubmit}
                            disabled={loading}
                            className="flex-1 btn-liquid-glass-dark py-3 justify-center text-center text-xs flex items-center gap-2 cursor-pointer"
                          >
                            {loading ? <Loader2 size={12} className="animate-spin" /> : "Complete Registry"}
                            {!loading && <CheckCircle2 size={12} />}
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="text-center mt-4 text-[12px] font-sans text-brand-secondary">
                    Already registered?{" "}
                    <button
                      onClick={() => handleModeSwitch("login")}
                      className="font-medium text-brand-primary underline cursor-pointer bg-transparent border-none"
                    >
                      Log in here
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}

        </div>
      </div>
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
