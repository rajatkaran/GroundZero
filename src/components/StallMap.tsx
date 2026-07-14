"use client";

import { useRef } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface Stall {
  id: string;
  stallNumber: string;
  dimensions: string;
  basePrice: number;
  publicPrice: number;
  status: "AVAILABLE" | "RESERVED" | "NEGOTIATION" | "BOOKED" | "BLOCKED";
  coordinates: string; // JSON string
  expectedTraffic: number;
  visibilityScore: number;
  minSales: number;
  maxSales: number;
}

interface StallMapProps {
  stalls: Stall[];
  selectedStall: Stall | null;
  onSelectStall: (stall: Stall) => void;
  layoutMapUrl?: string | null;
  mapDimensions?: string | null;
}

export default function StallMap({ stalls, selectedStall, onSelectStall, layoutMapUrl, mapDimensions }: StallMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Parse coordinates safely
  const parseCoordinates = (coordStr: string) => {
    try {
      return JSON.parse(coordStr);
    } catch (e) {
      // Return fallback coordinates if parsing fails
      return { type: "rect", x: 100, y: 100, w: 60, h: 60 };
    }
  };

  // Resolve color variables based on status
  const getStallColors = (status: string, isSelected: boolean) => {
    if (isSelected) {
      return {
        fill: "rgba(217, 119, 6, 0.15)",
        stroke: "#D97706",
        strokeWidth: 2.5,
        textColor: "#D97706",
        cursor: "pointer",
        dashArray: "0"
      };
    }

    switch (status) {
      case "AVAILABLE":
        return {
          fill: "rgba(16, 185, 129, 0.12)",
          stroke: "rgba(16, 185, 129, 0.5)",
          strokeWidth: 1.5,
          textColor: isDark ? "#10B981" : "#047857",
          cursor: "pointer",
          dashArray: "0"
        };
      case "BOOKED":
        return {
          fill: isDark ? "#2D2A3E" : "#E5E7EB",
          stroke: isDark ? "#4B5563" : "#D1D5DB",
          strokeWidth: 1,
          textColor: isDark ? "#9CA3AF" : "#6B7280",
          cursor: "pointer",
          dashArray: "0"
        };
      case "NEGOTIATION":
        return {
          fill: "rgba(59, 130, 246, 0.08)",
          stroke: "rgba(59, 130, 246, 0.5)",
          strokeWidth: 1.5,
          textColor: isDark ? "#60A5FA" : "#2563EB",
          cursor: "pointer",
          dashArray: "4, 4"
        };
      case "RESERVED":
        return {
          fill: "rgba(245, 158, 11, 0.08)",
          stroke: "rgba(245, 158, 11, 0.5)",
          strokeWidth: 1.5,
          textColor: isDark ? "#FBBF24" : "#D97706",
          cursor: "pointer",
          dashArray: "0"
        };
      default:
        return {
          fill: isDark ? "#282725" : "#F3F3F3",
          stroke: isDark ? "rgba(245, 239, 230, 0.08)" : "rgba(0, 0, 0, 0.05)",
          strokeWidth: 1,
          textColor: isDark ? "#5F5F63" : "#CCCCCC",
          cursor: "pointer",
          dashArray: "0"
        };
    }
  };

  return (
    <div className="relative border border-brand-border rounded-2xl bg-brand-bg overflow-hidden select-none">
      
      {/* Transformation wrapper for pan and zoom */}
      <TransformWrapper
        initialScale={1}
        initialPositionX={0}
        initialPositionY={0}
        centerOnInit
        minScale={0.5}
        maxScale={3}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            {/* Zoom Controls Overlay */}
            <div className="absolute bottom-6 right-6 z-10 flex gap-2 bg-brand-card border border-brand-border p-2 rounded-full shadow-md">
              <button
                onClick={() => zoomIn()}
                className="p-2 border border-brand-border rounded-full hover:bg-brand-primary/5 text-brand-secondary hover:text-brand-primary transition-all focus:outline-none cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn size={14} />
              </button>
              <button
                onClick={() => zoomOut()}
                className="p-2 border border-brand-border rounded-full hover:bg-brand-primary/5 text-brand-secondary hover:text-brand-primary transition-all focus:outline-none cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut size={14} />
              </button>
              <button
                onClick={() => resetTransform()}
                className="p-2 border border-brand-border rounded-full hover:bg-brand-primary/5 text-brand-secondary hover:text-brand-primary transition-all focus:outline-none cursor-pointer"
                title="Reset Viewport"
              >
                <RotateCcw size={14} />
              </button>
            </div>

            {/* Canvas Area */}
            <TransformComponent wrapperClass="w-full !h-[450px]" contentClass="flex items-center justify-center">
              <div 
                ref={mapRef}
                className="relative bg-brand-card border border-brand-border rounded-xl shadow-inner select-none"
                style={{ 
                  width: "1000px", 
                  height: "600px",
                  backgroundImage: layoutMapUrl ? `url(${layoutMapUrl})` : "none",
                  backgroundSize: "100% 100%",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat"
                }}
              >
                {/* SVG Blueprint Layer */}
                <svg
                  width="1000"
                  height="600"
                  viewBox="0 0 1000 600"
                  className="absolute inset-0 w-full h-full pointer-events-none"
                >
                  {/* Grid Lines Pattern (only shown for default blueprints or blank canvas) */}
                  {(!layoutMapUrl || layoutMapUrl === "/blueprints/mood_indigo_layout.png" || layoutMapUrl === "/blueprints/oasis_layout.png") && (
                    <>
                      <defs>
                        <pattern id="blueprint-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke={isDark ? "rgba(245, 239, 230, 0.02)" : "rgba(0, 0, 0, 0.02)"} strokeWidth="0.5" />
                        </pattern>
                      </defs>
                      <rect width="1000" height="600" fill="url(#blueprint-grid)" />

                      {/* Stage & Walkway guidelines - only for pre-seeded template maps, not for blank canvas */}
                      {(layoutMapUrl === "/blueprints/mood_indigo_layout.png" || layoutMapUrl === "/blueprints/oasis_layout.png") && (
                        <>
                          {/* Stage Alignment */}
                          <rect x="750" y="220" width="160" height="160" fill={isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"} stroke={isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"} rx="8" />
                          <text x="830" y="305" fontFamily="var(--font-playfair), Georgia, serif" fontSize="14" fontWeight="500" fill={isDark ? "rgba(245,239,230,0.35)" : "rgba(0,0,0,0.25)"} textAnchor="middle">
                            MAIN CONCERT STAGE
                          </text>

                          {/* Entry Gate Area */}
                          <line x1="40" y1="100" x2="40" y2="220" stroke={isDark ? "rgba(245, 239, 230, 0.3)" : "rgba(0, 0, 0, 0.2)"} strokeWidth="4" strokeDasharray="6, 6" />
                          <text x="50" y="165" fontFamily="var(--font-dm-sans), sans-serif" fontSize="11" letterSpacing="0.1em" fill={isDark ? "rgba(245, 239, 230, 0.4)" : "rgba(0, 0, 0, 0.3)"} transform="rotate(-90 50 165)" textAnchor="middle">
                            PRIMARY AUDIENCE ENTRY
                          </text>

                          {/* Zone Walkways labels */}
                          <text x="400" y="80" fontFamily="var(--font-dm-sans), sans-serif" fontSize="11" letterSpacing="0.1em" fill={isDark ? "rgba(245, 239, 230, 0.4)" : "rgba(0, 0, 0, 0.25)"}>
                            ZONE A FOOD COURT
                          </text>
                          <text x="400" y="520" fontFamily="var(--font-dm-sans), sans-serif" fontSize="11" letterSpacing="0.1em" fill={isDark ? "rgba(245, 239, 230, 0.4)" : "rgba(0, 0, 0, 0.25)"}>
                            ZONE B CANOPY LOUNGES
                          </text>
                          <path d="M 100 280 L 700 280" fill="none" stroke={isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"} strokeWidth="30" strokeLinecap="round" />
                          <text x="400" y="284" fontFamily="var(--font-dm-sans), sans-serif" fontSize="11" letterSpacing="0.1em" fill={isDark ? "rgba(245, 239, 230, 0.35)" : "rgba(0, 0, 0, 0.2)"} textAnchor="middle">
                            MAIN ARTERY WALKWAY (TRAFFIC FLOW)
                          </text>
                        </>
                      )}
                    </>
                  )}

                  {/* Render Custom Mapped Visual Decorations */}
                  {mapDimensions && (() => {
                    try {
                      const parsed = JSON.parse(mapDimensions);
                      if (parsed && Array.isArray(parsed.decorations)) {
                        return parsed.decorations.map((dec: any, idx: number) => {
                          let fill = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)";
                          let stroke = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
                          let textColor = isDark ? "rgba(245,239,230,0.4)" : "rgba(0,0,0,0.3)";
                          
                          if (dec.type === "stage") {
                            fill = isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)";
                            stroke = isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)";
                          } else if (dec.type === "walkway") {
                            fill = isDark ? "rgba(255, 255, 255, 0.01)" : "rgba(0, 0, 0, 0.015)";
                            stroke = "transparent";
                          } else if (dec.type === "utility") {
                            fill = isDark ? "rgba(96, 165, 250, 0.03)" : "rgba(59, 130, 246, 0.03)";
                            stroke = isDark ? "rgba(96, 165, 250, 0.12)" : "rgba(59, 130, 246, 0.12)";
                            textColor = isDark ? "#60A5FA" : "#2563EB";
                          }
                          
                          return (
                            <g key={`dec-${idx}`}>
                              <rect
                                x={dec.x}
                                y={dec.y}
                                width={dec.w}
                                height={dec.h}
                                fill={fill}
                                stroke={stroke}
                                strokeWidth={1}
                                rx={dec.type === "walkway" ? 0 : 8}
                              />
                              <text
                                x={dec.x + dec.w / 2}
                                y={dec.y + dec.h / 2 + 4}
                                fontFamily="var(--font-dm-sans), sans-serif"
                                fontSize="11"
                                fontWeight="600"
                                fill={textColor}
                                textAnchor="middle"
                                letterSpacing="0.08em"
                              >
                                {dec.label.toUpperCase()}
                              </text>
                            </g>
                          );
                        });
                      }
                    } catch (e) {
                      console.error("Failed to parse map decorations", e);
                    }
                    return null;
                  })()}

                  {/* Interactive overlay bounding boxes for clicks */}
                  {stalls.map((stall) => {
                    const coords = parseCoordinates(stall.coordinates);
                    const isSelected = selectedStall?.id === stall.id;
                    const colors = getStallColors(stall.status, isSelected);

                    if (coords.type === "rect") {
                      return (
                        <g key={stall.id} className="pointer-events-auto select-none" style={{ cursor: colors.cursor }}>
                          {/* Main interactive block */}
                          <rect
                            x={coords.x}
                            y={coords.y}
                            width={coords.w}
                            height={coords.h}
                            fill={colors.fill}
                            stroke={colors.stroke}
                            strokeWidth={colors.strokeWidth}
                            strokeDasharray={colors.dashArray}
                            rx={12}
                            onClick={() => onSelectStall(stall)}
                            className="transition-all duration-300 select-none"
                          />
                          {/* Stall Number label */}
                          <text
                            x={coords.x + coords.w / 2}
                            y={coords.y + coords.h / 2 + 4}
                            fontFamily="var(--font-dm-sans), sans-serif"
                            fontSize="12"
                            fontWeight="600"
                            fill={colors.textColor}
                            textAnchor="middle"
                            onClick={() => onSelectStall(stall)}
                          >
                            {stall.stallNumber}
                          </text>
                        </g>
                      );
                    }
                    return null;
                  })}
                </svg>
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}
