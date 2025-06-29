import { Request, Response } from "express"
import { createWorkout, findByOwner, findWorkoutById, getExercises, getWorkouts } from "../services/workoutService"
import { ExerciseType } from "../../../shared/types/workout"
import { create } from "domain"

export const createWorkoutRoute = async (req: Request, res: Response) => {
    console.log('POST: Create workout')
    if (!req.user) {
        console.log('User not authenticated')
        res.send(401);
        return;
    }
    if (!req.body.workout) {
        console.log('Missing workout data in request body');
        res.status(400).json({ error: 'Missing workout data' });
        return;
    }
    const workoutId = await createWorkout(req.body.workout, req.user.id);
    if (!workoutId) {
        res.status(400).json({ error: 'Error creating workout' });
        return;
    }
    res.status(200).json({
        workoutId: workoutId
    })
}
export const reqExercises = async (req: Request, res: Response) => {
    const exercises: ExerciseType[] = await getExercises();
    console.log('GET:Exercise types')
    if (exercises)
        res.send(exercises).status(200);
    else
        res.sendStatus(404);
}
export const getLastWorkouts = async (req: Request, res: Response) => {
    console.log("GET: Last workouts");
    if (!req.user) {
        console.log('User not authenticated');
        res.send(401);
        return;
    }
    const workouts = await getWorkouts(5);
    res.status(200).json(
        workouts)
}

export const getWorkoutById = async (req: Request, res: Response) => {
    console.log("GET: Workout by ID:" + req.params.id);
    const workoutId = req.params.id;

    const workout = await findWorkoutById(workoutId);
    if (workout) {
        res.status(200).json({
            workout
        });
    } else {
        res.sendStatus(404);
    }
}
export const getUserWorkouts = async (req: Request, res: Response) => {
    console.log("GET: User workouts");
    if(!req.user) {
        console.log('User not authenticated');
        res.sendStatus(401);
        return;
    }
    const userId = req.user.id;
    console.log("User ID: ", userId);
    const workouts = await findByOwner(userId);
    if (workouts) {
        res.status(200).json(workouts);
    } else {
        res.sendStatus(404);
    }
}