import { pgTable, text, varchar, uuid, timestamp, jsonb, boolean, integer } from "drizzle-orm/pg-core";

// Users
export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    username: varchar("username", { length: 50 }).notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    preferences: jsonb("preferences").default({}),
    createdAt: timestamp("created_at").defaultNow(),
});

// Resources
export const resources = pgTable("resources", {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    type: varchar("type", { length: 50 }).notNull(),
    url: text("url"),
    description: text("description"),
    thumbnailUrl: text("thumbnail_url"),
    rating: integer("rating").default(0),
    difficulty: varchar("difficulty", { length: 50 }),
    metadata: jsonb("metadata").default({}),
    createdAt: timestamp("created_at").defaultNow(),
});

// User ↔ Resources
export const userResources = pgTable("user_resources", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull().references(() => users.id),
    resourceId: uuid("resource_id").notNull().references(() => resources.id),
    status: varchar("status", { length: 50 }).default("saved"),
    progress: integer("progress").default(0),
    bookmarked: boolean("bookmarked").default(false),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// Chat
export const chatMessages = pgTable("chat_messages", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull().references(() => users.id),
    message: text("message").notNull(),
    response: text("response"),
    timestamp: timestamp("timestamp").defaultNow(),
});

// Activity
export const userActivities = pgTable("user_activities", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull().references(() => users.id),
    action: varchar("action", { length: 100 }).notNull(),
    metadata: jsonb("metadata").default({}),
    timestamp: timestamp("timestamp").defaultNow(),
});
