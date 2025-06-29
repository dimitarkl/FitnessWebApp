import { Injectable } from '@angular/core';
import { Exercise, ExerciseSet, ExerciseType, Workout } from '../../../../shared/types/Workout';;

import { UserService } from '../user/user.service';
import { ErrorService } from '../error/error.service';
import { catchError, firstValueFrom, map, of } from 'rxjs';
import { PreferencesService } from '../user/preferences.service';
import { User } from '../../../../shared/types/user';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class WorkoutService {
    constructor(
        private userService: UserService,
        private errorService: ErrorService,
        private prefService: PreferencesService,
        private http: HttpClient,
    ) { }
    private apiUrl = 'http://localhost:5000';
    sendWorkout = async (workout: Workout) => {

        let user: User | null = await firstValueFrom(this.userService.user$)
        if (!user) {
            this.errorService.setError('User not found or invalid');
            console.log(user)
            return;
        }
        try {
            this.http.post(`${this.apiUrl}` + '/api/create-workout', {
                workout: workout,
                userId: user.id
            }, { withCredentials: true }).subscribe()

        } catch (error) {
            this.errorService.setError('Error sending workout: ' + (error as Error).message);
        }
    };
    convertWeightToKg = (workout: Workout): Workout => {
        workout.exercises.forEach(exercise => {
            exercise.sets?.forEach(set => {
                set.weight = parseFloat((set.weight * 0.453592).toFixed(2));
            });
        });
        return workout;
    };
    convertWeightToLbs = (workout: Workout): Workout => {
        workout.exercises.forEach(exercise => {
            exercise.sets?.forEach(set => {
                set.weight = parseFloat((set.weight * 2.20462).toFixed(2));
            });
        });
        return workout;
    };
    checkUser = async (): Promise<string | null> => {
        // try {
        // 	const userId = await firstValueFrom(
        // 		this.userService.user$.pipe(
        // 			map(user => user?.uid || null),
        // 			catchError(() => {
        // 				this.errorService.setError('Error fetching user');
        // 				return of(null);
        // 			})
        // 		)
        // 	);
        // 	if (userId) {
        // 		return userId;
        // 	} else return null;
        // } catch (error) {
        // 	this.errorService.setError('Error processing user');
        // 	return null;
        // }
        return "";
    };
    getLastWorkouts = () => {
        return this.http.get(`${this.apiUrl}/api/workouts`,
            { withCredentials: true })


    };

    getUserWorkouts = () => {
        return this.http.get(`${this.apiUrl}/api/user/workouts`, { withCredentials: true })
    };

    getDocuments = async (q: any) => {
        // try {
        // 	const querySnapshot = getDocs(q);
        // 	const workouts: Workout[] = [];
        // 	querySnapshot.then(item => {
        // 		item.forEach(doc => {
        // 			const data = doc.data();
        // 			const workout: Workout = {
        // 				id: doc.id,
        // 				title: data['title'] || 'Title Not Found',
        // 				ownerId: data['ownerId'] || 'Unknown Owner',
        // 				createdAt: data['createdAt'] || 'Unknown Date',
        // 				exercises: (data['exercises'] || []).map(
        // 					(exercise: Exercise) => ({
        // 						name: exercise?.name || 'Unknown Exercise',
        // 						sets: (exercise?.sets || []).map(
        // 							(set: ExerciseSet) => ({
        // 								weight: set?.weight || 0,
        // 								reps: set?.reps || 0,
        // 							})
        // 						),
        // 					})
        // 				),
        // 				likes: data['likes'],
        // 			};
        // 			workouts.push(workout);
        // 		});
        // 	});
        // 	const userId = await this.checkUser();
        // 	if (userId) {
        // 		const unit = await this.prefService.getWeightUnit();
        // 		if (unit == 'lbs')
        // 			workouts.forEach(
        // 				workout => (workout = this.convertWeightToLbs(workout))
        // 			);
        // 	}
        // 	return workouts;
        // } catch (e) {
        // 	this.errorService.setError(
        // 		'Error Fetching Workout' + (e as Error).message
        // 	);
        // 	return null;
        // }
    };
    deteleteWorkout = async (workoutId: string) => {
        // const workout = await this.getWorkoutById(workoutId);
        // if (!workout) {
        // 	this.errorService.setError('Error:Workout Doesnt Exist');
        // 	return;
        // }
        // const isUserValid = await this.checkUser();
        // if (isUserValid)
        // 	try {
        // 		await deleteDoc(doc(db, 'exercises', workoutId));
        // 	} catch (e) {
        // 		this.errorService.setError(
        // 			'Error Deleting:' + (e as Error).message
        // 		);
        // 	}
    };
    likePost = async (workoutId: string) => {
        // const workout = await this.getWorkoutById(workoutId);
        // if (!workout) {
        // 	this.errorService.setError('Error:Workout Doesnt Exist');
        // 	return;
        // }
        // const isUserValid = await this.checkUser();
        // if (isUserValid)
        // 	if (auth.currentUser) {
        // 		const body = {
        // 			likes: arrayUnion(auth.currentUser.uid),
        // 		};
        // 		try {
        // 			const response = await setDoc(
        // 				doc(db, 'exercises', workoutId),
        // 				body,
        // 				{ merge: true }
        // 			);
        // 			return response;
        // 		} catch (e) {
        // 			this.errorService.setError(
        // 				'Error Liking:' + (e as Error).message
        // 			);
        // 		}
        // 	} else this.errorService.setError('Error Liking: User Not Found');
    };
    getWorkoutById = (id: string) => {
        return this.http.get(`${this.apiUrl}/api/workouts/${id}`,
            { withCredentials: true })

    };
    updateWorkoutById = async (workout: Workout) => {
        // 	const userId = await this.checkUser();
        // 	if (userId) {
        // 		workout.ownerId = userId;
        // 		const unit = await this.prefService.getWeightUnit();

        // 		if (unit == 'lbs') workout = this.convertWeightToKg(workout);

        // 		let body;
        // 		if (workout.likes == undefined)
        // 			body = {
        // 				...workout,
        // 				likes: null,
        // 			};
        // 		else
        // 			body = {
        // 				...workout,
        // 			};
        // 		if (workout.id) {
        // 			try {
        // 				const response = await setDoc(
        // 					doc(db, 'exercises', workout.id),
        // 					body,
        // 					{
        // 						merge: true,
        // 					}
        // 				);
        // 				return response;
        // 			} catch (e) {
        // 				this.errorService.setError(
        // 					'Error Updating Workout:' + (e as Error).message
        // 				);
        // 				console.log(
        // 					'Error Updating Workout:' + (e as Error).message
        // 				);
        // 			}
        // 		} else this.errorService.setError('Workout Id Not Found');
        // 	} else
        // 		this.errorService.setError('Error Updating User: User Not Found');
        return workout;
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
            this.errorService.setError('Error fetching exercises: ' + err.message);
            return [];
        }
    }
}
