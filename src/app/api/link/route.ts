export async function GET(req: Request) {
  const url = new URL(req.url);
  const href = url.searchParams.get("url");

  if (!href) {
    return new Response("Invalid href.", { status: 400 });
  }

  const response = await fetch(href, {
    method: "GET",
  });
  const data = await response.text();

  const titleMatches = data.match(/<title>(.*?)<\/title>/);
  const title = titleMatches ? titleMatches[1] : "";

  const descriptionMatches = data.match(
    /<meta name="description" content="(.*?)" /,
  );
  const description = descriptionMatches ? descriptionMatches[1] : "";

  const imageMatches = data.match(/<meta property="og:image" content="(.*?)"/);
  const imageUrl = imageMatches ? imageMatches[1] : "";

  return new Response(
    JSON.stringify({
      success: 1,
      meta: {
        title,
        description,
        image: {
          url: imageUrl,
        },
      },
    }),
  );
}
