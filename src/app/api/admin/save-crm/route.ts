import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, adminFeedback } = body;

    if (!userId) {
      return NextResponse.json(
        { message: "Missing userId parameter." },
        { status: 400 }
      );
    }

    // Update profile adminFeedback
    const profile = await prisma.profile.update({
      where: { userId },
      data: { adminFeedback }
    });

    return NextResponse.json(
      { message: "CRM feedback saved successfully.", profile },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Save CRM API error:", error);
    return NextResponse.json(
      { message: "Internal Server Error.", error: error.message },
      { status: 500 }
    );
  }
}
