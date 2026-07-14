import { PrismaClient } from "../generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// In local dev, SQLite dev.db is in the project root.
const dbUrl = process.env.DATABASE_URL || "file:dev.db";
const dbAuthToken = process.env.DATABASE_AUTH_TOKEN;

// Instantiate the libSQL driver adapter
const adapter = new PrismaLibSql({
  url: dbUrl,
  authToken: dbAuthToken
});

// Singleton instance wrapper
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
