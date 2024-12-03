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
	getDocs,
	limit,
	orderBy,
	Query,
	query,
	serverTimestamp,
	where,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { UserService } from '../user/user.service';

@Injectable({
	providedIn: 'root',
})
export class WorkoutService {
	constructor(private userService: UserService) {}
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
					};
					workouts.push(workout);
				});
			});
			return workouts;
		} catch (e) {
			console.error('Error Fetching Workout' + (e as Error));
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
}
