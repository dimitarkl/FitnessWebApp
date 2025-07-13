import { Component, OnInit } from '@angular/core';
//import { PostComponent } from './post/post.component';
import { WorkoutService } from './workout.service';
import { Workout } from '../../../../shared/types/Workout';;
import { RouterLink } from '@angular/router';
import { ErrorService } from '../error/error.service';
import { PostComponent } from './post/post.component';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [RouterLink, PostComponent],
    templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
    constructor(
        private workoutService: WorkoutService,
        private errorService: ErrorService
    ) { }
    workouts: Workout[] | null = null;
    ngOnInit(): void {
        this.getWorkout();
    }
    ngOnChange():void {
        this.getWorkout();
    }
    getWorkout = () => {
        this.workoutService.getLastWorkouts().subscribe({
            next: (response: any) => {
                if (response) {
                    this.workouts = response;
                } else {
                    this.errorService.setError('No workouts found');
                }
            },
            error: (error: Error) => {
                console.log('Error fetching workouts: ' + error.message)
                this.errorService.setError('Error fetching workouts: ');
            }
        });
    };
    

    onWorkoutDeleted(id: string): void {
        if (!this.workouts) return;
        this.workouts = this.workouts.filter(w => w.id !== id);
    }
    
    // Handle like event from child PostComponent by refreshing the list
    onPostLiked(_: any): void {
        this.getWorkout();
    }
}
