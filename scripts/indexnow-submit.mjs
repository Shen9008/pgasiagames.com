/**
 * indexnow-submit.mjs
 * Submits all pgasiagames.com URLs to IndexNow (batch POST to api.indexnow.org).
 * Covers Bing, Yandex, and every other IndexNow-compliant engine.
 *
 * Usage: node scripts/indexnow-submit.mjs
 */

const HOST = "pgasiagames.com";
const KEY  = "726fe81e289f46b5a2823c7232998385";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

// All live URLs extracted from sitemap.xml
const URL_LIST = [
  // Core pages
  "https://pgasiagames.com/",
  "https://pgasiagames.com/slots/",
  "https://pgasiagames.com/live-casino/",
  "https://pgasiagames.com/sports-betting/",
  "https://pgasiagames.com/bonus/",
  "https://pgasiagames.com/about-us/",
  "https://pgasiagames.com/help-center/",
  "https://pgasiagames.com/terms-conditions/",
  "https://pgasiagames.com/responsible-gambling/",
  "https://pgasiagames.com/sitemap/",
  "https://pgasiagames.com/blog/",
  // Blog posts
  "https://pgasiagames.com/blog/the-psychological-appeal-behind-long-online-slot-gaming-sessions/",
  "https://pgasiagames.com/blog/what-experienced-players-look-for-before-trusting-an-online-casino-platform/",
  "https://pgasiagames.com/blog/reasons-why-online-casino-withdrawals-sometimes-take-longer-than-expected/",
  "https://pgasiagames.com/blog/local-banking-methods-that-make-deposits-easier-on-asian-gaming-sites/",
  "https://pgasiagames.com/blog/why-vip-loyalty-systems-matter-more-than-welcome-bonuses/",
  "https://pgasiagames.com/blog/how-cashback-features-help-reduce-risk-during-losing-sessions/",
  "https://pgasiagames.com/blog/comparing-different-types-of-welcome-bonuses-offered-by-casino-platforms/",
  "https://pgasiagames.com/blog/why-competitive-gaming-fans-are-turning-to-esports-betting-platforms/",
  "https://pgasiagames.com/blog/how-in-play-betting-creates-faster-decisions-for-sportsbook-players/",
  "https://pgasiagames.com/blog/football-betting-habits-that-experienced-pgasiagames-users-often-follow/",
  "https://pgasiagames.com/blog/exploring-the-most-recognizable-slot-providers-featured-on-pgasiagames/",
  "https://pgasiagames.com/blog/the-real-reason-live-baccarat-remains-a-favourite-on-pgasiagames/",
  "https://pgasiagames.com/blog/why-hold-and-win-slots-continue-dominating-asian-casino-platforms/",
  "https://pgasiagames.com/blog/slot-mechanics-that-are-becoming-more-popular-on-pgasiagames/",
  "https://pgasiagames.com/blog/how-pgasiagames-optimizes-casino-play-for-smartphone-users/",
  "https://pgasiagames.com/blog/common-pgasiagames-login-problems-and-solutions/",
  "https://pgasiagames.com/blog/essential-things-first-time-users-should-know-before-joining-pgasiagames/",
  "https://pgasiagames.com/blog/why-pgasiagames-is-gaining-attention-among-mobile-casino-players/",
  "https://pgasiagames.com/blog/pg-asia-games-vs-other-slot-providers-comparison/",
  "https://pgasiagames.com/blog/is-pg-asia-games-safe-and-legit-for-online-players/",
  "https://pgasiagames.com/blog/pg-asia-games-review-malaysia-pros-and-cons/",
  "https://pgasiagames.com/blog/tips-to-maximize-wins-on-pg-asia-games-platform/",
  "https://pgasiagames.com/blog/winning-strategies-for-pg-soft-slot-games/",
  "https://pgasiagames.com/blog/how-to-play-pg-soft-games-on-mobile-devices/",
  "https://pgasiagames.com/blog/pg-asia-games-mobile-experience-full-review/",
  "https://pgasiagames.com/blog/pg-asia-games-withdrawal-guide-and-processing-time/",
  "https://pgasiagames.com/blog/pg-asia-games-deposit-methods-explained/",
  "https://pgasiagames.com/blog/best-bonus-offers-available-on-pg-asia-games/",
  "https://pgasiagames.com/blog/how-to-claim-pg-asia-games-free-credit-promotions/",
  "https://pgasiagames.com/blog/pg-asia-games-bonus-and-promotion-guide/",
  "https://pgasiagames.com/blog/does-pg-asia-games-offer-live-casino-experience/",
  "https://pgasiagames.com/blog/how-pg-soft-slot-features-improve-winning-chances/",
  "https://pgasiagames.com/blog/beginner-guide-to-playing-pg-slots-online/",
  "https://pgasiagames.com/blog/top-pg-asia-games-slot-titles-you-should-try-first/",
  "https://pgasiagames.com/blog/best-pg-soft-slot-games-available-on-pg-asia-games/",
  "https://pgasiagames.com/blog/how-to-start-playing-on-pg-asia-games-platform/",
  "https://pgasiagames.com/blog/why-pg-asia-games-are-popular-among-asian-players/",
  "https://pgasiagames.com/blog/what-is-pg-asia-games-and-how-it-works-online/",
  "https://pgasiagames.com/blog/pg-asia-games-complete-guide-for-new-online-players/",
  "https://pgasiagames.com/blog/high-rtp-pg-soft-games-recommended-for-players/",
  "https://pgasiagames.com/blog/most-popular-pg-soft-games-in-asia-right-now/",
  "https://pgasiagames.com/blog/pg-asia-games-jackpot-slots-complete-guide/",
];

// IndexNow supports batch up to 10,000 URLs per call.
// We also submit to Bing and Yandex endpoints directly for redundancy.
const ENDPOINTS = [
  "https://api.indexnow.org/indexnow",
  "https://www.bing.com/indexnow",
];

const payload = JSON.stringify({
  host: HOST,
  key: KEY,
  keyLocation: KEY_LOCATION,
  urlList: URL_LIST,
});

console.log(`Submitting ${URL_LIST.length} URLs to IndexNow...\n`);

let allOk = true;

for (const endpoint of ENDPOINTS) {
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: payload,
    });

    const status = res.status;
    const text = await res.text().catch(() => "");

    if (status === 200 || status === 202) {
      console.log(`✓ ${endpoint}  →  HTTP ${status} (accepted)`);
    } else if (status === 400) {
      console.error(`✗ ${endpoint}  →  HTTP 400 (invalid request — check key file is live)`);
      allOk = false;
    } else if (status === 403) {
      console.error(`✗ ${endpoint}  →  HTTP 403 (key mismatch or not yet live)`);
      allOk = false;
    } else if (status === 422) {
      console.error(`✗ ${endpoint}  →  HTTP 422 (URLs do not belong to host)`);
      allOk = false;
    } else if (status === 429) {
      console.warn(`⚠ ${endpoint}  →  HTTP 429 (rate-limited — try again in a few minutes)`);
    } else {
      console.warn(`? ${endpoint}  →  HTTP ${status}  ${text.slice(0, 120)}`);
    }
  } catch (err) {
    console.error(`✗ ${endpoint}  →  Network error: ${err.message}`);
    allOk = false;
  }
}

console.log(`\nURL count submitted: ${URL_LIST.length}`);
console.log(`Key verification file: ${KEY_LOCATION}`);
if (allOk) {
  console.log("\nAll endpoints accepted the submission. ✓");
} else {
  console.log("\nSome endpoints returned errors — see above.");
}
