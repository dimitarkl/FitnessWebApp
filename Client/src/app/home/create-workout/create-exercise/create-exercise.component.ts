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
import { Exercise, ExerciseSet, ExerciseType } from '../../../../../../shared/types/Workout';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'app-create-exercise',
	standalone: true,
	imports: [SetInputComponent,FormsModule],
	templateUrl: './create-exercise.component.html',

})
export class CreateExerciseComponent implements OnChanges {
	@Input() name: string = '';
	@Input() last: boolean = false;
	@Input() exercise: Exercise | null = null;
	@Input() indx: number = 0;
	@Input() deleteExercise!: (index: number) => void;
	@Input() exerciseSelection: ExerciseType[] = [];

	@Output() setChange = new EventEmitter<Exercise>();
	sets = 0;
	set: ExerciseSet[] | null = null;
	handleSetChange(updatedSet: ExerciseSet, index: number) {
		if (!this.exercise) {
			console.error('Exercise Does not Exist')
			return
		}

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
		this.exercise?.sets?.splice(index, 1);
		this.checkSets();
	};
}

