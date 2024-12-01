import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CreateExerciseComponent } from './create-exercise/create-exercise.component';
import { Exercise, WorkoutSend } from '../../types/Workout';
import { WorkoutService } from '../workout.service';
@Component({
	selector: 'app-create-workout',
	standalone: true,
	imports: [FormsModule, CreateExerciseComponent],
	templateUrl: './create-workout.component.html',
	styleUrl: './create-workout.component.css',
})
export class CreateWorkoutComponent {
	hidden = false;
	constructor(private workoutService: WorkoutService) {}

	handleExerciseChange(updatedExercise: Exercise, index: number) {
		this.workoutObj.exercises[index] = updatedExercise;
	}

	create = () => {
		this.workoutService.sendWorkout(this.workoutObj);
	};
	switchForm = () => {
		this.hidden = !this.hidden;
		this.workoutService.getLastWorkouts();
	};
	addExercise = () => {
		this.workoutObj.exercises.push({ name: 'benchPress', sets: [] });
		console.log(this.workoutObj);
	};
	workoutObj: WorkoutSend = {
		owner: 'rTwGKZTHPrYDXsdWvDMDqJ8vTHw2',
		exercises: [
			{
				name: 'benchPPress',
				sets: [
					{
						weight: 0,
						reps: 0,
					},
					{
						weight: 0,
						reps: 0,
					},
				],
			},
			{
				name: 'pullUps',
				sets: [
					{
						weight: 0,
						reps: 0,
					},
				],
			},
			{
				name: 'push ups',
				sets: [
					{
						weight: 0,
						reps: 0,
					},
				],
			},
		],
	};
}
