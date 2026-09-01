import fs from "fs";

const ROOT = "C:/Users/Chia Shen/Downloads/pgasiagames-website";

const ORG_OLD = `{"@type": "Organization", "@id": "https://pgasiagames.com/#organization", "name": "PG Asia Games", "alternateName": ["PGAsia", "PG Asia", "pgasia"], "url": "https://pgasiagames.com/", "description": "PG Asia Games / PGAsia—casino, live dealer tables, and sportsbook for Southeast Asia and select markets.", "logo": {"@type": "ImageObject", "url": "https://pgasiagames.com/assets/logo-main.webp", "contentUrl": "https://pgasiagames.com/assets/logo-main.webp"}, "sameAs": ["https://pgasiagames.com/"]}`;
const ORG_NEW = `{"@type": "Organization", "@id": "https://pgasiagames.com/#organization", "name": "PG Asia Games", "legalName": "PG Asia Games", "alternateName": ["PGAsia", "PG Asia", "pgasia"], "url": "https://pgasiagames.com/", "description": "PG Asia Games / PGAsia — licensed online casino and sportsbook at pgasiagames.com for Southeast Asia.", "logo": {"@type": "ImageObject", "url": "https://pgasiagames.com/assets/logo-main.webp", "contentUrl": "https://pgasiagames.com/assets/logo-main.webp"}, "sameAs": ["https://pgasiagames.com/", "https://pgasiagames.com/about-us/"]}`;

const PAGES = [
  {
    file: `${ROOT}/slots/index.html`,
    slug: "slots",
    pageType: "CollectionPage",
    oldName: "PGAsia Slots | PG Asia Games Online | pgasiagames.com",
    oldDesc: "PGAsia / PG Asia Games slots on pgasiagames.com—1,000+ games, Megaways, jackpots, high RTP. Pragmatic, NetEnt, Microgaming and more.",
    newName: "PGAsia Slots — 1,000+ Online Games | Megaways & Jackpots",
    newDesc: "Spin 1,000+ slots at PGAsia — Megaways, progressives, Hold & Win from Pragmatic Play, NetEnt, BTG & 40+ studios. High RTP. Play now at pgasiagames.com.",
    heroImg: "slots-1200.webp",
    breadcrumbName: "Slots",
    faqItems: [
      {
        q: "What slots are available at PGAsia?",
        a: "PGAsia offers 1,000+ online slots from 40+ licensed providers including Pragmatic Play, NetEnt, BTG, Microgaming, and more. Formats include Megaways, jackpots, Hold & Win, buy-bonus, and classic reels. 18+ only. T&Cs apply."
      },
      {
        q: "What does RTP mean on PGAsia slots?",
        a: "RTP (Return to Player) is the theoretical percentage of total wagers returned to players over millions of spins. PGAsia lists games with 96%+ RTP in its featured sections. Actual results in any single session will vary significantly."
      },
      {
        q: "Can I play PGAsia slots on mobile?",
        a: "Yes. All PGAsia slots run in a mobile browser without any download required — iOS Safari and Android Chrome are both fully supported. The game interface adjusts automatically to screen size."
      },
      {
        q: "What is the difference between Megaways and classic slots at PGAsia?",
        a: "Megaways slots use a dynamic reel engine that changes the number of symbols per reel on every spin, creating up to 117,649 win ways. Classic slots use fixed paylines. PGAsia offers both formats from multiple providers."
      }
    ]
  },
  {
    file: `${ROOT}/live-casino/index.html`,
    slug: "live-casino",
    pageType: "WebPage",
    oldName: "PGAsia Live Casino | PG Asia Games Live Dealer | pgasiagames.com",
    oldDesc: "PGAsia / PG Asia Games live casino—Teen Patti, Baccarat, Dragon Tiger, Andar Bahar, Roulette, Blackjack, Sic Bo at pgasiagames.com.",
    newName: "PGAsia Live Casino | Teen Patti, Baccarat & Dragon Tiger",
    newDesc: "Play 150+ live dealer tables at PGAsia — Teen Patti, Andar Bahar, Baccarat with roads, Dragon Tiger. HD streams, real dealers, 24/7 at pgasiagames.com.",
    heroImg: "live-casino-1200.webp",
    breadcrumbName: "Live Casino",
    faqItems: [
      {
        q: "What live casino games are available at PGAsia?",
        a: "PGAsia offers 150+ live dealer tables including Teen Patti, Andar Bahar, Baccarat (with road displays), Dragon Tiger, Sic Bo, Roulette, Blackjack, and game shows — all streamed in HD from certified studios. 18+ only."
      },
      {
        q: "Who provides the live casino games at PGAsia?",
        a: "PGAsia's live casino is powered by certified studios including Evolution, Pragmatic Play Live, Ezugi, Asia Gaming, and Playtech Live. All studios use real physical equipment — real cards, real roulette wheels, real dice."
      },
      {
        q: "Can I play PGAsia live casino on my phone?",
        a: "Yes. All PGAsia live casino tables stream directly in your mobile browser with no download. HD video adjusts to your connection speed. iOS Safari and Android Chrome are both fully supported."
      },
      {
        q: "What is the minimum bet at PGAsia live casino tables?",
        a: "Minimum bet limits vary by table and game type. Most standard tables start at MYR 5–20 per hand or round. High-limit and VIP tables have higher minimums. Current limits are shown on each table tile in the lobby before you join."
      }
    ]
  },
  {
    file: `${ROOT}/sports-betting/index.html`,
    slug: "sports-betting",
    pageType: "WebPage",
    oldName: "PGAsia Sportsbook | PG Asia Games Sports | pgasiagames.com",
    oldDesc: "PGAsia / PG Asia Games sportsbook at pgasiagames.com—85+ sports, 1,000+ leagues, Asian Handicap, in-play betting and cash-out.",
    newName: "PGAsia Sportsbook | EPL, IPL, eSports & Asian Handicap Odds",
    newDesc: "Bet on 85+ sports at PGAsia — EPL, Champions League, IPL, NBA, CS2 & Dota 2. Asian Handicap, in-play & cash-out. Register at pgasiagames.com.",
    heroImg: "sports-1200.webp",
    breadcrumbName: "Sports Betting",
    faqItems: [
      {
        q: "What sports can I bet on at PGAsia?",
        a: "PGAsia covers 85+ sports including football (EPL, Champions League, La Liga, AFC), cricket (IPL, international), basketball (NBA), badminton, eSports (CS2, Dota 2, League of Legends), and more. Asian Handicap, totals, and props markets are available. 18+ only."
      },
      {
        q: "What is Asian Handicap betting at PGAsia?",
        a: "Asian Handicap removes the draw outcome by giving each team a goal head start or deficit. This creates a two-way market and often produces higher odds than 1X2 betting. PGAsia offers Asian Handicap on all major football leagues."
      },
      {
        q: "Does PGAsia offer in-play sports betting?",
        a: "Yes. PGAsia supports live in-play betting on major football, basketball, tennis, and cricket matches. Odds update in real time as the match progresses. Cash-out is available on selected pre-match and in-play bets."
      },
      {
        q: "What odds formats does PGAsia use?",
        a: "PGAsia displays odds in decimal format by default (e.g. 2.00 = evens). You can switch to Malay or Hong Kong odds formats in your account settings depending on your preference."
      }
    ]
  }
];

