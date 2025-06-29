import { Injectable, OnDestroy } from "@angular/core";
import { BehaviorSubject, Observable, tap, } from "rxjs";
import { ErrorService } from "../error/error.service";
import { HttpClient } from "@angular/common/http";
import { User } from "../../../../shared/types/user";

@Injectable({
    providedIn: "root",
})

export class UserService implements OnDestroy {
    private userSubject: BehaviorSubject<User | null> =
        new BehaviorSubject<User | null>(null);

    user$: Observable<User | null> = this.userSubject.asObservable();
    userBool: User | null | false = false;

    private isAuthenticated = new BehaviorSubject<boolean | null>(null);
    isAuthenticated$ = this.isAuthenticated.asObservable();

    private apiUrl = 'http://localhost:5000';
    private authUrl = `${this.apiUrl}/auth`;

    constructor(
        private errorService: ErrorService,
        private http: HttpClient,
    ) {
        this.initializeAuthState();
    }
    checkUser = async () => {
        this.http.get(
            `${this.apiUrl}/api/users/me`,
            { withCredentials: true }
        ).subscribe({
            next: (data: any) => {
                if (data.authenticated == false) {
                    console.log("User not authenticated");
                    this.isAuthenticated.next(false);
                    this.userSubject.next(null);
                    return;
                }
                this.userSubject.next(data.user);
                this.isAuthenticated.next(true);
            },
            error: (err) => {
                console.log("Error checking user authentication", err);
                this.isAuthenticated.next(false);
                this.userSubject.next(null);
            }
        });
    }
    initializeAuthState(): void {
        this.checkUser()
    }
    logout(): void {
        this.http.get(
            `${this.authUrl}/logout`,
            { withCredentials: true }
        ).pipe(
            tap(() => {
                this.userSubject.next(null);
                this.isAuthenticated.next(false);
            }),
            tap({
                error: (err) => {
                    this.errorService.setError(err);
                }
            })
        ).subscribe();

    }

    login(email: string, password: string) {
        return this.http.post(
            `${this.authUrl}/login`,
            { email, password },
            { withCredentials: true }
        ).pipe(
            tap(() => this.isAuthenticated.next(true))
        );
    }

    register(email: string, password: string): Observable<any> {
        return this.http.post(
            `${this.authUrl}/register`,
            { email, password },
            { withCredentials: true }
        ).pipe(
            tap(() => this.isAuthenticated.next(true))
        )
    }

    get isLogged(): boolean | null {
        return this.isAuthenticated.value
    }
    ngOnDestroy(): void { }
}
