import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const bookingId = searchParams.get("bookingId");
    const requesterRole = searchParams.get("requesterRole");

    if (!bookingId) {
      return NextResponse.json(
        { message: "Missing bookingId parameter." },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        festival: true,
        stall: true,
        vendor: {
          include: {
            profile: true
          }
        }
      }
    });

    if (!booking) {
      return NextResponse.json(
        { message: "Booking not found." },
        { status: 404 }
      );
    }

    // Mask vendor details if requester is an organizer
    if (requesterRole === "ORGANIZER" && booking.vendor) {
      booking.vendor.email = "masked@privacy.groundzero.network";
      if (booking.vendor.profile) {
        booking.vendor.profile.contactPhone = "[Masked for Privacy]";
        booking.vendor.profile.metadata = null;
      }
    }

    // Also get the organizer profile to show as Licensor
    const organizer = await prisma.user.findUnique({
      where: { id: booking.festival.organizerId },
      include: {
        profile: true
      }
    });

    return NextResponse.json({
      booking,
      organizer
    }, { status: 200 });
  } catch (error: any) {
    console.error("Booking Detail API error:", error);
    return NextResponse.json(
      { message: "Internal Server Error.", error: error.message },
      { status: 500 }
    );
  }
}
