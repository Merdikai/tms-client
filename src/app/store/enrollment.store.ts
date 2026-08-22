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
  updateEntity,
} from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, concatMap, tap, catchError, switchMap, EMPTY, Observable } from 'rxjs';
import { EnrollmentService } from '../services/enrollment.service';
import { LiveSyncService } from '../services/live-sync.service';
import { Enrollment } from '../models/enrollment.model';

export const EnrollmentStore = signalStore(
  { providedIn: 'root' },
  withState({
    isLoading: false,
    error: null as string | null,
    filterTerm: '',
  }),
  withEntities<Enrollment>(),
  withComputed((store) => ({
    totalCount: computed(() => store.entities().length),
    pendingCount: computed(
      () => store.entities().filter((e) => e.status === 'Pending').length
    ),
    approvedCount: computed(
      () => store.entities().filter((e) => e.status === 'Approved').length
    ),
    rejectedCount: computed(
      () => store.entities().filter((e) => e.status === 'Rejected').length
    ),
    filteredEnrollments: computed(() => {
      const term = store.filterTerm().toLowerCase();
      if (!term) return store.entities();
      return store
        .entities()
        .filter(
          (e) =>
            e.studentName.toLowerCase().includes(term) ||
            e.courseName.toLowerCase().includes(term) ||
            e.status.toLowerCase().includes(term)
        );
    }),
  })),
  withMethods((
    store,
    api = inject(EnrollmentService),
    sync = inject(LiveSyncService)
  ) => ({
    loadEnrollments: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        concatMap(() =>
          api.getAll().pipe(
            tap((rows) =>
              patchState(store, setAllEntities(rows), { isLoading: false })
            ),
            catchError((err) => {
              patchState(store, {
                isLoading: false,
                error: err.error?.detail || err.message || 'Failed to load enrollments',
              });
              return EMPTY;
            })
          )
        )
      )
    ),

    setFilter(filterTerm: string) {
      patchState(store, { filterTerm });
    },

    addEnrollment(enrollment: Enrollment) {
      patchState(store, addEntity(enrollment));
    },

    addEnrollmentAsync(dto: {
      studentId: string;
      studentName?: string;
      courseId: number;
      term?: string;
      notes?: string;
      backupCourses?: string[];
    }): Observable<Enrollment> {
      return api.create(dto).pipe(
        tap((created) => {
          if (created) {
            patchState(store, addEntity(created));
          }
        })
      );
    },

    updateGrade(studentId: number, courseId: number, grade: number) {
      const found = store
        .entities()
        .find((e) => e.studentId === studentId && e.courseId === courseId);
      if (found) {
        const letter = grade >= 90 ? 'A' : grade >= 80 ? 'B' : grade >= 70 ? 'C' : 'D';
        patchState(
          store,
          updateEntity({ id: found.id, changes: { status: 'Approved', grade, letterGrade: letter } })
        );
      }
    },

    approveEnrollment: rxMethod<string>(
      pipe(
        tap((id) => {
          patchState(store, updateEntity({ id, changes: { status: 'Approved' } }));
        }),
        concatMap((id) =>
          api.approve(id).pipe(
            catchError((err) => {
              patchState(store, updateEntity({ id, changes: { status: 'Pending' } }));
              patchState(store, {
                error: err.error?.detail || 'Server rejected the approval. Check enrollment constraints.',
              });
              return EMPTY;
            })
          )
        )
      )
    ),

    rejectEnrollment: rxMethod<string>(
      pipe(
        tap((id) => {
          patchState(store, updateEntity({ id, changes: { status: 'Rejected' } }));
        }),
        concatMap((id) =>
          api.reject(id).pipe(
            catchError((err) => {
              patchState(store, updateEntity({ id, changes: { status: 'Pending' } }));
              patchState(store, {
                error: err.error?.detail || 'Server rejected rejection.',
              });
              return EMPTY;
            })
          )
        )
      )
    ),

    listenForLiveUpdates: rxMethod<void>(
      pipe(
        tap(() => sync.connect()),
        switchMap(() => sync.events$),
        tap((event) => {
          patchState(
            store,
            updateEntity({ id: event.id, changes: { status: event.status } })
          );
        })
      )
    ),
  }))
);
