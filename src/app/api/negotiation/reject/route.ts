import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bookingId, userId } = body;

    if (!bookingId || !userId) {
      return NextResponse.json({ message: "Missing bookingId or userId." }, { status: 400 });
    }

    // 1. Fetch user to get their company/name
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true }
    });

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    const name = user.profile?.companyName || user.email;

    // 2. Fetch negotiation linked to booking
    const negotiation = await prisma.negotiation.findUnique({
      where: { bookingId }
    });

    if (!negotiation) {
      return NextResponse.json({ message: "Negotiation thread not found." }, { status: 404 });
    }

    // 3. Update booking status and write timeline reject message in transaction
    const booking = await prisma.$transaction(async (tx) => {
      const updatedBooking = await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: "CANCELLED"
        }
      });

      await tx.negotiationMessage.create({
        data: {
          negotiationId: negotiation.id,
          senderId: "SYSTEM",
          content: `Proposal rejected by ${name}. Stall booking cancelled.`
        }
      });

      // Check if there are other active negotiations or pending bookings on this stall
      const activeBookingsCount = await tx.booking.count({
        where: {
          stallId: updatedBooking.stallId,
          status: { in: ["PENDING", "NEGOTIATING", "APPROVED"] }
        }
      });

      // If no other active negotiations exist, set the stall status back to AVAILABLE
      if (activeBookingsCount === 0) {
        await tx.stall.update({
          where: { id: updatedBooking.stallId },
          data: {
            status: "AVAILABLE"
          }
        });
      }

      return updatedBooking;
    });

    return NextResponse.json(
      { message: "Stall booking proposal rejected.", booking },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Negotiation Reject API error:", error);
    return NextResponse.json(
      { message: "Internal Server Error.", error: error.message },
      { status: 500 }
    );
  }
}
