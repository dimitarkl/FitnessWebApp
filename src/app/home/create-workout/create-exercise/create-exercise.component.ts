import {
	Component,
	EventEmitter,
	Input,
	OnChanges,
	OnInit,
	Output,
	SimpleChanges,
} from '@angular/core';
import { SetInputComponent } from './set-input/set-input.component';
import { Exercise, ExerciseSet } from '../../../types/Workout';

@Component({
	selector: 'app-create-exercise',
	standalone: true,
	imports: [SetInputComponent],
	templateUrl: './create-exercise.component.html',
})
export class CreateExerciseComponent implements OnChanges {
	@Input() name: string = '';
	@Input() addExercise: () => void = () => {};
	@Input() last: boolean = false;
	@Input() exercise: Exercise | null = null;
	@Input() indx: number = 0;
	@Input() deleteExercise!: (index: number) => void;

	@Output() setChange = new EventEmitter<Exercise>();
	sets = 0;
	set: ExerciseSet[] | null = null;
	handleSetChange(updatedSet: ExerciseSet, index: number) {
		if (!this.exercise) {
			console.error('Exercise is undefined or null');
			return;
		}
		if (!this.exercise.sets) {
			this.exercise.sets = [];
		}
		if (index >= this.exercise.sets.length) {
			console.error('Index out of bounds');
			return;
		}
		this.exercise.sets[index] = updatedSet;
		this.setChange.emit(this.exercise);
	}
	setName = (name: string) => {
		if (this.exercise && name != '') this.exercise.name = name;
		else console.log('Error Changing Exercise Name');
	};
	ngOnChanges(changes: SimpleChanges): void {
		this.checkSets();
	}
	checkSets = () => {
		if (this.exercise) {
			const count = this.exercise.sets?.length;
			if (count) this.sets = count;
			else {
				this.deleteExercise(this.indx);
			}
			if (this.exercise.sets) {
				this.set = this.exercise.sets;
			}
		}
	};
	add = () => {
		this.exercise?.sets?.push({ weight: 0, reps: 0 });
		this.checkSets();
	};
	deleteSet = (index: number) => {
		console.log('set index' + index);
		this.exercise?.sets?.splice(index, 1);
		this.checkSets();
	};
}
