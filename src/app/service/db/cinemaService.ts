import { db } from "@/db";
import { cinemaTable } from "@/db/schema";
import { inArray } from "drizzle-orm";
import { getUser } from "./customerService";

export async function getAllCinemas() {
  const cinemas = await db.select().from(cinemaTable);
  return cinemas;
}

// todo: move to userservice
export async function getCinemasForUser(userId: string) {
  const user = await getUser(userId);
  const cinemas = await db
    .select()
    .from(cinemaTable)
    .where(inArray(cinemaTable.id, user.cinemas));

  return cinemas;
}
