import { Injectable } from '@angular/core';
import {
	Exercise,
	ExerciseSet,
	WorkoutSend,
	WorkoutGet,
} from '../types/Workout';
import {
	addDoc,
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

@Injectable({
	providedIn: 'root',
})
export class WorkoutService {
	constructor(
		private userService: UserService,
		private errorService: ErrorService
	) {}
	sendWorkout = async (workout: WorkoutSend) => {
		if (!this.userService.isLogged) return;
		let userId = '';
		this.userService.user$.subscribe(item => {
			//TODO Add Error Message
			if (!item) return;
			userId = item?.uid;
		});
		workout.ownerId = userId;
		try {
			const docRef = await addDoc(collection(db, 'exercises'), {
				...workout,
				createdAt: serverTimestamp(),
			});
			console.log('Document written with ID: ', docRef.id);
		} catch (e) {
			console.error('Error adding document: ', e);
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

	getDocuments = (q: Query) => {
		try {
			const querySnapshot = getDocs(q);
			const workouts: WorkoutGet[] = [];
			querySnapshot.then(item => {
				item.forEach(doc => {
					const data = doc.data();
					const workout: WorkoutGet = {
						id: doc.id,
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
			return workouts;
		} catch (e) {
			this.errorService.setError('Error Fetching Workout' + (e as Error));
			return null;
		}
	};
	deteleteWorkout = async (workoutId: string) => {
		try {
			await deleteDoc(doc(db, 'exercises', workoutId));
		} catch (e) {
			console.log('Error Deleting:' + (e as Error));
		}
	};
	likePost = async (workoutId: string) => {
		if (auth.currentUser) {
			const body = {
				likes: [auth.currentUser.uid],
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
					'Error Updating User:' + (e as Error)
				);
			}
		} else
			this.errorService.setError('Error Updating User: User Not Found');
	};
	getWorkoutById = async (id: string) => {
		try {
			const q = query(
				collection(db, 'exercises'),
				where(documentId(), '==', id)
			);
			const querySnapshot = await getDoc(doc(db, 'exercises', id));

			const data = querySnapshot.data();
			let workout: WorkoutGet | null = null;
			if (data) {
				workout = {
					id: querySnapshot.id,
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
			return workout;
		} catch (e) {
			this.errorService.setError('Error Fetching:' + (e as Error));
			return null;
		}
	};
}
