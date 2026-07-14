import * as fs from "fs";
import * as path from "path";

const seedPath = path.join(__dirname, "../src/lib/seed.ts");

function main() {
  console.log("Reading seed.ts...");
  let content = fs.readFileSync(seedPath, "utf8");

  // Perform replacements
  content = content
    .replace(/IIT Bombay/g, "Tier-1 Tech Campus")
    .replace(/IIT Delhi/g, "Premier Tech Institute")
    .replace(/BITS Pilani/g, "Premier Science Institute")
    .replace(/IIT Bombay Mood Indigo Committee/g, "Tier-1 Tech Campus Cultural Committee")
    .replace(/IIT Delhi Rendezvous Committee/g, "Premier Tech Institute Conclave Committee")
    .replace(/Chaayos Teas Ltd/g, "National F&B Vendor")
    .replace(/Mood Indigo/g, "Cultural Festival")
    .replace(/Oasis/g, "Autumn Festival")
    .replace(/Rendezvous/g, "Youth Conclave")
    .replace(/convener@moodindigo\.org/g, "convener@culturalfest.org")
    .replace(/partner@chaayos\.in/g, "partner@nationalbrand.in")
    // Lineups
    .replace(/Arijit Singh, Nucleya, Divine, Salim-Sulaiman/g, "National Pop Artist, Bass Producer, Hip-Hop Artist, Composing Duo")
    .replace(/Amit Trivedi, Sunidhi Chauhan, Shankar Mahadevan/g, "Famous Composer, Bollywood Vocalist, Award-Winning Vocalist")
    .replace(/Vishal-Shekhar, Zakir Khan, Amit Trivedi/g, "Composing Duo, Top Comic Act, Famous Composer")
    .replace(/Divine, Sunidhi Chauhan, Salim-Sulaiman/g, "Leading Hip-Hop Artist, Bollywood Vocalist, Composing Duo")
    .replace(/Jubin Nautiyal, Ritviz/g, "Playback Singer, Electronic Musician")
    .replace(/Nucleya, Zaeden/g, "Bass Producer, Electronic Producer")
    .replace(/Diljit Dosanjh, Divine/g, "Punjabi Pop Star, Hip-Hop Artist");

  console.log("Writing back to seed.ts...");
  fs.writeFileSync(seedPath, content, "utf8");
  console.log("seed.ts successfully anonymized!");
}

main();
