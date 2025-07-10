import db from "../db"
import { exerciseSetTable, exerciseTable, workoutExerciseTable, workoutTable } from "../db/schema"
import { Exercise, Workout } from "../../../shared/types/workout"
import { desc, eq, inArray } from "drizzle-orm"
import { getUser } from "./userService";
import { errString, kgToPounds, poundsToKg } from "../utils/util";
import { User } from "../../../shared/types/user";

const createWorkout = async (workoutData: Workout, ownerId: string) => {
    try {
        const [newWorkout] = await db.insert(workoutTable).values({
            title: workoutData.title,
            ownerId: BigInt(ownerId),
        }).returning({ id: workoutTable.id })

        for (const exercise of workoutData.exercises) {
            let [existingExercise] = await db.select({ id: exerciseTable.id }).from(exerciseTable).where(eq(exerciseTable.name, exercise.name)).limit(1)
            if (!existingExercise) throw new Error("Exercise Not Found")

            const [workoutExerciseRelation] = await db.insert(workoutExerciseTable).values({
                workoutId: newWorkout.id,
                exerciseId: existingExercise.id,
            }).returning({ id: workoutExerciseTable.id })

            if (exercise.sets && exercise.sets.length > 0) {
                const setValues = exercise.sets.map((set) => ({
                    reps: set.reps,
                    weight: String(set.weight),
                    w_e_id: workoutExerciseRelation.id,
                }));
                await db.insert(exerciseSetTable).values(setValues);
            }
        }

        return newWorkout.id.toString();

    } catch (err) {
        console.log(errString, (err as Error).message)
        return null
    }
}

const getExercises = async () => {
    try {
        const allExercises = await db.select().from(exerciseTable);

        const exercises = allExercises.map(exercise => ({
            id: exercise.id.toString(),
            name: exercise.name || "Unknown Exercise"
        }));

        return exercises;

    } catch (err) {
        console.log(errString, (err as Error).message)
        return null
    }
}

const findByOwner = async (ownerId: string) => {
    try {
        const workoutsToGet = await db.select().from(workoutTable).where(eq(workoutTable.ownerId, BigInt(Number(ownerId))))
        const workoutIds = workoutsToGet.map(workout => workout.id.toString());

        const workouts = workoutIds.map(async id => {
            const workout = await findWorkoutById(id);
            return workout;
        })

        return Promise.all(workouts)

    } catch (err) {
        console.log(errString, (err as Error).message)
    }
}

const getWorkouts = async (numWorkouts: number) => {
    try {
        const workoutsToGet = await db.select()
            .from(workoutTable)
            .orderBy(desc(workoutTable.created_at))
            .limit(numWorkouts)
        const workoutIds = workoutsToGet.map(workout => workout.id.toString());

        const workouts = workoutIds.map(async id => {
            const workout = await findWorkoutById(id);
            return workout;
        })

        return Promise.all(workouts)
    } catch (err) {
        console.log(errString, (err as Error).message)
        return [];
    }
}

const findWorkoutById = async (id: string) => {
    try {
        const [workout] = await db.select().from(workoutTable).where(eq(workoutTable.id, BigInt(id))).limit(1)
        if (!workout) throw new Error("Workout Not Found")

        const exercises = await db.select({
            workoutExerciseId: workoutExerciseTable.id,
            exerciseId: exerciseTable.id,
            exerciseName: exerciseTable.name
        })
            .from(workoutExerciseTable)
            .innerJoin(exerciseTable, eq(workoutExerciseTable.exerciseId, exerciseTable.id))
            .where(eq(workoutExerciseTable.workoutId, workout.id));

        const workoutExerciseIds = exercises.map(e => e.workoutExerciseId);
        let setsResult: { id: bigint; reps: number; weight: string; w_e_id: bigint | null }[] = [];

        if (workoutExerciseIds.length > 0) {
            setsResult = await db.select()
                .from(exerciseSetTable)
                .where(inArray(exerciseSetTable.w_e_id, workoutExerciseIds));
        }
        const exercisesMap = new Map<bigint, Exercise>();

        if (workoutExerciseIds.length > 0) {
            setsResult = await db.select()
                .from(exerciseSetTable)
                .where(inArray(exerciseSetTable.w_e_id, workoutExerciseIds));
        }

        for (const exResult of exercises) {
            exercisesMap.set(exResult.workoutExerciseId, {
                name: exResult.exerciseName ?? 'Unknown Exercise',
                sets: setsResult.filter(set => set.w_e_id === exResult.workoutExerciseId).map(set => {
                    return {
                        id: Number(set.id),
                        reps: set.reps,
                        weight: Number(set.weight),
                        w_e_id: Number(set.w_e_id)
                    }
                })
            });
        }

        const finalWorkout: Workout = {
            id: workout.id.toString(),
            title: workout.title,
            ownerId: workout.ownerId ? workout.ownerId.toString() : 'Unknown Owner',
            createdAt: workout.created_at instanceof Date ? workout.created_at.toISOString() : undefined,
            exercises: Array.from(exercisesMap.values())
        };
        return finalWorkout;
    } catch (err) {
        console.log(errString, (err as Error).message)
    }
}

