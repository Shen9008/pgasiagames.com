'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { fetchPosts, getPostsSyncConfig } = require('./lib/fetch-posts.js');
const { normalizePost, validatePost } = require('./lib/normalize-post.js');
const { renderArticle } = require('./lib/render-article.js');
const { generateSitemap } = require('./lib/generate-sitemap.js');

const ROOT = path.resolve(__dirname, '..');
const BLOGS_JSON_PATH = path.join(ROOT, 'assets/data/blogs.json');

const BLOGS_JSON_FIELDS = [
  'slug', 'title', 'meta_title', 'meta_description', 'focus_keyword',
  'category', 'search_intent', 'published_date', 'reading_time',
  'excerpt', 'image', 'placeholder_gradient', 'related_posts', 'keywords',
  'cms_updated_at', 'content_hash', 'synced_at',
];

function parseFlags() {
  const args = process.argv.slice(2);
  const limitIdx = args.indexOf('--limit');
  let limit = null;
  if (limitIdx >= 0 && args[limitIdx + 1]) {
    const n = parseInt(args[limitIdx + 1], 10);
    if (Number.isFinite(n) && n > 0) limit = n;
  }
  return {
    all: args.includes('--all'),
    daily: args.includes('--daily'),
    refresh: args.includes('--refresh'),
    force: args.includes('--force'),
    limit,
  };
}

function assertSiteFilterRequired() {
  if (!/^1|true|yes$/i.test(String(process.env.SYNC_REQUIRE_SITE_FILTER || '').trim())) {
    return;
  }
  const cfg = getPostsSyncConfig();
  if (!cfg.siteDomain) {
    throw new Error('SYNC_REQUIRE_SITE_FILTER: SITE_DOMAIN is required.');
  }
  if (cfg.skipFilter) {
    throw new Error('SYNC_REQUIRE_SITE_FILTER: SKIP_POSTS_SITE_FILTER must not be enabled.');
  }
  if (!cfg.filterKey) {
    throw new Error('SYNC_REQUIRE_SITE_FILTER: POSTS_SITE_FILTER_KEY is empty.');
  }
}

function sortBlogsByLatestSyncFirst(a, b) {
  const tb = new Date(b.synced_at || b.published_date || 0).getTime();
  const ta = new Date(a.synced_at || a.published_date || 0).getTime();
  if (tb !== ta) return tb - ta;
  return String(b.slug).localeCompare(String(a.slug));
}

function toBlogsEntry(normalized, raw) {
  const entry = {};
  for (const k of BLOGS_JSON_FIELDS) {
    if (normalized[k] !== undefined) entry[k] = normalized[k];
  }
  entry.cms_updated_at = cmsUpdatedAt(raw);
  entry.content_hash = hashContent(raw.content);
  entry.synced_at = new Date().toISOString();
  return entry;
}

function hashContent(content) {
  const payload =
    content == null ? '' : typeof content === 'string' ? content : JSON.stringify(content);
  return crypto.createHash('sha256').update(payload, 'utf8').digest('hex');
}

function cmsUpdatedAt(raw) {
  return raw.updatedAt || raw.updated_at || '';
}

function postSlug(raw) {
  return raw.slug || raw.documentId || '';
}

function postChanged(entry, raw) {
  const cms = cmsUpdatedAt(raw);
  const hash = hashContent(raw.content);
  if (!entry.cms_updated_at && !entry.content_hash) return true;
  if (entry.cms_updated_at !== cms) return true;
  if (entry.content_hash !== hash) return true;
  return false;
}

