import { db } from "@/db";
import { cinemaTable } from "@/db/schema";
import { getUser } from "./customerService";

export async function getAllCinemas() {
  const cinemas = await db.select().from(cinemaTable);
  return cinemas;
}

// todo: move to userservice
export async function getCinemasForUser(userId: string) {
  return (await getUser(userId)).cinemas;
}
