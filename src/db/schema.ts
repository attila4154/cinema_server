import {
  index,
  pgTable,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable(
  "user",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    password: varchar({ length: 255 }).notNull().unique(),
  },
  (table) => [index("email_idx").on(table.email)]
);

// todo: better to infer from drizzle but id is nullable for some reason
export type UserInfo = {
  id: string,
  email: string,
}
