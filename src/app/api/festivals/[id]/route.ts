import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ message: "Missing festival ID." }, { status: 400 });
    }

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    let festival = null;

    if (isUuid) {
      festival = await prisma.festival.findUnique({
        where: { id },
        include: {
          stalls: true,
          organizer: {
            select: {
              profile: true,
              email: true
            }
          }
        }
      });
    } else {
      const allFestivals = await prisma.festival.findMany({
        include: {
          stalls: true,
          organizer: {
            select: {
              profile: true,
              email: true
            }
          }
        }
      });
      festival = allFestivals.find(f => {
        const slug = f.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        const rawSlug = f.name.toLowerCase().replace(/[^a-z0-9]/g, "");
        return slug === id || rawSlug === id || f.name.toLowerCase() === id.replace(/-/g, " ").toLowerCase();
      }) || null;
    }

    if (!festival) {
      return NextResponse.json({ message: "Festival not found." }, { status: 404 });
    }

    // Compute key statistics dynamically
    const totalStalls = festival.stalls.length;
    const availableStalls = festival.stalls.filter(s => s.status === "AVAILABLE").length;
    const bookedStalls = festival.stalls.filter(s => s.status === "BOOKED").length;
    const negotiatingStalls = festival.stalls.filter(s => s.status === "NEGOTIATION").length;

    return NextResponse.json({
      festival,
      metrics: {
        totalStalls,
        availableStalls,
        bookedStalls,
        negotiatingStalls
      }
    }, { status: 200 });
  } catch (error: any) {
    console.error("Festival Detail API error:", error);
    return NextResponse.json(
      { message: "Internal Server Error.", error: error.message },
      { status: 500 }
    );
  }
}
