import crypto from 'crypto';

export const RSS_FEEDS_BY_CATEGORY = {
  "Personal Care": [
    "https://economictimes.indiatimes.com/industry/cons-products/fmcg/rssfeeds/13358311.cms",
    "https://timesofindia.indiatimes.com/rssfeeds/1898055.cms",
    "https://www.thehindubusinessline.com/companies/feeder/default.rss"
  ],
  "Beauty & Wellbeing": [
    "https://www.livemint.com/rss/companies",
    "https://economictimes.indiatimes.com/industry/cons-products/fmcg/rssfeeds/13358311.cms",
    "https://www.thehindubusinessline.com/companies/feeder/default.rss"
  ],
  "Home Care": [
    "https://economictimes.indiatimes.com/industry/cons-products/fmcg/rssfeeds/13358311.cms",
    "https://www.livemint.com/rss/industry",
    "https://timesofindia.indiatimes.com/rssfeeds/1898055.cms"
  ],
  "Foods & Refreshment": [
    "https://economictimes.indiatimes.com/industry/cons-products/fmcg/rssfeeds/13358311.cms",
    "https://www.thehindubusinessline.com/companies/feeder/default.rss",
    "https://www.livemint.com/rss/companies"
  ],
  "Supply Chain & Quick Commerce": [
    "https://economictimes.indiatimes.com/industry/cons-products/fmcg/rssfeeds/13358311.cms",
    "https://economictimes.indiatimes.com/news/economy/rssfeeds/1373380680.cms",
    "https://www.livemint.com/rss/industry"
  ]
};

export const CORE_NEWS_FEEDS = [
  "https://economictimes.indiatimes.com/industry/cons-products/fmcg/rssfeeds/13358311.cms",
  "https://economictimes.indiatimes.com/news/economy/rssfeeds/1373380680.cms",
  "https://www.livemint.com/rss/companies",
  "https://www.livemint.com/rss/industry",
  "https://timesofindia.indiatimes.com/rssfeeds/1898055.cms",
  "https://www.thehindubusinessline.com/companies/feeder/default.rss"
];

const feedFailureCounts = new Map();

export function cleanUrl(rawUrl) {
  if (!rawUrl) return null;
  try {
    const u = new URL(rawUrl.trim());
    // Strip common tracking and referrer query parameters
    const paramsToStrip = [
      'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
      'ref', 'fbclid', 'gclid', 'ocid', 'ved', 'usg', '_ga'
    ];
    paramsToStrip.forEach(p => u.searchParams.delete(p));
    // Remove trailing slash and empty query strings
    let cleaned = u.toString();
    if (cleaned.endsWith('?')) cleaned = cleaned.slice(0, -1);
    return cleaned;
  } catch {
    return rawUrl.trim();
  }
}

