import { getAuthState } from "@/app/service/authorizationService";
import { updateCinemas } from "@/app/service/db/customerService";

export async function PUT(req: Request) {
  const authState = await getAuthState();

  if (!authState.loggedIn) {
    return new Response("", { status: 401 });
  }

  const cinemaIds = (await req.json()) as number[];

  await updateCinemas(authState.user.id, cinemaIds);
  return Response.json("", { status: 200 });
}
