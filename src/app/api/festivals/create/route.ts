import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      organizerId,
      name,
      collegeName,
      location,
      startDate,
      endDate,
      expectedFootfall,
      artistLineup,
      demographics,
      stallCapacity,
      bannerUrl,
      galleryUrls,
      defaultStallPrice,
      layoutMapUrl,
      type,
      timeline,
      instagramUrl
    } = body;

    if (!organizerId || !name || !collegeName || !location || !startDate || !endDate || !expectedFootfall) {
      return NextResponse.json(
        { message: "Missing required festival registration parameters." },
        { status: 400 }
      );
    }

    const festival = await prisma.festival.create({
      data: {
        organizerId,
        name,
        collegeName,
        location,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        expectedFootfall: parseInt(expectedFootfall, 10),
        artistLineup: artistLineup || "To be announced",
        demographics: demographics || "General public and students",
        opportunityScore: 50, // default score pending audit
        layoutMapUrl: layoutMapUrl || "/blueprints/mood_indigo_layout.png", // custom or default template blueprint
        bannerUrl: bannerUrl || null,
        galleryUrls: galleryUrls || null,
        defaultStallPrice: defaultStallPrice ? parseFloat(defaultStallPrice) : 35000.0,
        mapDimensions: JSON.stringify({ width: 1000, height: 600 }),
        published: false, // Awaiting admin approval
        type: type || "FESTIVAL",
        timeline: timeline || "",
        instagramUrl: instagramUrl || null
      }
    });

    return NextResponse.json(
      { message: "Festival property registered. Pending administrative audit.", festival },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Festival Register API error:", error);
    return NextResponse.json(
      { message: "Internal Server Error.", error: error.message },
      { status: 500 }
    );
  }
}
