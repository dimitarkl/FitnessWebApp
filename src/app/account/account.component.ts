import { Component, OnInit } from '@angular/core';
import { UserService } from '../user/user.service';
import { User } from 'firebase/auth';
import { WorkoutService } from '../home/workout.service';
import { PostComponent } from '../home/post/post.component';
import { Workout } from '../types/Workout';
import { FormsModule, NgForm } from '@angular/forms';
import { PreferencesService } from '../user/preferences.service';

@Component({
	selector: 'app-account',
	standalone: true,
	imports: [PostComponent, FormsModule],
	templateUrl: './account.component.html',
	styleUrl: './account.component.css',
})
export class AccountComponent implements OnInit {
	constructor(
		private userService: UserService,
		private workoutService: WorkoutService,
		private prefService: PreferencesService
	) {}
	hidden = 'invisible';
	user: User | null = null;
	workouts: Workout[] | null = null;
	ngOnInit(): void {
		this.getUser();
	}
	getUser = () => {
		this.userService.user$.subscribe(i => {
			this.user = i;
			this.getWorkouts();
		});
	};
	getWorkouts = () => {
		if (this.user) {
			this.workouts = this.workoutService.getUserWorkouts(
				this.user.uid,
				5
			);
		} else {
			console.log('Error User');
			return;
		}
	};
	submitAccount = (form: NgForm) => {
		console.log('form submitted');
		const { username } = form.value;
		form.reset();
		this.hidden = 'invisible';
		this.prefService.updateUsername(username);
		console.log(form.value);
	};
	changeHidden = () => {
		if (this.hidden == 'invisible') this.hidden = '';
		else this.hidden = 'invisible';
	};
}
