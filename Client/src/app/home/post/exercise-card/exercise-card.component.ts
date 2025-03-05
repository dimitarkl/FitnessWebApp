import { Component, Input } from '@angular/core';
import { Exercise } from '../../../types/Workout';

@Component({
	selector: 'app-exercise-card',
	standalone: true,
	imports: [],
	templateUrl: './exercise-card.component.html',
})
export class ExerciseCardComponent {
	@Input() exercise: Exercise | null = null;
	@Input() class: string = '';
}
