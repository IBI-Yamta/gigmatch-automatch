export type Trade = "Plumber" | "Electrician" | "Tailor" | "Carpenter" | "Painter" | "Mechanic";

export const TRADES: Trade[] = [
  "Plumber",
  "Electrician",
  "Tailor",
  "Carpenter",
  "Painter",
  "Mechanic",
];

export const TRADE_KEYWORDS: Record<Trade, string[]> = {
  Plumber: [
    "pipe", "leak", "water", "clog", "drain", "faucet", "sink", "toilet",
    "shower", "boiler", "burst", "plumbing", "tap", "basin", "sewer", "plumber",
  ],
  Electrician: [
    "wire", "socket", "light", "breaker", "switch", "outlet", "power",
    "spark", "short circuit", "fuse", "shock", "electrical", "circuit",
    "voltage", "panel", "electrician", "wiring", "bulb", "fixture",
  ],
  Tailor: [
    "suit", "dress", "sew", "alter", "fit", "tear", "zipper", "hem",
    "fabric", "stitch", "thread", "jacket", "pants", "shirt", "skirt",
    "tailor", "alteration", "seam", "cuff", "button",
  ],
  Carpenter: [
    "wood", "door", "cabinet", "table", "chair", "deck", "frame", "hinge",
    "shelf", "saw", "furniture", "carpenter", "drawer", "trim", "molding",
    "floor", "stair", "railing", "cabinet", "plywood",
  ],
  Painter: [
    "paint", "wall", "ceiling", "drywall", "coat", "color", "roller",
    "brush", "stain", "wallpaper", "plaster", "painter", "priming",
    "spackle", "texture", "finish", "trim paint",
  ],
  Mechanic: [
    "engine", "car", "motor", "brakes", "transmission", "exhaust", "tire",
    "oil change", "noise", "battery", "bumper", "vehicle", "mechanic",
    "clutch", "radiator", "alternator", "starter", "axle", "suspension",
    "steering", "brake", "wheel", "garage", "auto",
  ],
};

export function categorizeDescription(description: string): Trade | "Uncategorized" {
  const lower = description.toLowerCase();
  const scores: Record<Trade, number> = {
    Plumber: 0,
    Electrician: 0,
    Tailor: 0,
    Carpenter: 0,
    Painter: 0,
    Mechanic: 0,
  };

  for (const [trade, keywords] of Object.entries(TRADE_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lower.includes(keyword)) {
        // Exact substring matches score higher
        const exactMatch = new RegExp(`\\b${keyword}\\b`, "i");
        if (exactMatch.test(description)) {
          scores[trade as Trade] += 3;
        } else {
          scores[trade as Trade] += 1;
        }
      }
    }
  }

  const maxScore = Math.max(...Object.values(scores));
  if (maxScore === 0) return "Uncategorized";

  const topTrade = Object.entries(scores).find(
    ([, score]) => score === maxScore
  )![0] as Trade;

  return topTrade;
}

export function getTradeIcon(trade: Trade | "Uncategorized"): string {
  const icons: Record<string, string> = {
    Plumber: "Droplets",
    Electrician: "Zap",
    Tailor: "Scissors",
    Carpenter: "Hammer",
    Painter: "Paintbrush",
    Mechanic: "Wrench",
    Uncategorized: "Search",
  };
  return icons[trade] || "Search";
}

export function getTradeColor(trade: Trade | "Uncategorized"): string {
  const colors: Record<string, string> = {
    Plumber: "text-cyan-400",
    Electrician: "text-amber-400",
    Tailor: "text-pink-400",
    Carpenter: "text-orange-400",
    Painter: "text-indigo-400",
    Mechanic: "text-emerald-400",
    Uncategorized: "text-muted-foreground",
  };
  return colors[trade] || "text-muted-foreground";
}

export function getTradeBadgeColor(trade: Trade | "Uncategorized"): string {
  const colors: Record<string, string> = {
    Plumber: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
    Electrician: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    Tailor: "bg-pink-500/15 text-pink-400 border-pink-500/30",
    Carpenter: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    Painter: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
    Mechanic: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    Uncategorized: "bg-muted text-muted-foreground border-border",
  };
  return colors[trade] || "bg-muted text-muted-foreground border-border";
}