import Parser from "rss-parser";
const parser = new Parser();
// Verify these feed URLs still resolve before relying on them — RSS
// endpoints occasionally change. PIB publishes official government releases;
// swap in any other reputable feed you trust.
const FEEDS = [
    { url: "https://pib.gov.in/PressReleaseIframePage.aspx?PRID=0", source: "PIB India" }, // placeholder — replace with a working PIB RSS URL you verify
    { url: "https://timesofindia.indiatimes.com/rssfeeds/-2128936835.cms", source: "Times of India — India" },
];
export default async function handler(_req, res) {
    try {
        const results = await Promise.allSettled(FEEDS.map((f) => parser.parseURL(f.url)));
        const items = results.flatMap((r, i) => {
            if (r.status !== "fulfilled")
                return [];
            return r.value.items.slice(0, 8).map((item) => ({
                title: item.title || "",
                link: item.link || "",
                pubDate: item.pubDate || "",
                source: FEEDS[i].source,
            }));
        });
        items.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
        res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate"); // cache 30 min at the edge
        res.status(200).json(items.slice(0, 15));
    }
    catch (e) {
        res.status(500).json({ error: "Failed to fetch current affairs" });
    }
}
