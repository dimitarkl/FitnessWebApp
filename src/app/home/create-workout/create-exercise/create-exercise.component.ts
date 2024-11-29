import { Component, Input } from '@angular/core';
import { SetInputComponent } from '../set-input/set-input.component';

@Component({
	selector: 'app-create-exercise',
	standalone: true,
	imports: [SetInputComponent],
	templateUrl: './create-exercise.component.html',
	styleUrl: './create-exercise.component.css',
})
export class CreateExerciseComponent {
	@Input() name: string = '';
	@Input() addExercise: () => void = () => {};
	sets = 1;
	add = () => {
		this.sets++;
	};
}
