import { Component, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { UserService } from "../user/user.service";

@Component({
	selector: "app-navigation",
	standalone: true,
	imports: [RouterLink],
	templateUrl: "./navigation.component.html",
})
export class NavigationComponent {
	constructor(private userService: UserService) {}

	get loggedIn(): boolean | null {
		return this.userService.isLogged;
	}
	Logout = () => {
		this.userService.logout();
	};
}
