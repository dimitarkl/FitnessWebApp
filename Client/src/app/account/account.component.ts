import { Component, OnInit } from '@angular/core';
import { UserService } from '../user/user.service';
import { WorkoutService } from '../home/workout.service';
import { PostComponent } from '../home/post/post.component';
import { Workout } from '../../../../shared/types/Workout';
import { FormsModule, NgForm } from '@angular/forms';
import { PreferencesService } from '../user/preferences.service';
import { User } from '../../../../shared/types/user';

@Component({
	selector: 'app-account',
	standalone: true,
	imports: [PostComponent, FormsModule],
	templateUrl: './account.component.html',
})
export class AccountComponent implements OnInit {
	constructor(
		private userService: UserService,
		private workoutService: WorkoutService,
		private prefService: PreferencesService
	) {}
	hidden = 'invisible';
	user: User | null = null;
	displayName: string = '';
	workouts: Workout[] | null = null;
	weightUnit: string = '';
	ngOnInit(): void {
		this.getUser();
		this.getName();
		this.getWorkouts();
		this.getWeightUnit();
	}
	getUser = () => {
		this.userService.user$.subscribe(i => {
			this.user = i;
		});
	};
	getName = () => {
		// if (this.user)
		// 	this.displayName = this.user.displayName
		// 		? this.user.displayName
		// 		: '';
		// else this.displayName = '';
	};
	getWorkouts = () => {
		if (this.user) {
			 this.workoutService
			 	.getUserWorkouts().subscribe({
                    next: (response: any) => {
                        if (response) {
                            console.log('Workouts fetched successfully');
                            console.log(response);
                            this.workouts = response;
                        } else {
                            console.error('No workouts found');
                        }
                    },
                    error: (error: Error) => {
                        console.error('Error fetching workouts: ' + error.message);
                    }
                })
		} else {
			console.log('Error User');
			return;
		}
	};
	submitAccount = (form: NgForm) => {
		console.log('form submitted');
		const { username, weightUnit } = form.value;
		this.hidden = 'invisible';
		this.prefService.updateUsername(username);
		this.prefService.updateWeightUnit(weightUnit);
		this.getUser();
		this.getWorkouts();
	};
	changeHidden = () => {
		if (this.hidden == 'invisible') this.hidden = '';
		else this.hidden = 'invisible';
	};
	getWeightUnit = () => {
		if (this.user)
			this.prefService.getWeightUnit().then(i => (this.weightUnit = i));
	};
}
