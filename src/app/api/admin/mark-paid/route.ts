import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bookingId } = body;

    if (!bookingId) {
      return NextResponse.json(
        { message: "Missing bookingId parameter." },
        { status: 400 }
      );
    }

    // Load booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });

    if (!booking) {
      return NextResponse.json(
        { message: "Booking not found." },
        { status: 404 }
      );
    }

    // Perform transaction to update booking status, stall status, and cancel competing bookings
    const result = await prisma.$transaction(async (tx) => {
      const b = await tx.booking.update({
        where: { id: bookingId },
        data: { status: "PAID" }
      });
      const s = await tx.stall.update({
        where: { id: booking.stallId },
        data: { status: "BOOKED" }
      });
      await tx.booking.updateMany({
        where: {
          stallId: booking.stallId,
          id: { not: bookingId },
          status: { in: ["PENDING", "NEGOTIATING", "APPROVED"] }
        },
        data: {
          status: "CANCELLED"
        }
      });
      return [b, s];
    });

    return NextResponse.json(
      { 
        message: "Booking and stall marked as PAID successfully.", 
        booking: result[0], 
        stall: result[1] 
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Mark Paid API error:", error);
    return NextResponse.json(
      { message: "Internal Server Error.", error: error.message },
      { status: 500 }
    );
  }
}
