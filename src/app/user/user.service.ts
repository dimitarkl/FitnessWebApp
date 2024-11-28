import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Subscription, tap } from 'rxjs';
import { UserForAuth } from '../types/user';
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '../../lib/firebase';

@Injectable({
	providedIn: 'root',
})
export class UserService implements OnDestroy {
	private user$$ = new BehaviorSubject<UserForAuth | null>(null);
	private user$ = this.user$$.asObservable();

	USER_KEY = '[user]';
	user: UserForAuth | null = null;
	userSubscription: Subscription | null = null;
	login = (email: string, password: string) => {
		try {
			return signInWithEmailAndPassword(auth, email, password);
		} catch (err) {
			console.log('Login Error:' + (err as Error).message);
		}
		return;
	};
	register = (email: string, password: string) => {
		try {
			return signInWithEmailAndPassword(auth, email, password);
		} catch (err) {
			console.log('Register Error:' + (err as Error).message);
		}
		return;
	};
	ngOnDestroy(): void {}
}
