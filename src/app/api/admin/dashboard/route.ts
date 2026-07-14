import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    // 1. Fetch unpublished festivals needing review
    const pendingFestivals = await prisma.festival.findMany({
      where: {
        published: false
      },
      include: {
        organizer: {
          select: {
            email: true,
            profile: true
          }
        }
      }
    });

    // 2. Fetch unverified users/profiles
    const pendingUsers = await prisma.user.findMany({
      where: {
        profile: {
          verified: false
        }
      },
      include: {
        profile: true
      }
    });

    // 3. Fetch all bookings for transaction review
    const bookings = await prisma.booking.findMany({
      include: {
        festival: true,
        stall: true,
        vendor: {
          select: {
            email: true,
            profile: true
          }
        },
        negotiation: {
          include: {
            messages: {
              orderBy: {
                createdAt: "asc"
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    // 4. Calculate stats robustly scanning all stalls in addition to bookings
    const allStalls = await prisma.stall.findMany({
      include: {
        bookings: {
          where: {
            status: { in: ["PAID", "APPROVED"] }
          }
        }
      }
    });

    let totalVolume = 0;
    let totalProfit = 0;

    for (const stall of allStalls) {
      const activeBooking = stall.bookings[0];
      if (stall.status === "BOOKED" || activeBooking) {
        const finalPrice = activeBooking ? activeBooking.finalPrice : stall.publicPrice;
        const profitVal = activeBooking ? (activeBooking.finalPrice - stall.basePrice) : stall.commissionAmount;
        totalVolume += finalPrice;
        totalProfit += profitVal;
      }
    }

    const vendorCount = await prisma.user.count({ where: { role: "VENDOR" } });
    const organizerCount = await prisma.user.count({ where: { role: "ORGANIZER" } });

    const activeNegotiationsCount = bookings.filter(
      b => b.status === "NEGOTIATING" || b.status === "PENDING"
    ).length;

    // Fetch published festivals with their stalls for commissions management
    const publishedFestivals = await prisma.festival.findMany({
      where: {
        published: true
      },
      include: {
        stalls: true,
        organizer: {
          select: {
            email: true,
            profile: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    // Fetch all users with their full profile and history relations
    const allUsers = await prisma.user.findMany({
      include: {
        profile: true,
        festivals: {
          include: {
            stalls: {
              include: {
                bookings: {
                  include: {
                    vendor: {
                      select: {
                        email: true,
                        profile: true
                      }
                    }
                  }
                }
              }
            }
          }
        },
        bookings: {
          include: {
            festival: true,
            stall: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json({
      stats: {
        totalVolume,
        totalProfit,
        vendorCount,
        organizerCount,
        pendingFestivalsCount: pendingFestivals.length,
        pendingUsersCount: pendingUsers.length,
        activeNegotiationsCount
      },
      pendingFestivals,
      pendingUsers,
      publishedFestivals,
      bookings,
      allUsers
    }, { status: 200 });
  } catch (error: any) {
    console.error("Admin Dashboard API error:", error);
    return NextResponse.json(
      { message: "Internal Server Error.", error: error.message },
      { status: 500 }
    );
  }
}
