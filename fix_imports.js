const fs = require("fs");
const path = require("path");

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach((f) => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

const srcDir = path.join(__dirname, "src");

walkDir(srcDir, (filePath) => {
  // Only process ts, tsx, js, jsx files
  if (!/\.(tsx|ts|js|jsx)$/.test(filePath)) return;

  let content = fs.readFileSync(filePath, "utf8");
  let modified = false;

  // 1. Fix lib/db imports
  const dbRegex = /import\s+([\s\S]*?)\s+from\s+["'](?:\.\.\/)+lib\/db["']/g;
  if (dbRegex.test(content)) {
    content = content.replace(dbRegex, 'import $1 from "@/lib/db"');
    modified = true;
  }

  // 2. Fix lib/seed imports
  const seedRegex = /import\s+([\s\S]*?)\s+from\s+["'](?:\.\.\/)+lib\/seed["']/g;
  if (seedRegex.test(content)) {
    content = content.replace(seedRegex, 'import $1 from "@/lib/seed"');
    modified = true;
  }

  // 3. Fix context/AuthContext imports
  const authRegex = /import\s+([\s\S]*?)\s+from\s+["'](?:\.\.\/)+context\/AuthContext["']/g;
  if (authRegex.test(content)) {
    content = content.replace(authRegex, 'import $1 from "@/context/AuthContext"');
    modified = true;
  }

  // 4. Fix components/PortalLayout imports
  const layoutRegex = /import\s+([\s\S]*?)\s+from\s+["'](?:\.\.\/)+components\/PortalLayout["']/g;
  if (layoutRegex.test(content)) {
    content = content.replace(layoutRegex, 'import $1 from "@/components/PortalLayout"');
    modified = true;
  }

  // 5. Fix components/StallMap imports
  const mapRegex = /import\s+([\s\S]*?)\s+from\s+["'](?:\.\.\/)+components\/StallMap["']/g;
  if (mapRegex.test(content)) {
    content = content.replace(mapRegex, 'import $1 from "@/components/StallMap"');
    modified = true;
  }

  // 6. Fix components/Navigation / Footer if any
  const navRegex = /import\s+([\s\S]*?)\s+from\s+["'](?:\.\.\/)+components\/Navigation["']/g;
  if (navRegex.test(content)) {
    content = content.replace(navRegex, 'import $1 from "@/components/Navigation"');
    modified = true;
  }
  const footerRegex = /import\s+([\s\S]*?)\s+from\s+["'](?:\.\.\/)+components\/Footer["']/g;
  if (footerRegex.test(content)) {
    content = content.replace(footerRegex, 'import $1 from "@/components/Footer"');
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`Updated imports in: ${path.relative(__dirname, filePath)}`);
  }
});

console.log("Import path cleanup completed.");
