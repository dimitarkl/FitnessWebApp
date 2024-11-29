import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

import { CreateExerciseComponent } from './create-exercise/create-exercise.component';
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
		{ name: 'benchPress' },
		{ name: 'pullUps' },
		{ name: 'push ups' },
	];
	create = (form: NgForm) => {
		console.log(form);
	};
	switchForm = () => {
		this.hidden = !this.hidden;
	};
	addExercise = () => {
		this.exercises.push({ name: 'benchPress' });
	};
}