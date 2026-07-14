import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const dbUrl = process.env.DATABASE_URL || "file:dev.db";
const dbAuthToken = process.env.DATABASE_AUTH_TOKEN;

// Instantiate the libSQL driver adapter
const adapter = new PrismaLibSql({
  url: dbUrl,
  authToken: dbAuthToken
});

const prisma = new PrismaClient({
  adapter
});

async function main() {
  console.log("Starting database anonymization...");

  // 1. Update Festivals
  const fests = await prisma.festival.findMany();
  console.log(`Found ${fests.length} festivals. Updating...`);
  
  for (const fest of fests) {
    let newName = fest.name;
    let newCollege = fest.collegeName;
    let newLocation = fest.location;
    let newLineup = fest.artistLineup;

    if (fest.collegeName === "IIT Bombay") {
      newCollege = "Tier-1 Tech Campus";
      newLocation = "Mumbai, Maharashtra";
      newName = fest.name.replace(/Mood Indigo/gi, "Cultural Festival");
    } else if (fest.collegeName === "BITS Pilani") {
      newCollege = "Premier Science Institute";
      newLocation = "Pilani, Rajasthan";
      newName = fest.name.replace(/Oasis/gi, "Autumn Festival");
    } else if (fest.collegeName === "IIT Delhi") {
      newCollege = "Premier Tech Institute";
      newLocation = "Hauz Khas, New Delhi";
      newName = fest.name.replace(/Rendezvous/gi, "Youth Conclave");
    }

    // Anonymize artist lineups to avoid legal issues with headliners
    newLineup = newLineup
      .replace(/Arijit Singh/gi, "National Pop Artist")
      .replace(/Diljit Dosanjh/gi, "Punjabi Pop Star")
      .replace(/Amit Trivedi/gi, "Famous Composer")
      .replace(/Sunidhi Chauhan/gi, "Bollywood Vocalist")
      .replace(/Shankar Mahadevan/gi, "Award-Winning Vocalist")
      .replace(/Salim-Sulaiman/gi, "Composing Duo")
      .replace(/Zakir Khan/gi, "Top Comic Act")
      .replace(/Divine/gi, "Leading Hip-Hop Artist")
      .replace(/Nucleya/gi, "Pioneering Bass Producer")
      .replace(/Jubin Nautiyal/gi, "Sensational Playback Singer")
      .replace(/Ritviz/gi, "Indie Electronic Musician");

    await prisma.festival.update({
      where: { id: fest.id },
      data: {
        name: newName,
        collegeName: newCollege,
        location: newLocation,
        artistLineup: newLineup
      }
    });
  }

  // 2. Update Profiles
  const profiles = await prisma.profile.findMany();
  console.log(`Found ${profiles.length} profiles. Updating...`);
  for (const prof of profiles) {
    let newCompanyName = prof.companyName;
    if (prof.companyName.includes("IIT Bombay Mood Indigo")) {
      newCompanyName = "Tier-1 Tech Campus Cultural Committee";
    } else if (prof.companyName.includes("IIT Delhi Rendezvous")) {
      newCompanyName = "Premier Tech Institute Conclave Committee";
    } else if (prof.companyName.includes("Chaayos")) {
      newCompanyName = "National F&B Vendor";
    } else if (prof.companyName.includes("Biryani")) {
      newCompanyName = "Premium Food Outlet";
    }

    await prisma.profile.update({
      where: { id: prof.id },
      data: {
        companyName: newCompanyName
      }
    });
  }

  // 3. Update Reviews
  const reviews = await prisma.review.findMany();
  console.log(`Found ${reviews.length} reviews. Updating...`);
  for (const rev of reviews) {
    let newUserName = rev.userName;
    let newComment = rev.comment;
    let newFestName = rev.festivalName;

    if (rev.userName.includes("IIT Bombay Mood Indigo")) {
      newUserName = "Tier-1 Tech Campus Cultural Committee";
    } else if (rev.userName.includes("IIT Delhi Rendezvous")) {
      newUserName = "Premier Tech Institute Conclave Committee";
    } else if (rev.userName.includes("Chaayos")) {
      newUserName = "National F&B Vendor";
    } else if (rev.userName.includes("Biryani")) {
      newUserName = "Premium Food Outlet";
    }

    newComment = newComment
      .replace(/Mood Indigo/gi, "Cultural Festival")
      .replace(/Oasis/gi, "Autumn Festival")
      .replace(/Rendezvous/gi, "Youth Conclave")
      .replace(/IIT Bombay/gi, "Tier-1 Tech Campus")
      .replace(/IIT Delhi/gi, "Premier Tech Institute")
      .replace(/BITS Pilani/gi, "Premier Science Institute");

    newFestName = newFestName
      .replace(/Mood Indigo/gi, "Cultural Festival")
      .replace(/Oasis/gi, "Autumn Festival")
      .replace(/Rendezvous/gi, "Youth Conclave");

    await prisma.review.update({
      where: { id: rev.id },
      data: {
        userName: newUserName,
        comment: newComment,
        festivalName: newFestName
      }
    });
  }

  // 4. Update Stall names/descriptions if any references exist
  const stalls = await prisma.stall.findMany();
  console.log(`Found ${stalls.length} stalls. Updating names...`);
  for (const stall of stalls) {
    let newFestName = stall.festivalName;
    newFestName = newFestName
      .replace(/Mood Indigo/gi, "Cultural Festival")
      .replace(/Oasis/gi, "Autumn Festival")
      .replace(/Rendezvous/gi, "Youth Conclave");

    await prisma.stall.update({
      where: { id: stall.id },
      data: {
        festivalName: newFestName
      }
    });
  }

  console.log("Database anonymization complete!");
}

main()
  .catch(err => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
