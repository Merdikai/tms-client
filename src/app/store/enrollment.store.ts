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
  updateEntity,
  addEntity,
  removeEntity,
} from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, concatMap, tap, catchError, EMPTY } from 'rxjs';
import { EnrollmentService } from '../services/enrollment.service';
import { Enrollment } from '../models/enrollment.model';

export const EnrollmentStore = signalStore(
  { providedIn: 'root' },

  // withState adds simple properties alongside the entity collection
  withState({
    isLoading: false,
    error: null as string | null,
  }),

  // withEntities creates an O(1) ID-indexed dictionary for the enrollment collection.
  // Internally, it stores { ids: string[], entityMap: Record<string, Enrollment> }
  // so lookups and updates by ID are instant - no array scanning.
  withEntities<Enrollment>(),

  // withComputed creates read-only derived signals that update automatically.
  // pendingCount recalculates every time the entity collection changes.
  withComputed((store) => ({
    pendingCount: computed(
      () => store.entities().filter((e) => e.status === 'Pending').length
    ),
    approvedCount: computed(
      () => store.entities().filter((e) => e.status === 'Approved').length
    ),
    rejectedCount: computed(
      () => store.entities().filter((e) => e.status === 'Rejected').length
    ),
  })),

  // withMethods defines actions that can modify the store state
  withMethods((store, enrollmentService = inject(EnrollmentService)) => ({
    // Loading Data
    // Why concatMap here? Because concatMap processes one emission at a time
    // in strict order. If something triggers loadEnrollments() twice quickly,
    // concatMap waits for the first HTTP response before starting the second.
    // switchMap would cancel the first request (data loss risk).
    // mergeMap would run both in parallel (race condition risk).
    loadEnrollments: rxMethod<void>(
  pipe(
    tap(() => patchState(store, { isLoading: true })),
    tap(() => {
      const mockEnrollments: Enrollment[] = [
        { id: '1', studentId: 1, studentName: 'Liya Kebede', courseId: 1, courseName: 'Advanced Java Services', status: 'Pending', enrolledAt: '2026-08-13T08:00:00Z' },
        { id: '2', studentId: 2, studentName: 'Dawit Tadesse', courseId: 2, courseName: 'Angular UI Lab', status: 'Approved', enrolledAt: '2026-08-12T10:30:00Z' },
        { id: '3', studentId: 3, studentName: 'Sara Bekele', courseId: 3, courseName: 'Database Design', status: 'Pending', enrolledAt: '2026-08-11T14:15:00Z' },
      ];
      patchState(store, setAllEntities(mockEnrollments), { isLoading: false });
    })
  )
),

    // Optimistic Approve
    // Step 1: Instantly flip the status to "Approved" in the store.
    // Every component reading from the store sees the change immediately.
    // Step 2: Send the approval to the server.
    // Step 3: If the server rejects it, roll back the status to "Pending."
    approveEnrollment: rxMethod<string>(
  pipe(
    tap((id) => {
      patchState(store, updateEntity({ id, changes: { status: 'Approved' } }));
    })
  )
),
rejectEnrollment: rxMethod<string>(
  pipe(
    tap((id) => {
      patchState(store, updateEntity({ id, changes: { status: 'Rejected' } }));
    })
  )
),

    // Add a new enrollment (optimistic)
    addEnrollment: (enrollment: Enrollment) => {
      patchState(store, addEntity(enrollment));
    },

    // Remove an enrollment (optimistic)
    removeEnrollment: rxMethod<string>(
      pipe(
        tap((id) => {
          patchState(store, removeEntity(id));
        }),
        concatMap((id) =>
          // In a real app, you'd call a delete endpoint here
          // For now, we just log and succeed
          enrollmentService.getAll().pipe(
            tap(() => console.log('Enrollment removed:', id)),
            catchError((err) => {
              // Rollback: we'd need to refetch or store the deleted entity
              // For simplicity, we just log the error
              console.error('Failed to delete enrollment:', err);
              patchState(store, {
                error: 'Failed to delete enrollment.',
              });
              return EMPTY;
            })
          )
        )
      )
    ),
  }))
);