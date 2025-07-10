import {
    Component,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
} from '@angular/core';
import { ExerciseCardComponent } from './exercise-card/exercise-card.component';
import { Workout } from '../../../../../shared/types/Workout';
import { UserService } from '../../user/user.service';
import { WorkoutService } from '../workout.service';
import { RouterLink } from '@angular/router';
import { User } from '../../../../../shared/types/user';

@Component({
    selector: 'app-post',
    standalone: true,
    imports: [ExerciseCardComponent, RouterLink],
    templateUrl: './post.component.html',
    styleUrl:'./post.component.css'
})
export class PostComponent implements OnInit {
    @Input() workout: Workout | null = null;

    constructor(
        private userServices: UserService,
        private workoutService: WorkoutService
    ) { }
    ownerUsername = ''

    user: User | null = null;
    likesInv = 'invisible';
    class = 'w-80';
    workoutDate = 'Sunday, July 6  2025'
    workoutLength = '55m'
    getUser = () => {
        const id = this.workout?.ownerId
        if (!id) return
        this.userServices.getUser(id).subscribe(
            username => {
                username ? this.ownerUsername = username : ""
            }
        )
        this.userServices.user$.subscribe({
            next: (user) => {
                if (!user) return
                this.user = user;
            }
        })
    };
    ngOnInit(): void {
        this.getUser();
        this.more = this.workout?.exercises.length
            ? this.workout.exercises.length - 3
            : 0;
        this.getWorkoutDate(this.workout)
    }
    getWorkoutDate = (workout: Workout | null) => {
        if (!workout || !workout.createdAt) return;
        const date = new Date(workout.createdAt);
        const options: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        this.workoutDate = date.toLocaleDateString('en-US', options);
    }
    deleteWorkout = () => {
        if (this.workout && this.workout.id != undefined)
            this.workoutService.deteleteWorkout(this.workout?.id)
        //TODO: Refresh when deleting
    };
    likePost = () => {
        if (this.workout && this.workout.id != undefined)
            this.workoutService
                .likePost(this.workout.id)
                .then(() => location.reload());
    };
    showLikes = () => {
        console.log('Show Likes');
    };
    more: number = 0;
}
