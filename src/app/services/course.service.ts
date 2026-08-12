import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Course, CourseDetail, PagedResponse } from '../models/course.model';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private http = inject(HttpClient);

  // Update this URL to match your API's address and version
  private baseUrl = 'http://localhost:5282/api/v2/courses';

  // ✅ FIXED: Changed .getAll to .get (HttpClient has .get, not .getAll)
  getAll() {
    return this.http
      .get<PagedResponse<Course>>(this.baseUrl, {
        params: { page: '1', pageSize: '50' },
      })
      //.pipe(map((p) => p.items));
      .pipe(map((p) => p.data))   // For V2 with data/meta/links envelope
  }

  getById(id: string) {
    return this.http.get<CourseDetail>(`${this.baseUrl}/${id}`);
  }
}