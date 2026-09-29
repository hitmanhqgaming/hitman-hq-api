const ALLOWED_ORIGIN = "*";

export default {
  async fetch(request) {
    const headers = {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
      "Cache-Control": "public, max-age=60"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          ...headers,
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      });
    }

    if (request.method !== "GET") {
      return new Response(
        JSON.stringify({
          error: "Method not allowed"
        }),
        {
          status: 405,
          headers
        }
      );
    }

    return new Response(
      JSON.stringify({
        status: "online",
        service: "HITMAN HQ API",
        channel: "HitmanHQ Gaming",
        channel_url: "https://www.youtube.com/@HitmanHQGaming",
        latest: null
      }),
      {
        status: 200,
        headers
      }
    );
  }
};
