import { db } from "@/db";
import { UserInfo, usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  generateRandomSalt,
  hashWithSalt,
} from "./encryptionService";

export async function customerExists(
  email: string
): Promise<boolean> {
  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

  return user.length !== 0;
}

export async function getUserByEmailAndPwd({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<
  | { result: "not_found" | "wrong_pwd" }
  | { result: "ok"; userInfo: UserInfo }
> {
  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if (user.length === 0) {
    return { result: "not_found" };
  }

  const userPassword = user[0].password;
  const [hashedPassword, salt] = userPassword.split(";");

  return hashWithSalt({ toHash: password, salt }) ===
    hashedPassword
    ? { result: "ok", userInfo: user[0] }
    : { result: "wrong_pwd" };
}

// todo: sanitize email
export async function createCustomer({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<{ id: string; email: string }> {
  const salt = generateRandomSalt();
  const hashedPassword = hashWithSalt({
    toHash: password,
    salt,
  });
  const passwordWithHash = `${hashedPassword};${salt}`;

  const user = await db
    .insert(usersTable)
    .values({ email, password: passwordWithHash })
    .returning({
      id: usersTable.id,
      email: usersTable.email,
    });

  return user[0];
}
