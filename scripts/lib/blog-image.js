'use strict';

const BLOG_DEFAULT_IMAGE = '/assets/img/blog-default.png';

function getStrapiPublicBase() {
  const fromEnv = process.env.STRAPI_PUBLIC_URL || process.env.STRAPI_URL;
  if (fromEnv) return String(fromEnv).replace(/\/$/, '');
  const api = process.env.STRAPI_API_URL || '';
  return api.replace(/\/api\/?$/, '').replace(/\/$/, '');
}

function getSiteOrigin() {
  return (process.env.SITE_BASE_URL || 'https://pgasiagames.com').replace(/\/$/, '');
}

/**
 * Normalises Strapi media URLs (absolute, protocol-relative, or /uploads).
 * @param {string} url
 * @param {string} [strapiBase]
 * @returns {string}
 */
function normalizeMediaUrl(url, strapiBase) {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('//')) return `https:${url}`;
  if (url.startsWith('/')) {
    if (url.startsWith('/assets/')) return url;
    if (strapiBase && url.startsWith('/uploads')) {
      return `${strapiBase}${url}`;
    }
    return url;
  }
  return url;
}

/**
 * @param {string|object|null|undefined} raw - Strapi image field
 * @param {string} [strapiBase]
 * @returns {string} Resolved URL or empty when missing
 */
function extractImageUrl(raw, strapiBase) {
  if (raw == null || raw === '') return '';
  if (typeof raw === 'string') {
    return normalizeMediaUrl(raw.trim(), strapiBase);
  }
  if (typeof raw !== 'object') return '';

  const nested = raw.data;
  const attrs = raw.attributes || (nested && nested.attributes) || nested;
  const url =
    raw.url ||
    raw.src ||
    attrs?.url ||
    (typeof nested === 'object' && nested?.url);

  if (!url) return '';
  return normalizeMediaUrl(String(url).trim(), strapiBase);
}

/**
 * Reads post image from common Strapi field names.
 * @param {object} strapiPost
 * @returns {string}
 */
function extractPostImage(strapiPost) {
  if (!strapiPost || typeof strapiPost !== 'object') return '';
  const raw =
    strapiPost.image ??
    strapiPost.cover ??
    strapiPost.featured_image ??
    strapiPost.featuredImage;
  return extractImageUrl(raw, getStrapiPublicBase());
}

/**
 * @param {string} [image]
 * @returns {string} Site-relative or absolute image URL
 */
function resolvePostImage(image) {
  const trimmed = (image || '').trim();
  return trimmed || BLOG_DEFAULT_IMAGE;
}

/**
 * @param {string} [image]
 * @returns {string} Absolute URL for meta tags
 */
function resolvePostImageAbsolute(image) {
  const src = resolvePostImage(image);
  if (/^https?:\/\//i.test(src)) return src;
  const origin = getSiteOrigin();
  return `${origin}${src.startsWith('/') ? src : `/${src}`}`;
}

module.exports = {
  BLOG_DEFAULT_IMAGE,
  extractImageUrl,
  extractPostImage,
  resolvePostImage,
  resolvePostImageAbsolute,
};
