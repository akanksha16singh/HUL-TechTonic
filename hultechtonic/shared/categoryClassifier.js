// Word-boundary based weighted FMCG category classifier

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function matchesWord(text, term) {
  if (!text || !term) return false;
  const regex = new RegExp(`\\b${escapeRegex(term.toLowerCase())}\\b`, 'i');
  return regex.test(text);
}

const CATEGORY_RULES = {
  "Personal Care": {
    brands: ["rexona", "lifebuoy", "lux", "close up", "pepsodent", "axe", "hamam", "liril", "pears", "breeze"],
    nouns: ["deodorant", "body wash", "soap", "toothpaste", "oral care", "handwash", "sanitizer", "sweat", "antiperspirant", "bath bar"],
    keywords: ["hygiene", "cleanliness", "germ protection", "bathing", "dental", "odor protection", "freshness"]
  },
  "Beauty & Wellbeing": {
    brands: ["dove", "sunsilk", "pond's", "ponds", "glow & lovely", "glow and lovely", "lakmé", "lakme", "tresemme", "tresemmé", "simple", "vaseline", "clinic plus", "indulekha", "dermalogica", "novology"],
    nouns: ["skincare", "haircare", "shampoo", "conditioner", "serum", "moisturizer", "sunscreen", "face wash", "creamer", "cosmetics", "foundation", "lipstick", "skin cream", "derma"],
    keywords: ["beauty", "glowing skin", "hair fall", "nourishment", "anti-aging", "hydration", "dermatological", "filter backlash"]
  },
  "Home Care": {
    brands: ["surf excel", "rin", "wheel", "vim", "comfort", "domex", "sunlight", "cif", "active wheel", "surf"],
    nouns: ["detergent", "fabric wash", "fabric conditioner", "dishwash", "dishwashing", "floor cleaner", "toilet cleaner", "stain remover", "washing powder", "liquid detergent", "sachet"],
    keywords: ["laundry", "stain", "daag acche hain", "cleaning", "household hygiene", "fabric care", "rural wash"]
  },
  "Foods & Refreshment": {
    brands: ["brooke bond", "red label", "taj mahal", "taaza", "bru", "knorr", "kissan", "horlicks", "boost", "kwality wall's", "cornetto", "magnum", "annapurna"],
    nouns: ["tea", "chai", "coffee", "soup", "ketchup", "jam", "health food drink", "ice cream", "packaged food", "culinary", "malt drink"],
    keywords: ["beverage", "hot drink", "nutrition", "breakfast", "flavor", "brewed", "refreshment", "food ingredients"]
  },
  "Supply Chain & Quick Commerce": {
    brands: ["blinkit", "zepto", "swiggy instamart", "instamart", "hul logistics", "shikar", "shikhar app", "shikar app", "hul distributor"],
    nouns: ["quick commerce", "dark store", "10-minute delivery", "supply chain", "distributor", "depot", "kirana", "fulfillment", "b2b retail", "inventory", "stockout", "out of stock", "sla", "transit hub"],
    keywords: ["logistics", "ordering app", "contactless ordering", "retail network", "warehousing", "route to market", "direct store delivery"]
  }
};

export function classifyCategory(headline = '', summary = '', brand = '', providedCategory = '') {
  const text = `${headline} ${summary} ${brand}`.toLowerCase();

  const scores = {
    "Personal Care": 0,
    "Beauty & Wellbeing": 0,
    "Home Care": 0,
    "Foods & Refreshment": 0,
    "Supply Chain & Quick Commerce": 0
  };

  for (const [catName, rules] of Object.entries(CATEGORY_RULES)) {
    // Exact brands: weight 10
    for (const b of rules.brands) {
      if (matchesWord(text, b)) {
        scores[catName] += 10;
      }
    }
    // Specific nouns: weight 4
    for (const n of rules.nouns) {
      if (matchesWord(text, n)) {
        scores[catName] += 4;
      }
    }
    // General keywords: weight 2
    for (const k of rules.keywords) {
      if (matchesWord(text, k)) {
        scores[catName] += 2;
      }
    }
  }

  // Find max scoring category
  let topCategory = null;
  let maxScore = 0;

  for (const [catName, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      topCategory = catName;
    }
  }

  // Threshold check: need at least 4 points to confidently assign
  if (maxScore >= 4 && topCategory) {
    return topCategory;
  }

  // Fallback to provided category mapping if valid
  if (providedCategory) {
    const pc = String(providedCategory).toLowerCase();
    if (pc.includes("beauty") || pc.includes("skin") || pc.includes("hair")) return "Beauty & Wellbeing";
    if (pc.includes("home") || pc.includes("fabric") || pc.includes("detergent")) return "Home Care";
    if (pc.includes("food") || pc.includes("refreshment") || pc.includes("tea") || pc.includes("beverage")) return "Foods & Refreshment";
    if (pc.includes("supply") || pc.includes("quick") || pc.includes("commerce") || pc.includes("logistics")) return "Supply Chain & Quick Commerce";
    if (pc.includes("personal") || pc.includes("care") || pc.includes("hygiene")) return "Personal Care";
  }

  return topCategory || "Uncategorized";
}

export function detectBrand(headline = '', summary = '', fallback = 'HUL') {
  const text = `${headline} ${summary}`.toLowerCase();
  
  // Specific multi-word brand matches first
  if (matchesWord(text, 'surf excel') || matchesWord(text, 'surf')) return 'Surf Excel';
  if (matchesWord(text, 'glow & lovely') || matchesWord(text, 'glow and lovely')) return 'Glow & Lovely';
  if (matchesWord(text, 'brooke bond') || matchesWord(text, 'red label')) return 'Brooke Bond';
  if (matchesWord(text, 'taj mahal')) return 'Taj Mahal';
  if (matchesWord(text, 'kwality walls') || matchesWord(text, "kwality wall's")) return "Kwality Wall's";
  
  // Single-word brand matches
  if (matchesWord(text, 'dove')) return 'Dove';
  if (matchesWord(text, 'rexona')) return 'Rexona';
  if (matchesWord(text, 'lifebuoy')) return 'Lifebuoy';
  if (matchesWord(text, 'lux')) return 'Lux';
  if (matchesWord(text, "pond's") || matchesWord(text, 'ponds')) return "Pond's";
  if (matchesWord(text, 'lakme') || matchesWord(text, 'lakmé')) return 'Lakmé';
  if (matchesWord(text, 'sunsilk')) return 'Sunsilk';
  if (matchesWord(text, 'tresemme') || matchesWord(text, 'tresemmé')) return 'Tresemme';
  if (matchesWord(text, 'vaseline')) return 'Vaseline';
  if (matchesWord(text, 'rin')) return 'Rin';
  if (matchesWord(text, 'vim')) return 'Vim';
  if (matchesWord(text, 'comfort')) return 'Comfort';
  if (matchesWord(text, 'domex')) return 'Domex';
  if (matchesWord(text, 'bru')) return 'Bru';
  if (matchesWord(text, 'knorr')) return 'Knorr';
  if (matchesWord(text, 'kissan')) return 'Kissan';
  if (matchesWord(text, 'horlicks')) return 'Horlicks';
  if (matchesWord(text, 'boost')) return 'Boost';
  if (matchesWord(text, 'blinkit') || matchesWord(text, 'zepto') || matchesWord(text, 'instamart') || matchesWord(text, 'shikar')) return 'HUL Logistics';

  return fallback;
}
