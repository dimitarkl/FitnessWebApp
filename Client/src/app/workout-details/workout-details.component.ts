import { Component, OnInit } from '@angular/core';
import { WorkoutService } from '../home/workout.service';
import { ActivatedRoute } from '@angular/router';
import { Workout } from '../../../../shared/types/Workout';
import { ExerciseCardComponent } from '../home/post/exercise-card/exercise-card.component';
import { PreferencesService } from '../user/preferences.service';
import { ErrorService } from '../error/error.service';

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
        private prefService: PreferencesService,
        private errorService: ErrorService
    ) { }

    class = 'w-full';
    workout: Workout | null = null;
    ownerUsername: string | null = null;
    prefUnit: string = '';
    ngOnInit(): void {
        const id = this.route.snapshot.params['detailsId'];
        this.getWorkout(id);
        this.getOwnerName();
        this.getWeightUnit();
    }
    getOwnerName = () => {
        if (this.workout?.ownerId)
            this.prefService
                .getUsernameById(this.workout.ownerId)
                .then(response => (this.ownerUsername = response));
    };
    getWorkout = (id: string) => {
        this.workoutService
            .getWorkoutById(id).subscribe({
                next: (response: any) => {
                    if (response) {
                        this.workout = response.workout;
                        } else {
                            this.errorService.setError('No workouts found');
                        }
                },
                error: (error: Error) => {
                    this.errorService.setError('Error fetching workouts: ' + error.message);
                }
            })
    };
    getWeightUnit = () => {
        this.prefService
            .getWeightUnit()
            .then(response => (this.prefUnit = response));
    };
}
