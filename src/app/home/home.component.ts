import { Component, OnInit } from '@angular/core';
//import { PostComponent } from './post/post.component';
import { WorkoutService } from './workout.service';
import { Workout } from '../types/Workout';
import { PreferencesService } from '../user/preferences.service';
import { RouterLink } from '@angular/router';
import { ErrorService } from '../error/error.service';
import { PostComponent } from './post/post.component';

@Component({
	selector: 'app-home',
	standalone: true,
	imports: [RouterLink, PostComponent],
	templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
	constructor(
		private workoutService: WorkoutService,
		private errorService: ErrorService
	) {}
	workouts: Workout[] | null = null;
	ngOnInit(): void {
		this.getWorkout();
	}
	getWorkout = () => {
		this.workoutService.getLastWorkouts().then(response => {
			if (response != null) this.workouts = response;
			else this.errorService.setError('Error Getting Response');
		});
	};
}
