import { sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTable,
  text,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable(
  "user",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    password: varchar({ length: 255 }).notNull().unique(),
    cinemas: integer()
      .array()
      .notNull()
      .default(sql`'{}'::integer[]`), // empty list by default
  },
  (table) => [index("email_idx").on(table.email)]
);

export const cinemaTable = pgTable("cinema", {
  id: integer().primaryKey().notNull(),
  name: varchar({ length: 128 }).notNull(),
  url: varchar({ length: 256 }),
});

export const filmTable = pgTable("film", {
  id: integer().primaryKey().notNull(),
  data: text().notNull(),
});

// todo: better to infer from drizzle but id is nullable for some reason
export type UserInfo = {
  id: string;
  email: string;
};
