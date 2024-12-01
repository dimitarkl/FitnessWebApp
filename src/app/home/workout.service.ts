import { Injectable } from '@angular/core';
import { Exercise, ExerciseSet, Workout, WorkoutGet } from '../types/Workout';
import {
	addDoc,
	collection,
	getDocs,
	limit,
	orderBy,
	query,
	serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';

@Injectable({
	providedIn: 'root',
})
export class WorkoutService {
	constructor() {}
	sendWorkout = async (workout: Workout) => {
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
		try {
			const querySnapshot = getDocs(q);
			const workouts: WorkoutGet[] = [];
			querySnapshot.then(item => {
				item.forEach(doc => {
					const data = doc.data();
					const workout: WorkoutGet = {
						id: doc.id,
						owner: data['owner'] || 'Unknown Owner',
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
}
