import { parseScreenings } from "@/ext/csfd";
import { HomePageClient } from "./components/HomePageClient";
import { getAuthState } from "./service/authorizationService";
import { getCinemasForUser } from "./service/db/cinemaService";

export default async function Home() {
  const allScreenings = await parseScreenings();
  const allCinemas = allScreenings.map((s) => ({
    cinemaId: s.cinemaId,
    cinemaName: s.cinemaName,
  }));
  const authState = await getAuthState();
  const userCinemaIds = authState.loggedIn
    ? await getCinemasForUser(authState.user.id)
    : [];

  return (
    <HomePageClient
      initialScreenings={allScreenings}
      authState={authState}
      initialUserCinemaIds={userCinemaIds}
      allCinemas={allCinemas}
    />
  );
}
