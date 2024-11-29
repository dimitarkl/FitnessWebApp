import { Component, Input } from '@angular/core';
import { ExerciseCardComponent } from './exercise-card/exercise-card.component';

@Component({
	selector: 'app-post',
	standalone: true,
	imports: [ExerciseCardComponent],
	templateUrl: './post.component.html',
	styleUrl: './post.component.css',
})
export class PostComponent {
	@Input() card: {
		username: string;
		workout: string;
	} | null = null;
}
