import { getAuthState } from "@/app/service/authorizationService";
import { getCinemasForUser } from "@/app/service/db/cinemaService";
import { updateCinemas } from "@/app/service/db/customerService";

export async function GET(req: Request) {
  const authState = await getAuthState();

  if (!authState.loggedIn) {
    return new Response("", { status: 401 });
  }

  const cinemas = await getCinemasForUser(
    authState.user.id
  );

  return Response.json(cinemas, { status: 200 });
}

export async function PUT(req: Request) {
  const authState = await getAuthState();

  if (!authState.loggedIn) {
    return new Response("", { status: 401 });
  }

  const cinemaIds = (await req.json()) as number[];

  await updateCinemas(authState.user.id, cinemaIds);
  return Response.json("", { status: 200 });
}
