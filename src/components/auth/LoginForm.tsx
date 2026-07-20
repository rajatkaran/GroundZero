"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Script from "next/script";

interface LoginFormProps {
  handleModeSwitch: (mode: "login" | "signup" | "forgot_password") => void;
  initialRole?: "VENDOR" | "ORGANIZER" | "BRAND" | "ADMIN" | null;
}

export default function LoginForm({ handleModeSwitch, initialRole = "VENDOR" }: LoginFormProps) {
  const { login, loginWithGoogle } = useAuth();
  const [selectedRole, setSelectedRole] = useState<"VENDOR" | "ORGANIZER" | "BRAND" | "ADMIN" | null>(initialRole);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginMethod, setLoginMethod] = useState<"password" | "otp">("password");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpMessage, setOtpMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const initGoogleAuth = () => {
    if (typeof window !== "undefined" && (window as any).google) {
      (window as any).google.accounts.id.initialize({
        client_id: "369989823612-dummyclientid.apps.googleusercontent.com",
        callback: handleGoogleCredentialResponse
      });
      
      const container = document.getElementById("google-signin-btn");
      if (container) {
        (window as any).google.accounts.id.renderButton(container, {
          theme: "filled_black",
          shape: "pill",
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
  }, [selectedRole]);

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
        await login(email, password);
      } else {
        await login(email, undefined, otp);
      }
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please verify your role or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && (
        <div className="p-4 bg-black/[0.02] dark:bg-white/[0.02] border border-black/10 dark:border-white/10 rounded-xl text-xs text-brand-primary mb-6">
          {error}
        </div>
      )}
      <motion.form 
        key="login"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4, ease: "easeOut", staggerChildren: 0.1 }}
        onSubmit={handleLoginSubmit}
        className="flex flex-col gap-6"
      >


        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="flex flex-col gap-2.5">
          <label className="font-sans text-[10px] font-bold uppercase tracking-widest text-brand-secondary/80 pl-4">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            suppressHydrationWarning={true}
            className="w-full px-6 py-4 rounded-full border border-white/10 bg-black/20 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/60 transition-all text-[14px]"
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-col gap-2.5">
          <div className="flex justify-between items-center px-2">
            <label className="font-sans text-[10px] font-bold uppercase tracking-widest text-brand-secondary/80">Authentication Method</label>
          </div>
          <div className="relative flex p-1 bg-black/20 dark:bg-black/40 border border-white/5 rounded-full w-full max-w-[240px]">
            {[
              { method: "password", label: "Password" },
              { method: "otp", label: "OTP" }
            ].map((item) => (
              <button
                key={item.method}
                type="button"
                onClick={() => { setLoginMethod(item.method as any); setError(""); }}
                className={`relative flex-1 py-1.5 text-[11px] font-sans font-semibold rounded-full transition-colors z-10 ${
                  loginMethod === item.method ? "text-white" : "text-brand-secondary hover:text-white/80"
                }`}
              >
                {loginMethod === item.method && (
                  <motion.div
                    layoutId="active-login-method"
                    className="absolute inset-0 bg-white/10 border border-white/10 rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-20">{item.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {loginMethod === "password" ? (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex flex-col gap-2.5">
            <div className="flex justify-between items-center px-4">
              <label className="font-sans text-[10px] font-bold uppercase tracking-widest text-brand-secondary/80">Password</label>
              <button
                type="button"
                onClick={() => handleModeSwitch("forgot_password")}
                className="text-[11px] font-sans text-purple-400/80 hover:text-purple-400 hover:underline decoration-purple-400/50 underline-offset-2 transition-all focus:outline-none cursor-pointer bg-transparent border-none"
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
              className="w-full px-6 py-4 rounded-full border border-white/10 bg-black/20 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/60 transition-all text-[14px]"
            />
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex flex-col gap-3">
            <div className="flex flex-col gap-2.5">
              <label className="font-sans text-[10px] font-bold uppercase tracking-widest text-brand-secondary/80 pl-4">OTP Verification Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required={isOtpSent}
                  disabled={!isOtpSent}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder={isOtpSent ? "Enter 6-digit code" : "Click 'Send OTP' first"}
                  suppressHydrationWarning={true}
                  className="flex-grow px-6 py-4 rounded-full border border-white/10 bg-black/20 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/60 transition-all text-[14px] disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="px-6 py-4 rounded-full bg-white/5 border border-white/10 text-white text-xs font-semibold hover:bg-white/10 transition-colors cursor-pointer select-none"
                >
                  {isOtpSent ? "Resend" : "Send OTP"}
                </button>
              </div>
            </div>
            {isOtpSent && (
              <div className="text-[11.5px] text-emerald-400 font-sans font-medium px-4 bg-emerald-500/10 py-2.5 rounded-full border border-emerald-500/20 text-center">
                {otpMessage}
              </div>
            )}
          </motion.div>
        )}

        <motion.button
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          type="submit"
          disabled={loading}
          className="group relative w-full overflow-hidden rounded-full bg-purple-600 px-4 py-4 mt-2 transition-all duration-300 hover:scale-[1.02] hover:brightness-110 active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <span className="relative z-10 flex justify-center items-center gap-2 font-sans font-bold text-[14px] uppercase tracking-wider text-white">
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Access Workspace"}
            {!loading && <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />}
          </span>
        </motion.button>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex flex-col gap-4 mt-2 items-center">
          <div className="flex items-center w-full gap-3 text-brand-secondary/60 text-[10px] uppercase tracking-widest font-semibold font-sans">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-white/10"></div>
            <span>Or</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent via-white/10 to-white/10"></div>
          </div>
          <div className="w-full rounded-full hover:-translate-y-0.5 transition-all duration-300 flex justify-center">
            <div 
              id="google-signin-btn" 
              className="w-full flex justify-center items-center overflow-hidden"
              style={{ minHeight: "44px", borderRadius: "9999px" }}
            ></div>
          </div>
          <Script 
            src="https://accounts.google.com/gsi/client" 
            strategy="afterInteractive" 
            onLoad={initGoogleAuth} 
          />
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }} className="text-center mt-2 text-[12px] font-sans text-brand-secondary">
          Don't have access?{" "}
          <button
            type="button"
            onClick={() => handleModeSwitch("signup")}
            className="font-medium text-white/90 hover:text-white underline decoration-white/30 hover:decoration-white/80 transition-all cursor-pointer bg-transparent border-none"
          >
            Request access here
          </button>
        </motion.div>
      </motion.form>
    </>
  );
}
