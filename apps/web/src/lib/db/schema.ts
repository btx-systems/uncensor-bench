import type { Run, Summary } from "@repo/types";
import { jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const models = pgTable("models", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    content: jsonb("content").$type<Run>(),
    summary: jsonb("summary").$type<Summary>(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const summaries = pgTable("summaries", {
    id: text("id").primaryKey(),
    summary: jsonb("summary").$type<Summary>(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
