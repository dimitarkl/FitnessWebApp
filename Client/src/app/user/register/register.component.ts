import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { UserService } from '../user.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ErrorService } from '../../error/error.service';

@Component({
	selector: 'app-register',
	standalone: true,
	imports: [RouterLink, FormsModule, CommonModule],
	templateUrl: './register.component.html',
})
export class RegisterComponent {
	constructor(
		private userService: UserService,
		private router: Router,
		private errorService: ErrorService
	) {}
	register(form: NgForm) {
		if (form.invalid) {
			console.error('Invalid Register Form!');
		}
		

		const { email, password, rePassword } = form.value;
		if (rePassword != password)
			this.errorService.setError("Passwords don't match");

        this.userService.register(email, password).subscribe({
            next: () => {
                this.router.navigate(['/'])
            },
            error: (error) => {
                console.error(error.error.message);
                this.errorService.setError('Registration failed');
            }
        })
	}
}
