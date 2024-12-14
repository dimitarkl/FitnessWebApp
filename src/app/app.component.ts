import { Component, OnChanges, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './navigation/navigation.component';
import { ErrorComponent } from './error/error.component';
import { ErrorService } from './error/error.service';
@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterOutlet, NavigationComponent, ErrorComponent],
	templateUrl: './app.component.html',
	styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
	constructor(private errorService: ErrorService) {}
	errorHidden = true;
	private errorCheckInterval: any;
	ngOnInit(): void {
		this.startErrorCheck();
	}
	displayError = () => {
		if (this.errorService.errorMessage != '') this.errorHidden = false;
		else this.errorHidden = true;
		console.log(this.errorService.errorMessage != '');
	};
	startErrorCheck(): void {
		this.errorCheckInterval = setInterval(() => this.displayError(), 1000);
	}
	title = 'FitnessWebApp';
}
