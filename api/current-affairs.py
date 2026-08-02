from http.server import BaseHTTPRequestHandler
import json
import feedparser
from datetime import datetime

FEEDS = [
    {"url": "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=1", "source": "PIB India — Press Releases"},
    {"url": "https://timesofindia.indiatimes.com/rssfeeds/-2128936835.cms", "source": "Times of India — India"},
]

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        items = []
        for feed in FEEDS:
            try:
                parsed = feedparser.parse(feed["url"])
                for entry in parsed.entries[:8]:
                    items.append({
                        "title": entry.get("title", ""),
                        "link": entry.get("link", ""),
                        "pubDate": entry.get("published", ""),
                        "source": feed["source"],
                    })
            except Exception:
                continue

        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.send_header("Cache-Control", "s-maxage=1800, stale-while-revalidate")
        self.end_headers()
        self.wfile.write(json.dumps(items[:15]).encode())