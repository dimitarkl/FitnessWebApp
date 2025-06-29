import db from "../db"
import { exerciseSetTable, exerciseTable, workoutExerciseTable, workoutTable } from "../db/schema"
import { Exercise, Workout } from "../../../shared/types/workout"
import { desc, eq, inArray } from "drizzle-orm"

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
                    weight: set.weight,
                    w_e_id: workoutExerciseRelation.id,
                }));
                await db.insert(exerciseSetTable).values(setValues);
            }
        }
        return newWorkout.id.toString();
    }
    catch (err) {
        console.log(err)
        return null
    }
}
const getExercises = async () => {
    const allExercises = await db.select().from(exerciseTable);
    const exercises = allExercises.map(exercise => ({
        id: exercise.id.toString(),
        name: exercise.name || "Unknown Exercise"
    }));
    return exercises;
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
        console.log(err)
    }
}
const getWorkouts = async (numWorkouts: number) => {
    try {
        //get last numWorkouts workouts's ids
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
        console.log(err);
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
        let setsResult: { id: bigint; reps: number; weight: number; w_e_id: bigint | null }[] = [];

        if (workoutExerciseIds.length > 0) {
            setsResult = await db.select()
                .from(exerciseSetTable)
                .where(inArray(exerciseSetTable.w_e_id, workoutExerciseIds));
        }

        const exercisesMap = new Map<bigint, Exercise>(); // Map workoutExerciseId to Exercise object

        // Add sets to the corresponding exercises in the map
        for (const set of setsResult) {
            if (set.w_e_id) { // Ensure w_e_id is not null
                const exerciseEntry = exercisesMap.get(set.w_e_id);
                if (exerciseEntry && exerciseEntry.sets) { // Check if sets array exists
                    exerciseEntry.sets.push({
                        reps: set.reps,
                        weight: set.weight // Schema defines weight as integer
                    });
                }
            }
        }

        if (workoutExerciseIds.length > 0) {
            setsResult = await db.select()
                .from(exerciseSetTable)
                .where(inArray(exerciseSetTable.w_e_id, workoutExerciseIds));
        }

        // 4. Assemble the data
        // Populate map with exercises and prepare sets array
        for (const exResult of exercises) {
            exercisesMap.set(exResult.workoutExerciseId, {
                name: exResult.exerciseName ?? 'Unknown Exercise', // Handle potential null name
                sets: [] // Initialize sets array
            });
        }

        // Construct the final Workout object
        const finalWorkout: Workout = {
            id: workout.id.toString(),
            title: workout.title,
            // Ensure ownerId is converted and handled if potentially null
            ownerId: workout.ownerId ? workout.ownerId.toString() : 'Unknown Owner',
            // Adjust createdAt based on your actual schema column name and type
            createdAt: workout.created_at instanceof Date ? workout.created_at.toISOString() : undefined,
            exercises: Array.from(exercisesMap.values()) // Get assembled exercises from the map
        };

        return finalWorkout;
    } catch (err) {
        console.log(err)
    }
}

const findAll = () => {

}

export { createWorkout, getExercises, findWorkoutById, getWorkouts, findByOwner }