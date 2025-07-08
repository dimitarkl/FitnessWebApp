import { Component, OnInit } from '@angular/core';
import { UserService } from '../user/user.service';
import { WorkoutService } from '../home/workout.service';
import { PostComponent } from '../home/post/post.component';
import { Workout } from '../../../../shared/types/Workout';
import { FormsModule, NgForm } from '@angular/forms';
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
    ) { }
    hidden = 'invisible';
    user: User | null = null;
    displayName: string = '';
    workouts: Workout[] | null = null;
    weightUnit: string = '';
    ngOnInit(): void {
        this.getUser();
        this.getWorkouts();
    }
    getUser = () => {
        this.userService.user$.subscribe(user => {
            if (!user) return
            this.user = user;
            this.displayName = user.username ? user.username : "Username Not Found";
            this.weightUnit = user.preferredWeightUnit ? user.preferredWeightUnit : "NOT FOUND"

        });
    };
    getWorkouts = () => {
        if (this.user) {
            this.workoutService
                .getUserWorkouts().subscribe({
                    next: (response: any) => {
                        if (response) {
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
        this.userService.updateUser(username, weightUnit).subscribe()
        
        this.getUser();
        this.getWorkouts();
    };
    changeHidden = () => {
        if (this.hidden == 'invisible') this.hidden = '';
        else this.hidden = 'invisible';
    };
}
