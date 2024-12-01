import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SetInputComponent } from './set-input/set-input.component';
import { Exercise, ExerciseSet } from '../../../types/Workout';

@Component({
	selector: 'app-create-exercise',
	standalone: true,
	imports: [SetInputComponent],
	templateUrl: './create-exercise.component.html',
	styleUrl: './create-exercise.component.css',
})
export class CreateExerciseComponent implements OnInit {
	@Input() name: string = '';
	@Input() addExercise: () => void = () => {};
	@Input() last: boolean = false;
	@Input() exercise: Exercise | null = null;
	@Input() indx: number = 0;

	@Output() setChange = new EventEmitter<Exercise>();
	sets = 0;
	set: ExerciseSet[] | null = null;
	handleSetChange(updatedSet: ExerciseSet, index: number) {
		if (!this.exercise) {
			console.error('Exercise is undefined or null');
			return;
		}

		// Initialize the sets array if it is not already initialized
		if (!this.exercise.sets) {
			this.exercise.sets = [];
		}

		// Ensure the index is within the bounds of the sets array
		if (index >= this.exercise.sets.length) {
			console.error('Index out of bounds');
			return;
		}

		this.exercise.sets[index] = updatedSet;
		this.setChange.emit(this.exercise);
	}

	ngOnInit(): void {
		this.checkSets();
	}
	checkSets = () => {
		if (this.exercise) {
			const count = this.exercise.sets?.length;
			if (count) this.sets = count;
			if (this.exercise.sets) {
				this.set = this.exercise.sets;
			}
		}
	};
	add = () => {
		this.exercise?.sets?.push({ weight: 0, reps: 0 });
		this.checkSets();
	};
}
