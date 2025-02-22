"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cinemaTable = exports.usersTable = void 0;
var drizzle_orm_1 = require("drizzle-orm");
var pg_core_1 = require("drizzle-orm/pg-core");
exports.usersTable = (0, pg_core_1.pgTable)("user", {
    id: (0, pg_core_1.uuid)().defaultRandom().primaryKey().notNull(),
    email: (0, pg_core_1.varchar)({ length: 255 }).notNull().unique(),
    password: (0, pg_core_1.varchar)({ length: 255 }).notNull().unique(),
    cinemas: (0, pg_core_1.integer)()
        .array()
        .notNull()
        .default((0, drizzle_orm_1.sql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["'{}'::integer[]"], ["'{}'::integer[]"])))), // empty list by default
}, function (table) { return [(0, pg_core_1.index)("email_idx").on(table.email)]; });
exports.cinemaTable = (0, pg_core_1.pgTable)("cinema", {
    id: (0, pg_core_1.integer)().primaryKey().notNull(),
    name: (0, pg_core_1.varchar)({ length: 128 }).notNull(),
});
var templateObject_1;
