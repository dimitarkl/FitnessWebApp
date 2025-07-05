import { Request, Response } from "express"
import { createWorkout, deleteWorkoutById, editWorkout, findByOwner, findWorkoutById, getExercises, getWorkouts } from "../services/workoutService"
import { ExerciseType } from "../../../shared/types/workout"
import { create } from "domain"
import { sanitazeInputs } from "../utils/util"
import { error } from "console"

export const createWorkoutRoute = async (req: Request, res: Response) => {
    console.log('POST: Create workout')

    if (!req.user) {
        console.log('User not authenticated')
        res.send(401);
        return;
    } else if (!req.body.workout) {
        console.log('Missing workout data in request body');
        res.status(400).json({ error: 'Missing workout data' });
        return;
    }

    const workout = sanitazeInputs(req.body.workout)
    const workoutId = await createWorkout(workout, req.user.id);
    if (!workoutId) {
        res.status(400).json({ error: 'Error creating workout' });
        return;
    }
    res.status(200).json({
        workoutId: workoutId
    })
}

export const reqExercises = async (req: Request, res: Response) => {
    console.log('GET:Exercise types')
    const exercises = await getExercises();
    if (exercises)
        res.status(200).json(exercises);
    else
        res.status(404).json({ error: "Exercises Not Found" });
}

export const getLastWorkouts = async (req: Request, res: Response) => {
    console.log("GET: Last workouts");

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
    if (!req.user) {
        console.log('User not authenticated');
        res.sendStatus(401);
        return;
    }
    const userId = req.user.id;
    const workouts = await findByOwner(userId);
    if (workouts) {
        res.status(200).json(workouts);
    } else {
        res.sendStatus(404);
    }
}

export const deleteWorkout = async (req: Request, res: Response) => {
    const workoutId = req.params.id
    const user = req.user

    console.log("DELETE: WorkoutId:", req.params.id)

    if (!user) {
        res.sendStatus(401)
        return;
    }

    const workout = await findWorkoutById(workoutId)

    if (!workout) {
        res.status(404).json({ error: "Workout doesnt exist" })
        return
    } else if (workout.ownerId !== String(user.id)) {
        res.sendStatus(401)
        return;
    }


    const result = await deleteWorkoutById(workoutId)

    if (result)
        res.status(200).json({ message: "Workout deleted successfully" })
    else
        res.status(500).json({ error: "Failed to delete workout" })
}

export const updateWorkout = async (req: Request, res: Response) => {
    console.log("PUT: Update Workout")

    const workoutId = req.params.id
    const user = req.user
    const { workout } = req.body
    console.log(workout)
    if (!user) {
        res.sendStatus(401)
        return;
    }
    const workoutExistance = await findWorkoutById(workoutId)
    console.log(workoutExistance)
    if (!workoutExistance) {
        res.status(404).json({ error: "Workout doesnt exist" })
        return
    } else if (workout.ownerId !== String(user.id)) {
        res.sendStatus(401)
        return;
    }

    const result = await editWorkout(workoutId, workout)
    if (result)
        res.status(200).json({ message: "Workout updated successfully" })
    else
        res.sendStatus(500)

}