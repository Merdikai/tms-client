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
import { pipe, concatMap, tap, catchError, EMPTY, switchMap } from 'rxjs';
import { EnrollmentService } from '../services/enrollment.service';
import { LiveSyncService, EnrollmentStatusEvent } from '../services/live-sync.service';
import { Enrollment } from '../models/enrollment.model';

export const EnrollmentStore = signalStore(
  { providedIn: 'root' },

  withState({
    isLoading: false,
    error: null as string | null,
  }),

  withEntities<Enrollment>(),

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

  withMethods((store) => {
    const enrollmentService = inject(EnrollmentService);
    const liveSync = inject(LiveSyncService);

    // Auto-connect and subscribe to SignalR live updates for immediate reactive updates
    liveSync.connect();
    liveSync.events$.subscribe((event: EnrollmentStatusEvent) => {
      console.log('[EnrollmentStore] SignalR live update received in store:', event);
      const current = store.entities();
      const updated = current.map((e) =>
        e.id === event.id ? { ...e, status: event.status } : e
      );
      patchState(store, setAllEntities(updated));
    });

    return {
      loadEnrollments: rxMethod<void>(
        pipe(
          tap(() => {
            if (store.entities().length === 0) {
              patchState(store, { isLoading: true });
              const mockEnrollments: Enrollment[] = [
                { id: '1', studentId: 1, studentName: 'Liya Kebede', courseId: 1, courseName: 'Advanced Java Services', status: 'Pending', enrolledAt: '2026-08-13T08:00:00Z' },
                { id: '2', studentId: 2, studentName: 'Dawit Tadesse', courseId: 2, courseName: 'Angular UI Lab', status: 'Approved', enrolledAt: '2026-08-12T10:30:00Z' },
                { id: '3', studentId: 3, studentName: 'Sara Bekele', courseId: 3, courseName: 'Database Design', status: 'Pending', enrolledAt: '2026-08-11T14:15:00Z' },
              ];
              patchState(store, setAllEntities(mockEnrollments), { isLoading: false });
            }
          })
        )
      ),

      approveEnrollment: rxMethod<string>(
        pipe(
          tap((id: string) => {
            const updated = store.entities().map((e) =>
              e.id === id ? { ...e, status: 'Approved' as const } : e
            );
            patchState(store, setAllEntities(updated));
          }),
          concatMap((id: string) =>
            enrollmentService.approve(id).pipe(
              catchError((err) => {
                console.error('Approve enrollment failed:', err);
                const reverted = store.entities().map((e) =>
                  e.id === id ? { ...e, status: 'Pending' as const } : e
                );
                patchState(store, setAllEntities(reverted));
                patchState(store, {
                  error: 'Server rejected the approval. Check enrollment constraints.',
                });
                return EMPTY;
              })
            )
          )
        )
      ),

      rejectEnrollment: rxMethod<string>(
        pipe(
          tap((id: string) => {
            const updated = store.entities().map((e) =>
              e.id === id ? { ...e, status: 'Rejected' as const } : e
            );
            patchState(store, setAllEntities(updated));
          }),
          concatMap((id: string) =>
            enrollmentService.reject(id).pipe(
              catchError((err) => {
                console.error('Reject enrollment failed:', err);
                const reverted = store.entities().map((e) =>
                  e.id === id ? { ...e, status: 'Pending' as const } : e
                );
                patchState(store, setAllEntities(reverted));
                patchState(store, {
                  error: 'Server rejected the rejection. Check enrollment constraints.',
                });
                return EMPTY;
              })
            )
          )
        )
      ),

      addEnrollment: (enrollment: Enrollment) => {
        patchState(store, addEntity(enrollment));
      },

      removeEnrollment: rxMethod<string>(
        pipe(
          tap((id: string) => {
            patchState(store, removeEntity(id));
          })
        )
      ),

      listenForLiveUpdates: () => {
        liveSync.connect();
      },
    };
  })
);