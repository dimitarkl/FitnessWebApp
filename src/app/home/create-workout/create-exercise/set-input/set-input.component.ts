import {
	Component,
	Input,
	Output,
	EventEmitter,
	OnChanges,
	SimpleChanges,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ExerciseSet } from '../../../../types/Workout';

@Component({
	selector: 'app-set-input',
	standalone: true,
	imports: [FormsModule],
	templateUrl: './set-input.component.html',
	styleUrl: './set-input.component.css',
})
export class SetInputComponent implements OnChanges {
	@Input() idx: number = 0;
	@Input() first: boolean = false;
	@Input() set: ExerciseSet | null = null;
	@Input() exerciseName: string = '';
	@Input() deleteSet!: (index: number) => void;

	@Output() setChange = new EventEmitter<ExerciseSet>();
	@Output() setName = new EventEmitter<string>();
	ngOnChanges(changes: SimpleChanges): void {
		this.updateSet();
	}
	setValues: { reps: number; weight: number } = { reps: 0, weight: 0 };
	submitSet = (form: NgForm) => {
		const { weight, reps, exercise } = form.value;
		//TODO FIX Logic
		console.log(weight + ' ' + reps + ' ' + exercise);
		if (exercise) this.setName.emit(exercise);
		if (weight && reps) {
			this.setChange.emit({ weight, reps });
		} else {
			this.setChange.emit({ weight: 0, reps: 0 });
		}
	};
	updateSet = () => {
		if (this.set) {
			this.setValues.reps = this.set.reps;
			this.setValues.weight = this.set.weight;
		}
	};
	onDeleteSet = () => {
		this.deleteSet(this.idx);
	};
}
