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
import { UserService } from '../../user/user.service';
import { User } from 'firebase/auth';
import { WorkoutService } from '../workout.service';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'app-post',
	standalone: true,
	imports: [ExerciseCardComponent, RouterLink],
	templateUrl: './post.component.html',
	styleUrl: './post.component.css',
})
export class PostComponent implements OnInit {
	@Input() workout: WorkoutGet | null = null;

	constructor(
		private prefService: PreferencesService,
		private userService: UserService,
		private workoutService: WorkoutService
	) {}
	ownerUsername = '';
	user: User | null = null;
	likesInv = 'invisible';
	getUser = () => {
		this.userService.user$.subscribe(i => (this.user = i));
	};
	ngOnInit(): void {
		this.getUser();
		this.more = this.workout?.exercises.length
			? this.workout.exercises.length - 3
			: 0;
		if (this.workout?.ownerId)
			this.prefService
				.getUsernameById(this.workout?.ownerId)
				.then(response => (this.ownerUsername = response));
	}
	deletePost = () => {
		if (this.workout)
			this.workoutService
				.deteleteWorkout(this.workout?.id)
				.then(() => location.reload());
	};
	likePost = () => {
		if (this.workout)
			this.workoutService
				.likePost(this.workout.id)
				.then(() => console.log('Done'));
	};
	showLikes = () => {
		console.log('Show Likes');
	};
	more: number = 0;
}
