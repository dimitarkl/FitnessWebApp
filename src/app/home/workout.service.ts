import { Injectable } from '@angular/core';
import { Exercise, ExerciseSet, Workout } from '../types/Workout';
import {
	addDoc,
	arrayUnion,
	collection,
	deleteDoc,
	doc,
	documentId,
	getDoc,
	getDocs,
	limit,
	orderBy,
	Query,
	query,
	serverTimestamp,
	setDoc,
	where,
} from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import { UserService } from '../user/user.service';
import { ErrorService } from '../error/error.service';
import { catchError, firstValueFrom, map, of } from 'rxjs';
import { PreferencesService } from '../user/preferences.service';
import { User } from 'firebase/auth';

@Injectable({
	providedIn: 'root',
})
export class WorkoutService {
	constructor(
		private userService: UserService,
		private errorService: ErrorService,
		private prefService: PreferencesService
	) {}
	sendWorkout = async (workout: Workout) => {
		const userId = await this.checkUser();
		if (userId) {
			workout.ownerId = userId;
			const unit = await this.prefService.getWeightUnit();

			if (unit == 'lbs') workout = this.convertWeightToKg(workout);

			try {
				const docRef = await addDoc(collection(db, 'exercises'), {
					...workout,
					createdAt: serverTimestamp(),
				});
				console.log('Document written with ID: ', docRef.id);
			} catch (e) {
				this.errorService.setError(
					'Error adding document: ' + (e as Error).message
				);
			}
		} else {
			this.errorService.setError('User not found or invalid');
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
		try {
			const userId = await firstValueFrom(
				this.userService.user$.pipe(
					map(user => user?.uid || null),
					catchError(() => {
						this.errorService.setError('Error fetching user');
						return of(null);
					})
				)
			);

			if (userId) {
				return userId; // Return the userId
			} else {
				this.errorService.setError('User not found or error occurred');
				return null; // Return null if no userId found
			}
		} catch (error) {
			this.errorService.setError('Error processing user');
			return null; // Return null in case of an error
		}
	};
	getLastWorkouts = () => {
		const q = query(
			collection(db, 'exercises'),
			orderBy('createdAt', 'desc'),
			limit(5)
		);
		const response = this.getDocuments(q);
		return response;
	};

	getUserWorkouts = (id: string, amount: number) => {
		const q = query(
			collection(db, 'exercises'),
			where('ownerId', '==', id),
			orderBy('createdAt', 'desc'),
			limit(amount)
		);
		const response = this.getDocuments(q);
		return response;
	};

	getDocuments = async (q: Query) => {
		try {
			const querySnapshot = getDocs(q);
			const workouts: Workout[] = [];
			querySnapshot.then(item => {
				item.forEach(doc => {
					const data = doc.data();
					const workout: Workout = {
						id: doc.id,
						title: data['title'] || 'Title Not Found',
						ownerId: data['ownerId'] || 'Unknown Owner',
						createdAt: data['createdAt'] || 'Unknown Date',
						exercises: (data['exercises'] || []).map(
							(exercise: Exercise) => ({
								name: exercise?.name || 'Unknown Exercise',
								sets: (exercise?.sets || []).map(
									(set: ExerciseSet) => ({
										weight: set?.weight || 0,
										reps: set?.reps || 0,
									})
								),
							})
						),
						likes: data['likes'],
					};
					workouts.push(workout);
				});
			});
			const userId = await this.checkUser();
			if (userId) {
				const unit = await this.prefService.getWeightUnit();
				if (unit == 'lbs')
					workouts.forEach(
						workout => (workout = this.convertWeightToLbs(workout))
					);
			}
			return workouts;
		} catch (e) {
			this.errorService.setError(
				'Error Fetching Workout' + (e as Error).message
			);
			return null;
		}
	};
	deteleteWorkout = async (workoutId: string) => {
		const workout = await this.getWorkoutById(workoutId);
		if (!workout) {
			this.errorService.setError('Error:Workout Doesnt Exist');
			return;
		}
		const isUserValid = await this.checkUser();
		if (isUserValid)
			try {
				await deleteDoc(doc(db, 'exercises', workoutId));
			} catch (e) {
				this.errorService.setError(
					'Error Deleting:' + (e as Error).message
				);
			}
	};
	likePost = async (workoutId: string) => {
		const workout = await this.getWorkoutById(workoutId);
		if (!workout) {
			this.errorService.setError('Error:Workout Doesnt Exist');
			return;
		}
		const isUserValid = await this.checkUser();
		if (isUserValid)
			if (auth.currentUser) {
				const body = {
					likes: arrayUnion(auth.currentUser.uid),
				};
				try {
					const response = await setDoc(
						doc(db, 'exercises', workoutId),
						body,
						{ merge: true }
					);
					return response;
				} catch (e) {
					this.errorService.setError(
						'Error Liking:' + (e as Error).message
					);
				}
			} else this.errorService.setError('Error Liking: User Not Found');
	};
	getWorkoutById = async (id: string) => {
		try {
			const q = query(
				collection(db, 'exercises'),
				where(documentId(), '==', id)
			);
			const querySnapshot = await getDoc(doc(db, 'exercises', id));

			const data = querySnapshot.data();
			let workout: Workout | null = null;
			if (data) {
				workout = {
					id: querySnapshot.id,
					title: data['title'] || 'Title Not Found',
					ownerId: data['ownerId'] || 'Unknown Owner',
					createdAt: data['createdAt'] || 'Unknown Date',
					exercises: (data['exercises'] || []).map(
						(exercise: Exercise) => ({
							name: exercise?.name || 'Unknown Exercise',
							sets: (exercise?.sets || []).map(
								(set: ExerciseSet) => ({
									weight: set?.weight || 0,
									reps: set?.reps || 0,
								})
							),
						})
					),
					likes: data['likes'],
				};
			} else this.errorService.setError('Error Fetching');
			const userId = await this.checkUser();
			if (userId) {
				const unit = await this.prefService.getWeightUnit();
				if (unit == 'lbs' && workout)
					workout = this.convertWeightToLbs(workout);
			}
			return workout;
		} catch (e) {
			this.errorService.setError(
				'Error Fetching:' + (e as Error).message
			);
			return null;
		}
	};
	updateWorkoutById = async (workout: Workout) => {
		const userId = await this.checkUser();
		if (userId) {
			workout.ownerId = userId;
			const unit = await this.prefService.getWeightUnit();

			if (unit == 'lbs') workout = this.convertWeightToKg(workout);

			let body;
			if (workout.likes == undefined)
				body = {
					...workout,
					likes: null,
				};
			else
				body = {
					...workout,
				};
			if (workout.id) {
				try {
					const response = await setDoc(
						doc(db, 'exercises', workout.id),
						body,
						{
							merge: true,
						}
					);
					return response;
				} catch (e) {
					this.errorService.setError(
						'Error Updating Workout:' + (e as Error).message
					);
					console.log(
						'Error Updating Workout:' + (e as Error).message
					);
				}
			} else this.errorService.setError('Workout Id Not Found');
		} else
			this.errorService.setError('Error Updating User: User Not Found');
	};
}
