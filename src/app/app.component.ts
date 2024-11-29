import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './navigation/navigation.component';
import { ErrorComponent } from './error/error.component';
@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterOutlet, NavigationComponent, ErrorComponent],
	templateUrl: './app.component.html',
	styleUrl: './app.component.css',
})
export class AppComponent {
	title = 'FitnessWebApp';
}
