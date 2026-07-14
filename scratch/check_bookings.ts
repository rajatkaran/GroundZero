import { prisma } from "../src/lib/db";

async function main() {
  const bookings = await prisma.booking.findMany({
    include: {
      stall: true,
      festival: true
    }
  });

  console.log(`Total Bookings: ${bookings.length}`);
  let sumFinalPrice = 0;
  let sumComm = 0;
  for (const b of bookings) {
    console.log(`Booking ID: ${b.id}, Fest: ${b.festival?.name}, Stall: ${b.stall?.stallNumber}, Status: ${b.status}, FinalPrice: ${b.finalPrice}, CommAmount: ${b.stall?.commissionAmount}`);
    if (b.status === "PAID" || b.status === "APPROVED") {
      sumFinalPrice += b.finalPrice;
      sumComm += b.stall?.commissionAmount || 0;
    }
  }
  console.log(`Sum of PAID/APPROVED FinalPrice: ${sumFinalPrice}`);
  console.log(`Sum of PAID/APPROVED Commission: ${sumComm}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
