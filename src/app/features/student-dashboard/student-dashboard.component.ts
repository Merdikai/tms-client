import { Component, signal, computed } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { CourseCardComponent } from '../../ui/course-card/course-card.component';
import { Course } from '../../models/course.model';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CourseCardComponent, RouterLink],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.scss',
})
export class StudentDashboardComponent {
  studentName = signal('Liya Kebede');
  earnedCredits = signal(45);

  graduationStatus = computed(() => {
    return this.earnedCredits() >= 120 ? 'Eligible for Graduation' : 'In Progress';
  });

  selectedCourse = signal<Course | null>(null);

  coursesResource = httpResource<{ data: Course[] }>(() => 'http://localhost:5282/api/v2/courses?page=1&pageSize=50');

  registerForClass() {
    this.earnedCredits.update((c) => c + 3);
  }

  handleEnroll(course: Course) {
    this.selectedCourse.set(course);
    console.log('Enrollment requested for:', course.title);
  }
}
