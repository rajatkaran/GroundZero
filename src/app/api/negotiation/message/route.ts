import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendNegotiationUpdateWhatsApp } from "@/lib/whatsapp";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bookingId, senderId, content, proposedPrice } = body;

    if (!bookingId || !senderId || !content) {
      return NextResponse.json(
        { message: "Missing required message parameters." },
        { status: 400 }
      );
    }

    // 1. Find the negotiation linked to this booking
    const negotiation = await prisma.negotiation.findUnique({
      where: { bookingId }
    });

    if (!negotiation) {
      return NextResponse.json({ message: "Negotiation thread not found." }, { status: 404 });
    }

    // 2. Perform updates in a database transaction
    const message = await prisma.$transaction(async (tx) => {
      // Create the message
      const msg = await tx.negotiationMessage.create({
        data: {
          negotiationId: negotiation.id,
          senderId,
          content,
          proposedPrice: proposedPrice ? parseFloat(proposedPrice) : null
        }
      });

      // If a new price is proposed, update the booking's final price and flag as negotiating
      if (proposedPrice) {
        await tx.booking.update({
          where: { id: bookingId },
          data: {
            finalPrice: parseFloat(proposedPrice),
            status: "NEGOTIATING"
          }
        });
      }

      return msg;
    });

    // Send WhatsApp notification if the counter offer came from organizer/admin to vendor
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        vendor: { include: { profile: true } },
        festival: true,
        stall: true
      }
    });

    if (booking && senderId !== booking.vendorId && booking.vendor.profile?.contactPhone) {
      const price = proposedPrice ? parseFloat(proposedPrice) : booking.finalPrice;
      await sendNegotiationUpdateWhatsApp(
        booking.vendor.profile.contactPhone,
        booking.vendor.profile.companyName || "Vendor Representative",
        booking.festival.name,
        booking.stall.stallNumber,
        price,
        "Organizer"
      ).catch(err => console.error("WhatsApp notification error:", err));
    }

    return NextResponse.json({ message }, { status: 201 });
  } catch (error: any) {
    console.error("Negotiation Message POST API error:", error);
    return NextResponse.json(
      { message: "Internal Server Error.", error: error.message },
      { status: 500 }
    );
  }
}
