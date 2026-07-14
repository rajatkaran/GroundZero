import { createClient } from "@libsql/client";
import * as fs from "fs";
import * as path from "path";
import "dotenv/config";
import { checkAndSeedDatabase } from "../src/lib/seed";
import { prisma } from "../src/lib/db";

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  const dbAuthToken = process.env.DATABASE_AUTH_TOKEN;

  if (!dbUrl || dbUrl.startsWith("file:")) {
    console.error("Error: DATABASE_URL must be a remote libsql:// cloud URL to deploy to live database.");
    process.exit(1);
  }

  console.log(`Connecting to Turso Database at: ${dbUrl}`);
  const client = createClient({
    url: dbUrl,
    authToken: dbAuthToken
  });

  try {
    console.log("Reading schema_full.sql...");
    const sqlPath = path.join(__dirname, "../prisma/schema_full.sql");
    const sqlContent = fs.readFileSync(sqlPath, "utf-8");

    // Split SQL content into individual statements
    const statements = sqlContent
      .split(";")
      .map(s => s.trim())
      .filter(s => s.length > 0);

    console.log(`Found ${statements.length} SQL statements to execute.`);

    // Drop tables if they exist to start fresh
    const tablesToDrop = [
      "Report",
      "Review",
      "NegotiationMessage",
      "NegotiationParticipant",
      "Negotiation",
      "Booking",
      "Stall",
      "Festival",
      "Profile",
      "User"
    ];

    console.log("Dropping existing tables to ensure clean deploy...");
    for (const table of tablesToDrop) {
      try {
        await client.execute(`DROP TABLE IF EXISTS "${table}"`);
        console.log(`Dropped table "${table}" (if it existed)`);
      } catch (e) {
        console.log(`Note: Could not drop table "${table}":`, e);
      }
    }

    console.log("Executing DDL statements to create tables and indexes...");
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      const firstLine = stmt.split("\n")[0] || stmt;
      console.log(`[Statement ${i + 1}/${statements.length}] Executing: ${firstLine}...`);
      await client.execute(stmt);
    }
    console.log("Database schema successfully deployed to cloud!");

    console.log("Closing direct libsql connection...");
    client.close();

    console.log("Initializing database seed via Prisma client...");
    await checkAndSeedDatabase();
    console.log("Seeding complete!");

    const count = await prisma.festival.count();
    console.log(`Successfully verified live database connection! Festival count in live DB: ${count}`);

  } catch (error) {
    console.error("Deployment failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
