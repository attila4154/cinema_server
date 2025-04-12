import { cookies } from "next/headers";
import { HomePageClient } from "./components/HomePageClient";
import {
  getCachedCinemas,
  getCachedScreenings,
} from "./service/cachingService";

async function getCinemas() {
  const cookieStore = await cookies();
  return (
    cookieStore
      .get("cinemaIds")
      ?.value.split(",")
      .map((id) => +id) || []
  );
}

export default async function Home() {
  const userCinemaIds = await getCinemas();
  const allCinemas = await getCachedCinemas();
  const allScreenings = await getCachedScreenings();

  return (
    <HomePageClient
      initialScreenings={allScreenings}
      allCinemas={allCinemas}
      initialUserCinemaIds={userCinemaIds}
    />
  );
}
