import { Injectable, OnDestroy } from "@angular/core";
import { BehaviorSubject, map, Observable } from "rxjs";
import {
	browserLocalPersistence,
	createUserWithEmailAndPassword,
	onAuthStateChanged,
	setPersistence,
	signInWithEmailAndPassword,
	User,
} from "firebase/auth";
import { auth } from "../../lib/firebase";
import { ErrorService } from "../error/error.service";

@Injectable({
	providedIn: "root",
})
export class UserService implements OnDestroy {
	private userSubject: BehaviorSubject<User | null> =
		new BehaviorSubject<User | null>(null);
	user$: Observable<User | null> = this.userSubject.asObservable();
	userBool: User | null | false = false;
	constructor(private errorService: ErrorService) {
		this.initializeAuthState();
	}
	initializeAuthState(): void {
		onAuthStateChanged(auth, (user) => {
			this.userSubject.next(user);
			this.userBool = user;
		});
	}
	login = async (email: string, password: string) => {
		try {
			await setPersistence(auth, browserLocalPersistence);

			return await signInWithEmailAndPassword(auth, email, password);
		} catch (err) {
			this.errorService.setError("Login Error:" + (err as Error).message);
		}
		return;
	};
	register = async (email: string, password: string) => {
		try {
			await setPersistence(auth, browserLocalPersistence);
			return await createUserWithEmailAndPassword(auth, email, password);
		} catch (err) {
			this.errorService.setError(
				"Register Error:" + (err as Error).message
			);
		}
		return;
	};
	logout = async () => {
		try {
			await auth.signOut();
		} catch (err) {
			this.errorService.setError(
				"Logout Error:" + (err as Error).message
			);
		}
	};
	get isLogged(): boolean | null {
		if (this.userBool) return true;
		else if (this.userBool == null) return false;
		return null;
	}
	ngOnDestroy(): void {}
}
