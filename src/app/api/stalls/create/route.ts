import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      festivalId,
      stallNumber,
      dimensions,
      basePrice,
      publicPrice,
      coordinates, // JSON string or object
      expectedTraffic,
      visibilityScore,
      description,
      powerGrid
    } = body;

    if (!festivalId || !stallNumber || !dimensions || !basePrice || !coordinates) {
      return NextResponse.json(
        { message: "Missing required stall mapping parameters." },
        { status: 400 }
      );
    }

    // Convert coordinates to string if passed as object
    const coordinatesStr = typeof coordinates === "string" 
      ? coordinates 
      : JSON.stringify(coordinates);

    // Calculate simulated ROI range bounds if not provided
    const traffic = parseFloat(expectedTraffic) || 5.0;
    const visibility = parseFloat(visibilityScore) || 5.0;
    
    // Admin commission markup (defaults to 10,000 if not set)
    const commAmt = parseFloat(body.commissionAmount) || 10000.0;
    const finalPublicPrice = parseFloat(basePrice) + commAmt;

    // Simple ROI heuristics modulated by traffic and visibility
    const minSales = Math.round(finalPublicPrice * (2.0 + (traffic * 0.1) + (visibility * 0.1)));
    const maxSales = Math.round(finalPublicPrice * (3.5 + (traffic * 0.2) + (visibility * 0.2)));

    // Fetch the festival name to populate denormalized festivalName
    const festival = await prisma.festival.findUnique({
      where: { id: festivalId },
      select: { name: true }
    });
    const festivalName = festival?.name || "";

    const stall = await prisma.stall.create({
      data: {
        festivalId,
        festivalName,
        stallNumber,
        dimensions,
        basePrice: parseFloat(basePrice),
        publicPrice: finalPublicPrice,
        commissionAmount: commAmt,
        status: "AVAILABLE",
        coordinates: coordinatesStr,
        expectedTraffic: traffic,
        visibilityScore: visibility,
        minSales,
        maxSales,
        description: description || null,
        powerGrid: powerGrid || "Standard (15A)"
      }
    });

    return NextResponse.json(
      { message: "Stall coordinate mapped successfully.", stall },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Stall Create API error:", error);
    return NextResponse.json(
      { message: "Internal Server Error.", error: error.message },
      { status: 500 }
    );
  }
}
