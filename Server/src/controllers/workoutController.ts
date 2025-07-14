import { Request, Response } from "express"
import { convertWorkoutToPounds, createWorkout, deleteWorkoutById, editWorkout, findByOwner, findWorkoutById, getExercises, getWorkouts } from "../services/workoutService"
import { ExerciseType, Workout } from "@shared/types/Workout"
import { create } from "domain"
import { sanitazeInputs } from "../utils/util"
import { error } from "console"
import { getUser } from "../services/userService"

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
    const user = await getUser(req.user.id)

    const workout = sanitazeInputs(req.body.workout, user.preferredWeightUnit)
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
    console.log('GET: Exercise types')
    const exercises = await getExercises();
    if (exercises)
        res.status(200).json(exercises);
    else
        res.status(404).json({ error: "Exercises Not Found" });
}

export const getLastWorkouts = async (req: Request, res: Response) => {
    console.log("GET: Last workouts");

    let workouts = await getWorkouts(5);
    if (req.user) {
        const user = await getUser(req.user.id)
        if (user)
            workouts.forEach(workout => convertWorkoutToPounds(workout as Workout, user.preferredWeightUnit))
    }
    res.status(200).json(
        workouts)
}

export const getWorkoutById = async (req: Request, res: Response) => {
    console.log("GET: Workout by ID:" + req.params.id);
    const user = req.user
    const workoutId = req.params.id;

    let workout = await findWorkoutById(workoutId);
    if (req.user) {
        const user = await getUser(req.user.id)
        if (user)
            workout = convertWorkoutToPounds(workout as Workout, user.preferredWeightUnit)
    }
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
    let workouts = await findByOwner(userId,5);

    if (workouts) {
        if (req.user) {
            const user = await getUser(req.user.id)
            if (user)
                workouts.forEach(workout => convertWorkoutToPounds(workout as Workout, user.preferredWeightUnit))
        }
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
    // Extract and type workout input
    if (!user) {
        res.sendStatus(401)
        return;
    }
    const workoutExistance = await findWorkoutById(workoutId)
    if (!workoutExistance) {
        res.status(404).json({ error: "Workout doesnt exist" })
        return
    } else if (workoutExistance.ownerId !== String(user.id)) {
        res.sendStatus(401)
        return;
    }
    const workoutInput = req.body.workout as Workout;
    const workoutData = sanitazeInputs(workoutInput, user.preferredWeightUnit)
    const result = await editWorkout(workoutId, workoutData)
    if (result)
        res.status(200).json({ message: "Workout updated successfully" })
    else
        res.sendStatus(500)

}