import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { httpResource } from '@angular/common/http';
import { CourseDetail } from '../../models/course.model';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.scss',
})
export class CourseDetailComponent {
  id = input.required<string>();

  courseResource = httpResource<CourseDetail>(() => `http://localhost:5282/api/v2/courses/${this.id()}`);
}