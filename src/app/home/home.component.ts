import { Component, OnInit } from '@angular/core';
import { PostComponent } from './post/post.component';
import { CreateWorkoutComponent } from './create-workout/create-workout.component';

@Component({
	selector: 'app-home',
	standalone: true,
	imports: [PostComponent, CreateWorkoutComponent],
	templateUrl: './home.component.html',
	styleUrl: './home.component.css',
})
export class HomeComponent {
	Card = {
		username: 'Bradur',
		workout: 'Full Body Workout',
	};
}
