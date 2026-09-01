import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = "C:/Users/Chia Shen/Downloads/pgasiagames-website";

const ORG_OLD = `{"@type": "Organization", "@id": "https://pgasiagames.com/#organization", "name": "PG Asia Games", "alternateName": ["PGAsia", "PG Asia", "pgasia"], "url": "https://pgasiagames.com/", "description": "PG Asia Games / PGAsia—casino, live dealer tables, and sportsbook for Southeast Asia and select markets.", "logo": {"@type": "ImageObject", "url": "https://pgasiagames.com/assets/logo-main.webp", "contentUrl": "https://pgasiagames.com/assets/logo-main.webp"}, "sameAs": ["https://pgasiagames.com/"]}`;
const ORG_NEW = `{"@type": "Organization", "@id": "https://pgasiagames.com/#organization", "name": "PG Asia Games", "legalName": "PG Asia Games", "alternateName": ["PGAsia", "PG Asia", "pgasia"], "url": "https://pgasiagames.com/", "description": "PG Asia Games / PGAsia — licensed online casino and sportsbook at pgasiagames.com for Southeast Asia.", "logo": {"@type": "ImageObject", "url": "https://pgasiagames.com/assets/logo-main.webp", "contentUrl": "https://pgasiagames.com/assets/logo-main.webp"}, "sameAs": ["https://pgasiagames.com/", "https://pgasiagames.com/about-us/"]}`;

// Pages that just need org fix, promo removal, and dateModified on WebPage
const SECONDARY = [
  `${ROOT}/help-center/index.html`,
  `${ROOT}/terms-conditions/index.html`,
  `${ROOT}/sitemap/index.html`,
];

for (const file of SECONDARY) {
  let content = fs.readFileSync(file, "utf8");

  // Fix org
  if (content.includes(ORG_OLD)) {
    content = content.replace(ORG_OLD, ORG_NEW);
    console.log(`Org fixed: ${file}`);
  }

  // Remove promo banners
  content = content.replace(/\s*<div id="partial-1xbet-promo"><\/div>\s*/g, "\n        ");
  content = content.replace(/\s*<div id="partial-1xbet-promo-bottom"><\/div>\s*/g, "\n    ");
  content = content.replace(/\s*<div id="partial-1xbet-promo-mid"><\/div>\s*/g, "\n\n                    ");

  // Add dateModified to any WebPage/AboutPage in schema if not already there
  if (!content.includes('"dateModified"')) {
    content = content.replace(
      /"inLanguage": "en", "isPartOf"/g,
      '"dateModified": "2026-09-01", "lastReviewed": "2026-09-01", "inLanguage": "en", "isPartOf"'
    );
    console.log(`dateModified added: ${file}`);
  }

  fs.writeFileSync(file, content, "utf8");
  console.log(`Saved: ${file}`);
}

console.log("Secondary pages done.");
