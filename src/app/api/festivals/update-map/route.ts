import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { festivalId, mapDimensions } = body;

    if (!festivalId) {
      return NextResponse.json(
        { message: "Missing required festivalId parameter." },
        { status: 400 }
      );
    }

    const currentFestival = await prisma.festival.findUnique({
      where: { id: festivalId }
    });

    if (!currentFestival) {
      return NextResponse.json(
        { message: "Festival not found." },
        { status: 404 }
      );
    }

    if (currentFestival.mapLocked) {
      return NextResponse.json(
        { message: "Map layout and stall pricing are locked. Cannot update." },
        { status: 403 }
      );
    }

    let mapLayoutHistory = currentFestival.mapLayoutHistory;
    if (currentFestival.mapDimensions) {
      const historyEntry = {
        mapDimensions: currentFestival.mapDimensions,
        updatedAt: new Date().toISOString()
      };
      let historyList = [];
      if (currentFestival.mapLayoutHistory) {
        try {
          historyList = JSON.parse(currentFestival.mapLayoutHistory);
        } catch (e) {}
      }
      historyList.push(historyEntry);
      mapLayoutHistory = JSON.stringify(historyList);
    }

    const festival = await prisma.festival.update({
      where: { id: festivalId },
      data: {
        mapDimensions: mapDimensions || null,
        mapLayoutHistory
      }
    });

    return NextResponse.json(
      { message: "Festival map layout updated successfully.", festival },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Festival Update Map API error:", error);
    return NextResponse.json(
      { message: "Internal Server Error.", error: error.message },
      { status: 500 }
    );
  }
}
