type WorkoutFull = {
	owner: string;
	createdAt: string;
	exercises: Exercise[];
};

type Exercise = {
	name: string;
	sets: ExerciseSet[];
};
type ExerciseSet = {
	weight: number;
	reps: number;
};
// workout = {
// 	owner: 'ownerId1',
// 	exercises: [
// 		{
// 			name: 'Bench Press',
// 			sets: [
// 				{ weight: 100, reps: 10 },
// 				{ weight: 100, reps: 8 },
// 			],
// 		},
// 		{
// 			name: 'Squat',
// 			sets: [
// 				{ weight: 150, reps: 12 },
// 				{ weight: 150, reps: 10 },
// 			],
// 		},
// 	],
// };
