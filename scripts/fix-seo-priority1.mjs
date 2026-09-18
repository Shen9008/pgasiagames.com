#!/usr/bin/env node
/**
 * Priority-1 SEO audit fixes: email obfuscation bypass, promo-card HTML structure.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.html$/i.test(entry.name)) out.push(full);
  }
  return out;
}

function fixMailto(html) {
  const re = /<a href="mailto:sparta4444@protonmail\.com">sparta4444@protonmail\.com<\/a>/g;
  return html.replace(
    re,
    '<!--email_off--><a href="mailto:sparta4444@protonmail.com">sparta4444@protonmail.com</a><!--/email_off-->'
  );
}

function fixPromoCards(html) {
  return html.replace(
    /<a href="(https:\/\/reffpa\.com[^"]*)" target="_blank" rel="noopener noreferrer" class="(promo-card[^"]*)" role="listitem">([\s\S]*?)<\/a>/g,
    (_, href, cls, inner) =>
      `<article class="${cls}" role="listitem"><a href="${href}" target="_blank" rel="noopener noreferrer sponsored" class="promo-card__overlay-link" aria-label="View promotion"><span class="visually-hidden">View promotion</span></a>${inner}</article>`
  );
}

let mailtoCount = 0;
let promoCount = 0;

for (const file of walk(root)) {
  let html = fs.readFileSync(file, 'utf8');
  const beforeMail = html;
  html = fixMailto(html);
  if (html !== beforeMail) mailtoCount++;

  if (file.endsWith(`${path.sep}bonus${path.sep}index.html`)) {
    const beforePromo = html;
    html = fixPromoCards(html);
    if (html !== beforePromo) promoCount++;
  }

  if (html !== fs.readFileSync(file, 'utf8')) {
    fs.writeFileSync(file, html, 'utf8');
    console.log('updated', path.relative(root, file));
  }
}

console.log(`mailto fixes in ${mailtoCount} file(s); promo-card fix in ${promoCount} file(s)`);
