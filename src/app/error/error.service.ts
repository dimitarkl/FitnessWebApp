import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class ErrorService {
	constructor() {}
	errorMessage = '';
	setError = (error: string) => {
		this.errorMessage = error;
	};
	cleanError = () => {
		this.errorMessage = '';
	};
}
