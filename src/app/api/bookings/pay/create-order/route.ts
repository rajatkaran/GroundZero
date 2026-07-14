import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bookingId } = body;

    if (!bookingId) {
      return NextResponse.json({ message: "Missing bookingId." }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        festival: true,
        vendor: { include: { profile: true } }
      }
    });

    if (!booking) {
      return NextResponse.json({ message: "Booking not found." }, { status: 404 });
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { message: "Razorpay credentials are not configured on the server." },
        { status: 500 }
      );
    }

    const amountInPaise = Math.round(booking.finalPrice * 100);

    // Call Razorpay API directly using fetch to create order
    const authString = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${authString}`
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: "INR",
        receipt: bookingId.slice(0, 40) // Razorpay receipt parameter limit is 40 chars
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Razorpay order creation failed:", errorText);
      return NextResponse.json(
        { message: "Failed to create order on payment gateway." },
        { status: 500 }
      );
    }

    const order = await response.json();

    return NextResponse.json({
      success: true,
      keyId,
      amount: order.amount,
      currency: order.currency,
      orderId: order.id,
      bookingDetails: {
        eventName: booking.festival.name,
        email: booking.vendor.email,
        phone: booking.vendor.profile?.contactPhone || "",
        companyName: booking.vendor.profile?.companyName || "Vendor"
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error("Order creation route error:", error);
    return NextResponse.json(
      { message: "Internal Server Error.", error: error.message },
      { status: 500 }
    );
  }
}
