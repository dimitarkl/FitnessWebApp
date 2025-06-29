ALTER TABLE "weight_units" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "weight_units" CASCADE;--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_preferredWeightUnit_weight_units_unit_fk";
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "preferredWeightUnit" SET DEFAULT 'kg';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "preferredWeightUnit" SET NOT NULL;