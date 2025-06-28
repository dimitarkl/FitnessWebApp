import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { UserService } from '../user.service';
import { Router, RouterLink } from '@angular/router';

import { CommonModule } from '@angular/common';
import { ErrorService } from '../../error/error.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [RouterLink, FormsModule, CommonModule],
    templateUrl: './login.component.html',
})
export class LoginComponent {
    constructor(
        private userService: UserService,
        private router: Router,
        private errorService: ErrorService  
    ) { }
    login(form: NgForm) {
        if (form.invalid) {
            console.error('Invalid Login Form!');
            return;
        }

        const { email, password } = form.value;
        this.userService.login(email, password).subscribe({
            next: () => {
                this.router.navigate(['/'])
            },
            error: (error) => {
                console.error(error.error.message);
                this.errorService.setError(error.error.message || 'Registration failed');
            }
        })
    }
}