function loadBlogsJson() {
  try {
    const raw = fs.readFileSync(BLOGS_JSON_PATH, 'utf8');
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function saveBlogsJson(blogs) {
  const json = JSON.stringify(blogs, null, 2);
  fs.writeFileSync(BLOGS_JSON_PATH, json + '\n', 'utf8');
}

function getRelatedSlugs(blogs, currentSlug, opts = {}, limit = 3) {
  const searchIntent = (opts.searchIntent || 'informational').toLowerCase();
  const category = (opts.category || '').toLowerCase();
  const others = blogs.filter((b) => b.slug !== currentSlug);

  const sameIntent = others
    .filter((b) => (b.search_intent || '').toLowerCase() === searchIntent)
    .sort(sortBlogsByLatestSyncFirst);
  const sameIntentSlugs = new Set(sameIntent.map((b) => b.slug));
  const sameCategory = others
    .filter((b) => !sameIntentSlugs.has(b.slug) && category && (b.category || '').toLowerCase() === category)
    .sort(sortBlogsByLatestSyncFirst);
  const sameCategorySlugs = new Set(sameCategory.map((b) => b.slug));
  const rest = others
    .filter((b) => !sameIntentSlugs.has(b.slug) && !sameCategorySlugs.has(b.slug))
    .sort(sortBlogsByLatestSyncFirst);

  return [...sameIntent, ...sameCategory, ...rest].slice(0, limit).map((b) => b.slug);
}

function upsertBlogEntry(blogs, entry) {
  const idx = blogs.findIndex((b) => b.slug === entry.slug);
  if (idx >= 0) {
    blogs[idx] = { ...blogs[idx], ...entry };
  } else {
    blogs.push(entry);
  }
}

function buildWorklist(strapiPosts, blogs, flags) {
  const knownSlugs = new Set(blogs.map((b) => b.slug));
  const postsBySlug = new Map();
  for (const raw of strapiPosts) {
    const slug = postSlug(raw);
    if (slug) postsBySlug.set(slug, raw);
  }

  const worklist = [];

  if (flags.force) {
    for (const raw of strapiPosts) {
      const slug = postSlug(raw);
      if (!slug) continue;
      worklist.push({ raw, slug, kind: knownSlugs.has(slug) ? 'refresh' : 'create' });
    }
    if (flags.limit) return worklist.slice(0, flags.limit);
    return worklist;
  }

  if (!flags.refresh) {
    const unprocessed = strapiPosts
      .filter((p) => {
        const slug = postSlug(p);
        return slug && !knownSlugs.has(slug);
      })
      .sort((a, b) => new Date(a.publishedAt || 0) - new Date(b.publishedAt || 0));

    const maxNew = flags.all ? (flags.limit ?? unprocessed.length) : 1;
    for (const raw of unprocessed.slice(0, maxNew)) {
      worklist.push({ raw, slug: postSlug(raw), kind: 'create' });
    }
  }

  if (flags.daily || flags.refresh) {
    for (const entry of blogs) {
      const raw = postsBySlug.get(entry.slug);
      if (!raw || !postChanged(entry, raw)) continue;
      worklist.push({ raw, slug: entry.slug, kind: 'refresh' });
    }
  }

  return worklist;
}

async function run() {
  const flags = parseFlags();
  assertSiteFilterRequired();

  const apiUrl = process.env.STRAPI_API_URL || 'http://localhost:1337/api';
  const modeLabel = flags.force
    ? 'force'
    : flags.daily
      ? 'daily'
      : flags.refresh
        ? 'refresh'
        : flags.all
          ? 'all new'
          : 'sync';

  console.log(`Fetching posts from API (${modeLabel})...`);
  const strapiPosts = await fetchPosts({ baseUrl: apiUrl });

  let blogs = loadBlogsJson();
  const worklist = buildWorklist(strapiPosts, blogs, flags);

  if (worklist.length === 0) {
    console.log('No articles to publish or refresh.');
    return;
  }

  const creates = worklist.filter((w) => w.kind === 'create').length;
  const refreshes = worklist.filter((w) => w.kind === 'refresh').length;
  console.log(
    `Processing ${worklist.length} article(s) (${creates} new, ${refreshes} refresh)...`,
  );

  for (const item of worklist) {
    const { raw, slug, kind } = item;
    const related = getRelatedSlugs(blogs, slug, {
      searchIntent: raw.search_intent,
      category: raw.category,
    });

    const normalized = normalizePost(raw, {
      relatedPosts:
        kind === 'refresh'
          ? (blogs.find((b) => b.slug === slug)?.related_posts || related)
          : related,
    });
    validatePost(normalized);

    console.log(`  - [${kind}] ${normalized.title} (${slug})`);
    renderArticle(normalized, { blogs });

    const entry = toBlogsEntry(normalized, raw);
    upsertBlogEntry(blogs, entry);
  }

  blogs.sort(sortBlogsByLatestSyncFirst);
  saveBlogsJson(blogs);
  generateSitemap();
  console.log('Done. blogs.json and sitemap.xml updated.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
