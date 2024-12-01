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
}
