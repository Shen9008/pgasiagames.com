#!/usr/bin/env node
/**
 * Priority-4 SEO fixes: meta descriptions, llms.txt link, static footer fallback for crawlers.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const footerFallback = fs.readFileSync(path.join(root, 'partials/footer-fallback.html'), 'utf8').trim();

const descriptionMap = new Map([
  [
    "Claim PGAsia's 100% first-deposit match + up to 10% daily cashback. VIP tiers, free spins & acca boosts. Read terms in cashier before opting in.",
    'PGAsia bonuses: 100% welcome match, cashback & VIP perks. Read wagering terms in the cashier. 18+ only.',
  ],
  [
    'Spin 1,000+ slots at PGAsia — Megaways, progressives, Hold & Win from Pragmatic Play, NetEnt, BTG & 40+ studios. High RTP. Play now at pgasiagames.com.',
    '1,000+ PGAsia slots — Megaways, jackpots & Hold & Win from 40+ studios. High RTP titles at pgasiagames.com. 18+.',
  ],
  [
    'Play 150+ live dealer tables at PGAsia — Teen Patti, Andar Bahar, Baccarat with roads, Dragon Tiger. HD streams, real dealers, 24/7 at pgasiagames.com.',
    'PGAsia live casino: Teen Patti, Baccarat & Dragon Tiger with HD streams. 150+ tables at pgasiagames.com. 18+.',
  ],
  [
    'Bet on 85+ sports at PGAsia — EPL, Champions League, IPL, NBA, CS2 & Dota 2. Asian Handicap, in-play & cash-out. Register at pgasiagames.com.',
    'Bet EPL, IPL, NBA & eSports at PGAsia. Asian Handicap, in-play odds & cash-out at pgasiagames.com. 18+.',
  ],
  [
    'Set deposit & loss limits, request self-exclusion or take a break at PGAsia. Free support via BeGambleAware, GamCare & Gambling Therapy. pgasiagames.com.',
    'Set deposit limits & self-exclusion at PGAsia. Free support via BeGambleAware & GamCare. 18+ only.',
  ],
  [
    'PGAsia is a licensed online casino & sportsbook built for Asia. 1,200+ games, local e-wallets (MYR/THB/VND), 24/7 support. Play with confidence at pgasiagames.com.',
    'PGAsia: licensed casino & sportsbook for Asia. 1,200+ games, local wallets & 24/7 support. 18+ only.',
  ],
  [
    'PGAsia editorial standards: how we research casino guides, review accuracy, disclose affiliates, and correct errors on pgasiagames.com.',
    'How PGAsia researches guides, discloses affiliates, and corrects errors on pgasiagames.com.',
  ],
  [
    "Read PGAsia's privacy policy: what data we collect, how we use cookies, KYC storage, marketing preferences and your rights at pgasiagames.com.",
    'PGAsia privacy policy: cookies, KYC data, marketing choices and your rights at pgasiagames.com.',
  ],
]);

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === '_site' || entry.name === 'dist') {
      continue;
    }
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.html$/i.test(entry.name)) out.push(full);
  }
  return out;
}

function replaceDescriptions(html) {
  let next = html;
  for (const [oldDesc, newDesc] of descriptionMap) {
    next = next.split(oldDesc).join(newDesc);
  }
  return next;
}

function injectLlmsLink(html) {
  if (html.includes('rel="llms"')) return html;
  const tag = '    <link rel="llms" href="/llms.txt">\r\n';
  if (html.includes('<link rel="canonical"')) {
    return html.replace(/(<link rel="canonical"[^>]*>\r?\n)/, `$1${tag}`);
  }
  if (html.includes('<link rel="icon"')) {
    return html.replace(/(<link rel="icon"[^>]*>\r?\n)/, `$1${tag}`);
  }
  return html.replace('</head>', `${tag}</head>`);
}

function injectFooterFallback(html) {
  if (html.includes('footer--fallback')) return html;
  const emptyDiv = '<div id="partial-footer"></div>';
  const filled = `<div id="partial-footer">\n${footerFallback}\n</div>`;
  if (html.includes(emptyDiv)) {
    return html.replace(emptyDiv, filled);
  }
  return html.replace(
    /<div id="partial-footer">\s*<\/div>/,
    filled
  );
}

function fixBonusOgDimensions(html) {
  if (!html.includes('heroes/bonus-1200.webp')) return html;
  return html
    .replace(/<meta property="og:image:width" content="567">/, '<meta property="og:image:width" content="1200">')
    .replace(/<meta property="og:image:height" content="557">/, '<meta property="og:image:height" content="640">');
}

let updated = 0;

for (const file of walk(root)) {
  if (file.includes(`${path.sep}seo-content${path.sep}`)) continue;

  let html = fs.readFileSync(file, 'utf8');
  const original = html;

  html = replaceDescriptions(html);
  html = injectLlmsLink(html);
  html = injectFooterFallback(html);
  html = fixBonusOgDimensions(html);

  if (html !== original) {
    fs.writeFileSync(file, html, 'utf8');
    updated++;
    console.log('updated', path.relative(root, file));
  }
}

console.log(`Priority-4 bulk updates applied to ${updated} file(s)`);
