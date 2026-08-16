import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CourseStore } from '../../store/course.store';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.scss',
})
export class CourseListComponent implements OnInit {
  store = inject(CourseStore);
  auth = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  showCreateModal = signal(false);
  isSubmitting = signal(false);
  modalError = signal<string | null>(null);

  newCourse = {
    code: '',
    title: '',
    maxCapacity: 30,
  };

  ngOnInit() {
    this.store.loadCourses();
  }

  isPrivileged() {
    return this.auth.hasRole('Instructor') || this.auth.hasRole('Admin');
  }

  openCreateModal() {
    this.newCourse = { code: '', title: '', maxCapacity: 30 };
    this.modalError.set(null);
    this.showCreateModal.set(true);
  }

  closeCreateModal() {
    this.showCreateModal.set(false);
  }

  submitCreateCourse() {
    if (!this.newCourse.code || !this.newCourse.title) {
      this.modalError.set('Course code and title are required.');
      return;
    }

    this.isSubmitting.set(true);
    this.modalError.set(null);

    this.store.createCourse(
      {
        code: this.newCourse.code.toUpperCase().trim(),
        title: this.newCourse.title.trim(),
        maxCapacity: Number(this.newCourse.maxCapacity) || 30,
      },
      () => {
        this.isSubmitting.set(false);
        this.showCreateModal.set(false);
        this.snackBar.open(`Course ${this.newCourse.code} created successfully!`, 'Close', { duration: 3000 });
        this.store.loadCourses();
      },
      (error) => {
        this.isSubmitting.set(false);
        this.modalError.set(error);
      }
    );
  }

  onDelete(id: number, title: string) {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      this.store.deleteCourse(id);

      setTimeout(() => {
        const error = this.store.error();
        if (error) {
          this.snackBar.open(error, 'Close', { duration: 5000 });
        }
      }, 300);
    }
  }
}
