import { HomePageClient } from "./components/HomePageClient";
import {
  AuthState,
  getAuthState,
} from "./service/authorizationService";
import { getCachedScreenings } from "./service/cachingService";
import { getCinemasForUser } from "./service/db/cinemaService";

async function getCinemas(authState: AuthState) {
  if (!authState.loggedIn) return [];
  return await getCinemasForUser(authState.user.id);
}

export default async function Home() {
  const authState = await getAuthState();
  const userCinemaIds = await getCinemas(authState);
  const allScreenings = await getCachedScreenings();

  const allCinemas = allScreenings.map((s) => ({
    cinemaId: s.cinemaId,
    cinemaName: s.cinemaName,
  }));

  return (
    <HomePageClient
      initialScreenings={allScreenings}
      authState={authState}
      initialUserCinemaIds={userCinemaIds}
      allCinemas={allCinemas}
    />
  );
}