export function normalizeTitle(str) {
  if (!str) return '';
  return String(str)
    .replace(/<[^>]*>/g, '') // Strip HTML tags
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function computeContentHash(headline) {
  return crypto.createHash('sha1').update(normalizeTitle(headline)).digest('hex');
}

export function parseXmlText(xmlText) {
  const items = [];
  if (!xmlText) return items;

  // Match RSS <item> tags
  const itemMatches = xmlText.match(/<item[\s\S]*?<\/item>/gi) || [];

  for (const itemXml of itemMatches) {
    const titleMatch = itemXml.match(/<title(?:\s[^>]*)?>([\s\S]*?)<\/title>/i);
    const linkMatch = itemXml.match(/<link(?:\s[^>]*)?>([\s\S]*?)<\/link>/i);
    const pubDateMatch = itemXml.match(/<pubDate(?:\s[^>]*)?>([\s\S]*?)<\/pubDate>/i);
    const descMatch = itemXml.match(/<description(?:\s[^>]*)?>([\s\S]*?)<\/description>/i);
    const sourceMatch = itemXml.match(/<source(?:\s[^>]*)?>([\s\S]*?)<\/source>/i);

    const cleanField = (raw) => {
      if (!raw) return '';
      let text = raw.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, '$1').trim();
      return text.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
    };

    let title = cleanField(titleMatch ? titleMatch[1] : '');
    let link = cleanField(linkMatch ? linkMatch[1] : '');
    let rawPubDate = cleanField(pubDateMatch ? pubDateMatch[1] : '');
    let description = cleanField(descMatch ? descMatch[1] : '');
    let source = cleanField(sourceMatch ? sourceMatch[1] : '');

    // Extract publisher from title if format is "Headline - Publisher"
    if (!source && title.includes(' - ')) {
      const parts = title.split(' - ');
      source = parts.pop().trim();
      title = parts.join(' - ').trim();
    }

    if (!title) continue;

    let publishedAtISO = new Date().toISOString();
    if (rawPubDate) {
      const parsedD = new Date(rawPubDate);
      if (!isNaN(parsedD.getTime())) {
        publishedAtISO = parsedD.toISOString();
      }
    }

    items.push({
      headline: title,
      summary: description || title,
      source: source || 'News Wire',
      url: cleanUrl(link) || link,
      canonicalUrl: cleanUrl(link) || link,
      publishedAtISO,
      contentHash: computeContentHash(title)
    });
  }

  return items;
}

export async function fetchRssFeed(feedUrl, timeoutMs = 5000) {
  const failures = feedFailureCounts.get(feedUrl) || 0;
  if (failures >= 5) {
    // Cooldown for broken feeds
    if (Math.random() > 0.2) return [];
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(feedUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
      }
    });

    clearTimeout(timer);
    if (!res.ok) {
      feedFailureCounts.set(feedUrl, failures + 1);
      return [];
    }

    const xml = await res.text();
    feedFailureCounts.set(feedUrl, 0); // reset on success
    return parseXmlText(xml);
  } catch (err) {
    clearTimeout(timer);
    feedFailureCounts.set(feedUrl, failures + 1);
    return [];
  }
}

export async function searchRssFeedsForKeyword(keyword, timeoutMs = 6000) {
  if (!keyword || keyword.trim().length < 2) return [];
  const q = keyword.trim();
  const qLower = q.toLowerCase();
  const qTokens = qLower.split(/\s+/).filter(t => t.length >= 2);

  const feedsToQuery = [
    `https://news.google.com/rss/search?q=${encodeURIComponent(q + ' HUL OR FMCG India')}&hl=en-IN&gl=IN&ceid=IN:en`,
    ...CORE_NEWS_FEEDS
  ];

  const results = await Promise.allSettled(
    feedsToQuery.map(feedUrl => fetchRssFeed(feedUrl, timeoutMs))
  );

  const candidateItems = [];
  const seenHashes = new Set();

  for (const r of results) {
    if (r.status === 'fulfilled' && Array.isArray(r.value)) {
      for (const item of r.value) {
        if (!item || !item.headline) continue;
        if (seenHashes.has(item.contentHash)) continue;
        seenHashes.add(item.contentHash);

        const text = `${item.headline} ${item.summary || ''}`.toLowerCase();
        let matchScore = 0;

        // Exact match
        if (text.includes(qLower)) {
          matchScore += 10;
        }

        // Token match with word boundaries
        for (const token of qTokens) {
          const regex = new RegExp(`\\b${token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
          if (regex.test(text)) {
            matchScore += 4;
          }
        }

        if (matchScore > 0) {
          candidateItems.push({
            ...item,
            searchScore: matchScore
          });
        }
      }
    }
  }

  // Sort by search score descending, then by publishedAtISO descending
  candidateItems.sort((a, b) => {
    if (b.searchScore !== a.searchScore) return b.searchScore - a.searchScore;
    return new Date(b.publishedAtISO).getTime() - new Date(a.publishedAtISO).getTime();
  });

  return candidateItems;
}

