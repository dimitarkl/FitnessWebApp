import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CreateExerciseComponent } from './create-exercise/create-exercise.component';
import { Exercise, ExerciseType, Workout } from '../../../../../shared/types/Workout';
import { WorkoutService } from '../workout.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ErrorService } from '../../error/error.service';
import { DurationPipe } from '../../pipes/duration.pipe';
@Component({
    selector: 'app-create-workout',
    standalone: true,
    imports: [FormsModule, CreateExerciseComponent, RouterLink, DatePipe,DurationPipe],
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

    private timerInterval = setInterval(() => {
        if (!this.isEditingDuration) this.workoutObj.duration++
    }, 1000);

    isEditingDuration = false;
    tempHours = 0;
    tempMinutes = 0;
    tempSeconds = 0;
    showExerciseSelection = false;

    selectExercise = (selectedExercise: ExerciseType) => {
        this.workoutObj.exercises.push({
            name: selectedExercise.name,
            sets: [{ reps: 0, weight: 0 }],
        });
        this.showExerciseSelection = false;
    };

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
    }

    deleteExercise = (index: number) => {
        if (
            this.workoutObj.exercises[index].sets &&
            this.workoutObj.exercises[index].sets.length <= 0
        ) {
            this.workoutObj.exercises.splice(index, 1);
        } else {
            this.errorService.setError('Error Deleting Exercise')
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
    
    toggleDurationInput() {
        this.isEditingDuration = !this.isEditingDuration;
        if (this.isEditingDuration) {
            // Parse current duration from time string
            this.tempHours = Math.floor(this.workoutObj.duration / 3600)
            this.tempMinutes = Math.floor((this.workoutObj.duration % 3600) / 60);
            this.tempSeconds = 0;
        }
    }

    saveDuration() {
        if (this.tempHours < 24 && this.tempMinutes < 60) {
            this.workoutObj.duration = this.tempHours * 3600 + this.tempMinutes * 60
            this.isEditingDuration = false;
        } else {
            this.errorService.setError("Exceeding max hours on minutes")
        }
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
        ],
        duration: 0
    };
}
