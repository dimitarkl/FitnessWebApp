import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CreateExerciseComponent } from './create-exercise/create-exercise.component';
import { Exercise, Workout } from '../../../../../shared/types/Workout';
import { WorkoutService } from '../workout.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ErrorService } from '../../error/error.service';
@Component({
    selector: 'app-create-workout',
    standalone: true,
    imports: [FormsModule, CreateExerciseComponent, RouterLink],
    templateUrl: './create-workout.component.html',
})
export class CreateWorkoutComponent implements OnInit {
    constructor(
        private workoutService: WorkoutService,
        private route: ActivatedRoute,
        private router: Router,
        private errorService: ErrorService
    ) { }
    editing = false;
    ngOnInit(): void {
        const id = this.route.snapshot.params['editId'];
        if (id)
            this.getWorkout(id);
    }
    handleExerciseChange(updatedExercise: Exercise, index: number) {
        this.workoutObj.exercises[index] = updatedExercise;
    }
    deleteExercise = (index: number) => {
        if (
            this.workoutObj.exercises[index].sets &&
            this.workoutObj.exercises[index].sets.length <= 0
        ) {
            this.workoutObj.exercises.splice(index, 1);
        } else {
            console.log('ERROR');
        }
    };
    create = () => {
        if (!this.editing) {
            this.workoutService.sendWorkout(this.workoutObj);
        } else this.workoutService.updateWorkoutById(this.workoutObj);
        //this.router.navigate(['/']);
    };
    addExercise = () => {
        this.workoutObj.exercises.push({
            name: 'Exercise',
            sets: [{ reps: 0, weight: 0 }],
        });
    };
    getWorkout = (id: string | null) => {
        if (id) {
            this.workoutService.getWorkoutById(id).subscribe({
                next: (response: any) => {
                    if (response) {
                        this.workoutObj = response.workout;
                    } else {
                        this.errorService.setError('No workouts found');
                    }
                },
                error: (error: Error) => {
                    this.errorService.setError('Error fetching workouts: ' + error.message);
                }
            })
        }
    };
    submitName = (form: NgForm) => {
        const { title } = form.value;
        this.workoutObj.title = title;
    };
    workoutObj: Workout = {
        title: '',
        ownerId: '',
        exercises: [
            {
                name: 'Exercise',
                sets: [
                    {
                        weight: 0,
                        reps: 0,
                    },
                ],
            },
            {
                name: 'Second Exercise',
                sets: [
                    {
                        weight: 0,
                        reps: 0,
                    },
                ],
            },
        ],
    };
}
