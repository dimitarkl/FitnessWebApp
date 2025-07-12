import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'relativeDate',
  standalone: true
})
export class RelativeDatePipe implements PipeTransform {

  transform(value: string | Date | null | undefined): string {
    if (!value) {
      return 'Unknown date';
    }

    const date = typeof value === 'string' ? new Date(value) : value;
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    // Future dates
    if (diffInMs < 0) {
      return date.toLocaleDateString();
    }

    // Less than a minute
    if (diffInSeconds < 60) {
      return 'Just now';
    }

    // Less than an hour
    if (diffInMinutes < 60) {
      return diffInMinutes === 1 ? '1 minute ago' : `${diffInMinutes} minutes ago`;
    }

    // Less than a day
    if (diffInHours < 24) {
      return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`;
    }

    // Yesterday
    if (diffInDays === 1) {
      return 'Yesterday';
    }

    // Less than a week
    if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    }

    // Less than a month
    if (diffInWeeks < 4) {
      return diffInWeeks === 1 ? '1 week ago' : `${diffInWeeks} weeks ago`;
    }

    // Less than a year
    if (diffInMonths < 12) {
      return diffInMonths === 1 ? '1 month ago' : `${diffInMonths} months ago`;
    }

    // More than a year
    if (diffInYears === 1) {
      return '1 year ago';
    } else if (diffInYears > 1) {
      return `${diffInYears} years ago`;
    }

    // Fallback to formatted date for very old dates
    return date.toLocaleDateString();
  }
}