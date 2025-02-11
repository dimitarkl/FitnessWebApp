import { inject } from "@angular/core";
import {
	ActivatedRouteSnapshot,
	CanActivateFn,
	Router,
	RouterStateSnapshot,
} from "@angular/router";

import { UserService } from "../user/user.service";
import { tap } from "rxjs";
import { User } from "firebase/auth";
export const AuthGuard: CanActivateFn = async (
	route: ActivatedRouteSnapshot,
	state: RouterStateSnapshot
) => {
	const userService = inject(UserService);
	const router = inject(Router);
	let user: User | null = null;
	userService.user$.subscribe((userObs) => {
		user = userObs;
	});
	console.log(user);
	if (user) {
		return true;
	}
	router.navigate(["/login"]);
	return false;
};
