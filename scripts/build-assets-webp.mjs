/**
 * Converts JPG/PNG under assets/img/ to sibling .webp files.
 * Run: npm run build:webp
 */
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const imgRoot = path.join(root, "assets", "img");

const RASTER_EXT = new Set([".jpg", ".jpeg", ".png"]);

async function walkConvert(dir) {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      await walkConvert(full);
      continue;
    }
    const ext = path.extname(e.name).toLowerCase();
    if (!RASTER_EXT.has(ext)) continue;
    const dest = full.slice(0, -ext.length) + ".webp";
    await sharp(full)
      .webp({ quality: 82, effort: 6, smartSubsample: true })
      .toFile(dest);
    const st = await fs.promises.stat(dest);
    console.log("ok", path.relative(root, dest), `(${(st.size / 1024).toFixed(1)} KB)`);
  }
}

async function main() {
  if (!fs.existsSync(imgRoot)) {
    console.error("missing:", path.relative(root, imgRoot));
    process.exit(1);
  }
  await walkConvert(imgRoot);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
