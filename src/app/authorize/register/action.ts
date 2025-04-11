"use server";

import {
  createCustomer,
  customerExists,
} from "@/app/service/db/customerService";
import { createJWT } from "@/app/service/encryptionService";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function submitRegisterForm(
  /* eslint-disable @typescript-eslint/no-explicit-any */
  state: any,
  formData: FormData
) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "missing values", email };
  }

  // todo: don't use it
  const exists = await customerExists(email);
  if (exists) {
    return { error: "Customer already exists", email };
  }

  const userInfo = await createCustomer({
    email,
    password,
  });

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
