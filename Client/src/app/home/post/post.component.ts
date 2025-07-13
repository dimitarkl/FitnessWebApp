import {
    Component,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
    Output,
    EventEmitter
} from '@angular/core';
import { ExerciseCardComponent } from './exercise-card/exercise-card.component';
import { Workout } from '../../../../../shared/types/Workout';
import { UserService } from '../../user/user.service';
import { WorkoutService } from '../workout.service';
import { RouterLink } from '@angular/router';
import { User } from '../../../../../shared/types/user';
import { DurationPipe } from '../../pipes/duration.pipe';
import { RelativeDatePipe } from '../../pipes/relative-date.pipe';
import { DeleteConfirmationModalComponent } from '../../shared/components/delete-confirmation-modal/delete-confirmation-modal.component';
import { DeleteButtonComponent } from '../../shared/components/delete-button/delete-button.component';

@Component({
    selector: 'app-post',
    standalone: true,
    imports: [ExerciseCardComponent, RouterLink, DurationPipe, RelativeDatePipe, DeleteConfirmationModalComponent, DeleteButtonComponent],
    templateUrl: './post.component.html',
    styleUrl: './post.component.css'
})
export class PostComponent implements OnInit {
    @Input() workout: Workout | null = null;

    @Output() workoutDeleted = new EventEmitter<string>();
    @Output() postLiked = new EventEmitter<string>();

    constructor(
        private userServices: UserService,
        private workoutService: WorkoutService
    ) { }

    ownerUsername = '';
    user: User | null = null;
    likesInv = 'invisible';
    class = 'w-80';
    workoutLength = '55m';
    more: number = 0;

    // Delete confirmation modal properties
    showDeleteConfirm = false;
    isDeleting = false;
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
        this.workout?.createdAt

    }

    confirmDelete(): void {
        this.showDeleteConfirm = true;
    }

    cancelDelete(): void {
        this.showDeleteConfirm = false;
    }

    deleteWorkout = async (): Promise<void> => {
        if (!this.workout?.id) return;

        this.isDeleting = true;

        await this.workoutService.deteleteWorkout(this.workout.id);
        // Emit event to parent to refresh the list or remove this post
        this.workoutDeleted.emit(this.workout.id);
        this.isDeleting = false;
        this.showDeleteConfirm = false;
    };
    likePost = async (): Promise<void> => {
        if (!this.workout?.id) return;
        await this.workoutService.likePost(this.workout.id);

        // Emit event to parent to update likes
        this.postLiked.emit(this.workout.id);
    };
}
