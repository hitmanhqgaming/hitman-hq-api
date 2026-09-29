const CHANNEL_ID = "UCClntt9HBQirLO6m0klTY4g";
const CHANNEL_URL = "https://www.youtube.com/@HitmanHQGaming";
const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=60"
    }
  });
}

function getTag(xml, tag) {
  const match = xml.match(
    new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i")
  );

  if (!match) return "";

  return match[1]
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function getLatest(xml) {
  const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/gi)];

  if (!entries.length) return null;

  const entry = entries[0][1];

  const videoId = getTag(entry, "yt:videoId");
  const title = getTag(entry, "title");
  const publishedAt = getTag(entry, "published");

  const linkMatch = entry.match(
    /<link[^>]+rel=["']alternate["'][^>]+href=["']([^"']+)["']/i
  );

  const url =
    linkMatch?.[1] ||
    (videoId ? `https://www.youtube.com/watch?v=${videoId}` : "");

  return {
    video_id: videoId,
    title,
    url,
    thumbnail: videoId
      ? `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`
      : "",
    published_at: publishedAt,
    content_type: "YouTube"
  };
}

export default {
  async fetch(request) {
    if (request.method !== "GET") {
      return json({ error: "Method not allowed" }, 405);
    }

    try {
      const response = await fetch(RSS_URL, {
        headers: {
          "User-Agent": "HITMAN-HQ-API/1.0"
        }
      });

      if (!response.ok) {
        return json(
          {
            status: "error",
            message: "Unable to fetch YouTube channel feed",
            http_status: response.status
          },
          502
        );
      }

      const xml = await response.text();
      const latest = getLatest(xml);

      return json({
        status: "online",
        service: "HITMAN HQ API",
        channel: "HitmanHQ Gaming",
        channel_id: CHANNEL_ID,
        channel_url: CHANNEL_URL,
        latest
      });
    } catch (error) {
      return json(
        {
          status: "error",
          message: "Failed to read YouTube channel feed"
        },
        500
      );
    }
  }
};
