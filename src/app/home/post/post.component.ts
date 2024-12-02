import {
	Component,
	Input,
	OnChanges,
	OnInit,
	SimpleChanges,
} from '@angular/core';
import { ExerciseCardComponent } from './exercise-card/exercise-card.component';
import { WorkoutGet } from '../../types/Workout';
import { PreferencesService } from '../../user/preferences.service';

@Component({
	selector: 'app-post',
	standalone: true,
	imports: [ExerciseCardComponent],
	templateUrl: './post.component.html',
	styleUrl: './post.component.css',
})
export class PostComponent implements OnInit {
	@Input() workout: WorkoutGet | null = null;

	constructor(private prefService: PreferencesService) {}
	ownerUsername = '';
	ngOnInit(): void {
		this.more = this.workout?.exercises.length
			? this.workout.exercises.length - 3
			: 0;
		if (this.workout?.ownerId)
			this.prefService
				.getUsernameById(this.workout?.ownerId)
				.then(response => (this.ownerUsername = response));
	}
	more: number = 0;
}
