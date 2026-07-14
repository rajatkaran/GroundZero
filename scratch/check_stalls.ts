import { prisma } from "../src/lib/db";

async function main() {
  const fests = await prisma.festival.findMany({
    include: {
      stalls: true,
      bookings: true
    }
  });

  for (const f of fests) {
    const totalStalls = f.stalls.length;
    const bookedStallsCount = f.stalls.filter((s: any) => s.status === "BOOKED").length;
    const paidBookingsCount = f.bookings.filter((b: any) => b.status === "PAID").length;
    console.log(`Festival: ${f.name}`);
    console.log(`  Total Stalls in DB: ${totalStalls}`);
    console.log(`  Stalls with status='BOOKED' in DB: ${bookedStallsCount}`);
    console.log(`  Bookings with status='PAID' in DB: ${paidBookingsCount}`);
    for (const s of f.stalls) {
      console.log(`    Stall: ${s.stallNumber}, Status: ${s.status}, Base: ${s.basePrice}, Public: ${s.publicPrice}, Comm: ${s.commissionAmount}`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
