import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendReceiptWhatsApp } from "@/lib/whatsapp";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bookingId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = body;

    if (!bookingId) {
      return NextResponse.json({ message: "Missing bookingId." }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });

    if (!booking) {
      return NextResponse.json({ message: "Booking not found." }, { status: 404 });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Verify signature if Razorpay parameters are provided
    if (razorpayOrderId && razorpayPaymentId && razorpaySignature) {
      if (!keySecret) {
        return NextResponse.json(
          { message: "Razorpay configuration secret is missing on server." },
          { status: 500 }
        );
      }

      const generatedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest("hex");

      if (generatedSignature !== razorpaySignature) {
        return NextResponse.json(
          { message: "Cryptographic signature validation failed. Transaction rejected." },
          { status: 400 }
        );
      }
    }

    // Update stall and booking status in a database transaction
    const updatedBooking = await prisma.$transaction(async (tx) => {
      // 1. Lock the stall permanently to BOOKED status
      await tx.stall.update({
        where: { id: booking.stallId },
        data: {
          status: "BOOKED"
        }
      });

      // 1b. Automatically cancel all other pending or negotiating bookings for this stall
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

      // 2. Generate contract url path
      const contractUrl = `/contracts/gz_license_${bookingId}.pdf`;

      // 3. Update the booking status to PAID and save the contract link
      const b = await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: "PAID",
          contractUrl
        }
      });

      // 4. Find the negotiation linked to booking
      const negotiation = await tx.negotiation.findUnique({
        where: { bookingId }
      });

      if (negotiation) {
        // 5. Write final transactional confirmation message to timeline
        await tx.negotiationMessage.create({
          data: {
            negotiationId: negotiation.id,
            senderId: "SYSTEM",
            content: `Transaction successful (Ref: ${razorpayPaymentId || "manual_checkout"}). Stall license issued. Platform volume logged. View or download your PDF Licensing Agreement below.`
          }
        });
      }

      return b;
    });

    // Send simulated WhatsApp Receipt
    const bookingDetails = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        vendor: { include: { profile: true } },
        festival: true,
        stall: true
      }
    });

    if (bookingDetails?.vendor?.profile?.contactPhone) {
      await sendReceiptWhatsApp(
        bookingDetails.vendor.profile.contactPhone,
        bookingDetails.vendor.profile.companyName || "Vendor Representative",
        bookingDetails.festival.name,
        bookingDetails.stall.stallNumber,
        bookingDetails.finalPrice,
        `/contracts?bookingId=${bookingId}`
      ).catch(err => console.error("WhatsApp notification error:", err));
    }

    return NextResponse.json(
      { message: "Payment verified and checkout completed successfully.", booking: updatedBooking },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Payment API error:", error);
    return NextResponse.json(
      { message: "Internal Server Error.", error: error.message },
      { status: 500 }
    );
  }
}
