import { likeWorkout } from "../services/likesService"
import { Request, Response } from 'express';

export const likeWorkoutRoute = async (req: Request, res: Response) => {
    console.log("POST: Like workout")
    const user = req.user
    if (!user) {
        if (!req.user) {
            res.sendStatus(401);
            return;
        }
    }
    const workoutId = req.params.id
    const result = await likeWorkout(user.id, workoutId)
    if (result)
        res.status(200).json({ message: "Workout liked successfuly" })
    else {
        res.status(400).json({ message: "Could not like workout" });
    }
}