type WorkoutFull = {
	owner: string;
	createdAt?: string;
	exercises: Exercise[];
};

type Exercise = {
	name: string;
	sets?: ExerciseSet[];
};
type ExerciseSet = {
	weight: number;
	reps: number;
};
export type { WorkoutFull, Exercise, ExerciseSet };
