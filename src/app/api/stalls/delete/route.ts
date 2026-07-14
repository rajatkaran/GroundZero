import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { stallId } = body;

    if (!stallId) {
      return NextResponse.json(
        { message: "Missing stallId parameter." },
        { status: 400 }
      );
    }

    // Delete the stall from the database
    const deletedStall = await prisma.stall.delete({
      where: { id: stallId }
    });

    return NextResponse.json(
      { message: "Stall deleted successfully.", stall: deletedStall },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Stall Delete API error:", error);
    return NextResponse.json(
      { message: "Internal Server Error.", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const stallId = searchParams.get("stallId");

    if (!stallId) {
      return NextResponse.json(
        { message: "Missing stallId parameter." },
        { status: 400 }
      );
    }

    // Delete the stall from the database
    const deletedStall = await prisma.stall.delete({
      where: { id: stallId }
    });

    return NextResponse.json(
      { message: "Stall deleted successfully.", stall: deletedStall },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Stall Delete API error:", error);
    return NextResponse.json(
      { message: "Internal Server Error.", error: error.message },
      { status: 500 }
    );
  }
}
