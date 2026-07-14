import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { festivalId, defaultCommission } = body;

    if (!festivalId) {
      return NextResponse.json({ message: "Missing festivalId." }, { status: 400 });
    }

    // Set published: true and assign an initial Opportunity Score
    const festival = await prisma.$transaction(async (tx) => {
      const updatedFest = await tx.festival.update({
        where: { id: festivalId },
        data: {
          published: true,
          opportunityScore: Math.floor(Math.random() * 15) + 82 // random initial score between 82 and 96
        }
      });

      const commission = parseFloat(defaultCommission);
      if (!isNaN(commission) && commission >= 0) {
        // Fetch all stalls for this festival
        const stalls = await tx.stall.findMany({
          where: { festivalId }
        });
        
        // Update each stall's commission and public price
        for (const stall of stalls) {
          await tx.stall.update({
            where: { id: stall.id },
            data: {
              commissionAmount: commission,
              publicPrice: stall.basePrice + commission
            }
          });
        }
      }

      return updatedFest;
    });

    return NextResponse.json(
      { message: "Festival approved and published to directory.", festival },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Festival approval API error:", error);
    return NextResponse.json(
      { message: "Internal Server Error.", error: error.message },
      { status: 500 }
    );
  }
}

