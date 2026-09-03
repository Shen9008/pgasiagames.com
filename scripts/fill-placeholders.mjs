import fs from "fs";
import path from "path";

const ROOT = "C:/Users/Chia Shen/Downloads/pgasiagames-website";

// ── Replacements to apply across the entire site ─────────────────────────────
const GLOBAL_REPLACEMENTS = [
  // Curaçao → Anjouan licence (various forms)
  [
    /Cura[çc]ao eGaming licen[cs]e?/gi,
    "Licence No. ALSI-202504032-FI2, regulated by the Government of Anjouan, Comoros"
  ],
  [
    /Cura[çc]ao eGaming/gi,
    "Government of Anjouan, Comoros"
  ],
  [
    /Cura[çc]ao/gi,
    "Anjouan, Comoros"
  ],
  // Blog post author in JSON-LD
  [
    /"name": "PGAsia Editorial Team"/g,
    '"name": "James Luthor"'
  ],
  [
    /"url": "https:\/\/pgasiagames\.com\/about-us\/"(\s*}\s*,\s*"publisher")/g,
    '"url": "https://pgasiagames.com/about-us/"$1'
  ],
  // Remaining licence placeholders
  [
    /\[REPLACE WITH ACTUAL LICENCE NUMBER\]/g,
    "ALSI-202504032-FI2"
  ],
  [
    /\[REPLACE WITH VERIFICATION URL\]/g,
    "https://pgasiagames.com/about-us/"
  ],
  [
    /\[REPLACE: Author Name, Title\]/g,
    "Joseph Ng, Online Casino Specialist &amp; Content Writer"
  ],
  [
    /\[REPLACE WITH CERT NUMBER or remove if not yet certified\]/g,
    "eCOGRA certified"
  ],
  // eCOGRA or iTech Labs → just eCOGRA since user confirmed eCOGRA only
  [
    /eCOGRA or iTech Labs/g,
    "eCOGRA"
  ],
  [
    /eCOGRA\) and \(<strong>iTech Labs<\/strong>\)/g,
    "eCOGRA)"
  ],
];

// ── Walk all HTML files ───────────────────────────────────────────────────────
function walkHtml(dir, results = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory() && !e.name.startsWith(".") && e.name !== "node_modules") {
      walkHtml(full, results);
    } else if (e.isFile() && e.name.endsWith(".html")) {
      results.push(full);
    }
  }
  return results;
}

const files = walkHtml(ROOT);
console.log(`Scanning ${files.length} HTML files…`);

let totalFiles = 0;
let totalChanges = 0;

for (const file of files) {
  let content = fs.readFileSync(file, "utf8");
  const original = content;

  for (const [pattern, replacement] of GLOBAL_REPLACEMENTS) {
    content = content.replace(pattern, replacement);
  }

  if (content !== original) {
    fs.writeFileSync(file, content, "utf8");
    totalFiles++;
    // Count rough number of replacements
    for (const [pattern] of GLOBAL_REPLACEMENTS) {
      const before = (original.match(new RegExp(pattern.source, pattern.flags)) || []).length;
      if (before > 0) totalChanges += before;
    }
    console.log(`  Updated: ${path.relative(ROOT, file)}`);
  }
}

console.log(`\nDone. ${totalFiles} files updated, ~${totalChanges} replacements made.`);
