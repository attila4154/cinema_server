import { getFilmIds, parseScreenings } from "@/ext/csfd";
import { unstable_cache } from "next/cache";
import { csfd } from "node-csfd-api";
import { createFilms, getFilmData } from "./db/filmService";

export async function udpateCache(): Promise<boolean> {
  console.log("Updating cache");
  const screenings = await parseScreenings();
  const filmIds = getFilmIds(screenings);
  const filmsFromDb = await getFilmData(filmIds);
  const filmIdsFromDb = filmsFromDb.map((f) => f.id);

  const missingFilmIds = filmIds.filter(
    (id) => !filmIdsFromDb.includes(id)
  );
  console.log(
    `found ${filmIds.length} films in total; found ${filmIdsFromDb.length} in db`
  );

  try {
    for (let i = 0; i < missingFilmIds.length; i++) {
      const ids = [...missingFilmIds].slice(
        i * 5,
        i * 5 + 5
      );
      console.log("fetching data for films: " + ids);
      const csfdFilms = await Promise.all(
        ids.map((id) => csfd.movie(id))
      );
      await createFilms(csfdFilms);
    }
  } catch (e) {
    console.log("failed to fetch data from csfd", e);
    return false;
  }

  return true;
}

export const getCachedScreenings = unstable_cache(
  async () => await parseScreenings(),
  [],
  { revalidate: 1 * 60 }
);

// don't know if it's okay to use cache inside cache
export const getCachedFilmData = unstable_cache(
  async () => {
    const screenings = await getCachedScreenings();
    const filmIds = getFilmIds(screenings);
    return await getFilmData(filmIds);
  },
  [],
  { revalidate: 1 * 60 }
);
