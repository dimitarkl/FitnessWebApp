import { and, eq } from "drizzle-orm";
import db from "../db"
import { likeTable } from "../db/schema"
import { errString } from "../utils/util";

export const likeWorkout = async (userId: string, workoutId: string) => {
    try {
        const likeId = await db.insert(likeTable).values({
            user_id: BigInt(userId),
            workout_id: BigInt(workoutId)
        }).returning({ id: likeTable.id })
        return true
    } catch (err) {
        console.log(errString, 'Error liking workout:', (err as Error).message);
        return false;
    }
}
export const unlikeWorkout = async (userId: string, workoutId: string) => {
    try {
        await db.delete(likeTable)
            .where(and(
                eq(likeTable.user_id, BigInt(userId)),
                eq(likeTable.workout_id, BigInt(workoutId))
            ));

        return true;
    } catch (err) {
        console.log(errString, 'Error unliking workout:', (err as Error).message);
        return false;
    }
};