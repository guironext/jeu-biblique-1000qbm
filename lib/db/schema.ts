import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["PLAYER", "ADMIN"]);
export const stageStatusEnum = pgEnum("stage_status", [
  "LOCKED",
  "UNLOCKED",
  "COMPLETED",
]);
export const sectionStatusEnum = pgEnum("section_status", [
  "LOCKED",
  "UNLOCKED",
  "FAILED",
  "PASSED",
]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: userRoleEnum("role").notNull().default("PLAYER"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const playerProfiles = pgTable("player_profiles", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  fullName: text("full_name").notNull().default(""),
  phone: text("phone").notNull(),
  countryCode: text("country_code").notNull(),
  locale: text("locale").notNull(),
  onboardedAt: timestamp("onboarded_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const stages = pgTable(
  "stages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    locale: text("locale").notNull(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    orderIndex: integer("order_index").notNull(),
    published: boolean("published").notNull().default(false),
    imageUrl: text("image_url"),
  },
  (table) => [
    uniqueIndex("stages_locale_slug_idx").on(table.locale, table.slug),
    uniqueIndex("stages_locale_order_idx").on(table.locale, table.orderIndex),
  ],
);

export const sections = pgTable(
  "sections",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    stageId: uuid("stage_id")
      .notNull()
      .references(() => stages.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    orderIndex: integer("order_index").notNull(),
    published: boolean("published").notNull().default(false),
    imageUrl: text("image_url"),
  },
  (table) => [
    uniqueIndex("sections_stage_order_idx").on(table.stageId, table.orderIndex),
  ],
);

export const questions = pgTable(
  "questions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    sectionId: uuid("section_id")
      .notNull()
      .references(() => sections.id, { onDelete: "cascade" }),
    prompt: text("prompt").notNull(),
    orderIndex: integer("order_index").notNull(),
    published: boolean("published").notNull().default(false),
  },
  (table) => [
    uniqueIndex("questions_section_order_idx").on(
      table.sectionId,
      table.orderIndex,
    ),
  ],
);

export const answers = pgTable("answers", {
  id: uuid("id").defaultRandom().primaryKey(),
  questionId: uuid("question_id")
    .notNull()
    .references(() => questions.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  orderIndex: integer("order_index").notNull(),
  isCorrect: boolean("is_correct").notNull().default(false),
});

export const stageProgress = pgTable(
  "stage_progress",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    stageId: uuid("stage_id")
      .notNull()
      .references(() => stages.id, { onDelete: "cascade" }),
    status: stageStatusEnum("status").notNull().default("LOCKED"),
  },
  (table) => [
    uniqueIndex("stage_progress_user_stage_idx").on(table.userId, table.stageId),
  ],
);

export const sectionProgress = pgTable(
  "section_progress",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    sectionId: uuid("section_id")
      .notNull()
      .references(() => sections.id, { onDelete: "cascade" }),
    status: sectionStatusEnum("status").notNull().default("LOCKED"),
    bestScore: integer("best_score").notNull().default(0),
    lastScore: integer("last_score").notNull().default(0),
    attempts: integer("attempts").notNull().default(0),
  },
  (table) => [
    uniqueIndex("section_progress_user_section_idx").on(
      table.userId,
      table.sectionId,
    ),
  ],
);

export const attempts = pgTable("attempts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  sectionId: uuid("section_id")
    .notNull()
    .references(() => sections.id, { onDelete: "cascade" }),
  score: integer("score").notNull(),
  passed: boolean("passed").notNull(),
  finishedAt: timestamp("finished_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(playerProfiles, {
    fields: [users.id],
    references: [playerProfiles.userId],
  }),
  stageProgress: many(stageProgress),
  sectionProgress: many(sectionProgress),
}));

export const playerProfilesRelations = relations(playerProfiles, ({ one }) => ({
  user: one(users, {
    fields: [playerProfiles.userId],
    references: [users.id],
  }),
}));

export const stagesRelations = relations(stages, ({ many }) => ({
  sections: many(sections),
  progress: many(stageProgress),
}));

export const sectionsRelations = relations(sections, ({ one, many }) => ({
  stage: one(stages, {
    fields: [sections.stageId],
    references: [stages.id],
  }),
  questions: many(questions),
  progress: many(sectionProgress),
}));

export const questionsRelations = relations(questions, ({ one, many }) => ({
  section: one(sections, {
    fields: [questions.sectionId],
    references: [sections.id],
  }),
  answers: many(answers),
}));

export const answersRelations = relations(answers, ({ one }) => ({
  question: one(questions, {
    fields: [answers.questionId],
    references: [questions.id],
  }),
}));

export const stageProgressRelations = relations(stageProgress, ({ one }) => ({
  user: one(users, {
    fields: [stageProgress.userId],
    references: [users.id],
  }),
  stage: one(stages, {
    fields: [stageProgress.stageId],
    references: [stages.id],
  }),
}));

export const sectionProgressRelations = relations(
  sectionProgress,
  ({ one }) => ({
    user: one(users, {
      fields: [sectionProgress.userId],
      references: [users.id],
    }),
    section: one(sections, {
      fields: [sectionProgress.sectionId],
      references: [sections.id],
    }),
  }),
);
