import { inject } from "@angular/core";
import {
	ActivatedRouteSnapshot,
	CanActivateFn,
	Router,
	RouterStateSnapshot,
} from "@angular/router";

import { UserService } from "../user/user.service";
export const GuestGuard: CanActivateFn = async (
	route: ActivatedRouteSnapshot,
	state: RouterStateSnapshot
) => {
	const userService = inject(UserService);
	const router = inject(Router);

	const checkGuest = (): Promise<boolean> => {
		return new Promise((resolve) => {
			const interval = setInterval(() => {
				if (userService.isLogged === true) {
					clearInterval(interval);
					router.navigate(["/"]);
					resolve(false);
				} else if (userService.isLogged === false) {
					clearInterval(interval);

					resolve(true);
				}
			}, 250);
		});
	};

	return await checkGuest();
};
