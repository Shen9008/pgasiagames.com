import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const files = [
  "about-us/index.html",
  "bonus/index.html",
  "help-center/index.html",
  "index.html",
  "live-casino/index.html",
  "responsible-gambling/index.html",
  "sitemap/index.html",
  "slots/index.html",
  "sports-betting/index.html",
  "terms-conditions/index.html",
];

function resolve(content) {
  const normalized = content.replace(/\r\n/g, "\n");
  const re = /<<<<<<< HEAD\n([\s\S]*?)=======\n([\s\S]*?)>>>>>>>[^\n]*\n/g;
  const out = normalized.replace(re, (_, head, theirs) => {
    const pick =
      /\/images\/webp\//.test(theirs) || /images\/webp/.test(theirs)
        ? theirs
        : /\/images\/webp\//.test(head) || /images\/webp/.test(head)
          ? head
          : /srcset|preload/.test(theirs)
            ? theirs
            : head;
    return pick;
  });
  return out.replace(/\n/g, "\r\n");
}

for (const rel of files) {
  const file = path.join(root, rel);
  let raw = fs.readFileSync(file, "utf8");
  if (!raw.includes("<<<<<<<")) continue;
  const out = resolve(raw);
  if (out.includes("<<<<<<<")) {
    console.error("Unresolved markers remain in", rel);
    process.exitCode = 1;
  } else {
    fs.writeFileSync(file, out);
    console.log("Resolved", rel);
  }
}
