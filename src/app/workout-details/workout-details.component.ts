import { Component, OnInit } from '@angular/core';
import { WorkoutService } from '../home/workout.service';
import { ActivatedRoute } from '@angular/router';
import { Workout } from '../types/Workout';
import { ExerciseCardComponent } from '../home/post/exercise-card/exercise-card.component';
import { UserService } from '../user/user.service';
import { User } from 'firebase/auth';
import { PreferencesService } from '../user/preferences.service';

@Component({
	selector: 'app-workout-details',
	standalone: true,
	imports: [ExerciseCardComponent],
	templateUrl: './workout-details.component.html',
})
export class WorkoutDetailsComponent implements OnInit {
	constructor(
		private workoutService: WorkoutService,
		private route: ActivatedRoute,
		private prefService: PreferencesService
	) {}

	class = 'w-full';
	workout: Workout | null = null;
	ownerUsername: string | null = null;
	prefUnit: string = '';
	ngOnInit(): void {
		const id = this.route.snapshot.params['detailsId'];
		this.getWorkout(id);
		this.getOwnerName();
		this.getWeightUnit();
	}
	getOwnerName = () => {
		if (this.workout?.ownerId)
			this.prefService
				.getUsernameById(this.workout.ownerId)
				.then(response => (this.ownerUsername = response));
	};
	getWorkout = (id: string) => {
		this.workoutService
			.getWorkoutById(id)
			.then(response => (this.workout = response))
			.then(() => this.getOwnerName());
	};
	getWeightUnit = () => {
		this.prefService
			.getWeightUnit()
			.then(response => (this.prefUnit = response));
	};
}
