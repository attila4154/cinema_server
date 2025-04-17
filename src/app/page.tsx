import { cookies } from "next/headers";
import { HomePageClient } from "./components/HomePageClient";
import {
  getCachedCinemas,
  getCachedScreenings,
} from "./service/cachingService";
import { Watchlist } from "./service/cookieWatchlistService";

async function getCinemas() {
  const cookieStore = await cookies();
  const value = cookieStore.get("cinemaIds");
  if (!value?.value) {
    return [];
  }

  return value.value.split(",").map((id) => +id);
}

async function getWatchlist() {
  const cookieStore = await cookies();
  const wathclistCookie =
    cookieStore.get("watchlist")?.value;
  if (!wathclistCookie) {
    return [];
  }

  return JSON.parse(wathclistCookie) as Watchlist;
}

export default async function Home() {
  const userCinemaIds = await getCinemas();
  const userWatchlist = await getWatchlist();
  const allCinemas = await getCachedCinemas();
  const allScreenings = await getCachedScreenings();

  return (
    <HomePageClient
      initialScreenings={allScreenings}
      allCinemas={allCinemas}
      initialUserCinemaIds={userCinemaIds}
      initialWatchlist={userWatchlist}
    />
  );
}