const deleteWorkoutById = async (id: string) => {
    try {
        const workoutExercises = await db.select({ id: workoutExerciseTable.id })
            .from(workoutExerciseTable)
            .where(eq(workoutExerciseTable.workoutId, BigInt(id)))

        const workoutExerciseIds = workoutExercises.map(we => we.id)

        let exerciseSetIds: { id: bigint }[] = []
        if (workoutExerciseIds.length > 0)
            exerciseSetIds = await db.select({ id: exerciseSetTable.id })
                .from(exerciseSetTable)
                .where(inArray(exerciseSetTable.w_e_id, workoutExerciseIds));


        if (exerciseSetIds.length > 0) {
            const exerciseSetIdValues = exerciseSetIds.map(es => es.id);
            await db.delete(exerciseSetTable)
                .where(inArray(exerciseSetTable.id, exerciseSetIdValues));
        }


        if (workoutExerciseIds.length > 0)
            await db.delete(workoutExerciseTable)
                .where(inArray(workoutExerciseTable.id, workoutExerciseIds));


        await db.delete(workoutTable)
            .where(eq(workoutTable.id, BigInt(id)));
    }
    catch (err) {
        console.log(errString, (err as Error).message)
        return null
    }
}

const editWorkout = async (id: string, newWorkout: Workout) => {
    try {
        await db.update(workoutTable).set({ title: newWorkout.title }).where(eq(workoutTable.id, BigInt(id)))

        const workoutExercises = await db.select({ id: workoutExerciseTable.id })
            .from(workoutExerciseTable)
            .where(eq(workoutExerciseTable.workoutId, BigInt(id)))
        const workoutExerciseIds = workoutExercises.map(we => we.id)

        if (workoutExerciseIds.length > 0) {
            await db.delete(exerciseSetTable)
                .where(inArray(exerciseSetTable.w_e_id, workoutExerciseIds));

            await db.delete(workoutExerciseTable)
                .where(inArray(workoutExerciseTable.id, workoutExerciseIds));
        }
        for (const exercise of newWorkout.exercises) {

            let [existingExercise] = await db.select({ id: exerciseTable.id })
                .from(exerciseTable)
                .where(eq(exerciseTable.name, exercise.name))
                .limit(1)

            if (!existingExercise) throw new Error("Exercise Not Found")

            const [workoutExerciseRelation] = await db.insert(workoutExerciseTable).values({
                workoutId: BigInt(id),
                exerciseId: existingExercise.id,
            }).returning({ id: workoutExerciseTable.id })

            if (exercise.sets && exercise.sets.length > 0) {
                const setValues = exercise.sets.map((set) => ({
                    reps: set.reps,
                    weight: String(set.weight),
                    w_e_id: workoutExerciseRelation.id,
                }));
                await db.insert(exerciseSetTable).values(setValues);
            }
        }
        return true;
    } catch (err) {
        console.log(errString, (err as Error).message)
    }

}

const convertWorkoutToPounds = (workout: Workout, preferredWeightUnit: string) => {
    if (preferredWeightUnit === 'lbs')
        workout.exercises.forEach(exercise => {
            exercise.sets?.forEach(set => {
                set.weight = kgToPounds(set.weight);
            });
        });
    return workout
}


const convertWorkoutToKg = (workout: Workout, preferredWeightUnit: string)=> {
    if (preferredWeightUnit === 'lbs')
        workout.exercises.forEach(exercise => {
            exercise.sets?.forEach(set => {
                set.weight = poundsToKg(set.weight);
            });
        });

    return workout;
}

export {
    createWorkout,
    getExercises,
    findWorkoutById,
    getWorkouts,
    findByOwner,
    deleteWorkoutById,
    editWorkout,
    convertWorkoutToPounds,
    convertWorkoutToKg
}