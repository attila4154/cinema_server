import jsdom from "jsdom";

// todo: move to util
function zip<A, B>(a: A[], b: B[]): [A, B][] {
  if (a.length !== b.length)
    throw new Error("length mismatch!");
  return a.map((k, i) => [k, b[i]]);
}

export type Language = "cz" | "dubbed" | "subs";

function extractFilmData(screening: Element) {
  const screeningLink = screening.querySelector(
    "a.film-title-name"
  ) as HTMLLinkElement;

  const filmUrl = screeningLink.href;
  const match = filmUrl.match(/\/film\/(\d+)-/);
  if (!match) {
    console.log(filmUrl + " doesn't match the id regex");
    throw new Error("malformed film url: " + filmUrl);
  }

  const filmId = +match[1];
  const filmName = screeningLink.textContent as string;
  let language: Language;
  const langCol = screening.querySelector(
    "td.td-title"
  ) as HTMLDivElement;
  if (langCol.querySelector('span[title="Dabing"]'))
    language = "dubbed";
  else if (langCol.querySelector('span[title="Titulky"]'))
    language = "subs";
  else language = "cz";

  return { filmId, filmName, language };
}

function extractScreeningData(dayScreening: Element) {
  const screenings = [
    ...dayScreening.querySelectorAll("tr"),
  ].map((screening) => {
    const screeningTimes = [
      ...screening.querySelectorAll("td.td-time"),
    ].map((timeCol) => timeCol.textContent!.trim());

    return {
      ...extractFilmData(screening),
      screeningTimes,
    };
  });

  return screenings;
}

export type ScreeningList = {};

export type ScreeningData = {
  date: string;
  screenings: {
    filmId: number;
    filmName: string;
    language: Language;
    screeningTimes: string[];
  }[];
};

export type CinemaScreeningData = {
  cinemaId: number;
  cinemaName: string;
  screenings: ScreeningData[];
};

// todo: add normal caching
let result: CinemaScreeningData[] | undefined;

export async function parseScreenings() {
  if (result !== undefined) {
    console.log("returning csfd data from 'cache'");
    return result;
  }

  console.log("fetching data from csfd");
  const response = await fetch(
    "https://www.csfd.cz/kino/1-praha/?period=week"
  );
  const html = await response.text();

  const doc = new jsdom.JSDOM(html);
  const cinemas = doc.window.document.querySelectorAll(
    "section.box.box-cinema"
  );

  const res = [...cinemas].map((cinemaSection) => {
    const _cinemaHeader =
      cinemaSection.querySelector("header a");

    if (!_cinemaHeader?.textContent) {
      console.error(
        "Cinema section missing header",
        _cinemaHeader
      );
      throw new Error("cinema section missing header");
    }

    const cinemaName =
      _cinemaHeader.textContent.substring(8);
    const cinemaId = +cinemaSection.id.split("-")[1];

    const dates = [
      ...cinemaSection.querySelectorAll(
        "div.box-sub-header"
      ),
    ].map((dateHeader) => {
      const match = dateHeader.textContent?.match(
        /(\b\d{2}\.\d{2}\.\d{4}\b)/
      ) as string[];
      return match[1];
    });

    // day -> [screening]
    const dayScreeningsTable =
      cinemaSection.querySelectorAll("table.cinema-table");
    const dayScreenings = [...dayScreeningsTable].map(
      (dayScreening) => extractScreeningData(dayScreening)
    );

    const dateWithAllScreenings = zip(
      dates,
      dayScreenings
    ).map(([date, screenings]) => ({
      date,
      screenings,
    }));

    return {
      cinemaId,
      cinemaName,
      screenings: dateWithAllScreenings,
    };
  });

  result = res;

  return res;
}
