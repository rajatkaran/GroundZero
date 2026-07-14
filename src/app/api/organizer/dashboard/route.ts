import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const organizerId = searchParams.get("organizerId");

    if (!organizerId) {
      return NextResponse.json({ message: "Missing organizerId." }, { status: 400 });
    }

    // 1. Fetch organizer's festivals
    const festivals = await prisma.festival.findMany({
      where: {
        organizerId
      },
      include: {
        stalls: true,
        bookings: {
          include: {
            vendor: {
              select: {
                id: true,
                profile: {
                  select: {
                    companyName: true,
                    category: true
                  }
                }
              }
            },
            stall: true
          }
        }
      }
    });

    // 2. Compute statistics
    let totalRevenue = 0;
    let totalStallsCount = 0;
    let bookedStallsCount = 0;
    const liveListingsCount = festivals.filter(f => f.published).length;
    
    const pendingRequests: any[] = [];

    for (const fest of festivals) {
      totalStallsCount += fest.stalls.length;
      
      for (const booking of fest.bookings) {
        if (booking.status === "PAID" || booking.status === "APPROVED") {
          totalRevenue += booking.finalPrice;
        }
        
        if (booking.status === "PAID" || booking.status === "APPROVED" || booking.status === "NEGOTIATING" || booking.status === "PENDING") {
          // A stall is occupied or held if it is not cancelled
          // Let's count booked stalls specifically as status PAID
          if (booking.status === "PAID") {
            bookedStallsCount++;
          }
        }

        if (booking.status === "PENDING" || booking.status === "NEGOTIATING") {
          pendingRequests.push({
            id: booking.id,
            festivalName: fest.name,
            stallNumber: booking.stall.stallNumber,
            dimensions: booking.stall.dimensions,
            vendorName: booking.vendor.profile?.companyName || `Vendor #${booking.vendor.id.substring(0, 8)}`,
            status: booking.status,
            finalPrice: booking.finalPrice,
            createdAt: booking.createdAt
          });
        }
      }
    }

    // Fetch reviews submitted by this organizer
    const reviews = await prisma.review.findMany({
      where: {
        userId: organizerId
      }
    });

    return NextResponse.json({
      stats: {
        totalRevenue,
        occupancy: totalStallsCount > 0 ? Math.round((bookedStallsCount / totalStallsCount) * 100) : 0,
        pendingRequestsCount: pendingRequests.length,
        liveListingsCount
      },
      festivals,
      pendingRequests,
      reviews
    }, { status: 200 });
  } catch (error: any) {
    console.error("Organizer Dashboard API error:", error);
    return NextResponse.json(
      { message: "Internal Server Error.", error: error.message },
      { status: 500 }
    );
  }
}
