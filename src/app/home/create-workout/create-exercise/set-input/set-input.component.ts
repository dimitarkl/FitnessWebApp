import { Component, Input } from '@angular/core';
import { FormGroup, FormsModule, NgForm } from '@angular/forms';

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
	submitSet = (form: NgForm) => {
		// console.log(form);
		const { weight, reps } = form.value;
		console.log(`weight:${weight}  and reps${reps}`);
	};
}
