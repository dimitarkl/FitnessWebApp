import { Injectable, OnDestroy } from "@angular/core";
import { BehaviorSubject, filter, map, Observable, tap, } from "rxjs";
import { ErrorService } from "../error/error.service";
import { HttpClient } from "@angular/common/http";
import { User } from "../../../../shared/types/user";
import { NavigationEnd, Router } from "@angular/router";

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
        private router: Router
    ) {
        this.initializeAuthState();
        this.subscribeToRouteChanges();
    }

    private subscribeToRouteChanges(): void {
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe(() => {
            this.initializeAuthState();
        });
    }
    checkUser = async () => {
        this.http.get(
            `${this.apiUrl}/api/users/me`,
            { withCredentials: true }
        ).subscribe({
            next: (data: any) => {
                if (data.authenticated == false) {
                    this.isAuthenticated.next(false);
                    this.userSubject.next(null);
                    return;
                }
                this.userSubject.next(data.user);
                this.isAuthenticated.next(true);
            },
            error: (err) => {
                this.errorService.setError('Error checking user authentication')
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
                    console.log('Error Logging Out',err)
                    this.errorService.setError('Error Logging Out');
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

    updateUser = (username: string, weightUnit: string) => {
        return this.http.put(`${this.apiUrl}/api/users/update`, {
            username,
            weightUnit
        }, { withCredentials: true }).pipe(
            tap({
                next: () => {
                    this.initializeAuthState();
                },
                error: (error) => {
                    console.error('Error updating user:', error);
                    this.errorService.setError("Error updating user");
                }
            })
        );
    };

    getUser = (id: string) => {
        return this.http.get<User>(`${this.apiUrl}/api/users/${id}`, { withCredentials: true })
            .pipe(
                map(user => user.username)
            );
    }

    ngOnDestroy(): void { }
}
