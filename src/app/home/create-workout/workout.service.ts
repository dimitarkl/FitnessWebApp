import { Injectable } from '@angular/core';
import { WorkoutFull } from '../../types/Workout';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

@Injectable({
	providedIn: 'root',
})
export class WorkoutService {
	constructor() {}
	sendWorkout = async (workout: WorkoutFull) => {
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
