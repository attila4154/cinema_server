import "dotenv/config";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";

// todo: implement connection pool instead

// let db: NeonHttpDatabase; //|NodePgDatabase;
export const db = drizzlePg({
  connection: {
    connectionString: process.env.DATABASE_URL!,
    ssl: false,
  },
});
// ? (() => {
//     const sql = neon(process.env.DATABASE_URL!);
//     return drizzleNeon({ client: sql });
//   })()
