import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { AccountComponent } from './account/account.component';
import { AuthGuard } from './guards/auth.guard';
import { CreateWorkoutComponent } from './home/create-workout/create-workout.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { WorkoutDetailsComponent } from './workout-details/workout-details.component';
import { CatalogComponent } from './catalog/catalog.component';

export const routes: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'login', component: LoginComponent },
	{
		path: 'register',
		component: RegisterComponent,
	},
	{ path: 'account', component: AccountComponent },
	{
		path: 'create',
		component: CreateWorkoutComponent,
		canActivate: [AuthGuard],
	},
	{
		path: 'details',
		children: [{ path: ':detailsId', component: WorkoutDetailsComponent }],
	},
	{
		path: 'edit',
		children: [
			{ path: '', component: HomeComponent },
			{
				path: ':editId',
				component: CreateWorkoutComponent,
				canActivate: [AuthGuard],
			},
		],
	},
	{ path: 'catalog', component: CatalogComponent },
	{ path: '404', component: NotFoundComponent },
	{ path: '**', redirectTo: '/404' },
];
