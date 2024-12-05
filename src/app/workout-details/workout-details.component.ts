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
}
