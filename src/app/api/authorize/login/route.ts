import { getUserByEmailAndPwd } from "@/app/service/customerService";
import { createJWT } from "@/app/service/encryptionService";

export async function POST(req: Request) {
  const json = await req.json();
  const { email, password } = json;

  const res = await getUserByEmailAndPwd({
    email,
    password,
  });
  if (res.result === "not_found") {
    return new Response("", { status: 404 });
  }

  if (res.result === "wrong_pwd") {
    return new Response("", { status: 401 });
  }

  if (res.result === "ok") {
    const { userInfo } = res;

    const accessToken = createJWT(userInfo);

    return Response.json(res.userInfo, {
      status: 200,
      headers: {
        "Set-Cookie": `accessToken=${accessToken}`,
      },
    });
  }

  console.log("This shouldn't happen");
  return new Response("Something unexpected happen", {
    status: 500,
  });
}
