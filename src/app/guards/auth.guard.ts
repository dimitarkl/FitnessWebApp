import { inject } from "@angular/core";
import {
	ActivatedRouteSnapshot,
	CanActivateFn,
	Router,
	RouterStateSnapshot,
} from "@angular/router";

import { UserService } from "../user/user.service";
export const AuthGuard: CanActivateFn = async (
	route: ActivatedRouteSnapshot,
	state: RouterStateSnapshot
) => {
	const userService = inject(UserService);
	const router = inject(Router);

	const checkAuth = (): Promise<boolean> => {
		return new Promise((resolve) => {
			const interval = setInterval(() => {
				if (userService.isLogged === true) {
					clearInterval(interval);
					resolve(true);
				} else if (userService.isLogged === false) {
					clearInterval(interval);
					router.navigate(["/login"]);
					resolve(false);
				}
			}, 250);
		});
	};

	return await checkAuth();
};
