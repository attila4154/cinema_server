// import { neon } from "@neondatabase/serverless";
import "dotenv/config";
// import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/vercel-postgres";

// todo: implement connection pool instead

// let db;
// if (process.env.CONNECT_TO_PROD_DB === "true") {
//   const sql = neon(process.env.DATABASE_URL!);
//   db = drizzleNeon({ client: sql });
// } else {
  const db = drizzlePg({
    connection: {
      connectionString: process.env.DATABASE_URL!,
      ssl: true,
    },
  });
// }

export { db };
