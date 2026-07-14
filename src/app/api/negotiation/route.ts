import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const bookingId = searchParams.get("bookingId");
    const requesterRole = searchParams.get("requesterRole");

    if (!bookingId) {
      return NextResponse.json({ message: "Missing bookingId." }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        festival: true,
        stall: true,
        vendor: {
          select: {
            id: true,
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
            },
            participants: {
              include: {
                user: {
                  select: {
                    id: true,
                    email: true,
                    role: true,
                    profile: {
                      select: {
                        companyName: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!booking) {
      return NextResponse.json({ message: "Booking thread not found." }, { status: 404 });
    }

    // Mask vendor details if requester is an organizer
    if (requesterRole === "ORGANIZER" && booking.vendor) {
      booking.vendor.email = "masked@privacy.groundzero.network";
      if (booking.vendor.profile) {
        booking.vendor.profile.contactPhone = "[Masked for Privacy]";
        booking.vendor.profile.metadata = null;
      }
    }

    return NextResponse.json({ booking }, { status: 200 });
  } catch (error: any) {
    console.error("Negotiation GET API error:", error);
    return NextResponse.json(
      { message: "Internal Server Error.", error: error.message },
      { status: 500 }
    );
  }
}
