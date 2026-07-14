import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendBookingConfirmationWhatsApp } from "@/lib/whatsapp";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { festivalId, vendorId, stallId, action } = body;

    if (!festivalId || !vendorId || !stallId || !action) {
      return NextResponse.json(
        { message: "Missing required booking transaction parameters." },
        { status: 400 }
      );
    }

    // Begin database transaction sequence to prevent double bookings
    const result = await prisma.$transaction(async (tx) => {
      // 1. Fetch the stall and verify its availability
      const stall = await tx.stall.findUnique({
        where: { id: stallId }
      });

      if (!stall) {
        throw new Error("Stall not found.");
      }

      if (stall.status !== "AVAILABLE" && stall.status !== "NEGOTIATION") {
        throw new Error("STALL_OCCUPIED: Stall is already booked or reserved.");
      }

      // 2. Lock the stall by updating its status to NEGOTIATION if currently AVAILABLE
      if (stall.status === "AVAILABLE") {
        await tx.stall.update({
          where: { id: stallId },
          data: {
            status: "NEGOTIATION"
          }
        });
      }

      // 3. Create the Booking entry
      const booking = await tx.booking.create({
        data: {
          festivalId,
          vendorId,
          stallId,
          status: action === "book" ? "PENDING" : "NEGOTIATING",
          finalPrice: stall.publicPrice
        }
      });

      // 4. Create the Negotiation timeline thread
      const negotiation = await tx.negotiation.create({
        data: {
          bookingId: booking.id
        }
      });

      // Fetch the organizer ID for this festival to add them as participant
      const festival = await tx.festival.findUnique({
        where: { id: festivalId }
      });

      if (!festival) {
        throw new Error("Festival not found.");
      }

      // 5. Register participants in the negotiation hub (Vendor and Organizer)
      await tx.negotiationParticipant.create({
        data: {
          negotiationId: negotiation.id,
          userId: vendorId
        }
      });

      await tx.negotiationParticipant.create({
        data: {
          negotiationId: negotiation.id,
          userId: festival.organizerId
        }
      });

      // 6. Write the initial ledger message in the negotiation timeline
      const content = action === "book" 
        ? `Booking interest registered at public listing price of ₹${stall.publicPrice.toLocaleString("en-IN")}. Awaiting organizer approval.` 
        : `Price negotiation proposal initiated by vendor. Awaiting organizer review.`;

      await tx.negotiationMessage.create({
        data: {
          negotiationId: negotiation.id,
          senderId: vendorId,
          content,
          proposedPrice: stall.publicPrice
        }
      });

      return { booking, negotiation };
    });

    // Send simulated WhatsApp notification
    const vendorUser = await prisma.user.findUnique({
      where: { id: vendorId },
      include: { profile: true }
    });

    const festival = await prisma.festival.findUnique({
      where: { id: festivalId }
    });

    const stall = await prisma.stall.findUnique({
      where: { id: stallId }
    });

    if (vendorUser?.profile?.contactPhone && festival && stall) {
      await sendBookingConfirmationWhatsApp(
        vendorUser.profile.contactPhone,
        vendorUser.profile.companyName || "Vendor Representative",
        festival.name,
        stall.stallNumber,
        result.booking.finalPrice
      ).catch(err => console.error("WhatsApp notification error:", err));
    }

    return NextResponse.json(
      { message: "Booking transaction initiated.", booking: result.booking },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Booking Create API error:", error);
    
    if (error.message.includes("STALL_OCCUPIED")) {
      return NextResponse.json({ message: error.message }, { status: 409 });
    }
    
    return NextResponse.json(
      { message: "Internal Server Error.", error: error.message },
      { status: 500 }
    );
  }
}
