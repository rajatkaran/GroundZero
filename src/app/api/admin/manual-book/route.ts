import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { festivalId, vendorId, stallId, finalPrice } = body;

    if (!festivalId || !vendorId || !stallId || !finalPrice) {
      return NextResponse.json(
        { message: "Missing manual booking parameters." },
        { status: 400 }
      );
    }

    const stall = await prisma.stall.findUnique({
      where: { id: stallId }
    });

    if (!stall) {
      return NextResponse.json({ message: "Stall not found." }, { status: 404 });
    }

    // Check if vendor exists
    const vendor = await prisma.user.findUnique({
      where: { id: vendorId }
    });

    if (!vendor || vendor.role !== "VENDOR") {
      return NextResponse.json(
        { message: "Selected user is not a valid vendor." },
        { status: 400 }
      );
    }

    // Perform manual booking inside transaction
    const booking = await prisma.$transaction(async (tx) => {
      // 1. Create paid booking
      const newBooking = await tx.booking.create({
        data: {
          festivalId,
          vendorId,
          stallId,
          status: "PAID",
          finalPrice: parseFloat(finalPrice)
        }
      });

      // 2. Lock stall as Booked
      await tx.stall.update({
        where: { id: stallId },
        data: { status: "BOOKED" }
      });

      // 3. Cancel competing bookings
      await tx.booking.updateMany({
        where: {
          stallId,
          id: { not: newBooking.id },
          status: { in: ["PENDING", "NEGOTIATING", "APPROVED"] }
        },
        data: {
          status: "CANCELLED"
        }
      });

      return newBooking;
    });

    return NextResponse.json(
      { message: "Manual stall booking registered successfully.", booking },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Manual Booking API error:", error);
    return NextResponse.json(
      { message: "Internal Server Error.", error: error.message },
      { status: 500 }
    );
  }
}
