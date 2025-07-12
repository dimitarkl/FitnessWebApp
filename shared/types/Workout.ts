type Workout = {
    title: string;
    id?: string;
    ownerId: string;
    duration:number;
    createdAt?: string;
    exercises: Exercise[];
    likes?: string[];
};

type Exercise = {
    name: string;
    sets?: ExerciseSet[];
};
type ExerciseType = {
    id: string;
    name: string;
}
type ExerciseSet = {
    weight: number;
    reps: number;
};
export type { Workout, Exercise, ExerciseSet, ExerciseType };
