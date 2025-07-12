import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delete-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      (click)="onDelete()"
      [class]="buttonClass"
      [disabled]="disabled"
    >
      <div class="w-3 mr-1">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
          <path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z" />
        </svg>
      </div>
      {{ text || 'Delete' }}
    </button>
  `
})
export class DeleteButtonComponent {
  @Input() text?: string;
  @Input() disabled = false;
  @Input() buttonClass = "bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex flex-row items-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors";

  @Output() deleteClicked = new EventEmitter<void>();

  onDelete(): void {
    if (!this.disabled) {
      this.deleteClicked.emit();
    }
  }
}
