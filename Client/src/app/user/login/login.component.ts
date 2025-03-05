import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { UserService } from '../user.service';
import { Router, RouterLink } from '@angular/router';
import { auth } from '../../../lib/firebase';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [RouterLink, FormsModule, CommonModule],
	templateUrl: './login.component.html',
})
export class LoginComponent {
	constructor(private userService: UserService, private router: Router) {}
	login(form: NgForm) {
		if (form.invalid) {
			console.error('Invalid Login Form!');
			return;
		}

		const { email, password } = form.value;
		this.userService
			.login(email, password)
			?.then(() => this.router.navigate(['/catalog'])); //TODO rollback
	}
}
