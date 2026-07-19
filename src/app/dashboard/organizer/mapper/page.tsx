"use client";

import { useEffect, useState, useRef, use, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft, Plus, Check, Trash2, MapPin, Store, Mic, Route, Zap, Lock } from "lucide-react";
import PortalLayout from "@/components/PortalLayout";

function LayoutMapper() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const festivalId = searchParams.get("festivalId");

  const [festival, setFestival] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stalls, setStalls] = useState<any[]>([]);

  // Drawing state
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentBox, setCurrentBox] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  
  // Modal & form state
  const [showModal, setShowModal] = useState(false);
  const [stallNumber, setStallNumber] = useState("");
  const [dimensions, setDimensions] = useState("10x10");
  const [basePrice, setBasePrice] = useState("35000");
  const [publicPrice, setPublicPrice] = useState("45000");
  const [expectedTraffic, setExpectedTraffic] = useState("8.0");
  const [visibilityScore, setVisibilityScore] = useState("8.0");
  const [description, setDescription] = useState("");
  const [powerGrid, setPowerGrid] = useState("Standard (15A)");
  const [saveLoading, setSaveLoading] = useState(false);

  // Layout Design (Canva-like Blank Canvas Editor) States
  const [toolMode, setToolMode] = useState<"STALL" | "STAGE" | "WALKWAY" | "UTILITY">("STALL");
  const [showDecorationModal, setShowDecorationModal] = useState(false);
  const [decorationLabel, setDecorationLabel] = useState("");
  const [showLabels, setShowLabels] = useState(true);
  const [scale, setScale] = useState(1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapperRef.current) return;
    const handleResize = () => {
      const width = wrapperRef.current?.getBoundingClientRect().width || 1000;
      if (width < 1000) {
        setScale(width / 1000);
      } else {
        setScale(1);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchFestivalAndStalls = async () => {
    if (!festivalId) return;
    try {
      const response = await fetch(`/api/festivals/${festivalId}`);
      if (!response.ok) {
        throw new Error("Failed to load festival property.");
      }
      const res = await response.json();
      setFestival(res.festival);
      setStalls(res.festival.stalls || []);
    } catch (err: any) {
      setError(err.message || "Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFestivalAndStalls();
  }, [festivalId]);

  // Handle click-and-drag drawing coordinates
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current || showModal || festival?.mapLocked) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    setIsDrawing(true);
    setStartPos({ x, y });
    setCurrentBox({ x, y, w: 0, h: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing || !currentBox || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    const w = x - startPos.x;
    const h = y - startPos.y;

    setCurrentBox({
      x: w < 0 ? x : startPos.x,
      y: h < 0 ? y : startPos.y,
      w: Math.abs(w),
      h: Math.abs(h)
    });
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    
    // Minimum size check to avoid accidental micro-clicks
    if (currentBox && currentBox.w > 15 && currentBox.h > 15) {
      if (toolMode === "STALL") {
        // Suggest a stall number based on current count
        setStallNumber(`A${stalls.length + 1}`);
        setBasePrice(festival?.defaultStallPrice?.toString() || "35000");
        setDescription("");
        setPowerGrid("Standard (15A)");
        setShowModal(true);
      } else {
        // Drawing a decoration (Stage, Walkway, Utility)
        const defaultLabel = toolMode === "STAGE" ? "Concert Stage" : toolMode === "WALKWAY" ? "Walkway" : "Food Zone";
        setDecorationLabel(defaultLabel);
        setShowDecorationModal(true);
      }
    } else {
      setCurrentBox(null);
    }
  };

  const handleSaveDecoration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (festival?.mapLocked) {
      alert("Map is locked by admin and cannot be edited.");
      return;
    }
    if (!currentBox) return;

    setSaveLoading(true);
    try {
      let parsedDimensions = { width: 1000, height: 600, decorations: [] as any[] };
      if (festival.mapDimensions) {
        try {
          const parsed = JSON.parse(festival.mapDimensions);
          if (parsed && typeof parsed === "object") {
            parsedDimensions = {
              width: parsed.width || 1000,
              height: parsed.height || 600,
              decorations: Array.isArray(parsed.decorations) ? parsed.decorations : []
            };
          }
        } catch (e) {}
      }

      const newDec = {
        type: toolMode.toLowerCase(),
        x: Math.round(currentBox.x),
        y: Math.round(currentBox.y),
        w: Math.round(currentBox.w),
        h: Math.round(currentBox.h),
        label: decorationLabel || toolMode
      };

      parsedDimensions.decorations.push(newDec);

      const response = await fetch("/api/festivals/update-map", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          festivalId,
          mapDimensions: JSON.stringify(parsedDimensions)
        })
      });

      if (!response.ok) {
        throw new Error("Failed to save layout element.");
      }

      await fetchFestivalAndStalls();
      setShowDecorationModal(false);
      setCurrentBox(null);
      setDecorationLabel("");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDeleteDecoration = async (indexToDelete: number) => {
    if (festival?.mapLocked) {
      alert("Map layout is locked by admin. You cannot delete layout elements.");
      return;
    }
    if (!confirm("Are you sure you want to remove this layout element?")) return;
    try {
      if (!festival.mapDimensions) return;
      const parsed = JSON.parse(festival.mapDimensions);
      const decs = parsed?.decorations || [];
      const updatedDecs = decs.filter((_: any, idx: number) => idx !== indexToDelete);
      
      const updatedDimensions = {
        ...parsed,
        decorations: updatedDecs
      };

      const response = await fetch("/api/festivals/update-map", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          festivalId,
          mapDimensions: JSON.stringify(updatedDimensions)
        })
      });

      if (!response.ok) {
        throw new Error("Failed to delete layout element.");
      }

      await fetchFestivalAndStalls();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleResetMap = async () => {
    if (!confirm("Are you absolutely sure you want to reset the layout map? This will delete ALL mapped stalls and decorations for this festival. This action CANNOT be undone.")) {
      return;
    }
    try {
      const response = await fetch("/api/admin/adjust-festival", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          festivalId,
          action: "RESET_MAP"
        })
      });
      if (response.ok) {
        window.location.reload();
      } else {
        alert("Failed to reset map layout.");
      }
    } catch (e) {
      console.error(e);
      alert("Failed to reset map layout.");
    }
  };

  const handleCopyLastStallSettings = () => {
    if (stalls.length === 0) {
      alert("No previous stalls mapped to copy settings from.");
      return;
    }
    const lastStall = stalls[stalls.length - 1];
    setDimensions(lastStall.dimensions || "10x10");
    setBasePrice(lastStall.basePrice?.toString() || lastStall.publicPrice ? (lastStall.publicPrice - 10000).toString() : "35000");
    setExpectedTraffic(lastStall.expectedTraffic?.toString() || "8.0");
    setVisibilityScore(lastStall.visibilityScore?.toString() || "8.0");
    setPowerGrid(lastStall.powerGrid || "Standard (15A)");
    setDescription(lastStall.description || "");
  };

  const handleSaveStall = async (e: React.FormEvent) => {
    e.preventDefault();
    if (festival?.mapLocked) {
      alert("Map is locked by admin and cannot be edited.");
      return;
    }
    if (!stallNumber || !currentBox) return;

    const coordinates = {
      type: "rect",
      x: Math.round(currentBox.x),
      y: Math.round(currentBox.y),
      w: Math.round(currentBox.w),
      h: Math.round(currentBox.h)
    };

    const newStallOptimistic = {
      id: "temp_" + Date.now(),
      stallNumber,
      dimensions,
      basePrice: parseFloat(basePrice),
      publicPrice: parseFloat(basePrice) + 10000,
      coordinates: JSON.stringify(coordinates),
      status: "AVAILABLE",
      expectedTraffic: parseFloat(expectedTraffic) || 8.0,
      visibilityScore: parseFloat(visibilityScore) || 8.0,
      description,
      powerGrid
    };

    // Optimistically update stalls state and close modal instantly
    setStalls(prev => [...prev, newStallOptimistic]);
    setShowModal(false);
    setCurrentBox(null);

    // Perform database save in background without locking UI
    fetch("/api/stalls/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        festivalId,
        stallNumber,
        dimensions,
        basePrice,
        publicPrice: parseFloat(basePrice) + 10000,
        coordinates,
        expectedTraffic,
        visibilityScore,
        description,
        powerGrid
      })
    }).then(async (response) => {
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to save stall coordinates.");
      }
      fetchFestivalAndStalls();
    }).catch((err: any) => {
      alert("Failed to save stall layout mapping: " + err.message);
      // Rollback optimistic state
      setStalls(prev => prev.filter(s => s.id !== newStallOptimistic.id));
    });
  };

  const handleDeleteStall = async (stallId: string) => {
    if (festival?.mapLocked) {
      alert("Map layout is locked by admin. You cannot delete stalls.");
      return;
    }
    if (!confirm("Are you sure you want to release and delete this stall mapping?")) return;

    const originalStalls = stalls;
    setStalls(prev => prev.filter(s => s.id !== stallId));

    try {
      const response = await fetch("/api/stalls/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stallId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete stall mapping.");
      }
      fetchFestivalAndStalls();
    } catch (err: any) {
      alert(err.message);
      setStalls(originalStalls);
    }
  };

  if (loading) {
    return (
      <PortalLayout activeTab="my festivals">
        <div className="flex h-96 items-center justify-center">
          <Loader2 size={32} className="animate-spin text-brand-secondary" />
        </div>
      </PortalLayout>
    );
  }

  if (error || !festival) {
    return (
      <PortalLayout activeTab="my festivals">
        <div className="p-8 border border-brand-border bg-brand-card text-center rounded-2xl text-brand-secondary text-sm">
          {error || "Festival property not found."}
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout activeTab="my festivals">
      <div className="flex flex-col gap-12">
        {/* Navigation backlink */}
        <div>
          <Link href="/dashboard/organizer" className="group flex items-center gap-2 text-[12px] text-brand-secondary hover:text-brand-primary transition-colors uppercase tracking-wider">
            <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Dashboard
          </Link>
        </div>

        {/* Title Block */}
        <div className="flex flex-col gap-3">
          <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-brand-secondary">
            GRID COORDINATES GENERATOR
          </span>
          <h1 className="font-serif text-[40px] font-medium tracking-tight text-brand-primary">
            Layout Mapping Suite
          </h1>
          <p className="font-sans text-[13px] text-brand-secondary max-w-xl">
            Configure {festival.name}'s visual floorplan. Click, hold, and drag your cursor over the grid canvas to draw active stall hot-spots.
          </p>
        </div>

        {festival.mapLocked && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-xs text-red-500 font-medium flex items-center gap-3">
            <span className="text-lg">🔒</span>
            <div>
              <p className="font-bold uppercase tracking-wider text-[10px]">Map Locked by Admin</p>
              <p className="mt-0.5 text-brand-secondary text-[12px]">The visual coordinate layout and stall base pricing for this festival are locked. Drawing new zones, deleting spots, or revising prices requires admin approval.</p>
            </div>
          </div>
        )}

        {/* Editor Grid Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Block: Drawing Canvas */}
          <div className="lg:col-span-8 flex flex-col gap-4">
             <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <span className="font-sans text-[10px] uppercase tracking-wider text-brand-secondary">LAYOUT CANVAS</span>
                <label className="flex items-center gap-1.5 text-[10px] font-sans text-brand-secondary font-semibold uppercase tracking-wider cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showLabels}
                    onChange={(e) => setShowLabels(e.target.checked)}
                    className="rounded border-brand-border focus:ring-0 cursor-pointer"
                  />
                  Show Stall Numbers
                </label>
              </div>
              
              {/* Canvas Toolbox Toolbar */}
              {festival.mapLocked ? (
                <div className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-500 font-bold rounded-xl text-[10px] uppercase tracking-wider flex items-center gap-1.5 select-none">
                  <span className="flex items-center gap-1.5"><Lock size={12} /> Layout Locked (Read-Only)</span>
                </div>
              ) : (
                <div className="flex bg-brand-card border border-brand-border p-1 rounded-xl gap-1 text-[11px] font-sans">
                  {[
                    { mode: "STALL", label: <span className="flex items-center gap-1.5"><Store size={14} /> Stall Spot</span> },
                    { mode: "STAGE", label: <span className="flex items-center gap-1.5"><Mic size={14} /> Concert Stage</span> },
                    { mode: "WALKWAY", label: <span className="flex items-center gap-1.5"><Route size={14} /> Walkway Path</span> },
                    { mode: "UTILITY", label: <span className="flex items-center gap-1.5"><Zap size={14} /> Food/Utility Zone</span> }
                  ].map((btn) => (
                    <button
                      key={btn.mode}
                      type="button"
                      onClick={() => setToolMode(btn.mode as any)}
                      className={`px-3 py-1.5 rounded-lg transition-all font-semibold cursor-pointer ${
                        toolMode === btn.mode
                          ? "bg-brand-primary text-brand-bg"
                          : "text-brand-secondary hover:text-brand-primary"
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div ref={wrapperRef} className="w-full overflow-hidden select-none" style={{ height: `${600 * scale}px` }}>
              <div 
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                className={`relative bg-brand-card border border-brand-border rounded-2xl shadow-inner select-none overflow-hidden ${
                  festival.mapLocked ? "cursor-not-allowed" : "cursor-crosshair"
                }`}
                style={{ 
                  width: "1000px", 
                  height: "600px", 
                  transform: `scale(${scale})`,
                  transformOrigin: "top left",
                  flexShrink: 0,
                  backgroundImage: festival.layoutMapUrl ? `url(${festival.layoutMapUrl})` : "none",
                  backgroundSize: "100% 100%",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat"
                }}
              >
              {/* Background blueprints visual simulation (only shown for default blueprints or blank canvas) */}
              {(!festival.layoutMapUrl || festival.layoutMapUrl === "/blueprints/mood_indigo_layout.png" || festival.layoutMapUrl === "/blueprints/oasis_layout.png") && (
                <svg width="1000" height="600" className="absolute inset-0 w-full h-full pointer-events-none">
                  <defs>
                    <pattern id="mapper-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0, 0, 0, 0.03)" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="1000" height="600" fill="url(#mapper-grid)" />
                  
                  {/* Visual guidelines - only shown for pre-seeded template maps, not for blank canvasses */}
                  {(festival.layoutMapUrl === "/blueprints/mood_indigo_layout.png" || festival.layoutMapUrl === "/blueprints/oasis_layout.png") && (
                    <>
                      <rect x="750" y="220" width="160" height="160" fill="rgba(0,0,0,0.02)" stroke="rgba(0,0,0,0.06)" rx="8" />
                      <text x="830" y="305" fontFamily="var(--font-dm-sans), sans-serif" fontSize="12" fill="rgba(0,0,0,0.2)" textAnchor="middle">
                        CONCERT STAGE
                      </text>
                      <path d="M 100 280 L 700 280" fill="none" stroke="rgba(0,0,0,0.02)" strokeWidth="30" strokeLinecap="round" />
                      <text x="400" y="284" fontFamily="var(--font-dm-sans), sans-serif" fontSize="11" fill="rgba(0,0,0,0.15)" textAnchor="middle">
                        MAIN WALKWAY
                      </text>
                    </>
                  )}
                </svg>
              )}

              {/* Blank canvas help banner overlay */}
              {!festival.layoutMapUrl && (
                <div className="absolute top-4 left-4 right-4 bg-brand-primary/10 backdrop-blur-md border border-brand-primary/20 rounded-xl p-3 text-[11px] font-sans text-brand-primary flex items-center justify-between pointer-events-none">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🎨</span>
                    <span><strong>Blank Canvas Mode:</strong> Click and drag anywhere on this grid to draw custom stalls, stages, walkways, or utility zones.</span>
                  </div>
                  <span className="uppercase text-[9px] tracking-wider bg-brand-primary text-brand-bg px-2 py-0.5 rounded font-bold">scratch pad</span>
                </div>
              )}

              {/* Custom Drawn Decorations Overlay */}
              {(() => {
                try {
                  const parsed = festival.mapDimensions ? JSON.parse(festival.mapDimensions) : null;
                  if (parsed && Array.isArray(parsed.decorations)) {
                    return parsed.decorations.map((dec: any, idx: number) => {
                      let bg = "rgba(0, 0, 0, 0.05)";
                      let border = "1px solid rgba(0, 0, 0, 0.1)";
                      let color = "rgba(0,0,0,0.4)";
                      
                      if (dec.type === "stage") {
                        bg = "rgba(18, 17, 16, 0.05)";
                        border = "2px solid rgba(18, 17, 16, 0.2)";
                      } else if (dec.type === "walkway") {
                        bg = "rgba(0, 0, 0, 0.02)";
                        border = "1px dashed rgba(0, 0, 0, 0.06)";
                      } else if (dec.type === "utility") {
                        bg = "rgba(59, 130, 246, 0.05)";
                        border = "2px solid rgba(59, 130, 246, 0.2)";
                        color = "#2563EB";
                      }
                      
                      return (
                        <div
                          key={`dec-overlay-${idx}`}
                          className="absolute rounded-xl flex items-center justify-center font-sans text-[10px] font-bold uppercase tracking-wider text-center p-2"
                          style={{
                            left: `${dec.x}px`,
                            top: `${dec.y}px`,
                            width: `${dec.w}px`,
                            height: `${dec.h}px`,
                            background: bg,
                            border: border,
                            color: color
                          }}
                        >
                          {dec.label}
                        </div>
                      );
                    });
                  }
                } catch (e) {}
                return null;
              })()}

              {/* Already saved stalls overlay */}
              {stalls.map((stall) => {
                const coords = JSON.parse(stall.coordinates);
                return (
                  <div
                    key={stall.id}
                    className="absolute bg-black/5 border border-black/20 rounded-xl flex items-center justify-center font-sans text-[11px] font-bold text-brand-primary"
                    style={{
                      left: `${coords.x}px`,
                      top: `${coords.y}px`,
                      width: `${coords.w}px`,
                      height: `${coords.h}px`
                    }}
                  >
                    {showLabels && (
                      <span 
                        style={{
                          textShadow: "-2px -2px 0 var(--brand-card), 2px -2px 0 var(--brand-card), -2px 2px 0 var(--brand-card), 2px 2px 0 var(--brand-card)",
                          color: "var(--brand-primary)"
                        }}
                        className="text-[10px] font-extrabold select-none"
                      >
                        {stall.stallNumber}
                      </span>
                    )}
                  </div>
                );
              })}

              {/* Box being drawn currently */}
              {isDrawing && currentBox && (
                <div
                  className="absolute bg-black/10 border-2 border-dashed border-black rounded-xl pointer-events-none"
                  style={{
                    left: `${currentBox.x}px`,
                    top: `${currentBox.y}px`,
                    width: `${currentBox.w}px`,
                    height: `${currentBox.h}px`
                  }}
                />
              )}
            </div>
          </div>
        </div>

          <div className="lg:col-span-4 flex flex-col gap-6 w-full">
            {/* Mapped Stalls Inventory List */}
            <div className="flex justify-between items-center pb-2 border-b border-black/[0.06]">
              <h3 className="font-serif font-medium text-[16px] text-brand-primary">
                Mapped Stalls ({stalls.length})
              </h3>
              {!festival.mapLocked && stalls.length > 0 && (
                <button
                  type="button"
                  onClick={handleResetMap}
                  className="px-3 py-1.5 border border-red-500/20 bg-red-500/5 text-red-500 rounded-lg text-[10px] uppercase tracking-wider font-semibold hover:bg-red-500/10 transition-all cursor-pointer"
                >
                  Reset Map
                </button>
              )}
            </div>
            <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-2">
              {stalls.length === 0 ? (
                <div className="bg-brand-card border border-brand-border rounded-xl p-6 text-center text-brand-secondary text-xs">
                  No stalls mapped yet.
                </div>
              ) : (
                stalls.map((stall) => (
                  <div key={stall.id} className="bg-brand-card border border-brand-border rounded-xl p-4 flex items-center justify-between">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-serif font-medium text-[15px]">Stall {stall.stallNumber}</span>
                      <span className="font-sans text-[11px] text-brand-secondary">
                        {stall.dimensions} ft &middot; Price: ₹{stall.publicPrice.toLocaleString("en-IN")}
                      </span>
                    </div>
                    
                    {!festival.mapLocked && (
                      <button 
                        className="p-2 text-brand-secondary hover:text-red-500 transition-colors focus:outline-none cursor-pointer"
                        title="Remove Coordinate Mapping"
                        onClick={() => handleDeleteStall(stall.id)}
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Mapped Visual Annotations Decorations List */}
            <div className="flex flex-col gap-3 border-t border-black/[0.06] pt-6 mt-2">
              <h3 className="font-serif font-medium text-[16px] text-brand-primary pb-1">
                Visual Layout Elements
              </h3>
              {(() => {
                try {
                  const parsed = festival.mapDimensions ? JSON.parse(festival.mapDimensions) : null;
                  const decs = parsed?.decorations || [];
                  if (decs.length === 0) {
                    return (
                      <div className="bg-brand-card border border-brand-border rounded-xl p-6 text-center text-brand-secondary text-xs">
                        No stage or walkway annotations drawn yet.
                      </div>
                    );
                  }
                  return (
                    <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto pr-1">
                      {decs.map((dec: any, idx: number) => (
                        <div key={idx} className="bg-brand-card border border-brand-border rounded-xl p-3 flex items-center justify-between">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-sans font-semibold text-[12px] uppercase text-brand-primary">{dec.label}</span>
                            <span className="font-sans text-[10px] text-brand-secondary capitalize">
                              {dec.type} &middot; Size: {dec.w}x{dec.h} px
                            </span>
                          </div>
                          {!festival.mapLocked && (
                            <button
                              className="p-1 text-brand-secondary hover:text-red-500 transition-colors cursor-pointer"
                              onClick={() => handleDeleteDecoration(idx)}
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                } catch (e) {
                  return null;
                }
              })()}
            </div>
          </div>

        </div>

      </div>

      {/* METADATA MODAL */}
      {showModal && currentBox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-brand-card border border-brand-border rounded-[24px] max-w-md w-full p-8 shadow-xl flex flex-col gap-6 font-sans">
            
            <div className="flex flex-col gap-1.5 text-center relative">
              <div className="flex justify-between items-center w-full px-1 mb-2 border-b border-brand-border/40 pb-3">
                <h3 className="font-serif text-[22px] font-medium text-brand-primary">Register Space</h3>
                {stalls.length > 0 && (
                  <button
                    type="button"
                    onClick={handleCopyLastStallSettings}
                    className="text-[10px] font-sans text-brand-primary bg-brand-bg px-2.5 py-1.5 rounded-lg border border-brand-border hover:bg-brand-border/30 transition-all font-semibold cursor-pointer"
                  >
                    📋 Copy Last Stall Settings
                  </button>
                )}
              </div>
              <p className="text-xs text-brand-secondary">Assign properties to coordinates X:{Math.round(currentBox.x)}, Y:{Math.round(currentBox.y)}</p>
            </div>

            <form onSubmit={handleSaveStall} className="flex flex-col gap-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="uppercase tracking-wider font-semibold text-[10px] text-brand-secondary">Stall Identifier</label>
                  <input
                    type="text"
                    required
                    value={stallNumber}
                    onChange={(e) => setStallNumber(e.target.value)}
                    placeholder="e.g. A5"
                    className="w-full px-3 py-2.5 rounded-lg border border-brand-border bg-brand-bg text-brand-primary placeholder:text-brand-secondary/40 focus:outline-none focus:border-brand-primary text-[13px]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="uppercase tracking-wider font-semibold text-[10px] text-brand-secondary">Stall Dimensions (ft)</label>
                  <input
                    type="text"
                    required
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    placeholder="e.g. 10x10"
                    className="w-full px-3 py-2.5 rounded-lg border border-brand-border bg-brand-bg text-brand-primary placeholder:text-brand-secondary/40 focus:outline-none focus:border-brand-primary text-[13px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="uppercase tracking-wider font-semibold text-[10px] text-brand-secondary">Base Price (Your Target Revenue) (₹)</label>
                  <input
                    type="number"
                    required
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    placeholder="e.g. 35000"
                    className="w-full px-3 py-2.5 rounded-lg border border-brand-border bg-brand-bg text-brand-primary placeholder:text-brand-secondary/40 focus:outline-none focus:border-brand-primary text-[13px]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="uppercase tracking-wider font-semibold text-[10px] text-brand-secondary">Estimated Vendor Price (₹)</label>
                  <div className="w-full px-3 py-2.5 rounded-lg border border-brand-border bg-brand-bg text-[13px] font-semibold text-brand-primary flex items-center">
                    ₹{(parseFloat(basePrice) ? (parseFloat(basePrice) + 10000).toLocaleString("en-IN") : "0")}
                  </div>
                </div>
              </div>
              <span className="text-[10px] text-brand-secondary -mt-2 leading-relaxed">
                * Note: Vendor sees Base Price + default ₹10,000 platform commission. Admins can audit and adjust this markup before publishing.
              </span>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="uppercase tracking-wider font-semibold text-[10px] text-brand-secondary">Traffic Rating (1-10)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="10"
                    required
                    value={expectedTraffic}
                    onChange={(e) => setExpectedTraffic(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-brand-border bg-brand-bg text-brand-primary placeholder:text-brand-secondary/40 focus:outline-none focus:border-brand-primary text-[13px]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="uppercase tracking-wider font-semibold text-[10px] text-brand-secondary">Visibility Rating (1-10)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="10"
                    required
                    value={visibilityScore}
                    onChange={(e) => setVisibilityScore(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-brand-border bg-brand-bg text-brand-primary placeholder:text-brand-secondary/40 focus:outline-none focus:border-brand-primary text-[13px]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="uppercase tracking-wider font-semibold text-[10px] text-brand-secondary">Power Grid Requirements</label>
                <select
                  value={powerGrid}
                  onChange={(e) => setPowerGrid(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-brand-border bg-brand-bg text-brand-primary focus:outline-none focus:border-brand-primary text-[13px]"
                >
                  <option value="Standard (15A)">Standard 15A Socket</option>
                  <option value="Heavy (32A)">Heavy-duty 32A Single Phase</option>
                  <option value="Three Phase">Three Phase Power Grid Setup</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="uppercase tracking-wider font-semibold text-[10px] text-brand-secondary">Stall Space Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Corner stall near entrance, ideal for QSR food brands"
                  rows={2}
                  className="w-full px-3 py-2.5 rounded-lg border border-brand-border bg-brand-bg text-brand-primary placeholder:text-brand-secondary/40 focus:outline-none focus:border-brand-primary text-[13px]"
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setCurrentBox(null);
                  }}
                  className="btn-liquid-glass py-2 px-5 text-[11px]"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="btn-liquid-glass-dark py-2 px-5 text-[11px] flex items-center gap-1.5"
                >
                  {saveLoading ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                  Save Space
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DECORATION MODAL */}
      {showDecorationModal && currentBox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-brand-card border border-brand-border rounded-[24px] max-w-sm w-full p-8 shadow-xl flex flex-col gap-6 font-sans">
            
            <div className="flex flex-col gap-1.5 text-center">
              <h3 className="font-serif text-[22px] font-medium text-brand-primary">Register Layout Element</h3>
              <p className="text-xs text-brand-secondary">Assign tag to custom {toolMode.toLowerCase()} element</p>
            </div>

            <form onSubmit={handleSaveDecoration} className="flex flex-col gap-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="uppercase tracking-wider font-semibold text-[10px] text-brand-secondary">Element Label</label>
                <input
                  type="text"
                  required
                  value={decorationLabel}
                  onChange={(e) => setDecorationLabel(e.target.value)}
                  placeholder="e.g. Main Concert Stage"
                  className="w-full px-3 py-2.5 rounded-lg border border-brand-border bg-brand-bg text-brand-primary placeholder:text-brand-secondary/40 focus:outline-none focus:border-brand-primary text-[13px]"
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowDecorationModal(false);
                    setCurrentBox(null);
                    setDecorationLabel("");
                  }}
                  className="btn-liquid-glass py-2 px-5 text-[11px]"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="btn-liquid-glass-dark py-2 px-5 text-[11px] flex items-center gap-1.5"
                >
                  {saveLoading ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                  Save Element
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}

export default function LayoutMapperPage() {
  return (
    <Suspense fallback={
      <PortalLayout activeTab="my festivals">
        <div className="flex h-96 items-center justify-center">
          <Loader2 size={32} className="animate-spin text-brand-secondary" />
        </div>
      </PortalLayout>
    }>
      <LayoutMapper />
    </Suspense>
  );
}
