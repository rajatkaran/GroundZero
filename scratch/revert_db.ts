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
  console.log("Starting database reversion...");

  // Helper to revert artist lineup strings
  const revertLineup = (lineup: string) => {
    if (!lineup) return lineup;
    return lineup
      .replace(/National Pop Artist/gi, "Arijit Singh")
      .replace(/Punjabi Pop Star/gi, "Diljit Dosanjh")
      .replace(/Famous Composer/gi, "Amit Trivedi")
      .replace(/Bollywood Vocalist/gi, "Sunidhi Chauhan")
      .replace(/Award-Winning Vocalist/gi, "Shankar Mahadevan")
      .replace(/Composing Duo/gi, "Salim-Sulaiman")
      .replace(/Top Comic Act/gi, "Zakir Khan")
      .replace(/Leading Hip-Hop Artist/gi, "Divine")
      .replace(/Hip-Hop Artist/gi, "Divine")
      .replace(/Pioneering Bass Producer/gi, "Nucleya")
      .replace(/Bass Producer/gi, "Nucleya")
      .replace(/Sensational Playback Singer/gi, "Jubin Nautiyal")
      .replace(/Playback Singer/gi, "Jubin Nautiyal")
      .replace(/Indie Electronic Musician/gi, "Ritviz")
      .replace(/Electronic Musician/gi, "Ritviz")
      .replace(/Electronic Producer/gi, "Zaeden");
  };

  // 1. Update Festivals
  const fests = await prisma.festival.findMany();
  console.log(`Found ${fests.length} festivals. Reverting...`);
  
  for (const fest of fests) {
    let newName = fest.name;
    let newCollege = fest.collegeName;
    let newLocation = fest.location;
    let newLineup = fest.artistLineup;

    if (fest.collegeName === "Tier-1 Tech Campus") {
      newCollege = "IIT Bombay";
      newLocation = "Mumbai, Maharashtra";
      newName = fest.name.replace(/Cultural Festival/gi, "Mood Indigo");
    } else if (fest.collegeName === "Premier Science Institute") {
      newCollege = "BITS Pilani";
      newLocation = "Pilani, Rajasthan";
      newName = fest.name.replace(/Autumn Festival/gi, "Oasis");
    } else if (fest.collegeName === "Premier Tech Institute") {
      newCollege = "IIT Delhi";
      newLocation = "Hauz Khas, New Delhi";
      newName = fest.name.replace(/Youth Conclave/gi, "Rendezvous");
    }

    newLineup = revertLineup(newLineup);

    console.log(`Reverting festival: ${fest.name} -> ${newName} (${newCollege})`);

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
  console.log(`Found ${profiles.length} profiles. Reverting...`);
  for (const prof of profiles) {
    let newCompanyName = prof.companyName;
    if (prof.companyName.includes("Tier-1 Tech Campus Cultural Committee")) {
      newCompanyName = "IIT Bombay Mood Indigo Committee";
    } else if (prof.companyName.includes("Premier Tech Institute Conclave Committee")) {
      newCompanyName = "IIT Delhi Rendezvous Committee";
    } else if (prof.companyName.includes("National F&B Vendor")) {
      newCompanyName = "Chaayos Teas Ltd";
    } else if (prof.companyName.includes("Premium Food Outlet")) {
      newCompanyName = "Biryani By Kilo";
    }

    if (newCompanyName !== prof.companyName) {
      console.log(`Reverting profile: ${prof.companyName} -> ${newCompanyName}`);
      await prisma.profile.update({
        where: { id: prof.id },
        data: {
          companyName: newCompanyName
        }
      });
    }
  }

  // 3. Update Reviews
  const reviews = await prisma.review.findMany();
  console.log(`Found ${reviews.length} reviews. Reverting...`);
  for (const rev of reviews) {
    let newUserName = rev.userName;
    let newComment = rev.comment;
    let newFestName = rev.festivalName;

    if (rev.userName.includes("Tier-1 Tech Campus Cultural Committee")) {
      newUserName = "IIT Bombay Mood Indigo Committee";
    } else if (rev.userName.includes("Premier Tech Institute Conclave Committee")) {
      newUserName = "IIT Delhi Rendezvous Committee";
    } else if (rev.userName.includes("National F&B Vendor")) {
      newUserName = "Chaayos Teas Ltd";
    } else if (rev.userName.includes("Premium Food Outlet")) {
      newUserName = "Biryani By Kilo";
    }

    newComment = newComment
      .replace(/Cultural Festival/gi, "Mood Indigo")
      .replace(/Autumn Festival/gi, "Oasis")
      .replace(/Youth Conclave/gi, "Rendezvous")
      .replace(/Tier-1 Tech Campus/gi, "IIT Bombay")
      .replace(/Premier Tech Institute/gi, "IIT Delhi")
      .replace(/Premier Science Institute/gi, "BITS Pilani");

    newFestName = newFestName
      .replace(/Cultural Festival/gi, "Mood Indigo")
      .replace(/Autumn Festival/gi, "Oasis")
      .replace(/Youth Conclave/gi, "Rendezvous");

    console.log(`Reverting review comment/names for user: ${rev.userName}`);
    await prisma.review.update({
      where: { id: rev.id },
      data: {
        userName: newUserName,
        comment: newComment,
        festivalName: newFestName
      }
    });
  }

  // 4. Update Stall names
  const stalls = await prisma.stall.findMany();
  console.log(`Found ${stalls.length} stalls. Reverting names...`);
  for (const stall of stalls) {
    let newFestName = stall.festivalName;
    newFestName = newFestName
      .replace(/Cultural Festival/gi, "Mood Indigo")
      .replace(/Autumn Festival/gi, "Oasis")
      .replace(/Youth Conclave/gi, "Rendezvous");

    await prisma.stall.update({
      where: { id: stall.id },
      data: {
        festivalName: newFestName
      }
    });
  }

  console.log("Database reversion complete!");
}

main()
  .catch(err => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
