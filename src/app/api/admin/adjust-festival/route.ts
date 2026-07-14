import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { festivalId, opportunityScore, stallId, publicPrice, action, deckId } = body;

    // Transactional updates based on provided fields
    const result = await prisma.$transaction(async (tx) => {
      let updatedFestival = null;
      let updatedStall = null;

      if (festivalId) {
        if (action === "approve_lineup") {
          const fest = await tx.festival.findUnique({ where: { id: festivalId } });
          if (fest && fest.proposedArtistLineup) {
            updatedFestival = await tx.festival.update({
              where: { id: festivalId },
              data: {
                artistLineup: fest.proposedArtistLineup,
                proposedArtistLineup: null
              }
            });
          }
        } else if (action === "reject_lineup") {
          updatedFestival = await tx.festival.update({
            where: { id: festivalId },
            data: {
              proposedArtistLineup: null
            }
          });
        } else if (action === "toggle_map_lock") {
          const fest = await tx.festival.findUnique({ where: { id: festivalId } });
          if (fest) {
            updatedFestival = await tx.festival.update({
              where: { id: festivalId },
              data: {
                mapLocked: !fest.mapLocked
              }
            });
          }
        } else if (action === "approve_deck" && deckId) {
          const fest = await tx.festival.findUnique({ where: { id: festivalId } });
          if (fest && fest.decks) {
            let deckArray = JSON.parse(fest.decks);
            deckArray = deckArray.map((d: any) => {
              if (d.id === deckId) {
                return { ...d, status: "APPROVED" };
              }
              return d;
            });
            updatedFestival = await tx.festival.update({
              where: { id: festivalId },
              data: {
                decks: JSON.stringify(deckArray)
              }
            });
          }
        } else if (action === "reject_deck" && deckId) {
          const fest = await tx.festival.findUnique({ where: { id: festivalId } });
          if (fest && fest.decks) {
            let deckArray = JSON.parse(fest.decks);
            deckArray = deckArray.map((d: any) => {
              if (d.id === deckId) {
                return { ...d, status: "REJECTED" };
              }
              return d;
            });
            updatedFestival = await tx.festival.update({
              where: { id: festivalId },
              data: {
                decks: JSON.stringify(deckArray)
              }
            });
          }
        } else if (opportunityScore !== undefined) {
          updatedFestival = await tx.festival.update({
            where: { id: festivalId },
            data: {
              opportunityScore: parseInt(opportunityScore, 10)
            }
          });
        }
      }

      if (stallId) {
        const stall = await tx.stall.findUnique({ where: { id: stallId } });
        if (stall) {
          let updates: any = {};
          if (body.commissionAmount !== undefined) {
            const comm = parseFloat(body.commissionAmount);
            updates.commissionAmount = comm;
            updates.publicPrice = stall.basePrice + comm;
          } else if (publicPrice !== undefined) {
            const pubPrice = parseFloat(publicPrice);
            updates.publicPrice = pubPrice;
            updates.commissionAmount = pubPrice - stall.basePrice;
          }

          if (Object.keys(updates).length > 0) {
            const traffic = stall.expectedTraffic;
            const visibility = stall.visibilityScore;
            const finalPrice = updates.publicPrice;
            updates.minSales = Math.round(finalPrice * (2.0 + (traffic * 0.1) + (visibility * 0.1)));
            updates.maxSales = Math.round(finalPrice * (3.5 + (traffic * 0.2) + (visibility * 0.2)));

            updatedStall = await tx.stall.update({
              where: { id: stallId },
              data: updates
            });
          }
        }
      }

      return { updatedFestival, updatedStall };
    });

    return NextResponse.json(
      { message: "Administrative adjustment applied successfully.", result },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Admin adjustment API error:", error);
    return NextResponse.json(
      { message: "Internal Server Error.", error: error.message },
      { status: 500 }
    );
  }
}
