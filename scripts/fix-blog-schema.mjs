import fs from "fs";
import path from "path";

const ROOT = "C:/Users/Chia Shen/Downloads/pgasiagames-website/blog";

// Placeholder author — replace with real name/URL when available
const AUTHOR_NAME = "PGAsia Editorial Team"; // [REPLACE WITH REAL AUTHOR NAME]
const AUTHOR_URL = "https://pgasiagames.com/about-us/";

// Old Organisation author pattern (multi-line aware)
const OLD_ORG_AUTHOR = `    "author": {
      "@type": "Organization",
      "name": "PG Asia Games",
      "url": "https://pgasiagames.com/"
    },`;

const NEW_PERSON_AUTHOR = `    "author": {
      "@type": "Person",
      "name": "${AUTHOR_NAME}",
      "url": "${AUTHOR_URL}"
    },`;

function walkBlogPosts(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const fullPath = path.join(dir, e.name);
    if (e.isDirectory()) {
      // Check if this directory has an index.html (blog post)
      const indexFile = path.join(fullPath, "index.html");
      if (fs.existsSync(indexFile)) {
        results.push(indexFile);
      }
    }
  }
  return results;
}

const blogPosts = walkBlogPosts(ROOT);
console.log(`Found ${blogPosts.length} blog posts`);

let updated = 0;
let skipped = 0;
let alreadyPerson = 0;

for (const file of blogPosts) {
  let content = fs.readFileSync(file, "utf8");

  // Check if already has Person type
  if (content.includes('"@type": "Person"')) {
    alreadyPerson++;
    // Still update to consistent author name/url
  }

  if (content.includes(OLD_ORG_AUTHOR)) {
    content = content.replace(OLD_ORG_AUTHOR, NEW_PERSON_AUTHOR);
    updated++;
  } else {
    skipped++;
    // Try to find any author block variation and fix
    // Some posts may have different whitespace
    const orgAuthorRegex = /"author"\s*:\s*\{\s*"@type"\s*:\s*"Organization"\s*,\s*"name"\s*:\s*"PG Asia Games"\s*,\s*"url"\s*:\s*"https:\/\/pgasiagames\.com\/"\s*\}/g;
    if (orgAuthorRegex.test(content)) {
      content = content.replace(orgAuthorRegex, `"author": {"@type": "Person", "name": "${AUTHOR_NAME}", "url": "${AUTHOR_URL}"}`);
      updated++;
      skipped--;
    }
  }

  // Remove promo banner divs
  content = content.replace(/\s*<div id="partial-1xbet-promo"><\/div>\s*/g, "\n        ");
  content = content.replace(/\s*<div id="partial-1xbet-promo-bottom"><\/div>\s*/g, "\n    ");
  content = content.replace(/\s*<div id="partial-1xbet-promo-mid"><\/div>\s*/g, "\n\n                    ");

  fs.writeFileSync(file, content, "utf8");
}

console.log(`Updated: ${updated}`);
console.log(`Skipped (different format): ${skipped}`);
console.log(`Already had Person type: ${alreadyPerson}`);
console.log("Done.");
