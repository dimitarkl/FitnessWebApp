type Workout = {
	id?: string;
	ownerId: string;
	createdAt?: string;
	exercises: Exercise[];
	likes?: string[];
};

type Exercise = {
	name: string;
	sets?: ExerciseSet[];
};
type ExerciseSet = {
	weight: number;
	reps: number;
};
export type { Workout, Exercise, ExerciseSet };
