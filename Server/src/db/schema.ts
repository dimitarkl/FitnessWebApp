import { bigint, integer, pgTable, real, timestamp, varchar } from "drizzle-orm/pg-core";
//TODO Likes not implemented
export const usersTable = pgTable("users", {
    id: bigint({ mode: 'bigint' }).primaryKey().generatedAlwaysAsIdentity(),
    email: varchar().unique().notNull(),
    password: varchar().notNull(),
    preferredWeightUnit: varchar().notNull().default('kg'),
    username: varchar(),
})


export const workoutTable = pgTable("workout", {
    id: bigint({ mode: 'bigint' }).primaryKey().generatedAlwaysAsIdentity(),
    ownerId: bigint({ mode: 'bigint' }).references(() => usersTable.id),
    title: varchar().notNull(),
    created_at: timestamp({ withTimezone: true }).defaultNow()
})

export const exerciseTable = pgTable('exercise', {
    id: bigint({ mode: 'bigint' }).primaryKey().generatedAlwaysAsIdentity(),
    name: varchar().notNull()
})

export const exerciseSetTable = pgTable('exercise_set', {
    id: bigint({ mode: 'bigint' }).primaryKey().generatedAlwaysAsIdentity(),
    reps: real().notNull(),
    weight: integer().notNull(),
    w_e_id: bigint({ mode: 'bigint' }).references(() => workoutExerciseTable.id, { onDelete: 'cascade' })
})
export const workoutExerciseTable = pgTable('workout_exercise', {
    id: bigint({ mode: 'bigint' }).primaryKey().generatedAlwaysAsIdentity(),
    workoutId: bigint({ mode: 'bigint' })
        .notNull()
        .references(() => workoutTable.id, { onDelete: 'cascade' }),
    exerciseId: bigint({ mode: 'bigint' })
        .notNull()
        .references(() => exerciseTable.id, { onDelete: 'cascade' })
});