import "dotenv/config";
import { drizzle } from "drizzle-orm/vercel-postgres";

// todo: implement connection pool instead
// You can specify any property from the node-postgres connection options
export const db = drizzle({
  connection: {
    connectionString: process.env.DATABASE_URL!,
    ssl: true,
  },
});
