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
  addEntity,
  removeEntity,
} from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, concatMap, tap, catchError, EMPTY } from 'rxjs';
import { CourseService, CreateCoursePayload } from '../services/course.service';
import { Course } from '../models/course.model';

export const CourseStore = signalStore(
  { providedIn: 'root' },
  withState({
    isLoading: false,
    error: null as string | null,
    selectedCourseId: null as number | null,
  }),
  withEntities<Course>(),
  withComputed((store) => ({
    totalCourses: computed(() => store.entities().length),
    courseCount: computed(() => store.entities().length),
    availableCourses: computed(() =>
      store.entities().filter((c) => c.enrollmentCount < c.maxCapacity)
    ),
    fullCourses: computed(() =>
      store.entities().filter((c) => c.enrollmentCount >= c.maxCapacity)
    ),
    selectedCourse: computed(() => {
      const id = store.selectedCourseId();
      return id ? store.entityMap()[id] ?? null : null;
    }),
  })),
  withMethods((store, api = inject(CourseService)) => ({
    loadCourses: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        concatMap(() =>
          api.getAll().pipe(
            tap((courses) => {
              patchState(store, setAllEntities(courses), { isLoading: false });
            }),
            catchError((err) => {
              patchState(store, {
                isLoading: false,
                error: err.error?.detail || err.message || 'Failed to load courses',
              });
              return EMPTY;
            })
          )
        )
      )
    ),

    createCourse(payload: CreateCoursePayload, onSuccess?: () => void, onError?: (err: any) => void) {
      api.create(payload).subscribe({
        next: (created) => {
          if (created) {
            patchState(store, addEntity(created));
          }
          if (onSuccess) onSuccess();
        },
        error: (err) => {
          if (onError) onError(err);
        }
      });
    },

    selectCourse(id: number | null) {
      patchState(store, { selectedCourseId: id });
    },

    deleteCourse(id: number) {
      const previousSnapshot = store.entities();
      patchState(store, removeEntity(id));

      api.delete(id).pipe(
        catchError((err) => {
          patchState(store, setAllEntities(previousSnapshot));
          patchState(store, {
            error: err.error?.detail || 'Cannot delete course: active student enrollments exist.',
          });
          return EMPTY;
        })
      ).subscribe();
    },
  }))
);
