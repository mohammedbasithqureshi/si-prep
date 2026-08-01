import type { VercelRequest, VercelResponse } from "@vercel/node";
import Parser from "rss-parser";

const parser = new Parser();

// Verified working as of this deployment. If PIB restructures their site,
// re-check via https://pib.gov.in/ViewRss.aspx?reg=1&lang=1 for the current URL.
const FEEDS = [
  { url: "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=1", source: "PIB India — Press Releases" },
  { url: "https://timesofindia.indiatimes.com/rssfeeds/-2128936835.cms", source: "Times of India — India" },
];

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const results = await Promise.allSettled(FEEDS.map((f) => parser.parseURL(f.url)));
    const items = results.flatMap((r, i) => {
      if (r.status !== "fulfilled") return [];
      return r.value.items.slice(0, 8).map((item) => ({
        title: item.title || "",
        link: item.link || "",
        pubDate: item.pubDate || "",
        source: FEEDS[i].source,
      }));
    });
    items.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
    res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate");
    res.status(200).json(items.slice(0, 15));
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch current affairs" });
  }
}