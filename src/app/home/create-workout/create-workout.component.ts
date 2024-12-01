import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CreateExerciseComponent } from './create-exercise/create-exercise.component';
import { Exercise, WorkoutFull } from '../../types/Workout';
import { WorkoutService } from './workout.service';
@Component({
	selector: 'app-create-workout',
	standalone: true,
	imports: [FormsModule, CreateExerciseComponent],
	templateUrl: './create-workout.component.html',
	styleUrl: './create-workout.component.css',
})
export class CreateWorkoutComponent {
	hidden = false;
	exercises = [
	constructor(private workoutService: WorkoutService) {}

	handleExerciseChange(updatedExercise: Exercise, index: number) {
		this.workoutObj.exercises[index] = updatedExercise;
	}

	};
	switchForm = () => {
		this.hidden = !this.hidden;
	};
	addExercise = () => {
		this.workoutObj.exercises.push({ name: 'benchPress', sets: [] });
		console.log(this.workoutObj);
	};
	workoutObj: WorkoutFull = {
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
