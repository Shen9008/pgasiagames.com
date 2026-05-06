/**
 * Rewrites HTML references from assets img .jpg to .webp (same basename).
 * One-shot after build:webp; idempotent if already .webp.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "node_modules") continue;
      walk(full);
      continue;
    }
    if (!e.name.endsWith(".html")) continue;
    let s = fs.readFileSync(full, "utf8");
    const n = s
      .replace(/(\/assets\/img\/[^"'>\s]+\.)jpg\b/g, "$1webp")
      .replace(/(https:\/\/pgasiagames\.com\/assets\/img\/[^"'>\s]+\.)jpg\b/g, "$1webp");
    if (n !== s) {
      fs.writeFileSync(full, n, "utf8");
      console.log("patched", path.relative(root, full));
    }
  }
}

walk(root);
