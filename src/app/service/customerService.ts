import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function customerExists(
  email: string
): Promise<boolean> {
  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

  return user.length !== 0;
}
