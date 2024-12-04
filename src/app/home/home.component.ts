import { Component, OnInit } from '@angular/core';
import { PostComponent } from './post/post.component';
import { CreateWorkoutComponent } from './create-workout/create-workout.component';
import { WorkoutService } from './workout.service';
import { WorkoutGet } from '../types/Workout';
import { PreferencesService } from '../user/preferences.service';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'app-home',
	standalone: true,
	imports: [PostComponent, CreateWorkoutComponent, RouterLink],
	templateUrl: './home.component.html',
	styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
	constructor(private workoutService: WorkoutService) {}
	workouts: WorkoutGet[] | null = null;

	ngOnInit(): void {
		const response = this.workoutService.getLastWorkouts();
		if (response != null) this.workouts = response;
	}
}
