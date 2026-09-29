export default {
  async fetch(request) {
    return new Response(
      JSON.stringify({
        status: "online",
        service: "HITMAN HQ API"
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
  }
};
