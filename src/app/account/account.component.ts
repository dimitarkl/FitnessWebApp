import { Component, OnInit } from '@angular/core';
import { UserService } from '../user/user.service';
import { User } from 'firebase/auth';

@Component({
	selector: 'app-account',
	standalone: true,
	imports: [],
	templateUrl: './account.component.html',
	styleUrl: './account.component.css',
})
export class AccountComponent implements OnInit {
	constructor(private userService: UserService) {}
	user: User | null = null;
	ngOnInit(): void {
		this.getUser();
	}
	getUser = () => {
		this.userService.user$.subscribe(i => (this.user = i));
	};
	getWorkouts = () => {};
}
