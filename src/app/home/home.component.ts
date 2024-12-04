import { Component, OnInit } from '@angular/core';
import { PostComponent } from './post/post.component';
import { WorkoutService } from './workout.service';
import { WorkoutGet } from '../types/Workout';
import { PreferencesService } from '../user/preferences.service';
import { RouterLink } from '@angular/router';
import { ErrorService } from '../error/error.service';

@Component({
	selector: 'app-home',
	standalone: true,
	imports: [PostComponent, RouterLink],
	templateUrl: './home.component.html',
	styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
	constructor(
		private workoutService: WorkoutService,
		private errorService: ErrorService
	) {}
	workouts: WorkoutGet[] | null = null;

	ngOnInit(): void {
		const response = this.workoutService.getLastWorkouts();
		if (response != null) this.workouts = response;
		else this.errorService.setError('Error Getting Response');
	}
}
