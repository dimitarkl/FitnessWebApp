import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnChanges,
    SimpleChanges,
    OnInit,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ExerciseSet, ExerciseType } from '../../../../../../../shared/types/Workout';
import { WorkoutService } from '../../../workout.service';
import { ErrorService } from '../../../../error/error.service';

@Component({
    selector: 'app-set-input',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './set-input.component.html',
    styleUrls: ['./set-input.component.css'],
})
export class SetInputComponent implements OnChanges, OnInit {

    constructor(
        private errorService: ErrorService
    ) { }

    @Input() idx: number = 0;
    @Input() first: boolean = false;
    @Input() set: ExerciseSet | null = null;
    @Input() deleteSet!: (index: number) => void;

    @Output() setChange = new EventEmitter<ExerciseSet>();

    repsInput: number | '' = '';
    weightInput: number | '' = '';
    ngOnInit(): void {
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.repsInput = this.set?.reps || '';
        this.weightInput = this.set?.weight || '';
        this.updateSet();

    }

    setValues: { reps: number; weight: number } = { reps: 0, weight: 0 };
    submitSet = (form: NgForm) => {
        const { weight, reps } = form.value;
        if (typeof weight === 'number' && typeof reps === 'number')
            this.setChange.emit({ weight, reps });
        else if (typeof reps === 'number')
            this.setChange.emit({ weight: 0, reps });

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
