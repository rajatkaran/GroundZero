"use client";

import Link from "next/link";
import { Check, Zap } from "lucide-react";

export default function DesignSystemPage() {
  return (
    <div className="ds-wrap max-w-[960px] mx-auto px-6 py-20 sm:px-10 sm:py-24">
      {/* Back button */}
      <div className="mb-8 print:hidden">
        <Link href="/" className="gz-btn gz-btn-secondary gz-btn-sm">
          ← Back to Ground Zero
        </Link>
      </div>

      <div className="ds-header mb-20 pb-12 border-b border-[var(--gz-border)]">
        <div className="ds-header-brand font-serif text-[32px] font-bold mb-2">Ground Zero — Design System</div>
        <div className="ds-header-sub font-sans text-[14px] text-[var(--gz-secondary)]">
          by ThinkThrough · v1.0 · All tokens, components, and patterns for the platform
        </div>
      </div>

      {/* ── COLORS ── */}
      <div className="ds-section mb-24">
        <div className="ds-section-title font-sans text-[10px] tracking-[3px] uppercase text-[var(--gz-secondary)] mb-12 pb-4 border-b border-[var(--gz-border)]">
          01 — Color Tokens
        </div>
        <div className="ds-label font-sans text-[10px] tracking-[2px] uppercase text-[var(--gz-tertiary)] mt-6 mb-3">
          Backgrounds
        </div>
        <div className="swatch-row flex gap-3 flex-wrap mb-6">
          <div className="swatch flex flex-col gap-2">
            <div className="swatch-box w-20 h-20 rounded-[var(--radius-md)] border border-[var(--gz-border)]" style={{ background: "#FAFAFA" }}></div>
            <div className="swatch-name font-sans text-[11px] text-[var(--gz-secondary)]">--gz-bg</div>
            <div className="swatch-hex font-sans text-[11px] font-medium text-[var(--gz-text)]">#FAFAFA</div>
          </div>
          <div className="swatch flex flex-col gap-2">
            <div className="swatch-box w-20 h-20 rounded-[var(--radius-md)] border border-[var(--gz-border)]" style={{ background: "#FFFFFF" }}></div>
            <div className="swatch-name font-sans text-[11px] text-[var(--gz-secondary)]">--gz-bg-card</div>
            <div className="swatch-hex font-sans text-[11px] font-medium text-[var(--gz-text)]">#FFFFFF</div>
          </div>
          <div className="swatch flex flex-col gap-2">
            <div className="swatch-box w-20 h-20 rounded-[var(--radius-md)] border border-[var(--gz-border)]" style={{ background: "#0A0A0A" }}></div>
            <div className="swatch-name font-sans text-[11px] text-[var(--gz-secondary)]">--gz-inv-bg</div>
            <div className="swatch-hex font-sans text-[11px] font-medium text-[var(--gz-text)]">#0A0A0A</div>
          </div>
        </div>

        <div className="ds-label font-sans text-[10px] tracking-[2px] uppercase text-[var(--gz-tertiary)] mt-6 mb-3">
          Text
        </div>
        <div className="swatch-row flex gap-3 flex-wrap mb-6">
          <div className="swatch flex flex-col gap-2">
            <div className="swatch-box w-20 h-20 rounded-[var(--radius-md)] border border-[var(--gz-border)]" style={{ background: "#0A0A0A" }}></div>
            <div className="swatch-name font-sans text-[11px] text-[var(--gz-secondary)]">--gz-text</div>
            <div className="swatch-hex font-sans text-[11px] font-medium text-[var(--gz-text)]">#0A0A0A</div>
          </div>
          <div className="swatch flex flex-col gap-2">
            <div className="swatch-box w-20 h-20 rounded-[var(--radius-md)] border border-[var(--gz-border)]" style={{ background: "#86868B" }}></div>
            <div className="swatch-name font-sans text-[11px] text-[var(--gz-secondary)]">--gz-secondary</div>
            <div className="swatch-hex font-sans text-[11px] font-medium text-[var(--gz-text)]">#86868B</div>
          </div>
          <div className="swatch flex flex-col gap-2">
            <div className="swatch-box w-20 h-20 rounded-[var(--radius-md)] border border-[var(--gz-border)]" style={{ background: "#C0C0C5" }}></div>
            <div className="swatch-name font-sans text-[11px] text-[var(--gz-secondary)]">--gz-tertiary</div>
            <div className="swatch-hex font-sans text-[11px] font-medium text-[var(--gz-text)]">#C0C0C5</div>
          </div>
        </div>

        <div className="ds-label font-sans text-[10px] tracking-[2px] uppercase text-[var(--gz-tertiary)] mt-6 mb-3">
          Borders
        </div>
        <div className="swatch-row flex gap-3 flex-wrap mb-6">
          <div className="swatch flex flex-col gap-2">
            <div className="swatch-box w-20 h-20 rounded-[var(--radius-md)] border border-[var(--gz-border)]" style={{ background: "rgba(0,0,0,0.08)" }}></div>
            <div className="swatch-name font-sans text-[11px] text-[var(--gz-secondary)]">--gz-border</div>
            <div className="swatch-hex font-sans text-[11px] font-medium text-[var(--gz-text)]">rgba(0,0,0,0.08)</div>
          </div>
          <div className="swatch flex flex-col gap-2">
            <div className="swatch-box w-20 h-20 rounded-[var(--radius-md)] border border-[var(--gz-border)]" style={{ background: "rgba(0,0,0,0.12)" }}></div>
            <div className="swatch-name font-sans text-[11px] text-[var(--gz-secondary)]">--gz-border-md</div>
            <div className="swatch-hex font-sans text-[11px] font-medium text-[var(--gz-text)]">rgba(0,0,0,0.12)</div>
          </div>
          <div className="swatch flex flex-col gap-2">
            <div className="swatch-box w-20 h-20 rounded-[var(--radius-md)] border border-[var(--gz-border)]" style={{ background: "rgba(0,0,0,0.20)" }}></div>
            <div className="swatch-name font-sans text-[11px] text-[var(--gz-secondary)]">--gz-border-strong</div>
            <div className="swatch-hex font-sans text-[11px] font-medium text-[var(--gz-text)]">rgba(0,0,0,0.20)</div>
          </div>
        </div>
      </div>

      {/* ── TYPOGRAPHY ── */}
      <div className="ds-section mb-24">
        <div className="ds-section-title font-sans text-[10px] tracking-[3px] uppercase text-[var(--gz-secondary)] mb-12 pb-4 border-b border-[var(--gz-border)]">
          02 — Typography
        </div>

        <div className="type-row mb-8 pb-8 border-b border-[var(--gz-border)]">
          <span className="gz-eyebrow mb-2">Eyebrow — DM Sans 10px / 500 / LS 3px / UC</span>
          <div className="type-spec text-[11px] text-[var(--gz-tertiary)] mt-2">
            font-family: DM Sans · font-size: 10px · font-weight: 500 · letter-spacing: 3px · text-transform: uppercase
          </div>
        </div>

        <div className="type-row mb-8 pb-8 border-b border-[var(--gz-border)]">
          <h1 className="gz-hero-headline" style={{ fontSize: "clamp(48px,6vw,80px)" }}>
            India's Festival<br /><em>Economy.</em>
          </h1>
          <div className="type-spec text-[11px] text-[var(--gz-tertiary)] mt-2">
            gz-hero-headline — Playfair Display · clamp(56px→96px) · 700 · tracking −0.03em · em = italic 400
          </div>
        </div>

        <div className="type-row mb-8 pb-8 border-b border-[var(--gz-border)]">
          <h2 className="gz-h2">One Network. Complete Visibility.</h2>
          <div className="type-spec text-[11px] text-[var(--gz-tertiary)] mt-2">
            gz-h2 — Playfair Display · clamp(32px→56px) · 700 · tracking −0.02em
          </div>
        </div>

        <div className="type-row mb-8 pb-8 border-b border-[var(--gz-border)]">
          <h2 className="gz-h2-editorial">"Every festival is an opportunity."</h2>
          <div className="type-spec text-[11px] text-[var(--gz-tertiary)] mt-2">
            gz-h2-editorial — Cormorant Garamond · italic · 300 · clamp(32px→56px)
          </div>
        </div>

        <div className="type-row mb-8 pb-8 border-b border-[var(--gz-border)]">
          <h3 className="gz-h3">Festival Intelligence Dashboard</h3>
          <div className="type-spec text-[11px] text-[var(--gz-tertiary)] mt-2">
            gz-h3 — Playfair Display · clamp(24px→36px) · 600
          </div>
        </div>

        <div className="type-row mb-8 pb-8 border-b border-[var(--gz-border)]">
          <p className="gz-body-lg">
            Discover, evaluate and secure high-potential festival opportunities through a centralized commerce and vendor intelligence network.
          </p>
          <div className="type-spec text-[11px] text-[var(--gz-tertiary)] mt-2">
            gz-body-lg — DM Sans · 18px · 300 · color: --gz-secondary
          </div>
        </div>

        <div className="type-row mb-8 pb-8 border-b border-[var(--gz-border)]">
          <p className="gz-body">
            The platform allows organizers to list festivals and vendors to discover, evaluate, negotiate and book stalls.
          </p>
          <div className="type-spec text-[11px] text-[var(--gz-tertiary)] mt-2">
            gz-body — DM Sans · 16px · 400 · color: --gz-secondary
          </div>
        </div>

        <div className="type-row mb-8 pb-8 border-b border-[var(--gz-border)]">
          <p className="gz-caption">No credit card required · Invite-only · Limited spots</p>
          <div className="type-spec text-[11px] text-[var(--gz-tertiary)] mt-2">
            gz-caption — DM Sans · 12px · color: --gz-tertiary
          </div>
        </div>

        <div className="dark-section bg-[var(--gz-inv-bg)] text-[var(--gz-inv-text)] p-12 rounded-[var(--radius-xl)] mb-10">
          <span className="gz-eyebrow text-white/40 mb-4">Editorial quote — dark section</span>
          <p className="gz-quote text-white/90">
            "Building the infrastructure layer connecting festivals, vendors and campus communities across India."
          </p>
        </div>
      </div>

      {/* ── BUTTONS ── */}
      <div className="ds-section mb-24">
        <div className="ds-section-title font-sans text-[10px] tracking-[3px] uppercase text-[var(--gz-secondary)] mb-12 pb-4 border-b border-[var(--gz-border)]">
          03 — Buttons
        </div>

        <div className="ds-label font-sans text-[10px] tracking-[2px] uppercase text-[var(--gz-tertiary)] mt-6 mb-3">
          Light surface
        </div>
        <div className="btn-row flex gap-3 flex-wrap items-center mb-6">
          <a href="#" className="gz-btn gz-btn-primary">Request Access →</a>
          <a href="#" className="gz-btn gz-btn-secondary">Explore Platform</a>
          <a href="#" className="gz-btn gz-btn-ghost">Learn More</a>
        </div>
        <div className="btn-row flex gap-3 flex-wrap items-center mb-6">
          <a href="#" className="gz-btn gz-btn-primary gz-btn-sm">Request Access →</a>
          <a href="#" className="gz-btn gz-btn-primary">Request Access →</a>
          <a href="#" className="gz-btn gz-btn-primary gz-btn-lg">Request Early Access →</a>
        </div>

        <div className="ds-label font-sans text-[10px] tracking-[2px] uppercase text-[var(--gz-tertiary)] mt-6 mb-3">
          Dark surface
        </div>
        <div className="dark-section bg-[var(--gz-inv-bg)] text-[var(--gz-inv-text)] p-8 rounded-[var(--radius-xl)] mb-10">
          <div className="btn-row flex gap-3 flex-wrap items-center">
            <a href="#" className="gz-btn gz-btn-inv-primary">Request Access →</a>
            <a href="#" className="gz-btn gz-btn-inv-secondary">Explore Platform</a>
          </div>
        </div>
      </div>

      {/* ── CARDS ── */}
      <div className="ds-section mb-24">
        <div className="ds-section-title font-sans text-[10px] tracking-[3px] uppercase text-[var(--gz-secondary)] mb-12 pb-4 border-b border-[var(--gz-border)]">
          04 — Cards
        </div>

        <div className="ds-label font-sans text-[10px] tracking-[2px] uppercase text-[var(--gz-tertiary)] mt-6 mb-3">
          Festival card
        </div>
        <div className="card-row grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
          <div className="gz-festival-card">
            <div className="gz-festival-card-cover h-[180px] bg-[#f0f0f0] flex items-center justify-center text-[13px] text-[var(--gz-tertiary)] tracking-[2px] uppercase border-b border-[var(--gz-border)]">
              Festival Cover
            </div>
            <div className="gz-festival-card-body p-6">
              <div className="gz-festival-card-meta text-[11px] tracking-[1.5px] uppercase text-[var(--gz-tertiary)] mb-2">
                Mumbai · Jan 17–19, 2025
              </div>
              <div className="gz-festival-card-name font-serif text-[20px] font-semibold mb-1.5 leading-tight">
                Mood Indigo
              </div>
              <div className="gz-festival-card-sub text-[13px] text-[var(--gz-secondary)] mb-5">
                IIT Bombay · Asia's largest college festival
              </div>
              <div className="gz-festival-card-stats grid grid-cols-3 gap-2 mb-5">
                <div className="gz-mini-stat flex flex-col gap-0.5">
                  <span className="gz-mini-stat-val text-[15px] font-medium">52K</span>
                  <span className="gz-mini-stat-label text-[10px] text-[var(--gz-tertiary)] tracking-[1px] uppercase">Footfall</span>
                </div>
                <div className="gz-mini-stat flex flex-col gap-0.5">
                  <span className="gz-mini-stat-val text-[15px] font-medium">24</span>
                  <span className="gz-mini-stat-label text-[10px] text-[var(--gz-tertiary)] tracking-[1px] uppercase">Stalls Left</span>
                </div>
                <div className="gz-mini-stat flex flex-col gap-0.5">
                  <span className="gz-mini-stat-val text-[15px] font-medium">T1</span>
                  <span className="gz-mini-stat-label text-[10px] text-[var(--gz-tertiary)] tracking-[1px] uppercase">College</span>
                </div>
              </div>
              <span className="gz-score-badge inline-flex items-center gap-1.5 text-[12px] font-medium px-3.5 py-1.5 rounded-[var(--radius-pill)] bg-[var(--gz-text)] text-[var(--gz-bg)]">
                <Zap size={12} className="fill-brand-bg text-brand-bg dark:fill-brand-bg dark:text-brand-bg" /> 9.4 Score
              </span>
            </div>
          </div>

          <div className="gz-festival-card">
            <div className="gz-festival-card-cover h-[180px] bg-[#f0f0f0] flex items-center justify-center text-[13px] text-[var(--gz-tertiary)] tracking-[2px] uppercase border-b border-[var(--gz-border)]">
              Festival Cover
            </div>
            <div className="gz-festival-card-body p-6">
              <div className="gz-festival-card-meta text-[11px] tracking-[1.5px] uppercase text-[var(--gz-tertiary)] mb-2">
                Delhi · Oct 3–6, 2025
              </div>
              <div className="gz-festival-card-name font-serif text-[20px] font-semibold mb-1.5 leading-tight">
                Rendezvous
              </div>
              <div className="gz-festival-card-sub text-[13px] text-[var(--gz-secondary)] mb-5">
                IIT Delhi · North India's flagship fest
              </div>
              <div className="gz-festival-card-stats grid grid-cols-3 gap-2 mb-5">
                <div className="gz-mini-stat flex flex-col gap-0.5">
                  <span className="gz-mini-stat-val text-[15px] font-medium">40K</span>
                  <span className="gz-mini-stat-label text-[10px] text-[var(--gz-tertiary)] tracking-[1px] uppercase">Footfall</span>
                </div>
                <div className="gz-mini-stat flex flex-col gap-0.5">
                  <span className="gz-mini-stat-val text-[15px] font-medium">18</span>
                  <span className="gz-mini-stat-label text-[10px] text-[var(--gz-tertiary)] tracking-[1px] uppercase">Stalls Left</span>
                </div>
                <div className="gz-mini-stat flex flex-col gap-0.5">
                  <span className="gz-mini-stat-val text-[15px] font-medium">T1</span>
                  <span className="gz-mini-stat-label text-[10px] text-[var(--gz-tertiary)] tracking-[1px] uppercase">College</span>
                </div>
              </div>
              <span className="gz-score-badge inline-flex items-center gap-1.5 text-[12px] font-medium px-3.5 py-1.5 rounded-[var(--radius-pill)] bg-[var(--gz-text)] text-[var(--gz-bg)]">
                <Zap size={12} className="fill-brand-bg text-brand-bg dark:fill-brand-bg dark:text-brand-bg" /> 8.7 Score
              </span>
            </div>
          </div>
        </div>

        <div className="ds-label font-sans text-[10px] tracking-[2px] uppercase text-[var(--gz-tertiary)] mt-6 mb-3">
          Stat cards
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <div className="gz-stat-card bg-[var(--gz-bg)] rounded-[var(--radius-md)] p-5">
            <div className="gz-stat-card-label text-[9px] tracking-[2px] uppercase text-[var(--gz-tertiary)] mb-2">
              Expected Footfall
            </div>
            <div className="gz-stat-card-value font-serif text-[28px] font-semibold mb-1 leading-none">
              52,000
            </div>
            <div className="gz-stat-card-sub text-[12px] text-[var(--gz-secondary)]">
              3-day festival
            </div>
          </div>

          <div className="gz-stat-card bg-[var(--gz-bg)] rounded-[var(--radius-md)] p-5">
            <div className="gz-stat-card-label text-[9px] tracking-[2px] uppercase text-[var(--gz-tertiary)] mb-2">
              Opportunity Score
            </div>
            <div className="gz-stat-card-value font-serif text-[28px] font-semibold mb-1 leading-none">
              9.4
            </div>
            <div className="gz-stat-card-sub text-[12px] text-[var(--gz-secondary)]">
              Top 3%
            </div>
          </div>

          <div className="gz-stat-card bg-[var(--gz-bg)] rounded-[var(--radius-md)] p-5">
            <div className="gz-stat-card-label text-[9px] tracking-[2px] uppercase text-[var(--gz-tertiary)] mb-2">
              Available Stalls
            </div>
            <div className="gz-stat-card-value font-serif text-[28px] font-semibold mb-1 leading-none">
              24
            </div>
            <div className="gz-stat-card-sub text-[12px] text-[var(--gz-secondary)]">
              of 60 total
            </div>
          </div>

          <div className="gz-stat-card bg-[var(--gz-bg)] rounded-[var(--radius-md)] p-5">
            <div className="gz-stat-card-label text-[9px] tracking-[2px] uppercase text-[var(--gz-tertiary)] mb-2">
              Revenue Est.
            </div>
            <div className="gz-stat-card-value font-serif text-[28px] font-semibold mb-1 leading-none">
              ₹2.4L
            </div>
            <div className="gz-stat-card-sub text-[12px] text-[var(--gz-secondary)]">
              per vendor avg.
            </div>
          </div>
        </div>
      </div>

      {/* ── STATUS PILLS ── */}
      <div className="ds-section mb-24">
        <div className="ds-section-title font-sans text-[10px] tracking-[3px] uppercase text-[var(--gz-secondary)] mb-12 pb-4 border-b border-[var(--gz-border)]">
          05 — Stall Status Indicators
        </div>
        <div className="btn-row flex gap-3 flex-wrap items-center">
          <span className="gz-pill gz-pill-available">Available</span>
          <span className="gz-pill gz-pill-booked">Booked</span>
          <span className="gz-pill gz-pill-negotiation">In Negotiation</span>
          <span className="gz-pill gz-pill-reserved">Reserved</span>
        </div>
      </div>

      {/* ── FORMS ── */}
      <div className="ds-section mb-24">
        <div className="ds-section-title font-sans text-[10px] tracking-[3px] uppercase text-[var(--gz-secondary)] mb-12 pb-4 border-b border-[var(--gz-border)]">
          06 — Form Elements
        </div>

        <div className="ds-label font-sans text-[10px] tracking-[2px] uppercase text-[var(--gz-tertiary)] mt-6 mb-3">
          Step indicator (multi-step onboarding)
        </div>
        <div className="gz-steps flex items-center mb-10">
          <div className="gz-step done flex items-center gap-2.5 flex-1">
            <div className="gz-step-num w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-medium border border-[var(--gz-text)] bg-[var(--gz-text)] text-[var(--gz-bg)]">
              ✓
            </div>
            <div className="gz-step-label text-[12px] text-[var(--gz-text)] font-medium">Account</div>
          </div>
          <div className="gz-step-divider flex-1 h-[1px] bg-[var(--gz-border)] mx-3"></div>
          <div className="gz-step active flex items-center gap-2.5 flex-1">
            <div className="gz-step-num w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-medium border border-[var(--gz-text)] bg-[var(--gz-text)] text-[var(--gz-bg)]">
              2
            </div>
            <div className="gz-step-label text-[12px] text-[var(--gz-text)] font-medium">Business Details</div>
          </div>
          <div className="gz-step-divider flex-1 h-[1px] bg-[var(--gz-border)] mx-3"></div>
          <div className="gz-step flex items-center gap-2.5 flex-1">
            <div className="gz-step-num w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-medium border border-[var(--gz-border-md)] text-[var(--gz-tertiary)]">
              3
            </div>
            <div className="gz-step-label text-[12px] text-[var(--gz-secondary)]">Verification</div>
          </div>
          <div className="gz-step-divider flex-1 h-[1px] bg-[var(--gz-border)] mx-3"></div>
          <div className="gz-step flex items-center gap-2.5 flex-1">
            <div className="gz-step-num w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-medium border border-[var(--gz-border-md)] text-[var(--gz-tertiary)]">
              4
            </div>
            <div className="gz-step-label text-[12px] text-[var(--gz-secondary)]">Done</div>
          </div>
        </div>

        <div className="ds-label font-sans text-[10px] tracking-[2px] uppercase text-[var(--gz-tertiary)] mt-6 mb-3">
          Input fields
        </div>
        <div className="max-w-[480px] flex flex-col gap-4">
          <div className="gz-field flex flex-col">
            <label className="gz-input-label block text-[12px] font-medium tracking-[0.06em] uppercase text-[var(--gz-secondary)] mb-2">
              Business Name
            </label>
            <input className="gz-input" type="text" placeholder="e.g. Bombay Bites Co." />
          </div>
          <div className="gz-field flex flex-col">
            <label className="gz-input-label block text-[12px] font-medium tracking-[0.06em] uppercase text-[var(--gz-secondary)] mb-2">
              Vendor Category
            </label>
            <select className="gz-select">
              <option>Food & Beverage</option>
              <option>Fashion</option>
              <option>Gaming</option>
            </select>
          </div>
          <div className="gz-field flex flex-col">
            <label className="gz-input-label block text-[12px] font-medium tracking-[0.06em] uppercase text-[var(--gz-secondary)] mb-2">
              Business Description
            </label>
            <textarea className="gz-textarea" rows={3} placeholder="Tell festivals what makes you great..." />
            <span className="gz-field-hint text-[12px] text-[var(--gz-tertiary)] mt-1.5">
              This will appear on your vendor profile visible to organizers.
            </span>
          </div>
        </div>
      </div>

      {/* ── SPACING ── */}
      <div className="ds-section mb-24">
        <div className="ds-section-title font-sans text-[10px] tracking-[3px] uppercase text-[var(--gz-secondary)] mb-12 pb-4 border-b border-[var(--gz-border)]">
          07 — Spacing Scale
        </div>
        <div className="spacing-vis flex items-end gap-3 flex-wrap">
          <div className="spacing-block bg-black/5 rounded flex flex-col items-center justify-end pb-1.5 gap-1 text-[10px] text-[var(--gz-secondary)]" style={{ width: "4px", height: "4px" }}>
            <span>4</span>
          </div>
          <div className="spacing-block bg-black/5 rounded flex flex-col items-center justify-end pb-1.5 gap-1 text-[10px] text-[var(--gz-secondary)]" style={{ width: "8px", height: "8px" }}>
            <span>8</span>
          </div>
          <div className="spacing-block bg-black/5 rounded flex flex-col items-center justify-end pb-1.5 gap-1 text-[10px] text-[var(--gz-secondary)]" style={{ width: "12px", height: "12px" }}>
            <span>12</span>
          </div>
          <div className="spacing-block bg-black/5 rounded flex flex-col items-center justify-end pb-1.5 gap-1 text-[10px] text-[var(--gz-secondary)]" style={{ width: "16px", height: "16px" }}>
            <span>16</span>
          </div>
          <div className="spacing-block bg-black/5 rounded flex flex-col items-center justify-end pb-1.5 gap-1 text-[10px] text-[var(--gz-secondary)]" style={{ width: "24px", height: "24px" }}>
            <span>24</span>
          </div>
          <div className="spacing-block bg-black/5 rounded flex flex-col items-center justify-end pb-1.5 gap-1 text-[10px] text-[var(--gz-secondary)]" style={{ width: "32px", height: "32px" }}>
            <span>32</span>
          </div>
          <div className="spacing-block bg-black/5 rounded flex flex-col items-center justify-end pb-1.5 gap-1 text-[10px] text-[var(--gz-secondary)]" style={{ width: "48px", height: "48px" }}>
            <span>48</span>
          </div>
          <div className="spacing-block bg-black/5 rounded flex flex-col items-center justify-end pb-1.5 gap-1 text-[10px] text-[var(--gz-secondary)]" style={{ width: "64px", height: "64px" }}>
            <span>64</span>
          </div>
          <div className="spacing-block bg-black/5 rounded flex flex-col items-center justify-end pb-1.5 gap-1 text-[10px] text-[var(--gz-secondary)]" style={{ width: "80px", height: "80px" }}>
            <span>80</span>
          </div>
          <div className="spacing-block bg-black/5 rounded flex flex-col items-center justify-end pb-1.5 gap-1 text-[10px] text-[var(--gz-secondary)]" style={{ width: "100px", height: "100px" }}>
            <span>100</span>
          </div>
          <div className="spacing-block bg-black/5 rounded flex flex-col items-center justify-end pb-1.5 gap-1 text-[10px] text-[var(--gz-secondary)]" style={{ width: "140px", height: "140px" }}>
            <span>140 (sec)</span>
          </div>
        </div>
      </div>

      {/* ── RADIUS ── */}
      <div className="ds-section mb-24">
        <div className="ds-section-title font-sans text-[10px] tracking-[3px] uppercase text-[var(--gz-secondary)] mb-12 pb-4 border-b border-[var(--gz-border)]">
          08 — Border Radius
        </div>
        <div className="flex gap-5 flex-wrap items-end">
          <div className="flex flex-col gap-2 items-center">
            <div className="w-[60px] h-[60px] bg-black/5 rounded-[8px]"></div>
            <span className="gz-caption">sm — 8px</span>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <div className="w-[70px] h-[70px] bg-black/5 rounded-[12px]"></div>
            <span className="gz-caption">md — 12px</span>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <div className="w-[80px] h-[80px] bg-black/5 rounded-[16px]"></div>
            <span className="gz-caption">lg — 16px</span>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <div className="w-[90px] h-[90px] bg-black/5 rounded-[20px]"></div>
            <span className="gz-caption">xl — 20px</span>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <div className="w-[100px] h-[100px] bg-black/5 rounded-[28px]"></div>
            <span className="gz-caption">2xl — 28px</span>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <div className="w-[48px] h-[48px] bg-black/5 rounded-full"></div>
            <span className="gz-caption">pill</span>
          </div>
        </div>
      </div>
    </div>
  );
}
