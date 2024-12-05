import { Component, OnInit } from '@angular/core';
import { WorkoutService } from '../home/workout.service';
import { ActivatedRoute } from '@angular/router';
import { WorkoutGet } from '../types/Workout';
import { ExerciseCardComponent } from '../home/post/exercise-card/exercise-card.component';

@Component({
	selector: 'app-workout-details',
	standalone: true,
	imports: [ExerciseCardComponent],
	templateUrl: './workout-details.component.html',
	styleUrl: './workout-details.component.css',
})
export class WorkoutDetailsComponent implements OnInit {
	constructor(
		private workoutService: WorkoutService,
		private route: ActivatedRoute
	) {}
	workout: WorkoutGet | null = null;
	ngOnInit(): void {
		const id = this.route.snapshot.params['detailsId'];
		this.getWorkout(id);
	}
	getWorkout = (id: string) => {
		this.workoutService.getWorkoutById(id).then(response => {
			console.log(this.workout + ':::' + response);
			this.workout = response;
		});
	};
}
