"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowRight, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface SignupFormProps {
  handleModeSwitch: (mode: "login" | "signup" | "forgot_password") => void;
  initialRole?: "VENDOR" | "ORGANIZER" | "BRAND" | "ADMIN" | null;
}

export default function SignupForm({ handleModeSwitch, initialRole = null }: SignupFormProps) {
  const { signup } = useAuth();
  
  const [selectedRole, setSelectedRole] = useState<"VENDOR" | "ORGANIZER" | "BRAND" | "ADMIN" | null>(initialRole);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Shared Form Fields
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

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

  if (success) {
    return (
      <div className="flex flex-col items-center gap-6 py-8 text-center">
        <CheckCircle2 size={48} className="text-brand-primary" />
        <div className="flex flex-col gap-2">
          <h3 className="font-serif text-[20px] font-medium">Verification Initiated</h3>
          <p className="font-sans text-xs text-brand-secondary max-w-xs leading-5">
            Your registration has been created. Our verification team is auditing your details. Redirecting to workspace...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="p-4 bg-black/[0.02] dark:bg-white/[0.02] border border-black/10 dark:border-white/10 rounded-xl text-xs text-brand-primary mb-6">
          {error}
        </div>
      )}
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
    </>
  );
}
