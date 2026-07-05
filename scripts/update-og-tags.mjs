/**
 * update-og-tags.mjs
 * Syncs og:title, og:description, twitter:title, twitter:description
 * to match the already-updated <title> and <meta name="description">.
 * Run: node scripts/update-og-tags.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

// Recursively find all index.html files (excluding node_modules / seo-content)
function findHtml(dir, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (["node_modules", "seo-content", ".git"].includes(entry.name)) continue;
      findHtml(full, results);
    } else if (entry.name === "index.html") {
      results.push(full);
    }
  }
  return results;
}

const files = findHtml(ROOT);
let updated = 0;

for (const filePath of files) {
  let content = fs.readFileSync(filePath, "utf8");

  // Extract current <title> and meta description (already optimised)
  const titleMatch = content.match(/<title>([^<]+)<\/title>/);
  const descMatch = content.match(/name="description"\s+content="([^"]+)"/);

  if (!titleMatch || !descMatch) continue;

  const title = titleMatch[1];
  const desc = descMatch[1];

  const newContent = content
    // og:title
    .replace(
      /(<meta\s+property="og:title"\s+content=")[^"]*(")/,
      `$1${title}$2`
    )
    // og:description
    .replace(
      /(<meta\s+property="og:description"\s+content=")[^"]*(")/,
      `$1${desc}$2`
    )
    // twitter:title
    .replace(
      /(<meta\s+name="twitter:title"\s+content=")[^"]*(")/,
      `$1${title}$2`
    )
    // twitter:description
    .replace(
      /(<meta\s+name="twitter:description"\s+content=")[^"]*(")/,
      `$1${desc}$2`
    );

  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent, "utf8");
    const rel = filePath.replace(ROOT + path.sep, "").replace(/\\/g, "/");
    console.log(`✓ OG synced: ${rel}`);
    updated++;
  }
}

console.log(`\nDone — ${updated} files had OG/Twitter tags synced.`);
