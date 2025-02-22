"use server";

import { getUserByEmailAndPwd } from "@/app/service/db/customerService";
import { createJWT } from "@/app/service/encryptionService";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function submitLoginForm(
  state: any,
  formData: FormData
) {
  // await new Promise((resolve) => {
  //   setTimeout(resolve, 1000);
  // });
  // console.log("from action", state);
  // console.log("from action", formData);
  // const data = {
  //   email: formData.get("email"),
  //   password: formData.get("password"),
  // };
  // console.log("from action", data);
  // const result = LoginFormDataSchema.safeParse(data);
  // console.log("form action", result);

  // if (result.success) {
  //   return { data: result.data };
  // }

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
      maxAge: 60 * 60,
      path: "/",
      // todo: yes in prod
      secure: false,
    });

    redirect("/");
  }
}
