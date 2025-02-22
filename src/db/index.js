"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
require("dotenv/config");
var node_postgres_1 = require("drizzle-orm/node-postgres");
// todo: implement connection pool instead
// You can specify any property from the node-postgres connection options
exports.db = (0, node_postgres_1.drizzle)({
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: true,
    },
});
