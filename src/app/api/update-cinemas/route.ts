import { db } from "@/db";
import { cinemaTable } from "@/db/schema";
import { eq } from "drizzle-orm";

const data = [
  {
    id: 79,
    url: "https://www.biooko.net/en?sort=sort-by-data",
  },
  {
    id: 77,
    url: "https://kinoaero.cz/en?sort=sort-by-data",
  },
  {
    id: 78,
    url: "https://www.kinoatlaspraha.cz/",
  },
  {
    id: 94,
    url: "https://www.kinolucerna.cz/klient-263/kino-68/stranka-3705/jazyk-en_GB",
  },
  {
    id: 95,
    url: "https://www.mat.cz/kino/",
  },
  {
    id: 105,
    url: "https://nfa.cz/cs/kino-ponrepo/program/program",
  },
  {
    id: 109,
    url: "https://www.kinosvetozor.cz/en?sort=sort-by-data",
  },
  {
    id: 243,
    url: "https://kino35.ifp.cz/",
  },
  {
    id: 2123,
    url: "https://dlabacov.cz/",
  },
  {
    id: 2178,
    url: "https://kinopilotu.cz/",
  },
  {
    id: 2655,
    url: "https://edisonfilmhub.cz/program",
  },
];

export async function GET() {
  data.forEach(async (d) => {
    console.log("updating " + d.id);
    await db
      .update(cinemaTable)
      .set({ url: d.url })
      .where(eq(cinemaTable.id, d.id));
  });
  return new Response("ok", { status: 200 });
}
