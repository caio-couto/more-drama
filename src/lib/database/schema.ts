import { integer, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const novelsTable = pgTable('novels', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 120 }).notNull(),
  slug: varchar({ length: 120 }).notNull().unique(),
  thumbnailUrl: varchar("thumbnail_url", { length: 220 }),
  description: text().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const episodesTable = pgTable("episode", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 120 }).notNull(),
  season: integer().notNull(),
  episode: integer().notNull(),
  slug: varchar({ length: 120 }).notNull().unique(),
  thumbnailUrl: varchar("thumbnail_url", { length: 220 }),
  videoUrl: varchar("video_url", { length: 220 }),
  novelId: integer("novel_id").references(() => novelsTable.id, {
    onDelete: "cascade",
    onUpdate: "no action"
  }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});