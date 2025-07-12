import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delete-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if(isVisible) {
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" (click)="onCancel()">
      <div class="bg-dark-blue rounded-lg p-6 max-w-md w-full mx-4" (click)="$event.stopPropagation()">
        <h3 class="text-xl font-bold text-gray-100 mb-4">{{ title || 'Confirm Delete' }}</h3>
        <p class="text-gray-300 mb-6">
          {{ message || 'Are you sure you want to delete this item? This action cannot be undone.' }}
        </p>
        <div class="flex gap-3 justify-end">
          <button
            (click)="onCancel()"
            class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            (click)="onConfirm()"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            [disabled]="isDeleting"
          >
            {{ isDeleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
    }
  `
})
export class DeleteConfirmationModalComponent {
  @Input() isVisible = false;
  @Input() title?: string;
  @Input() message?: string;
  @Input() isDeleting = false;

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onConfirm(): void {
    this.confirmed.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
