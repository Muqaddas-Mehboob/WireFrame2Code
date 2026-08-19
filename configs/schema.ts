import { integer, pgTable, varchar, uuid, text, timestamp, json } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    credits: integer().default(0)
});


export const wireframeRecords = pgTable("wireframe_records", {
  id: uuid("id").defaultRandom().primaryKey(),
  imageUrl: text("image_url").notNull(),
  userDescription: text("user_description"),
  aiModel: text("ai_model"),
  generatedCode: text("generated_code"),
  status: text("status").default("pending"), // pending | processing | completed | failed
  createdAt: timestamp("created_at").defaultNow(),
});