import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { UserService } from '../user.service';
import { Router, RouterLink } from '@angular/router';

@Component({
	selector: 'app-register',
	standalone: true,
	imports: [RouterLink, FormsModule],
	templateUrl: './register.component.html',
	styleUrl: './register.component.css',
})
export class RegisterComponent {
	constructor(private userService: UserService, private router: Router) {}
	register(form: NgForm) {
		if (form.invalid) {
			console.error('Invalid Register Form!');
			return;
		}

		const { email, password } = form.value;
		this.userService
			.register(email, password)
			?.then(() => this.router.navigate(['/']));
		console.log(`Email: ${email} and password: ${password}`);
	}
}
