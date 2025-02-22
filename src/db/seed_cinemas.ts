import jsdom from "jsdom";
(async function () {
  const response = await fetch(
    "https://www.csfd.cz/kino/1-praha/"
  );
  const html = await response.text();

  const doc = new jsdom.JSDOM(html);
  const cinemas = doc.window.document.querySelectorAll(
    "section.box.box-cinema"
  );

  console.log(cinemas.length);

  const r = [...cinemas].map((cinemaSection) => {
    const id = +cinemaSection.id.split("-")[1];
    const name = cinemaSection
      .querySelector("header a")
      ?.textContent?.substring(8) as string;
    return { id, name };
  });
  console.log({ r });
})();
