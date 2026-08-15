import { computed, inject } from '@angular/core';
import {
  signalStore,
  withComputed,
  withMethods,
  patchState,
  withState,
} from '@ngrx/signals';
import {
  withEntities,
  setAllEntities,
  removeEntity,
  addEntity,
} from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, concatMap, tap, catchError, EMPTY } from 'rxjs';
import { CourseService } from '../services/course.service';
import { Course } from '../models/course.model';

export const CourseStore = signalStore(
  { providedIn: 'root' },
  withState({
    isLoading: false,
    error: null as string | null,
  }),
  withEntities<Course>(),
  withComputed((store) => ({
    courseCount: computed(() => store.entities().length),
  })),
  withMethods((store) => {
    const courseService = inject(CourseService);

    return {
      // Load all courses
      loadCourses: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isLoading: true, error: null })),
          concatMap(() =>
            courseService.getAll().pipe(
              tap((rows) =>
                patchState(store, setAllEntities(rows), { isLoading: false })
              ),
              catchError((err) => {
                patchState(store, {
                  isLoading: false,
                  error: err.error?.detail || 'Failed to load courses',
                });
                return EMPTY;
              })
            )
          )
        )
      ),

      // Optimistic Delete with Snapshot Rollback
      deleteCourse(id: number) {
        // 1. Take snapshot of current entities BEFORE mutating local state
        const previousSnapshot = store.entities();

        // 2. Instant visual feedback - remove entity immediately from Local UI
        patchState(store, removeEntity(id), { error: null });

        // 3. Dispatch API call to backend server
        courseService
          .delete(id)
          .pipe(
            catchError((err) => {
              // 4. Server rejected request - restore previous snapshot and set error message
              patchState(store, setAllEntities(previousSnapshot));
              patchState(store, {
                error:
                  err.error?.detail ||
                  'Cannot delete course: active student enrollments exist.',
              });
              return EMPTY;
            })
          )
          .subscribe();
      },

      // Add a new course (optimistic)
      addCourse: rxMethod<Course>(
        pipe(
          tap((course) => patchState(store, addEntity(course))),
          concatMap((course) =>
            courseService.getAll().pipe(
              tap(() => console.log('Course added:', course.title)),
              catchError((err) => {
                // Rollback on failure
                patchState(store, removeEntity(course.id));
                patchState(store, {
                  error: err.error?.detail || 'Failed to add course',
                });
                return EMPTY;
              })
            )
          )
        )
      ),
    };
  })
);
