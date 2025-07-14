import { Workout } from "@shared/types/Workout";
import { convertWorkoutToKg } from "../services/workoutService";

export const errString = '\x1b[31m[ERROR]:\x1b[0m';

export const sanitazeInputs = (workout: Workout, prefferedWeigthUnit: string) => {
    workout.exercises = workout.exercises.filter(
        exercise => exercise.sets && exercise.sets.length > 0
    )
    workout = convertWorkoutToKg(workout, prefferedWeigthUnit)

    return workout
}
export const kgToPounds = (kg: number): number => Number((kg * 2.20462).toFixed(2));
export const poundsToKg = (lbs: number): number => Number((lbs * 0.453592).toFixed(2));