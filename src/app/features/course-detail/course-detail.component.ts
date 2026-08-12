import { Component, input, effect } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.scss',
})
export class CourseDetailComponent {
  // This automatically receives :id from the URL /courses/:id
  // The name must match exactly: the route says ":id", so the input is called "id"
  id = input.required<string>();

  constructor() {
    // effect() watches any signals read inside it
    // Every time id() changes, this code runs again
    effect(() => {
      console.log('Loading course detail for ID:', this.id());
    });
  }
}