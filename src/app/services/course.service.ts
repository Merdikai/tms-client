import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Course, CourseDetail, PagedResponse } from '../models/course.model';

export interface CreateCoursePayload {
  code: string;
  title: string;
  maxCapacity: number;
  instructorId?: number;
}

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/courses`;

  getAll() {
    return this.http
      .get<PagedResponse<Course>>(this.base, {
        params: { page: '1', pageSize: '50' },
      })
      .pipe(map((response) => response.items ?? (response as any).data ?? []));
  }

  getById(id: string) {
    return this.http.get<CourseDetail>(`${this.base}/${id}`);
  }

  create(payload: CreateCoursePayload) {
    return this.http.post<Course>(this.base, payload);
  }

  delete(id: number | string) {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}