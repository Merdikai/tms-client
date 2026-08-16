import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { CourseCardComponent } from '../../ui/course-card/course-card.component';
import { Course } from '../../models/course.model';
import { CourseService } from '../../services/course.service';
import { AuthService } from '../../services/auth.service';
import { EnrollmentStore } from '../../store/enrollment.store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, CourseCardComponent],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.scss',
})
export class StudentDashboardComponent implements OnInit {
  private api = inject(CourseService);
  auth = inject(AuthService);
  private router = inject(Router);
  enrollmentStore = inject(EnrollmentStore);

  studentName = computed(() => this.auth.currentUser()?.displayName || 'Student');

  ngOnInit() {
    this.enrollmentStore.loadEnrollments();
  }

  isPrivileged = computed(() => {
    return this.auth.hasRole('Admin') || this.auth.hasRole('Instructor');
  });

  // Students see ONLY their own records, while Admin/Instructors see all records
  myEnrollments = computed(() => {
    const user = this.auth.currentUser();
    if (!user) return [];

    if (this.isPrivileged()) {
      return this.enrollmentStore.entities();
    }

    const currentDisplayName = (user.displayName || '').toLowerCase().trim();
    const currentEmailPrefix = (user.email || '').split('@')[0].toLowerCase().trim();

    return this.enrollmentStore.entities().filter((e) => {
      const eName = (e.studentName || '').toLowerCase().trim();
      return (
        eName === currentDisplayName ||
        (currentEmailPrefix && eName.includes(currentEmailPrefix))
      );
    });
  });

  earnedCredits = computed(() => {
    const approved = this.myEnrollments().filter((e) => e.status === 'Approved');
    return 45 + approved.length * 3;
  });

  graduationStatus = computed(() => {
    return this.earnedCredits() >= 120 ? 'Eligible for Graduation' : 'In Progress';
  });

  selectedCourse = signal<Course | null>(null);

  coursesResource = rxResource({
    stream: () => this.api.getAll(),
  });

  registerForClass() {
    this.router.navigate(['/enroll']);
  }

  handleEnroll(course: Course) {
    this.selectedCourse.set(course);
    this.router.navigate(['/enroll'], { queryParams: { courseId: course.id } });
  }
}
