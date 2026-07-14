import * as fs from "fs";
import * as path from "path";

const seedPath = path.resolve("./src/lib/seed.ts");

function main() {
  console.log("Reading seed.ts from", seedPath);
  let content = fs.readFileSync(seedPath, "utf8");

  // Perform inverse replacements
  content = content
    .replace(/Tier-1 Tech Campus Cultural Festival Committee/g, "IIT Bombay Mood Indigo Committee")
    .replace(/Tier-1 Tech Campus Cultural Committee/g, "IIT Bombay Mood Indigo Committee")
    .replace(/Premier Tech Institute Conclave Committee/g, "IIT Delhi Rendezvous Committee")
    .replace(/Premier Tech Institute Youth Conclave Committee/g, "IIT Delhi Rendezvous Committee")
    .replace(/Tier-1 Tech Campus/g, "IIT Bombay")
    .replace(/Premier Tech Institute/g, "IIT Delhi")
    .replace(/Premier Science Institute/g, "BITS Pilani")
    .replace(/National F&B Vendor/g, "Chaayos Teas Ltd")
    .replace(/Cultural Festival/g, "Mood Indigo")
    .replace(/Autumn Festival/g, "Oasis")
    .replace(/Youth Conclave/g, "Rendezvous")
    .replace(/convener@culturalfest\.org/g, "convener@moodindigo.org")
    .replace(/partner@nationalbrand\.in/g, "partner@chaayos.in")
    // Lineups (inverse)
    .replace(/National Pop Artist, Bass Producer, Hip-Hop Artist, Composing Duo/g, "Arijit Singh, Nucleya, Divine, Salim-Sulaiman")
    .replace(/Famous Composer, Bollywood Vocalist, Award-Winning Vocalist/g, "Amit Trivedi, Sunidhi Chauhan, Shankar Mahadevan")
    .replace(/Composing Duo, Top Comic Act, Famous Composer/g, "Vishal-Shekhar, Zakir Khan, Amit Trivedi")
    .replace(/Leading Hip-Hop Artist, Bollywood Vocalist, Composing Duo/g, "Divine, Sunidhi Chauhan, Salim-Sulaiman")
    .replace(/Playback Singer, Electronic Musician/g, "Jubin Nautiyal, Ritviz")
    .replace(/Bass Producer, Electronic Producer/g, "Nucleya, Zaeden")
    .replace(/Punjabi Pop Star, Hip-Hop Artist/g, "Diljit Dosanjh, Divine");

  console.log("Writing back to seed.ts...");
  fs.writeFileSync(seedPath, content, "utf8");
  console.log("seed.ts successfully reverted!");
}

main();
