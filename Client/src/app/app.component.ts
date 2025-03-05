import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './navigation/navigation.component';
import { ErrorComponent } from './error/error.component';
import { ErrorService } from './error/error.service';
@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterOutlet, NavigationComponent, ErrorComponent],
	templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
	constructor(private errorService: ErrorService) {}
	errorHidden = true;
	private errorCheckInterval: any;
	ngOnInit(): void {
		this.startErrorCheck();
	}
	displayError = () => {
		if (this.errorService.errorMessage != '') this.errorHidden = false;
		else this.errorHidden = true;
	};
	startErrorCheck(): void {
		this.errorCheckInterval = setInterval(() => this.displayError(), 1000);
	}
	ngOnDestroy(): void {
		clearInterval(this.errorCheckInterval);
	}
	title = 'FitnessWebApp';
}
