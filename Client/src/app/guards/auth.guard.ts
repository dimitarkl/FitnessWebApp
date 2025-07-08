import { inject } from "@angular/core";
import {
    ActivatedRouteSnapshot,
    CanActivateFn,
    Router,
    RouterStateSnapshot,
} from "@angular/router";

import { UserService } from "../user/user.service";
import { filter, map, take, tap } from "rxjs";
export const AuthGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const userService = inject(UserService);
    const router = inject(Router);
    
    return userService.isAuthenticated$.pipe(
        filter((value): value is boolean => value !== null),
        take(1),
        tap((isAuthenticated) => {
            if (!isAuthenticated) router.navigate(['/login']);
        }),
        map((isAuthenticated) => isAuthenticated)
    );
};
