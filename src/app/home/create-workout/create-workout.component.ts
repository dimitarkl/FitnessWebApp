import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CreateExerciseComponent } from './create-exercise/create-exercise.component';
import { Exercise, Workout } from '../../types/Workout';
import { WorkoutService } from '../workout.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
@Component({
	selector: 'app-create-workout',
	standalone: true,
	imports: [FormsModule, CreateExerciseComponent, RouterLink],
	templateUrl: './create-workout.component.html',
	styleUrl: './create-workout.component.css',
})
export class CreateWorkoutComponent implements OnInit {
	constructor(
		private workoutService: WorkoutService,
		private route: ActivatedRoute,
		private router: Router
	) {}
	editing = false;
	ngOnInit(): void {
		const id = this.route.snapshot.params['editId'];
		this.getWorkout(id);
	}
	handleExerciseChange(updatedExercise: Exercise, index: number) {
		this.workoutObj.exercises[index] = updatedExercise;
	}

	create = () => {
		if (!this.editing) {
			this.workoutService.sendWorkout(this.workoutObj);
			this.router.navigate(['/']);
		} else this.workoutService.updateWorkoutById(this.workoutObj);
	};
	addExercise = () => {
		this.workoutObj.exercises.push({ name: 'Exercise', sets: [] });
	};
	getWorkout = (id: string | null) => {
		if (id) {
			this.workoutService.getWorkoutById(id).then(workout => {
				if (workout) this.workoutObj = workout;
				this.editing = true;
			});
		}
	};
	workoutObj: Workout = {
		ownerId: '',
		exercises: [
			{
				name: 'benchPPress',
				sets: [
					{
						weight: 0,
						reps: 0,
					},
				],
			},
			{
				name: 'pullUps',
				sets: [
					{
						weight: 0,
						reps: 0,
					},
				],
			},
			{
				name: 'push ups',
				sets: [
					{
						weight: 0,
						reps: 0,
					},
				],
			},
		],
	};
}
