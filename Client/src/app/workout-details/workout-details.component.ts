import { Component, OnInit } from '@angular/core';
import { WorkoutService } from '../home/workout.service';
import { ActivatedRoute } from '@angular/router';
import { Workout } from '../../../../shared/types/Workout';
import { ExerciseCardComponent } from '../home/post/exercise-card/exercise-card.component';
import { ErrorService } from '../error/error.service';
import { UserService } from '../user/user.service';

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
        private errorService: ErrorService,
        private userServices: UserService
    ) { }

    class = 'w-full';
    workout: Workout | null = null;
    ownerUsername: string | null = null;
    prefUnit: string = 'kg';
    ngOnInit(): void {
        const id = this.route.snapshot.params['detailsId'];
        this.getWorkout(id);
        this.getPrefUnit()
    }
    getWorkout = (id: string) => {
        this.workoutService
            .getWorkoutById(id).subscribe({
                next: (response: any) => {
                    if (response) {
                        this.workout = response.workout;
                        this.updateWorkoutOwner(this.workout?.ownerId)
                    } else {
                        this.errorService.setError('No workouts found');
                    }
                },
                error: (error: Error) => {
                    console.log('Error fetching workouts: ' + error.message)
                    this.errorService.setError('Error fetching workouts');
                }
            })
    };
    updateWorkoutOwner = (id: string | undefined) => {
        if (!id) return
        this.userServices.getUser(id).subscribe(
            username => this.ownerUsername = username
        )
    }
    getPrefUnit = () => {
        this.userServices.user$.subscribe({
            next: (user) => {
                if (!user) return
                this.prefUnit = user.preferredWeightUnit
            }
        })
    }

}
