import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject } from 'rxjs';
import { exhaustMap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GradeService, GradePayload } from '../../services/grade.service';
import { EnrollmentStore } from '../../store/enrollment.store';

@Component({
  selector: 'tms-grade-submission',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './grade-submission.component.html',
  styleUrl: './grade-submission.component.scss',
})
export class GradeSubmissionComponent implements OnInit {
  private api = inject(GradeService);
  private fb = inject(FormBuilder);
  enrollmentStore = inject(EnrollmentStore);

  gradeForm = this.fb.group({
    studentId: [1, [Validators.required, Validators.min(1)]],
    courseId: [1, [Validators.required, Validators.min(1)]],
    score: [88, [Validators.required, Validators.min(0), Validators.max(100)]],
  });

  isSubmitting = signal(false);
  submissionStatus = signal('');
  isSuccess = signal(false);

  // Subject is an event stream protected against duplicate rage-clicks by exhaustMap
  private submitClick$ = new Subject<GradePayload>();

  constructor() {
    this.submitClick$
      .pipe(
        // exhaustMap: while the inner HTTP observable is active, all subsequent clicks are silently dropped
        exhaustMap((payload) => {
          this.isSubmitting.set(true);
          this.submissionStatus.set('Submitting grade to server...');
          this.isSuccess.set(false);
          return this.api.postGrade(payload);
        }),
        // takeUntilDestroyed: automatically unsubscribes on component destruction to prevent leaks
        takeUntilDestroyed()
      )
      .subscribe({
        next: (result) => {
          this.isSubmitting.set(false);
          this.isSuccess.set(true);
          this.submissionStatus.set(
            `Grade saved successfully! Record ID: ${result.id}`
          );
          const raw = this.gradeForm.getRawValue();
          this.enrollmentStore.updateGrade(
            Number(raw.studentId),
            Number(raw.courseId),
            Number(raw.score)
          );
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this.isSuccess.set(false);
          this.submissionStatus.set(
            `Submission failed: ${err?.error?.detail || err?.message || 'Server error'}`
          );
        },
      });
  }

  ngOnInit() {
    this.enrollmentStore.loadEnrollments();
  }

  onSelectEnrollment(enrollmentId: string) {
    const enrollment = this.enrollmentStore
      .entities()
      .find((e) => e.id === enrollmentId);
    if (enrollment) {
      this.gradeForm.patchValue({
        studentId: enrollment.studentId,
        courseId: enrollment.courseId,
      });
    }
  }

  onSubmit() {
    if (this.gradeForm.valid) {
      const rawValue = this.gradeForm.getRawValue();
      this.submitClick$.next({
        studentId: Number(rawValue.studentId),
        courseId: Number(rawValue.courseId),
        score: Number(rawValue.score),
      });
    } else {
      this.gradeForm.markAllAsTouched();
    }
  }
}
