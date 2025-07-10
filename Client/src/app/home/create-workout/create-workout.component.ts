import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CreateExerciseComponent } from './create-exercise/create-exercise.component';
import { Exercise, ExerciseType, Workout } from '../../../../../shared/types/Workout';
import { WorkoutService } from '../workout.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ErrorService } from '../../error/error.service';
@Component({
    selector: 'app-create-workout',
    standalone: true,
    imports: [FormsModule, CreateExerciseComponent, RouterLink, DatePipe],
    templateUrl: './create-workout.component.html',
})
export class CreateWorkoutComponent implements OnInit, OnDestroy {
    constructor(
        private workoutService: WorkoutService,
        private route: ActivatedRoute,
        private router: Router,
        private errorService: ErrorService
    ) { }
    editing = false;
    exerciseSelection: ExerciseType[] = []
    workoutDuration: number = 10000;
    private timerInterval = setInterval(() => this.workoutDuration++, 1000);
    isEditingDuration = false;
    tempHours = 0;
    tempMinutes = 0;
    tempSeconds = 0;

    //TODO:calls 4 times the exercises
    ngOnInit(): void {
        const id = this.route.snapshot.params['editId'];
        if (id)
            this.getWorkout(id);
        this.getExercises()
    }
    ngOnDestroy(): void {
        clearInterval(this.timerInterval);
    }
    handleExerciseChange(updatedExercise: Exercise, index: number) {
        this.workoutObj.exercises[index] = updatedExercise;
        console.log(this.workoutObj)
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
    create = async () => {
        let response;
        if (!this.editing)
            response = await this.workoutService.sendWorkout(this.workoutObj);
        else
            response = await this.workoutService.updateWorkoutById(this.workoutObj);

        if (response === true)
            this.router.navigate(['/'])
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
                    this.workoutObj = response.workout;
                    this.editing = true;
                },
                error: (error: Error) => {
                    this.errorService.setError('Error fetching workout');
                }
            })
        }
    };
    submitName = (form: NgForm) => {
        const { title } = form.value;
        this.workoutObj.title = title;
    };
    getExercises = async () => {
        this.exerciseSelection = await this.workoutService.getExercises();
    }

    get formattedDuration(): string {
        const hours = Math.floor(this.workoutDuration / 3600);
        const minutes = Math.floor((this.workoutDuration % 3600) / 60);
        const seconds = this.workoutDuration % 60;

        let result = '';
        if (hours > 0) {
            result += `${hours}h `;
        }
        if (minutes > 0) {
            result += `${minutes}m `;
        }
        if (seconds > 0 || result === '') {
            result += `${seconds}s`;
        }

        return result.trim();
    }

    toggleDurationInput() {
        this.isEditingDuration = !this.isEditingDuration;
        if (this.isEditingDuration) {
            // Parse current duration from time string
            if (this.workoutObj.duration) {
                const timeParts = this.workoutObj.duration.split(':');
                this.tempHours = parseInt(timeParts[0]) || 0;
                this.tempMinutes = parseInt(timeParts[1]) || 0;
                this.tempSeconds = parseInt(timeParts[2]) || 0;
            } else {
                this.tempHours = 0;
                this.tempMinutes = 0;
                this.tempSeconds = 0;
            }
        }
    }

    saveDuration() {
        // Convert hours, minutes, and seconds to time string format (HH:MM:SS)
        const hours = this.tempHours.toString().padStart(2, '0');
        const minutes = this.tempMinutes.toString().padStart(2, '0');
        const seconds = this.tempSeconds.toString().padStart(2, '0');
        this.workoutObj.duration = `${hours}:${minutes}:${seconds}`;
        this.isEditingDuration = false;
    }

    cancelDurationEdit() {
        this.isEditingDuration = false;
        this.tempHours = 0;
        this.tempMinutes = 0;
        this.tempSeconds = 0;
    }

    workoutObj: Workout = {
        title: '',
        ownerId: '',
        exercises: [
            {
                name: '',
                sets: [
                    {
                        weight: 0,
                        reps: 0,
                    },
                ],
            },
            {
                name: '',
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
