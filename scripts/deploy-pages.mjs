/**
 * Cloudflare Pages direct upload. Uses CLOUDFLARE_API_TOKEN + CLOUDFLARE_ACCOUNT_ID.
 * Optional: CLOUDFLARE_PAGES_PROJECT_NAME overrides wrangler.toml `name`.
 *
 * --commit-dirty: sync/backfill may change files without a git commit before deploy.
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

const projectName = process.env.CLOUDFLARE_PAGES_PROJECT_NAME?.trim();

const args = [
  "wrangler",
  "pages",
  "deploy",
  "--commit-dirty=true",
];
if (projectName) {
  args.push("--project-name", projectName);
}

const res = spawnSync("npx", args, {
  cwd: root,
  stdio: "inherit",
  shell: true,
});

process.exit(res.status === null ? 1 : res.status);
