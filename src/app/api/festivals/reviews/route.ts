import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET reviews for a festival
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const festivalId = searchParams.get("festivalId");

    if (!festivalId) {
      return NextResponse.json({ message: "Missing festivalId parameter." }, { status: 400 });
    }

    const reviews = await prisma.review.findMany({
      where: { festivalId },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ reviews }, { status: 200 });
  } catch (error: any) {
    console.error("GET Reviews API error:", error);
    return NextResponse.json(
      { message: "Failed to fetch reviews.", error: error.message },
      { status: 500 }
    );
  }
}

// POST a new review for a festival
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { festivalId, userId, rating, comment } = body;

    if (!festivalId || !userId || !rating || !comment) {
      return NextResponse.json({ message: "Missing required review fields." }, { status: 400 });
    }

    // Resolve reviewer profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true }
    });

    if (!user) {
      return NextResponse.json({ message: "User profile not found." }, { status: 404 });
    }

    const userName = user.profile?.companyName || user.email.split("@")[0];
    const role = user.role;

    // Resolve festival name
    const festival = await prisma.festival.findUnique({
      where: { id: festivalId }
    });

    if (!festival) {
      return NextResponse.json({ message: "Festival not found." }, { status: 404 });
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        festivalId,
        festivalName: festival.name,
        userId,
        userName,
        role,
        rating: parseInt(rating),
        comment
      }
    });

    return NextResponse.json({ message: "Feedback submitted successfully.", review }, { status: 201 });
  } catch (error: any) {
    console.error("POST Review API error:", error);
    return NextResponse.json(
      { message: "Failed to submit review.", error: error.message },
      { status: 500 }
    );
  }
}
