import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CourseStore } from '../../store/course.store';
import { AuthService } from '../../services/auth.service';
import { Course } from '../../models/course.model';
import { environment } from '../../../environments/environment';

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
  private http = inject(HttpClient);
  private snackBar = inject(MatSnackBar);

  showCreateModal = signal(false);
  showEditModal = signal(false);
  isSubmitting = signal(false);
  modalError = signal<string | null>(null);

  newCourse = {
    code: '',
    title: '',
    maxCapacity: 30,
  };

  editCourseData: { id: number; code: string; title: string; maxCapacity: number } = {
    id: 0,
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

  isOwner(course: Course): boolean {
    return this.auth.isCourseOwner(course.instructorId);
  }

  setScope(scope: 'all' | 'my') {
    this.store.setScope(scope);
  }

  openCreateModal() {
    this.newCourse = { code: '', title: '', maxCapacity: 30 };
    this.modalError.set(null);
    this.showCreateModal.set(true);
  }

  closeCreateModal() {
    this.showCreateModal.set(false);
  }

  openEditModal(course: Course) {
    if (!this.isOwner(course)) {
      this.snackBar.open(`Access Denied: You do not own ${course.code}.`, 'Close', { duration: 3500 });
      return;
    }
    this.editCourseData = {
      id: course.id,
      code: course.code,
      title: course.title,
      maxCapacity: course.maxCapacity,
    };
    this.modalError.set(null);
    this.showEditModal.set(true);
  }

  closeEditModal() {
    this.showEditModal.set(false);
  }

  submitCreateCourse() {
    if (!this.newCourse.code || !this.newCourse.title) {
      this.modalError.set('Course code and title are required.');
      return;
    }

    this.isSubmitting.set(true);
    this.modalError.set(null);

    const user = this.auth.currentUser();
    const instructorId = user?.userId || user?.displayName || 'admin';

    this.store.createCourse(
      {
        code: this.newCourse.code.toUpperCase().trim(),
        title: this.newCourse.title.trim(),
        maxCapacity: Number(this.newCourse.maxCapacity) || 30,
        instructorId: instructorId,
      },
      () => {
        this.isSubmitting.set(false);
        this.showCreateModal.set(false);
        this.snackBar.open(`Course ${this.newCourse.code} created and assigned to you!`, 'Close', { duration: 3000 });
        this.store.loadCourses();
      },
      (error) => {
        this.isSubmitting.set(false);
        this.modalError.set(error);
      }
    );
  }

  submitUpdateCourse() {
    if (!this.editCourseData.title) {
      this.modalError.set('Course title is required.');
      return;
    }

    this.isSubmitting.set(true);
    this.modalError.set(null);

    this.http.put(`${environment.apiUrl}/courses/${this.editCourseData.id}`, {
      title: this.editCourseData.title.trim(),
      code: this.editCourseData.code.trim(),
      maxCapacity: Number(this.editCourseData.maxCapacity) || 30,
    }).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.showEditModal.set(false);
        this.snackBar.open(`Course ${this.editCourseData.code} updated successfully!`, 'Close', { duration: 3000 });
        this.store.loadCourses();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        if (err.status === 403) {
          this.modalError.set('Security Violation: You do not have permission to edit this course (403 Forbidden).');
        } else {
          this.modalError.set(err.error?.detail || err.message || 'Failed to update course');
        }
      }
    });
  }

  onDelete(id: number, title: string, instructorId?: string | null) {
    if (!this.auth.isCourseOwner(instructorId)) {
      this.snackBar.open(`Permission Denied: Only the course owner can delete this module.`, 'Close', { duration: 4000 });
      return;
    }

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
