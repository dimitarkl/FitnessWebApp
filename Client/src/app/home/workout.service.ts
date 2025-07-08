import { Injectable } from '@angular/core';
import { Exercise, ExerciseSet, ExerciseType, Workout } from '../../../../shared/types/Workout';;

import { UserService } from '../user/user.service';
import { ErrorService } from '../error/error.service';
import { catchError, firstValueFrom, map, of } from 'rxjs';
import { User } from '../../../../shared/types/user';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class WorkoutService {
    constructor(
        private userService: UserService,
        private errorService: ErrorService,
        private http: HttpClient,
    ) { }
    private apiUrl = 'http://localhost:5000';
    //TODO Fix Errors
    sendWorkout = async (workout: Workout) => {
        const filteredWorkout = {
            ...workout,
            exercises: workout.exercises.filter(exercise => exercise.name !== "")
        };
        if (filteredWorkout.exercises.length <= 0) {
            this.errorService.setError("Empty Workout")
            return;
        }

        let user: User | null = await firstValueFrom(this.userService.user$)
        if (!user) {
            this.errorService.setError('User not found or invalid');
            console.log(user)
            return;
        }
        try {
            this.http.post(`${this.apiUrl}` + '/api/create-workout', {
                workout: workout
            }, { withCredentials: true }).subscribe()
            

        } catch (error) {
            console.log('Error sending workout: ' + (error as Error).message)
            this.errorService.setError('Error sending workout' );
        }
        return true
    };
    getLastWorkouts = () => {
        return this.http.get(`${this.apiUrl}/api/workouts`,
            { withCredentials: true })
    };

    getUserWorkouts = () => {
        return this.http.get(`${this.apiUrl}/api/user/workouts`, { withCredentials: true })
    };

    deteleteWorkout = async (workoutId: string) => {
        this.http.delete(`${this.apiUrl}/api/workouts/${workoutId}`
            , { withCredentials: true }).subscribe({
                error: (err) => {
                    console.log('Erorr while deleting workout',(err as Error).message)
                    this.errorService.setError('Erorr while deleting workout')
                }
            })
    };
    likePost = async (workoutId: string) => {
      
    };
    getWorkoutById = (id: string) => {
        return this.http.get(`${this.apiUrl}/api/workouts/${id}`,
            { withCredentials: true })

    };
    updateWorkoutById = async (workout: Workout) => {
        const filteredWorkout = {
            ...workout,
            exercises: workout.exercises.filter(exercise => exercise.name !== "")
        };
        if (filteredWorkout.exercises.length <= 0) {
            this.errorService.setError("Empty Workout")
            return;
        }

        let user: User | null = await firstValueFrom(this.userService.user$)
        if (!user) {
            this.errorService.setError('User not found or invalid');
            console.log(user)
            return;
        }
        try {
            this.http.put(`${this.apiUrl}/api/workouts/${workout.id}`, {
                workout: workout,
            }, { withCredentials: true }).subscribe({
                next: () => {
                    //TODO update the workouts list
                },
                error: (err) => {
                    console.log(err)
                    this.errorService.setError("Error Updating Workout")
                }

            })
        } catch (err) {
            return false
        }
        return false
    };

    getExercises = async (): Promise<ExerciseType[]> => {
        try {
            const data: any = await firstValueFrom(
                this.http.get(`${this.apiUrl}/exercises`, { withCredentials: true })
            );
            if (data) {
                return data;
            } else {
                this.errorService.setError('No exercises found');
                return [];
            }
        } catch (err: any) {
            console.log('Error fetching exercises: ' + err.message)
            this.errorService.setError('Error fetching exercises');
            return [];
        }
    }
}
