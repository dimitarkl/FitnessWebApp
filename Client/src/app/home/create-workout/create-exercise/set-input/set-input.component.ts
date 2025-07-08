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

@Component({
    selector: 'app-set-input',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './set-input.component.html',
    styleUrls: ['./set-input.component.css'],
})
export class SetInputComponent implements OnChanges, OnInit {

    @Input() idx: number = 0;
    @Input() first: boolean = false;
    @Input() set: ExerciseSet | null = null;
    @Input() exerciseName: string = '';
    @Input() deleteSet!: (index: number) => void;

    @Output() setChange = new EventEmitter<ExerciseSet>();
    @Output() setName = new EventEmitter<string>();

    exerciseSelection: ExerciseType[] = []

    constructor(
        private workoutService: WorkoutService,
    ) { }

    repsInput: number | '' = '';
    weightInput: number | '' = '';
    ngOnInit(): void {
        this.getExercises();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.repsInput = this.set?.reps || '';
        this.weightInput = this.set?.weight || '';
        this.updateSet();
        this.getExercises()
    }

    setValues: { reps: number; weight: number } = { reps: 0, weight: 0 };
    submitSet = (form: NgForm) => {
        const { weight, reps, exercise } = form.value;
        if (exercise) {
            this.setName.emit(exercise);
            console.log(typeof reps === 'number')
            if (typeof weight === 'number' && typeof reps === 'number')
                this.setChange.emit({ weight, reps });
            else if (typeof reps === 'number')
                this.setChange.emit({ weight: 0, reps });
        }
    };
    getExercises = async () => {
        this.exerciseSelection = await this.workoutService.getExercises();
    }
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
