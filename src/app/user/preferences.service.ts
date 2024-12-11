import { Injectable } from '@angular/core';
import { auth, db } from '../../lib/firebase';
import { updateProfile } from 'firebase/auth';
import {
	collection,
	doc,
	getDocs,
	query,
	setDoc,
	where,
} from 'firebase/firestore';

@Injectable({
	providedIn: 'root',
})
export class PreferencesService {
	updateUsername = async (name: string) => {
		if (auth.currentUser) {
			try {
				updateProfile(auth.currentUser, { displayName: name });
				const body = {
					userId: auth.currentUser.uid,
					username: name,
				};
				const response = await setDoc(
					doc(db, 'userPrefs', auth.currentUser.uid),
					body,
					{ merge: true }
				);
				return response;
			} catch (e) {
				console.log('Error Updating User:' + (e as Error));
			}
		} else console.log('Error Updating User: User Not Found');
	};
	getUsernameById = async (userId: string): Promise<string> => {
		const q = query(
			collection(db, 'userPrefs'),
			where('userId', '==', userId)
		);
		const querySnapshot = await getDocs(q);
		let response = '';
		querySnapshot.forEach(i => (response = i.data()['username']));
		return response;
	};

	updateWeightUnit = async (unit: string) => {
		if (auth.currentUser) {
			try {
				const body = {
					preferredWeightUnit: unit,
				};
				const response = await setDoc(
					doc(db, 'userPrefs', auth.currentUser.uid),
					body,
					{ merge: true }
				);
				return response;
			} catch (e) {
				console.log('Error Updating Preference:' + (e as Error));
			}
		} else console.log('Error Updating Preference: User Not Found');
	};
	getWeightUnit = async () => {
		const userId = auth.currentUser?.uid;
		if (!userId) return 'kg';
		const q = query(
			collection(db, 'userPrefs'),
			where('userId', '==', userId)
		);
		const querySnapshot = await getDocs(q);
		let response = '';
		querySnapshot.forEach(
			i => (response = i.data()['preferredWeightUnit'])
		);
		return response;
	};
}
