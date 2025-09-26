import type { Summary } from "@repo/types";
import { jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const models = pgTable("models", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    content: jsonb("content").$type<Summary>(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
