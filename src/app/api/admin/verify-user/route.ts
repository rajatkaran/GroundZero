import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ message: "Missing userId." }, { status: 400 });
    }

    const profile = await prisma.profile.update({
      where: { userId },
      data: {
        verified: true
      }
    });

    return NextResponse.json(
      { message: "User profile verified successfully.", profile },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("User verification API error:", error);
    return NextResponse.json(
      { message: "Internal Server Error.", error: error.message },
      { status: 500 }
    );
  }
}
