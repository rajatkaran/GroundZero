import { prisma } from "./src/lib/db.ts";

async function main() {
  const users = await prisma.user.findMany({
    include: { profile: true }
  });
  console.log(JSON.stringify(users, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
