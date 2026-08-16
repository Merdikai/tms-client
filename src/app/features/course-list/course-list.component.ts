import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
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

  ngOnInit() {
    this.store.loadCourses();
  }

  onDelete(id: number, title: string) {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      this.store.deleteCourse(id);

      // Show feedback if error occurs
      setTimeout(() => {
        const error = this.store.error();
        if (error) {
          this.snackBar.open(error, 'Close', { duration: 5000 });
        }
      }, 300);
    }
  }
}
