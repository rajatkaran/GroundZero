import { prisma } from "c:/Users/Rajat/antigravity/Ground-Zero/GroundZero/src/lib/db";

async function test() {
  try {
    const organizerId = "258a655d-d330-491b-8d5c-a64ffbb90fcd";
    
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

    const reviews = await prisma.review.findMany({
      where: {
        userId: organizerId
      }
    });

    const responseJSON = {
      stats: {
        totalRevenue,
        occupancy: totalStallsCount > 0 ? Math.round((bookedStallsCount / totalStallsCount) * 100) : 0,
        pendingRequestsCount: pendingRequests.length,
        liveListingsCount
      },
      festivals,
      pendingRequests,
      reviews
    };

    console.log("ORGANIZER DASHBOARD API RESPONSE:");
    console.log(JSON.stringify(responseJSON, null, 2));

  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
