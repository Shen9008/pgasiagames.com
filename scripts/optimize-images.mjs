import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.dirname(__dirname);
const srcRoot = path.join(root, "images");
const outRoot = path.join(root, "images", "webp");

/** @type {{ src: string, outs: { rel: string, width: number, height?: number, quality?: number }[] }[]} */
const jobs = [
  { src: "Hero Banners/Home.jpg", outs: [
    { rel: "heroes/home-1920.webp", width: 1920, height: 640, quality: 82 },
    { rel: "heroes/home-1200.webp", width: 1200, height: 400, quality: 82 },
  ]},
  { src: "Hero Banners/About.jpg", outs: [
    { rel: "heroes/about-1920.webp", width: 1920, height: 640, quality: 82 },
    { rel: "heroes/about-1200.webp", width: 1200, height: 400, quality: 82 },
  ]},
  { src: "Hero Banners/Bonus.jpg", outs: [
    { rel: "heroes/bonus-1920.webp", width: 1920, height: 640, quality: 82 },
    { rel: "heroes/bonus-1200.webp", width: 1200, height: 400, quality: 82 },
  ]},
  { src: "Hero Banners/Help.jpg", outs: [
    { rel: "heroes/help-1920.webp", width: 1920, height: 640, quality: 82 },
    { rel: "heroes/help-1200.webp", width: 1200, height: 400, quality: 82 },
  ]},
  { src: "Hero Banners/Live Casino.jpg", outs: [
    { rel: "heroes/live-casino-1920.webp", width: 1920, height: 640, quality: 82 },
    { rel: "heroes/live-casino-1200.webp", width: 1200, height: 400, quality: 82 },
  ]},
  { src: "Hero Banners/Slots.jpg", outs: [
    { rel: "heroes/slots-1920.webp", width: 1920, height: 640, quality: 82 },
    { rel: "heroes/slots-1200.webp", width: 1200, height: 400, quality: 82 },
  ]},
  { src: "Hero Banners/Sports.jpg", outs: [
    { rel: "heroes/sports-1920.webp", width: 1920, height: 640, quality: 82 },
    { rel: "heroes/sports-1200.webp", width: 1200, height: 400, quality: 82 },
  ]},
  { src: "Home/Chase Life-Changing Jackpots/Mega Moolah.jpg", outs: [
    { rel: "jackpots/mega-moolah-600.webp", width: 600, height: 400, quality: 80 },
    { rel: "jackpots/mega-moolah-1200.webp", width: 1200, height: 800, quality: 80 },
  ]},
  { src: "Home/Chase Life-Changing Jackpots/Mega Fortune.jpg", outs: [
    { rel: "jackpots/mega-fortune-600.webp", width: 600, height: 400, quality: 80 },
    { rel: "jackpots/mega-fortune-1200.webp", width: 1200, height: 800, quality: 80 },
  ]},
  { src: "Home/Chase Life-Changing Jackpots/divine fortune.jpg", outs: [
    { rel: "jackpots/divine-fortune-600.webp", width: 600, height: 400, quality: 80 },
    { rel: "jackpots/divine-fortune-1200.webp", width: 1200, height: 800, quality: 80 },
  ]},
  { src: "Home/Chase Life-Changing Jackpots/mega moolah isis.jpg", outs: [
    { rel: "jackpots/mega-moolah-isis-600.webp", width: 600, height: 400, quality: 80 },
    { rel: "jackpots/mega-moolah-isis-1200.webp", width: 1200, height: 800, quality: 80 },
  ]},
  { src: "Home/Fresh off the reels/Wanted dead or wild.jpg", outs: [
    { rel: "games/wanted-dead-or-wild-400.webp", width: 400, height: 280, quality: 80 },
    { rel: "games/wanted-dead-or-wild-800.webp", width: 800, height: 560, quality: 80 },
  ]},
  { src: "Home/Fresh off the reels/Zeus vs Hades.jpg", outs: [
    { rel: "games/zeus-vs-hades-400.webp", width: 400, height: 280, quality: 80 },
    { rel: "games/zeus-vs-hades-800.webp", width: 800, height: 560, quality: 80 },
  ]},
  { src: "Home/Fresh off the reels/Gonzo_s Quest Megaways.jpg", outs: [
    { rel: "games/gonzos-quest-megaways-400.webp", width: 400, height: 280, quality: 80 },
    { rel: "games/gonzos-quest-megaways-800.webp", width: 800, height: 560, quality: 80 },
  ]},
  { src: "Home/Fresh off the reels/Sugar Rush Xmas.jpg", outs: [
    { rel: "games/sugar-rush-xmas-400.webp", width: 400, height: 280, quality: 80 },
    { rel: "games/sugar-rush-xmas-800.webp", width: 800, height: 560, quality: 80 },
  ]},
  { src: "Game cards/Dynamic Reels.jpg", outs: [
    { rel: "game-cards/dynamic-reels-400.webp", width: 400, height: 280, quality: 80 },
    { rel: "game-cards/dynamic-reels-800.webp", width: 800, height: 560, quality: 80 },
  ]},
  { src: "Game cards/Progressives.jpg", outs: [
    { rel: "game-cards/progressives-400.webp", width: 400, height: 280, quality: 80 },
    { rel: "game-cards/progressives-800.webp", width: 800, height: 560, quality: 80 },
  ]},
  { src: "Game cards/Fruit and bars.jpg", outs: [
    { rel: "game-cards/fruit-and-bars-400.webp", width: 400, height: 280, quality: 80 },
    { rel: "game-cards/fruit-and-bars-800.webp", width: 800, height: 560, quality: 80 },
  ]},
  { src: "Promo Banners/Up to 100_ Welcome Match.jpg", outs: [
    { rel: "promos/welcome-640.webp", width: 640, height: 360, quality: 78 },
    { rel: "promos/welcome-960.webp", width: 960, height: 540, quality: 78 },
  ]},
  { src: "Promo Banners/Up to 10_ Daily Cashback.jpg", outs: [
    { rel: "promos/cashback-640.webp", width: 640, height: 360, quality: 78 },
    { rel: "promos/cashback-960.webp", width: 960, height: 540, quality: 78 },
  ]},
  { src: "Promo Banners/Reload Bonus.jpg", outs: [
    { rel: "promos/reload-640.webp", width: 640, height: 360, quality: 78 },
    { rel: "promos/reload-960.webp", width: 960, height: 540, quality: 78 },
  ]},
  { src: "Promo Banners/Free Spins.jpg", outs: [
    { rel: "promos/spins-640.webp", width: 640, height: 360, quality: 78 },
    { rel: "promos/spins-960.webp", width: 960, height: 540, quality: 78 },
  ]},
  { src: "Promo Banners/Live Casino.jpg", outs: [
    { rel: "promos/live-640.webp", width: 640, height: 360, quality: 78 },
    { rel: "promos/live-960.webp", width: 960, height: 540, quality: 78 },
  ]},
  { src: "Promo Banners/Sportsbook.jpg", outs: [
    { rel: "promos/sports-640.webp", width: 640, height: 360, quality: 78 },
    { rel: "promos/sports-960.webp", width: 960, height: 540, quality: 78 },
  ]},
  { src: "Promo Banners/VIP Club.jpg", outs: [
    { rel: "promos/vip-640.webp", width: 640, height: 360, quality: 78 },
    { rel: "promos/vip-960.webp", width: 960, height: 540, quality: 78 },
  ]},
  { src: "Promo Banners/Refer a Friend.jpg", outs: [
    { rel: "promos/refer-640.webp", width: 640, height: 360, quality: 78 },
    { rel: "promos/refer-960.webp", width: 960, height: 540, quality: 78 },
  ]},
  { src: "favicon.png", outs: [
    { rel: "favicon-192.webp", width: 192, height: 192, quality: 85 },
    { rel: "favicon-512.webp", width: 512, height: 512, quality: 85 },
  ]},
  { src: "logo-main.webp", outs: [
    { rel: "logo-main-240.webp", width: 240, quality: 85 },
  ]},
];

