import "dotenv/config";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";

// todo: implement connection pool instead

export const db = drizzlePg({
  connection: {
    connectionString: process.env.DATABASE_URL!,
    ssl: false,
  },
});
