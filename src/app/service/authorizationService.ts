import { UserInfo } from "@/db/schema";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export type AuthState =
  | { loggedIn: true; user: UserInfo }
  | { loggedIn: false };

export async function getAuthState(): Promise<AuthState> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");
  if (!accessToken) {
    return { loggedIn: false };
  }

  try {
    const userInfo = jwt.verify(
      accessToken.value,
      "secret"
    );
    return { loggedIn: true, user: userInfo as UserInfo };
  } catch (e) {
    console.log("incorrect token", e);
    return { loggedIn: false };
  }
}

export async function removeAccessTokenCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
}
