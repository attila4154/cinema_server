import { getAllScreenings } from "@/ext/csfd";
import { HomePageClient } from "./components/HomePageClient";
import {
  AuthState,
  getAuthState,
} from "./service/authorizationService";
import { getCinemasForUser } from "./service/db/cinemaService";

async function getCinemas(authState: AuthState) {
  if (!authState.loggedIn) return [];
  return await getCinemasForUser(authState.user.id);
}

export default async function Home() {
  const authState = await getAuthState();
  const userCinemaIds = await getCinemas(authState);
  const res = await getAllScreenings();
  // console.log(res);

  const allCinemas = res[0].map((s) => ({
    cinemaId: s.cinemaId,
    cinemaName: s.cinemaName,
  }));

  return (
    <HomePageClient
      initialScreenings={res[0]}
      authState={authState}
      initialUserCinemaIds={userCinemaIds}
      allCinemas={allCinemas}
      filmDataById={res[1]}
    />
  );
}
