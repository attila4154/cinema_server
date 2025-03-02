import { db } from "@/db";
import { filmTable } from "@/db/schema";
import { inArray } from "drizzle-orm";
import { CSFDMovie } from "node-csfd-api/interfaces/movie.interface";

export async function createFilms(filmsData: CSFDMovie[]) {
  const toInsert = filmsData.map((f) => ({
    id: f.id,
    data: JSON.stringify(f),
  }));

  await db.insert(filmTable).values(toInsert);
}

export async function getFilmData(
  ids: number[]
): Promise<CSFDMovie[]> {
  console.log("getting film data from db");
  const res = await db
    .select()
    .from(filmTable)
    .where(inArray(filmTable.id, ids));

  return res.map(
    ({ data }) => JSON.parse(data) as CSFDMovie
  );
}