for (const p of PAGES) {
  let content = fs.readFileSync(p.file, "utf8");

  // Fix Organisation schema
  if (content.includes(ORG_OLD)) {
    content = content.replace(ORG_OLD, ORG_NEW);
  }

  // Remove promo banner divs
  content = content.replace(/\s*<div id="partial-1xbet-promo"><\/div>\s*/g, "\n        ");
  content = content.replace(/\s*<div id="partial-1xbet-promo-bottom"><\/div>\s*/g, "\n    ");
  content = content.replace(/\s*<div id="partial-1xbet-promo-mid"><\/div>\s*/g, "\n\n                    ");

  // Build old CollectionPage/WebPage string (approximate match)
  const oldWebPageSnippet = `"name": "${p.oldName}", "description": "${p.oldDesc}"`;
  const newWebPageSnippet = `"name": "${p.newName}", "description": "${p.newDesc}", "dateModified": "2026-09-01", "lastReviewed": "2026-09-01"`;

  if (content.includes(oldWebPageSnippet)) {
    content = content.replace(oldWebPageSnippet, newWebPageSnippet);
  }

  // Add mainEntity ref to the webpage node
  const breadcrumbRef = `"breadcrumb": {"@id": "https://pgasiagames.com/${p.slug}/#breadcrumb"}}`;
  const breadcrumbRefNew = `"breadcrumb": {"@id": "https://pgasiagames.com/${p.slug}/#breadcrumb"}, "mainEntity": {"@id": "https://pgasiagames.com/${p.slug}/#faqpage"}}`;
  if (content.includes(breadcrumbRef) && !content.includes(breadcrumbRefNew)) {
    content = content.replace(breadcrumbRef, breadcrumbRefNew);
  }

  // Build FAQ schema entries
  const faqMainEntity = p.faqItems.map(item =>
    `{"@type": "Question", "name": ${JSON.stringify(item.q)}, "acceptedAnswer": {"@type": "Answer", "text": ${JSON.stringify(item.a)}}}`
  ).join(", ");

  const faqSchema = `,\n            {"@type": "FAQPage", "@id": "https://pgasiagames.com/${p.slug}/#faqpage", "dateModified": "2026-09-01", "mainEntity": [${faqMainEntity}]}`;

  // Insert FAQPage before closing ] of @graph array (before </script>)
  const closeGraph = "\n        ]\n    }\n    </script>";
  if (content.includes(closeGraph) && !content.includes(`/${p.slug}/#faqpage`)) {
    content = content.replace(closeGraph, faqSchema + closeGraph);
  }

  fs.writeFileSync(p.file, content, "utf8");
  console.log(`Updated: ${p.file}`);
}

console.log("Done.");
