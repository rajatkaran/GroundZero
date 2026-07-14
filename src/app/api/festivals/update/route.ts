import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      festivalId,
      name,
      collegeName,
      location,
      startDate,
      endDate,
      expectedFootfall,
      artistLineup,
      demographics,
      bannerUrl,
      galleryUrls,
      defaultStallPrice,
      layoutMapUrl,
      type,
      timeline,
      instagramUrl,
      published
    } = body;

    if (!festivalId || !name || !collegeName || !location || !startDate || !endDate || !expectedFootfall) {
      return NextResponse.json(
        { message: "Missing required festival update parameters." },
        { status: 400 }
      );
    }

    const currentFestival = await prisma.festival.findUnique({
      where: { id: festivalId }
    });

    if (!currentFestival) {
      return NextResponse.json({ message: "Festival not found." }, { status: 404 });
    }

    // 1. Lineup approval logic
    let finalArtistLineup = currentFestival.artistLineup;
    let proposedArtistLineup = currentFestival.proposedArtistLineup;

    if (artistLineup !== undefined) {
      if (artistLineup !== currentFestival.artistLineup) {
        if (currentFestival.published) {
          // If already published, lineup change needs approval
          proposedArtistLineup = artistLineup;
        } else {
          // If not published, can edit directly
          finalArtistLineup = artistLineup || "To be announced";
        }
      }
    }

    // 2. Map & pricing lock logic
    let finalDefaultStallPrice = currentFestival.defaultStallPrice;
    if (defaultStallPrice !== undefined) {
      const incomingPrice = parseFloat(defaultStallPrice);
      if (incomingPrice !== currentFestival.defaultStallPrice) {
        if (currentFestival.mapLocked) {
          finalDefaultStallPrice = currentFestival.defaultStallPrice;
        } else {
          finalDefaultStallPrice = incomingPrice;
        }
      }
    }

    // 3. Media History logs retention
    let mediaHistory = currentFestival.mediaHistory;
    const bannerChanged = bannerUrl !== undefined && bannerUrl !== currentFestival.bannerUrl;
    const galleryChanged = galleryUrls !== undefined && galleryUrls !== currentFestival.galleryUrls;
    if (bannerChanged || galleryChanged) {
      const historyEntry = {
        bannerUrl: currentFestival.bannerUrl,
        galleryUrls: currentFestival.galleryUrls,
        updatedAt: new Date().toISOString()
      };
      let historyList = [];
      if (currentFestival.mediaHistory) {
        try {
          historyList = JSON.parse(currentFestival.mediaHistory);
        } catch (e) {}
      }
      historyList.push(historyEntry);
      mediaHistory = JSON.stringify(historyList);
    }

    const festival = await prisma.festival.update({
      where: { id: festivalId },
      data: {
        name,
        collegeName,
        location,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        expectedFootfall: parseInt(expectedFootfall, 10),
        artistLineup: finalArtistLineup,
        proposedArtistLineup,
        demographics: demographics || "General public and students",
        layoutMapUrl: layoutMapUrl || "/blueprints/mood_indigo_layout.png",
        bannerUrl: bannerUrl || null,
        galleryUrls: galleryUrls || null,
        defaultStallPrice: finalDefaultStallPrice,
        type: type || "FESTIVAL",
        timeline: timeline || "",
        instagramUrl: instagramUrl || null,
        published: published !== undefined ? published : false,
        decks: body.decks !== undefined ? body.decks : currentFestival.decks,
        mediaHistory
      }
    });

    return NextResponse.json(
      { message: "Festival property updated successfully.", festival },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Festival Update API error:", error);
    return NextResponse.json(
      { message: "Internal Server Error.", error: error.message },
      { status: 500 }
    );
  }
}
