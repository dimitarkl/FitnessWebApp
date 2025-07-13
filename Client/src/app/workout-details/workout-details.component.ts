import { Component, OnInit } from '@angular/core';
import { WorkoutService } from '../home/workout.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Workout } from '../../../../shared/types/Workout';
import { ExerciseCardComponent } from '../home/post/exercise-card/exercise-card.component';
import { ErrorService } from '../error/error.service';
import { UserService } from '../user/user.service';
import { DurationPipe } from '../pipes/duration.pipe';
import { DatePipe, CommonModule } from '@angular/common';
import { User } from '../../../../shared/types/user';
import { RelativeDatePipe } from '../pipes/relative-date.pipe';
import { DeleteConfirmationModalComponent } from '../shared/components/delete-confirmation-modal/delete-confirmation-modal.component';

@Component({
    selector: 'app-workout-details',
    standalone: true,
    imports: [ExerciseCardComponent, DurationPipe, DatePipe, RelativeDatePipe, CommonModule, DeleteConfirmationModalComponent],
    templateUrl: './workout-details.component.html',
})
export class WorkoutDetailsComponent implements OnInit {
    constructor(
        private workoutService: WorkoutService,
        private route: ActivatedRoute,
        private router: Router,
        private errorService: ErrorService,
        private userServices: UserService
    ) { }

    class = 'w-full';
    workout: Workout | null = null;
    ownerUsername: string | null = null;
    prefUnit: string = 'kg';
    currentUser: User | null = null;
    showDeleteConfirm: boolean = false;
    isDeleting: boolean = false;
    ngOnInit(): void {
        const id = this.route.snapshot.params['detailsId'];
        this.getWorkout();
        this.getPrefUnit();
        this.getCurrentUser();
    }
    getWorkout = () => {
        const id = this.route.snapshot.params['detailsId'];
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
    getCurrentUser = () => {
        this.userServices.user$.subscribe({
            next: (user) => {
                this.currentUser = user;
            }
        });
    }

    isOwner(): boolean {
        return this.currentUser?.id === this.workout?.ownerId;
    }
    likePost = async () => {
        if (this.workout && this.workout.id != undefined)
            await this.workoutService.likePost(this.workout.id);
        this.getWorkout()
    };

    editWorkout = () => {
        if (this.workout?.id) {
            this.router.navigate(['/edit', this.workout.id]);
        }
    }

    confirmDelete = () => {
        this.showDeleteConfirm = true;
    }

    cancelDelete = () => {
        this.showDeleteConfirm = false;
    }

    deleteWorkout = async () => {
        if (this.workout?.id) {
            this.isDeleting = true;
            try {
                await this.workoutService.deteleteWorkout(this.workout.id);
                this.router.navigate(['/']);
            } catch (error) {
                this.errorService.setError('Failed to delete workout');
            } finally {
                this.isDeleting = false;
            }
        }
        this.showDeleteConfirm = false;
    }

    getTotalSets(): number {
        if (!this.workout?.exercises) return 0;
        return this.workout.exercises.reduce((total, exercise) => {
            return total + (exercise.sets?.length || 0);
        }, 0);
    }

    getTotalVolume(): number {
        if (!this.workout?.exercises) return 0;
        return this.workout.exercises.reduce((total, exercise) => {
            const exerciseVolume = exercise.sets?.reduce((setTotal, set) => {
                return setTotal + (set.weight * set.reps);
            }, 0) || 0;
            return total + exerciseVolume;
        }, 0);
    }
}
