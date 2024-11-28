import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { auth } from '../../../lib/firebase';
@Component({
	selector: 'app-login',
	standalone: true,
	imports: [FormsModule],
	templateUrl: './login.component.html',
	styleUrl: './login.component.css',
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
			?.then(() => this.router.navigate(['/']));
		console.log(`Email: ${email} and password: ${password}`);
	}
}