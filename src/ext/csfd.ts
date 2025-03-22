import { getFilmData } from "@/app/service/db/filmService";
import { zip } from "@/app/util/util";
import jsdom from "jsdom";
import { CSFDMovie } from "node-csfd-api/interfaces/movie.interface";

export type Language = "cz" | "dubbed" | "subs";

function getFilmIdFromLink(link: HTMLLinkElement): number {
  const filmUrl = link.href;
  const match = filmUrl.match(/\/film\/(\d+)-/);
  if (!match) {
    console.log(filmUrl + " doesn't match the id regex");
    throw new Error("malformed film url: " + filmUrl);
  }

  return +match[1];
}

function extractFilmData(screening: Element) {
  const screeningLink = screening.querySelector(
    "a.film-title-name"
  ) as HTMLLinkElement;

  const filmId = getFilmIdFromLink(screeningLink);

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
    const screenings = [
      ...screening.querySelectorAll("td.td-time"),
    ]
      .map((timeCol) => timeCol.textContent!.trim())
      // there might be multple screenings at the same column
      .flatMap((time) => time.match(/\b\d{1,2}:\d{2}\b/g))
      .filter((time) => time !== null);

    const { filmId, filmName, language } =
      extractFilmData(screening);
    const screeningTimes = screenings.map((time) => ({
      time,
      language,
    }));

    return {
      filmId,
      filmName,
      screeningTimes,
    };
  });

  return screenings;
}

export type ScreeningTime = {
  time: string;
  language: Language;
};

export type OneDayScreening = {
  filmId: number;
  filmName: string;
  year?: number;
  length?: string | undefined;
  countries?: string[] | undefined;
  screeningTimes: ScreeningTime[];
};

export type ScreeningData = {
  date: string;
  screenings: OneDayScreening[];
};

export type CinemaScreeningData = {
  cinemaId: number;
  cinemaName: string;
  screenings: ScreeningData[];
};

export function getFilmIds(
  screenings: CinemaScreeningData[]
): number[] {
  const ids = screenings.flatMap((s) =>
    s.screenings.flatMap((s) =>
      s.screenings.map((s) => s.filmId)
    )
  );

  return [...new Set(ids)];
}

export async function getFilmDataFromHtml(
  doc: jsdom.JSDOM
): Promise<CSFDMovie[]> {
  const filmLinks = [
    ...doc.window.document.querySelectorAll(
      ".film-title-name"
    ),
  ] as HTMLLinkElement[];

  const filmIds = [
    ...new Set(
      filmLinks.map((link) => getFilmIdFromLink(link))
    ),
  ];

  return await getFilmData(filmIds);
}

function enrichWithFilmData(
  screening: OneDayScreening,
  filmsData: CSFDMovie[]
): OneDayScreening {
  const filmData = filmsData.find(
    (f) => f.id === screening.filmId
  );

  // todo: don't enrich but use data from db instead
  const filmName =
    filmData?.titlesOther.find(
      (t) => t.country === "US" || t.country === "USA"
    )?.title || screening.filmName;

  const year = filmData?.year;
  const length = filmData?.duration?.toString();
  const countries = filmData?.origins.slice(0, 2);

  return {
    ...screening,
    filmName,
    year,
    length,
    countries,
  };
}

export async function parseScreenings() {
  console.log("fetching data from csfd");
  const response = await fetch(
    "https://www.csfd.cz/kino/1-praha/?period=all"
  );
  const html = await response.text();

  const doc = new jsdom.JSDOM(html);
  const filmsData = await getFilmDataFromHtml(doc);

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
    const dayScreenings = [...dayScreeningsTable]
      .map((dayScreening) =>
        extractScreeningData(dayScreening)
      )
      .map((screenings) =>
        screenings.map((screening) =>
          enrichWithFilmData(screening, filmsData)
        )
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

  return res;
}
