/**
 * update-meta.mjs
 * Replaces <title> and <meta name="description"> in specified HTML files.
 * Run: node scripts/update-meta.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

// [filePath, newTitle, newDescription]
const UPDATES = [
  // ── MAIN PAGES ──────────────────────────────────────────────────────────────
  [
    "index.html",
    "PGAsia Casino — 1,200+ Slots, Live Dealer & Sports Betting",
    "Join PGAsia at pgasiagames.com — Asia's licensed casino & sportsbook. Teen Patti, Baccarat, 1,000+ slots, 85+ sports. Claim your 100% welcome bonus today.",
  ],
  [
    "about-us/index.html",
    "About PGAsia (PG Asia Games) | Licensed Casino & Sportsbook",
    "PGAsia is a licensed online casino & sportsbook built for Asia. 1,200+ games, local e-wallets (MYR/THB/VND), 24/7 support. Play with confidence at pgasiagames.com.",
  ],
  [
    "slots/index.html",
    "PGAsia Slots — 1,000+ Online Games | Megaways & Jackpots",
    "Spin 1,000+ slots at PGAsia — Megaways, progressives, Hold & Win from Pragmatic Play, NetEnt, BTG & 40+ studios. High RTP. Play now at pgasiagames.com.",
  ],
  [
    "live-casino/index.html",
    "PGAsia Live Casino | Teen Patti, Baccarat & Dragon Tiger",
    "Play 150+ live dealer tables at PGAsia — Teen Patti, Andar Bahar, Baccarat with roads, Dragon Tiger. HD streams, real dealers, 24/7 at pgasiagames.com.",
  ],
  [
    "sports-betting/index.html",
    "PGAsia Sportsbook | EPL, IPL, eSports & Asian Handicap Odds",
    "Bet on 85+ sports at PGAsia — EPL, Champions League, IPL, NBA, CS2 & Dota 2. Asian Handicap, in-play & cash-out. Register at pgasiagames.com.",
  ],
  [
    "bonus/index.html",
    "PGAsia Bonus | 100% Welcome Match + Daily Cashback & VIP",
    "Claim PGAsia's 100% first-deposit match + up to 10% daily cashback. VIP tiers, free spins & acca boosts. Read terms in cashier before opting in.",
  ],
  [
    "help-center/index.html",
    "PGAsia Help Center | Accounts, Payments & 24/7 Live Chat",
    "Got a question about your PGAsia account? Find answers on deposits, withdrawals, bonuses, KYC & mobile play — or chat with support 24/7 at pgasiagames.com.",
  ],
  [
    "responsible-gambling/index.html",
    "Responsible Gambling | PGAsia Limits & Self-Exclusion Tools",
    "Set deposit & loss limits, request self-exclusion or take a break at PGAsia. Free support via BeGambleAware, GamCare & Gambling Therapy. pgasiagames.com.",
  ],
  [
    "blog/index.html",
    "PGAsia Blog — Casino Guides, Slot Tips & Betting Strategies",
    "Expert guides on slots, live casino, sports betting & bonuses from the PGAsia team. Tips, strategies & news for Asian players at pgasiagames.com.",
  ],
  [
    "terms-conditions/index.html",
    "Terms & Conditions | PGAsia — Full Rules & Player Rights",
    "Read PGAsia's full terms: account rules, payment conditions, bonus wagering, betting limits & dispute process. Always review before you play at pgasiagames.com.",
  ],
  [
    "sitemap/index.html",
    "Sitemap | PGAsia (pgasiagames.com) — All Pages",
    "Browse all PGAsia pages — slots, live casino, sports betting, bonuses, help, blog & responsible gambling tools at pgasiagames.com.",
  ],

  // ── BLOG POSTS ──────────────────────────────────────────────────────────────
  [
    "blog/beginner-guide-to-playing-pg-slots-online/index.html",
    "Beginner's Guide to PGAsia Slots | Game Types, RTP & Strategy",
    "New to online slots? Learn how to play PGAsia slots — game types, RTP, volatility, bonus features & smart strategies explained for beginners. Start spinning smarter.",
  ],
  [
    "blog/best-bonus-offers-available-on-pg-asia-games/index.html",
    "Best Bonus Offers at PGAsia | Welcome Match, Cashback & VIP",
    "Discover PGAsia's top casino bonuses — 100% welcome match, daily cashback, free spins & VIP rewards. Compare offers and claim the best value at pgasiagames.com.",
  ],
  [
    "blog/best-pg-soft-slot-games-available-on-pg-asia-games/index.html",
    "Best PG Soft Slot Games at PGAsia | Top Picks & RTP Ratings",
    "Explore the top PG Soft slot games available at PGAsia — unique themes, high RTP, and innovative features. Find your next favourite slot at pgasiagames.com.",
  ],
  [
    "blog/common-pgasiagames-login-problems-and-solutions/index.html",
    "PGAsia Login Problems Fixed | Common Issues & Solutions",
    "Can't log in to PGAsia? Fix forgotten passwords, 2FA issues, blocked accounts & more in minutes. Step-by-step solutions from the pgasiagames.com support team.",
  ],
  [
    "blog/comparing-different-types-of-welcome-bonuses-offered-by-casino-platforms/index.html",
    "Types of Casino Welcome Bonuses Compared | PGAsia Guide",
    "Match bonuses, free spins, no-deposit offers & cashback — a clear comparison of every welcome bonus type so you know exactly what you're claiming at PGAsia.",
  ],
  [
    "blog/does-pg-asia-games-offer-live-casino-experience/index.html",
    "PGAsia Live Casino — Real Dealers, Teen Patti & Baccarat",
    "Yes — PGAsia offers 150+ live dealer tables. Teen Patti, Baccarat, Dragon Tiger, Roulette & game shows streamed in HD. See what's available at pgasiagames.com.",
  ],
  [
    "blog/essential-things-first-time-users-should-know-before-joining-pgasiagames/index.html",
    "PGAsia First-Time Player Guide | What to Know Before Joining",
    "Everything new players need to know before joining PGAsia — registration, KYC, first deposit, bonus claiming & how games work. Read this before you sign up.",
  ],
  [
    "blog/exploring-the-most-recognizable-slot-providers-featured-on-pgasiagames/index.html",
    "Top Slot Providers at PGAsia | Pragmatic, NetEnt, BTG & More",
    "Which studios power the PGAsia slot lobby? Pragmatic Play, NetEnt, Microgaming, BTG & 40+ providers reviewed — find the best games from your favourite studio.",
  ],
  [
    "blog/football-betting-habits-that-experienced-pgasiagames-users-often-follow/index.html",
    "Football Betting Tips from Experienced PGAsia Players",
    "Learn the betting habits that winning football punters at PGAsia follow — market selection, staking, Asian Handicap use & bankroll discipline. Bet smarter today.",
  ],
  [
    "blog/high-rtp-pg-soft-games-recommended-for-players/index.html",
    "Highest RTP PG Soft Slots at PGAsia | Best Picks Ranked",
    "Find PG Soft slots with the highest RTP at PGAsia — ranked by return rate with volatility ratings and feature breakdowns. Spin smarter, not harder.",
  ],
  [
    "blog/how-cashback-features-help-reduce-risk-during-losing-sessions/index.html",
    "How Casino Cashback Works at PGAsia | Reduce Your Risk",
    "Daily cashback at PGAsia returns a percentage of your net losses — here's how it's calculated, when it credits, and how to make it work for you.",
  ],
  [
    "blog/how-in-play-betting-creates-faster-decisions-for-sportsbook-players/index.html",
    "In-Play Betting at PGAsia | Live Odds, Cash-Out & Strategy",
    "How does in-play betting work at PGAsia? Live odds, cash-out values, stream delays & market suspensions explained — bet confidently on live action.",
  ],
  [
    "blog/how-pg-soft-slot-features-improve-winning-chances/index.html",
    "PG Soft Slot Features Explained | Free Spins, Wilds & More",
    "PG Soft slots are packed with free spins, multiplier wilds, and bonus buy options. Learn which features give you the best return at PGAsia.",
  ],
  [
    "blog/how-pgasiagames-optimizes-casino-play-for-smartphone-users/index.html",
    "PGAsia Mobile Casino | Play Slots & Live Games on Your Phone",
    "PGAsia's full casino and sportsbook runs in your phone browser — no app needed. See how it's optimised for iOS & Android at pgasiagames.com.",
  ],
  [
    "blog/how-to-claim-pg-asia-games-free-credit-promotions/index.html",
    "How to Claim PGAsia Free Credits & Bonus Promotions",
    "Step-by-step: how to claim free credit, welcome bonuses and promotional offers at PGAsia. What qualifies, how it credits & wagering explained.",
  ],
  [
    "blog/how-to-play-pg-soft-games-on-mobile-devices/index.html",
    "Playing PG Soft Slots on Mobile at PGAsia | No App Needed",
    "PG Soft games run directly in your phone browser at PGAsia — no app download needed. Tips for smooth mobile gameplay on iOS and Android.",
  ],
  [
    "blog/how-to-start-playing-on-pg-asia-games-platform/index.html",
    "How to Start Playing at PGAsia | Registration to First Bet",
    "From registration to your first deposit and bonus claim — the complete starter guide for new PGAsia players. Get up and running in under 10 minutes.",
  ],
  [
    "blog/is-pg-asia-games-safe-and-legit-for-online-players/index.html",
    "Is PGAsia Legit & Safe? Licensed Casino Review 2026",
    "Is PGAsia (pgasiagames.com) safe to play at? We review the licence, security, payment history & game fairness — everything you need to know before joining.",
  ],
  [
    "blog/local-banking-methods-that-make-deposits-easier-on-asian-gaming-sites/index.html",
    "Local Banking & E-Wallet Deposits at PGAsia | MYR, THB, VND",
    "Boost, Touch 'n Go, TrueMoney & bank transfer — how local Asian banking methods make depositing at PGAsia fast, fee-free and hassle-free.",
  ],
  [
    "blog/most-popular-pg-soft-games-in-asia-right-now/index.html",
    "Most Popular PG Soft Games in Asia 2026 | Top Picks at PGAsia",
    "Which PG Soft games are players in Asia spinning most right now? Top picks ranked by popularity, with RTP, theme & feature highlights at PGAsia.",
  ],
  [
    "blog/pg-asia-games-bonus-and-promotion-guide/index.html",
    "PGAsia Bonus & Promotions Guide | Welcome, Cashback & VIP",
    "Full guide to every PGAsia promotion — welcome match, daily cashback, reload bonuses, free spins & VIP tiers. Understand every term before you claim.",
  ],
  [
    "blog/pg-asia-games-complete-guide-for-new-online-players/index.html",
    "PGAsia Complete Beginner Guide | Slots, Live Casino & Sports",
    "New to PGAsia? This complete guide covers everything — registration, games, bonuses, payments & responsible gambling. Start your journey at pgasiagames.com.",
  ],
  [
    "blog/pg-asia-games-deposit-methods-explained/index.html",
    "PGAsia Deposit Methods | E-Wallets, Bank Transfer & More",
    "How to deposit at PGAsia — all accepted methods, processing times, minimum amounts & tips for instant funding. MYR, THB & VND supported.",
  ],
  [
    "blog/pg-asia-games-jackpot-slots-complete-guide/index.html",
    "PGAsia Jackpot Slots Guide | Progressives, Wins & How to Play",
    "Everything about jackpot slots at PGAsia — progressive mechanics, contribution rules, qualifying bets & the top jackpot titles to try at pgasiagames.com.",
  ],
  [
    "blog/pg-asia-games-mobile-experience-full-review/index.html",
    "PGAsia Mobile Review | Browser Casino for iOS & Android",
    "Full mobile review of PGAsia — browser-based slots, live casino & sportsbook tested on iOS and Android. No app required. See how it performs.",
  ],
  [
    "blog/pg-asia-games-review-malaysia-pros-and-cons/index.html",
    "PGAsia Review Malaysia 2026 | Pros, Cons & Honest Verdict",
    "Our honest PGAsia review for Malaysia — what the casino does well, where it falls short, and whether pgasiagames.com is worth joining in 2026.",
  ],
  [
    "blog/pg-asia-games-vs-other-slot-providers-comparison/index.html",
    "PG Soft vs Pragmatic Play — Which Slots Win at PGAsia?",
    "Head-to-head: PG Soft vs Pragmatic Play slot features, RTP, volatility & hit frequency compared. Which provider deserves your next spin at PGAsia?",
  ],
  [
    "blog/pg-asia-games-withdrawal-guide-and-processing-time/index.html",
    "PGAsia Withdrawal Guide | Processing Times & Requirements",
    "How to withdraw from PGAsia — e-wallet vs bank transfer times, KYC requirements, pending reasons & tips for faster payouts at pgasiagames.com.",
  ],
  [
    "blog/reasons-why-online-casino-withdrawals-sometimes-take-longer-than-expected/index.html",
    "Why Casino Withdrawals Take Longer | PGAsia Explained",
    "Withdrawal still pending? KYC holds, active bonuses & bank delays are the usual culprits. Here's what causes each and how to resolve it at PGAsia.",
  ],
  [
    "blog/slot-mechanics-that-are-becoming-more-popular-on-pgasiagames/index.html",
    "Trending Slot Mechanics at PGAsia | Megaways, Cluster & More",
    "Megaways, cluster pays, cascading reels & buy bonus — the slot mechanics taking over the PGAsia lobby and how each one works. Know before you spin.",
  ],
  [
    "blog/the-psychological-appeal-behind-long-online-slot-gaming-sessions/index.html",
    "Why Slot Sessions Run Long | The Psychology Behind It",
    "What keeps players spinning for hours? Variable rewards, near-misses & sound design — understanding slot psychology helps you stay in control at PGAsia.",
  ],
  [
    "blog/the-real-reason-live-baccarat-remains-a-favourite-on-pgasiagames/index.html",
    "Why Live Baccarat Stays #1 at PGAsia | Roads, Odds & Tables",
    "Live Baccarat dominates at PGAsia — low house edge, fast rounds, road displays and squeeze tables. Find out why it's Asia's favourite card game.",
  ],
  [
    "blog/tips-to-maximize-wins-on-pg-asia-games-platform/index.html",
    "Tips to Win More at PGAsia | Slots, Live Casino & Sports",
    "Smart strategies for slots, live casino & sports betting at PGAsia — bankroll management, RTP selection, bonus use & when to walk away.",
  ],
  [
    "blog/top-pg-asia-games-slot-titles-you-should-try-first/index.html",
    "Top PGAsia Slot Titles to Try First | Expert Recommendations",
    "Not sure where to start? These are the must-try slot titles at PGAsia — handpicked for RTP, features & entertainment value. Your list starts here.",
  ],
  [
    "blog/what-experienced-players-look-for-before-trusting-an-online-casino-platform/index.html",
    "What Makes an Online Casino Trustworthy? | PGAsia Checklist",
    "Experienced players check licence, payment speed, game fairness & support quality before committing. Here's the full trust checklist — and how PGAsia scores.",
  ],
  [
    "blog/what-is-pg-asia-games-and-how-it-works-online/index.html",
    "What Is PGAsia? | The Official Casino & Sportsbook Explained",
    "PGAsia (pgasiagames.com) is a licensed online casino and sportsbook for Asia — slots, live dealer, sports & bonuses in one unified wallet. Here's how it works.",
  ],
  [
    "blog/why-competitive-gaming-fans-are-turning-to-esports-betting-platforms/index.html",
    "eSports Betting at PGAsia | CS2, Dota 2 & League of Legends",
    "Why are Asian gaming fans betting on eSports? CS2, Dota 2 & LoL markets at PGAsia explained — plus how to read match odds and bet smartly.",
  ],
  [
    "blog/why-hold-and-win-slots-continue-dominating-asian-casino-platforms/index.html",
    "Why Hold & Win Slots Dominate at PGAsia | How They Work",
    "Hold & Win mechanics — respins, fixed jackpots and bonus symbols explained. Find out why they're the most-played slot format at PGAsia.",
  ],
  [
    "blog/why-pg-asia-games-are-popular-among-asian-players/index.html",
    "Why PGAsia Appeals to Asian Players | Casino & Sportsbook",
    "PGAsia is designed for Asian players — local currencies (MYR/THB/VND), Asian table games, regional sports coverage and familiar payment methods.",
  ],
  [
    "blog/why-pgasiagames-is-gaining-attention-among-mobile-casino-players/index.html",
    "Why PGAsia Is the Go-To Mobile Casino in Asia",
    "PGAsia's mobile casino loads in any browser — no app download, full slot & live casino access, one-tap deposits. See why mobile players prefer it.",
  ],
  [
    "blog/why-vip-loyalty-systems-matter-more-than-welcome-bonuses/index.html",
    "VIP vs Welcome Bonus at PGAsia | Which Is More Valuable?",
    "One-time welcome match vs. ongoing VIP rewards — for regular players at PGAsia, the loyalty programme typically delivers far more long-term value.",
  ],
  [
    "blog/winning-strategies-for-pg-soft-slot-games/index.html",
    "PG Soft Slot Strategy Guide | RTP, Bankroll & Feature Tips",
    "Practical strategies for PG Soft slots at PGAsia — choosing games by RTP, sizing stakes to your bankroll, and using bonus buy wisely.",
  ],
];

let updated = 0;
let skipped = 0;

for (const [rel, title, desc] of UPDATES) {
  const filePath = path.join(ROOT, rel);
  if (!fs.existsSync(filePath)) {
    console.warn(`SKIP (not found): ${rel}`);
    skipped++;
    continue;
  }

  let content = fs.readFileSync(filePath, "utf8");

  // Replace <title>
  const newContent = content
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(
      /(<meta\s+name="description"\s+content=")[^"]*(")/,
      `$1${desc}$2`
    );

  if (newContent === content) {
    console.warn(`NO CHANGE: ${rel}`);
    skipped++;
    continue;
  }

  fs.writeFileSync(filePath, newContent, "utf8");
  console.log(`✓ Updated: ${rel}`);
  updated++;
}

console.log(`\nDone — ${updated} updated, ${skipped} skipped.`);
