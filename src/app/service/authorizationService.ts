import { UserInfo } from "@/db/schema";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function getUserInfo(): Promise<
  { loggedIn: true; user: UserInfo } | { loggedIn: false }
> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");
  // todo: signature check
  if (!accessToken) {
    return { loggedIn: false };
  }

  try {
    const userInfo = jwt.verify(
      accessToken.value,
      "secret"
    );
    console.log("decoded user info", userInfo);
    return { loggedIn: true, user: userInfo as UserInfo };
  } catch (e) {
    console.log("incorrect token", e);
    return { loggedIn: false };
  }
}

export async function removeAccessTokenCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('accessToken');
}