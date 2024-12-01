import {
	Component,
	Input,
	OnChanges,
	OnInit,
	SimpleChanges,
} from '@angular/core';
import { ExerciseCardComponent } from './exercise-card/exercise-card.component';
import { WorkoutGet } from '../../types/Workout';

@Component({
	selector: 'app-post',
	standalone: true,
	imports: [ExerciseCardComponent],
	templateUrl: './post.component.html',
	styleUrl: './post.component.css',
})
export class PostComponent implements OnChanges {
	@Input() workout: WorkoutGet | null = null;

	ngOnChanges(changes: SimpleChanges): void {
		this.more = this.workout?.exercises.length
			? this.workout.exercises.length - 3
			: 0;
	}
	more: number = 0;
}
