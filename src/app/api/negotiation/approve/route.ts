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

    // 3. Update booking status and write ledger message in transaction
    const booking = await prisma.$transaction(async (tx) => {
      const updatedBooking = await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: "APPROVED"
        }
      });

      await tx.negotiationMessage.create({
        data: {
          negotiationId: negotiation.id,
          senderId: "SYSTEM",
          content: `Stall pricing locked at ₹${updatedBooking.finalPrice.toLocaleString("en-IN")}. Proposal approved by ${name}. Awaiting payment gateway confirmation.`
        }
      });

      return updatedBooking;
    });

    return NextResponse.json(
      { message: "Stall booking proposal approved.", booking },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Negotiation Approve API error:", error);
    return NextResponse.json(
      { message: "Internal Server Error.", error: error.message },
      { status: 500 }
    );
  }
}
