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
import { LiveSyncService, EnrollmentStatusEvent } from '../services/live-sync.service';
import { Enrollment } from '../models/enrollment.model';

const STORAGE_KEY = 'tms_enrollments';

function getStoredEnrollments(): Enrollment[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to read enrollments from localStorage:', e);
  }
  return null;
}

function saveStoredEnrollments(enrollments: Enrollment[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(enrollments));
  } catch (e) {
    console.error('Failed to save enrollments to localStorage:', e);
  }
}

function calculateLetterGrade(score: number): string {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

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
      saveStoredEnrollments(updated);
    });

    return {
      loadEnrollments: rxMethod<void>(
        pipe(
          tap(() => {
            const saved = getStoredEnrollments();
            if (saved && saved.length > 0) {
              patchState(store, setAllEntities(saved), { isLoading: false });
              return;
            }

            if (store.entities().length === 0) {
              patchState(store, { isLoading: true });
              const defaultEnrollments: Enrollment[] = [
                { id: 'ENR-1001', studentId: 1, studentName: 'Liya Kebede', courseId: 1, courseName: 'CSE-101 - Web Development Fundamentals', status: 'Approved', enrolledAt: '2026-08-13T08:00:00Z', grade: 92, letterGrade: 'A' },
                { id: 'ENR-1002', studentId: 2, studentName: 'Dawit Tadesse', courseId: 2, courseName: 'CSE-102 - TypeScript Essentials', status: 'Approved', enrolledAt: '2026-08-12T10:30:00Z', grade: 85, letterGrade: 'B' },
                { id: 'ENR-1003', studentId: 3, studentName: 'Sara Bekele', courseId: 3, courseName: 'CSE-103 - Git and Collaborative Workflows', status: 'Pending', enrolledAt: '2026-08-11T14:15:00Z' },
              ];
              patchState(store, setAllEntities(defaultEnrollments), { isLoading: false });
              saveStoredEnrollments(defaultEnrollments);
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
            saveStoredEnrollments(updated);
          }),
          concatMap((id: string) =>
            enrollmentService.approve(id).pipe(
              catchError((err) => {
                console.error('Approve enrollment server sync note:', err);
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
            saveStoredEnrollments(updated);
          }),
          concatMap((id: string) =>
            enrollmentService.reject(id).pipe(
              catchError((err) => {
                console.error('Reject enrollment server sync note:', err);
                return EMPTY;
              })
            )
          )
        )
      ),

      updateGrade: (studentId: number, courseId: number, score: number) => {
        const letter = calculateLetterGrade(score);
        const updated = store.entities().map((e) => {
          if (e.studentId === studentId && e.courseId === courseId) {
            return { ...e, grade: score, letterGrade: letter };
          }
          return e;
        });
        patchState(store, setAllEntities(updated));
        saveStoredEnrollments(updated);
      },

      addEnrollment: (enrollment: Enrollment) => {
        patchState(store, addEntity(enrollment));
        saveStoredEnrollments(store.entities());
      },

      removeEnrollment: rxMethod<string>(
        pipe(
          tap((id: string) => {
            patchState(store, removeEntity(id));
            saveStoredEnrollments(store.entities());
          })
        )
      ),

      listenForLiveUpdates: () => {
        liveSync.connect();
      },
    };
  })
);