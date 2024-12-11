import { Component, OnInit } from '@angular/core';
import { Workout } from '../types/Workout';
import { RouterLink } from '@angular/router';
import { ErrorService } from '../error/error.service';
import { WorkoutService } from '../home/workout.service';
import { PostComponent } from '../home/post/post.component';
@Component({
	selector: 'app-catalog',
	standalone: true,
	imports: [RouterLink, PostComponent],
	templateUrl: './catalog.component.html',
	styleUrl: './catalog.component.css',
})
export class CatalogComponent {
	constructor(
		private workoutService: WorkoutService,
		private errorService: ErrorService
	) {}
	workouts!: Workout[];

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
