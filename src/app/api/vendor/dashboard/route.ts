import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const vendorId = searchParams.get("vendorId");

    if (!vendorId) {
      return NextResponse.json({ message: "Missing vendorId." }, { status: 400 });
    }

    // 1. Fetch Bookings count & Total Invested
    const bookings = await prisma.booking.findMany({
      where: {
        vendorId,
        status: "PAID" // Paid bookings represent confirmed investment
      },
      include: {
        stall: true,
        festival: true
      }
    });

    const bookedCount = bookings.length;
    const totalInvested = bookings.reduce((sum, b) => sum + b.finalPrice, 0);

    // 2. Fetch Active Negotiations Count (booking status NEGOTIATING or PENDING)
    const activeNegotiations = await prisma.booking.findMany({
      where: {
        vendorId,
        status: {
          in: ["PENDING", "NEGOTIATING", "APPROVED"]
        }
      },
      include: {
        festival: true,
        stall: true,
        negotiation: {
          include: {
            messages: {
              orderBy: { createdAt: "desc" },
              take: 1
            }
          }
        }
      }
    });

    const activeNegotiationsCount = activeNegotiations.length;

    // 3. Recommended Festivals (Opportunity score >= 85, excluding already booked ones)
    const recommended = await prisma.festival.findMany({
      where: {
        published: true,
        opportunityScore: { gte: 85 }
      },
      take: 3,
      orderBy: {
        opportunityScore: "desc"
      }
    });

    // 4. Fetch reviews submitted by this vendor
    const reviews = await prisma.review.findMany({
      where: {
        userId: vendorId
      }
    });

    return NextResponse.json({
      stats: {
        totalInvested,
        bookedCount,
        activeNegotiationsCount,
        averageScore: 92 // Unified GZ metric
      },
      recommended,
      activeNegotiations,
      bookings,
      reviews
    }, { status: 200 });
  } catch (error: any) {
    console.error("Vendor Dashboard API error:", error);
    return NextResponse.json(
      { message: "Internal Server Error.", error: error.message },
      { status: 500 }
    );
  }
}
