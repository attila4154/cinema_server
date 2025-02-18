import jsdom from "jsdom";
// export const dynamic = "force-static"; // caching get responses

export async function GET() {
  const response = await fetch(
    "https://www.csfd.cz/kino/1-praha/"
  );
  const html = await response.text();

  const doc = new jsdom.JSDOM(html);
  const cinemas = doc.window.document.querySelectorAll(
    ".box.box-cinema"
  );

  console.log(cinemas.length);

  const r = [...cinemas]
    .map((cinema) => cinema.querySelector("header a "))
    .map((a) => a?.textContent) as string[];

  return Response.json(r, {
    headers: new Headers({
      "Cache-Control": "public, max-age=3600, immutable",
    }),
  });
}
