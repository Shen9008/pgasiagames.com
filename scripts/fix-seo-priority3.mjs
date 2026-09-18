#!/usr/bin/env node
/**
 * Priority-3 SEO fixes: og:image dimensions on pages missing width/height.
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

function inferDimensions(ogImageUrl) {
  if (!ogImageUrl) return null;
  if (/-1200\.webp/.test(ogImageUrl) || /heroes\/[^/]+-1200/.test(ogImageUrl)) {
    return { width: '1200', height: '640' };
  }
  if (/banners\/home\.webp/.test(ogImageUrl)) {
    return { width: '1920', height: '280' };
  }
  if (/banners\//.test(ogImageUrl)) {
    return { width: '1200', height: '400' };
  }
  return { width: '1200', height: '630' };
}

let updated = 0;

for (const file of walk(root)) {
  if (file.includes(`${path.sep}blog${path.sep}`)) continue;

  let html = fs.readFileSync(file, 'utf8');
  if (!html.includes('property="og:image"') || html.includes('property="og:image:width"')) {
    continue;
  }

  const match = html.match(/<meta property="og:image" content="([^"]+)">/);
  if (!match) continue;

  const dims = inferDimensions(match[1]);
  const insert = `\n    <meta property="og:image:width" content="${dims.width}">\n    <meta property="og:image:height" content="${dims.height}">`;
  const next = html.replace(
    /<meta property="og:image" content="[^"]+">/,
    (line) => line + insert
  );

  if (next !== html) {
    fs.writeFileSync(file, next, 'utf8');
    updated++;
    console.log('updated', path.relative(root, file));
  }
}

console.log(`og:image dimensions added to ${updated} file(s)`);
