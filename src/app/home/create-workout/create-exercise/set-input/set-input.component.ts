import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ExerciseSet } from '../../../../types/Workout';

@Component({
	selector: 'app-set-input',
	standalone: true,
	imports: [FormsModule],
	templateUrl: './set-input.component.html',
	styleUrl: './set-input.component.css',
})
export class SetInputComponent {
	@Input() idx: number = 0;
	@Input() first: boolean = false;
	@Input() set: ExerciseSet | null = null;

	@Output() setChange = new EventEmitter<ExerciseSet>();

	submitSet = (form: NgForm) => {
		if (form.valid) {
			const { weight, reps } = form.value;
			this.setChange.emit((this.set = { weight, reps }));
		}
	};
}
