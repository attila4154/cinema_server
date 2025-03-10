import { db } from "@/db";
import { cinemaTable } from "@/db/schema";

const data = [
  {
    id: 110,
    name: "CineStar Praha - Anděl",
    url: null,
  },
  {
    id: 111,
    name: "CineStar Praha - Černý Most",
    url: null,
  },
  {
    id: 81,
    name: "Cinema City Flora",
    url: null,
  },
  {
    id: 2443,
    name: "Cinema City Chodov",
    url: null,
  },
  {
    id: 100,
    name: "Cinema City Letňany",
    url: null,
  },
  {
    id: 101,
    name: "Cinema City Nový Smíchov",
    url: null,
  },
  {
    id: 103,
    name: "Cinema City Slovanský dům",
    url: null,
  },
  {
    id: 84,
    name: "Cinema City Zličín",
    url: null,
  },
  {
    id: 2751,
    name: "Divadlo Za plotem",
    url: null,
  },
  {
    id: 1178,
    name: "KC Beseda",
    url: null,
  },
  {
    id: 3192,
    name: "Kino Balt",
    url: null,
  },
  {
    id: 3152,
    name: "Kino Kavalírka",
    url: null,
  },
  {
    id: 106,
    name: "Kino Radotín",
    url: null,
  },
  {
    id: 86,
    name: "Komorní kino Evald",
    url: null,
  },
  {
    id: 3213,
    name: "Městská knihovna v Praze - Petřiny",
    url: null,
  },
  {
    id: 205,
    name: "Městská knihovna v Praze - Ústřední knihovna",
    url: null,
  },
  {
    id: 97,
    name: "Modřanský biograf",
    url: null,
  },
  {
    id: 1303,
    name: "Premiere Cinemas Praha Hostivař",
    url: null,
  },
  {
    id: 2779,
    name: "Přítomnost Boutique Cinema",
    url: null,
  },
  {
    id: 79,
    name: "Bio Oko",
    url: "https://www.biooko.net/en?sort=sort-by-data",
  },
  {
    id: 243,
    name: "Kino 35",
    url: "https://kino35.ifp.cz/",
  },
  {
    id: 109,
    name: "Kino Světozor",
    url: "https://www.kinosvetozor.cz/en?sort=sort-by-data",
  },
  {
    id: 94,
    name: "Kino Lucerna",
    url: "https://www.kinolucerna.cz/klient-263/kino-68/stranka-3705/jazyk-en_GB",
  },
  {
    id: 105,
    name: "Kino Ponrepo",
    url: "https://nfa.cz/cs/kino-ponrepo/program/program",
  },
  {
    id: 2178,
    name: "Kino Pilotů",
    url: "https://kinopilotu.cz/",
  },
  {
    id: 95,
    name: "Kino MAT",
    url: "https://www.mat.cz/kino/",
  },
  {
    id: 2655,
    name: "Edison Filmhub",
    url: "https://edisonfilmhub.cz/program",
  },
  {
    id: 2123,
    name: "Dlabačov",
    url: "https://dlabacov.cz/",
  },
  {
    id: 78,
    name: "Kino Atlas",
    url: "https://www.kinoatlaspraha.cz/",
  },
  {
    id: 77,
    name: "Kino Aero",
    url: "https://kinoaero.cz/en?sort=sort-by-data",
  },
];

export async function GET() {
  try {
    await db.insert(cinemaTable).values(data);
  } catch (e) {
    console.log("failed to insert cinemas", e);
    return new Response("not ok", { status: 500 });
  }
  return new Response("ok", { status: 200 });
}
