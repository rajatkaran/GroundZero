import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checkAndSeedDatabase } from "@/lib/seed";

export async function GET(req: NextRequest) {
  try {
    // Run seeder in background if empty
    await checkAndSeedDatabase();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const location = searchParams.get("location");
    const minScore = searchParams.get("minScore");
    const minFootfall = searchParams.get("minFootfall");

    // Build Prisma query filters
    const where: any = {
      published: true
    };

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { collegeName: { contains: search } }
      ];
    }

    if (location) {
      where.location = { contains: location };
    }

    if (minScore) {
      where.opportunityScore = { gte: parseInt(minScore, 10) };
    }

    if (minFootfall) {
      where.expectedFootfall = { gte: parseInt(minFootfall, 10) };
    }

    const festivals = await prisma.festival.findMany({
      where,
      include: {
        stalls: true,
        organizer: {
          select: {
            profile: true
          }
        }
      },
      orderBy: {
        opportunityScore: "desc"
      }
    });

    return NextResponse.json({ festivals }, { status: 200 });
  } catch (error: any) {
    console.error("Festivals GET API error:", error);
    return NextResponse.json(
      { message: "Internal Server Error.", error: error.message },
      { status: 500 }
    );
  }
}
