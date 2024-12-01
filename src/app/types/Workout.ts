type WorkoutSend = {
	owner: string;
	createdAt?: string;
	exercises: Exercise[];
};
type WorkoutGet = {
	id: string;
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
export type { WorkoutGet, WorkoutSend, Exercise, ExerciseSet };