async function processOne(inputPath, outPath, { width, height, quality = 80 }) {
  await fs.promises.mkdir(path.dirname(outPath), { recursive: true });
  let pipeline = sharp(inputPath).rotate();
  if (height) {
    pipeline = pipeline.resize({ width, height, fit: "cover", position: "centre" });
  } else {
    pipeline = pipeline.resize({ width, withoutEnlargement: true });
  }
  await pipeline.webp({ quality, effort: 4 }).toFile(outPath);
  const stat = await fs.promises.stat(outPath);
  return stat.size;
}

let totalIn = 0;
let totalOut = 0;

for (const job of jobs) {
  const inputPath = path.join(srcRoot, job.src);
  if (!fs.existsSync(inputPath)) {
    console.warn("Missing:", job.src);
    continue;
  }
  const inSize = (await fs.promises.stat(inputPath)).size;
  totalIn += inSize;
  for (const out of job.outs) {
    const outPath = path.join(outRoot, out.rel);
    const outSize = await processOne(inputPath, outPath, out);
    totalOut += outSize;
    console.log(`${out.rel}  ${Math.round(outSize / 1024)} KB`);
  }
}

console.log(`\nTotal source: ${Math.round(totalIn / 1024)} KB → WebP output: ${Math.round(totalOut / 1024)} KB`);
