import { Component, OnInit } from '@angular/core';
import { ErrorService } from './error.service';

@Component({
	selector: 'app-error',
	standalone: true,
	imports: [],
	templateUrl: './error.component.html',
	styleUrl: './error.component.css',
})
export class ErrorComponent implements OnInit {
	constructor(private errorService: ErrorService) {}
	errorMessage = '';
	ngOnInit(): void {
		this.errorMessage = this.errorService.errorMessage;
		setInterval(() => this.cleanError(), 10000);
	}
	cleanError = () => {
		this.errorMessage = '';
		this.errorService.cleanError();
	};
}
