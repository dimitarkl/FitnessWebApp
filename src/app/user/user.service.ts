import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, tap } from 'rxjs';
import {
	browserLocalPersistence,
	createUserWithEmailAndPassword,
	onAuthStateChanged,
	setPersistence,
	signInWithEmailAndPassword,
	User,
} from 'firebase/auth';
import { auth } from '../../lib/firebase';

@Injectable({
	providedIn: 'root',
})
export class UserService implements OnDestroy {
	private userSubject: BehaviorSubject<User | null> =
		new BehaviorSubject<User | null>(null);
	user$: Observable<User | null> = this.userSubject.asObservable();

	constructor() {
		this.initializeAuthState();
	}
	private initializeAuthState(): void {
		onAuthStateChanged(auth, user => {
			this.userSubject.next(user);
		});
	}
	login = async (email: string, password: string) => {
		try {
			await setPersistence(auth, browserLocalPersistence);

			return signInWithEmailAndPassword(auth, email, password);
		} catch (err) {
			console.log('Login Error:' + (err as Error).message);
		}
		return;
	};
	register = async (email: string, password: string) => {
		try {
			await setPersistence(auth, browserLocalPersistence);
			return createUserWithEmailAndPassword(auth, email, password);
		} catch (err) {
			console.log('Register Error:' + (err as Error).message);
		}
		return;
	};
	logout = async () => {
		try {
			await auth.signOut();
		} catch (err) {
			console.log('Logout Error:' + (err as Error).message);
		}
	};
	get isLogged(): boolean {
		return !!this.userSubject.value;
	}
	ngOnDestroy(): void {}
}
