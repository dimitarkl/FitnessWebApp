import { Component, OnInit } from '@angular/core';
//import { PostComponent } from './post/post.component';
import { WorkoutService } from './workout.service';
import { Workout } from '../types/Workout';
import { PreferencesService } from '../user/preferences.service';
import { RouterLink } from '@angular/router';
import { ErrorService } from '../error/error.service';

@Component({
	selector: 'app-home',
	standalone: true,
	imports: [RouterLink], //add PostComponent
	templateUrl: './home.component.html',
	styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
	// 	constructor(
	// 		private workoutService: WorkoutService,
	// 		private errorService: ErrorService
	// 	) {}
	// 	workouts: Workout[] | null = null;
	ngOnInit(): void {
		// 		this.getWorkout();
	}
	// 	getWorkout = () => {
	// 		const response = this.workoutService.getLastWorkouts();
	// 		if (response != null) this.workouts = response;
	// 		else this.errorService.setError('Error Getting Response');
	// 	};
}
