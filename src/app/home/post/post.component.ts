import {
	Component,
	Input,
	OnChanges,
	OnInit,
	SimpleChanges,
} from '@angular/core';
import { ExerciseCardComponent } from './exercise-card/exercise-card.component';
import { Workout } from '../../types/Workout';
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
	@Input() workout: Workout | null = null;

	constructor(
		private prefService: PreferencesService,
		private userService: UserService,
		private workoutService: WorkoutService
	) {}
	ownerUsername = '';
	user: User | null = null;
	likesInv = 'invisible';
	class = 'w-96';
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
		if (this.workout && this.workout.id != undefined)
			this.workoutService
				.deteleteWorkout(this.workout?.id)
				.then(() => location.reload());
	};
	likePost = () => {
		if (this.workout && this.workout.id != undefined)
			this.workoutService
				.likePost(this.workout.id)
				.then(() => location.reload());
	};
	showLikes = () => {
		console.log('Show Likes');
	};
	more: number = 0;
}
