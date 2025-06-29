CREATE TABLE "exercise_set" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "exercise_set_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"reps" real NOT NULL,
	"weight" integer NOT NULL,
	"w_e_id" bigint
);
--> statement-breakpoint
CREATE TABLE "exercise" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "exercise_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"name" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"email" varchar NOT NULL,
	"password" varchar NOT NULL,
	"preferredWeightUnit" varchar,
	"username" varchar,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "weight_units" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "weight_units_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"unit" varchar,
	CONSTRAINT "weight_units_unit_unique" UNIQUE("unit")
);
--> statement-breakpoint
CREATE TABLE "workout_exercise" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "workout_exercise_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"workoutId" bigint NOT NULL,
	"exerciseId" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workout" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "workout_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"ownerId" bigint,
	"title" varchar NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "exercise_set" ADD CONSTRAINT "exercise_set_w_e_id_workout_exercise_id_fk" FOREIGN KEY ("w_e_id") REFERENCES "public"."workout_exercise"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_preferredWeightUnit_weight_units_unit_fk" FOREIGN KEY ("preferredWeightUnit") REFERENCES "public"."weight_units"("unit") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_exercise" ADD CONSTRAINT "workout_exercise_workoutId_workout_id_fk" FOREIGN KEY ("workoutId") REFERENCES "public"."workout"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_exercise" ADD CONSTRAINT "workout_exercise_exerciseId_exercise_id_fk" FOREIGN KEY ("exerciseId") REFERENCES "public"."exercise"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout" ADD CONSTRAINT "workout_ownerId_users_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;