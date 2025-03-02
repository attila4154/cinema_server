"use server";

import { getUserByEmailAndPwd } from "@/app/service/db/customerService";
import { createJWT } from "@/app/service/encryptionService";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function submitLoginForm(
  /* eslint-disable @typescript-eslint/no-explicit-any */
  state: any,
  formData: FormData
) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    // todo:
    return { error: "missing values" };
  }

  const res = await getUserByEmailAndPwd({
    email,
    password,
  });

  if (res.result === "not_found") {
    return { error: "Email not found" };
  }

  if (res.result === "wrong_pwd") {
    return { error: "Wrong password" };
  }

  if (res.result === "ok") {
    const { userInfo } = res;

    const accessToken = createJWT(userInfo);
    const cookieStore = await cookies();

    cookieStore.set("accessToken", accessToken, {
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
      // todo: yes in prod
      secure: false,
    });

    redirect("/");
  }
}
