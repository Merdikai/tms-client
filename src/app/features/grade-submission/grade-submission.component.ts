import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { firstValueFrom } from 'rxjs';
import { GradeService } from '../../services/grade.service';
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

  ngOnInit() {
    this.enrollmentStore.loadEnrollments();
  }

  onSelectEnrollment(enrollmentId: string) {
    const enrollment = this.enrollmentStore.entities().find((e) => e.id === enrollmentId);
    if (enrollment) {
      this.gradeForm.patchValue({
        studentId: enrollment.studentId,
        courseId: enrollment.courseId,
      });
    }
  }

  async onSubmit() {
    if (this.gradeForm.invalid || this.isSubmitting()) {
      this.gradeForm.markAllAsTouched();
      return;
    }

    const rawValue = this.gradeForm.getRawValue();
    const studentIdNum = Number(rawValue.studentId);
    const courseIdNum = Number(rawValue.courseId);
    const scoreNum = Number(rawValue.score);

    this.isSubmitting.set(true);
    this.submissionStatus.set('Submitting grade to server...');
    this.isSuccess.set(false);

    try {
      const result = await firstValueFrom(
        this.api.postGrade({
          studentId: studentIdNum,
          courseId: courseIdNum,
          score: scoreNum,
        })
      );
      this.isSuccess.set(true);
      this.submissionStatus.set(`Grade saved successfully to database! Record ID: ${result.id}`);

      // Update store so student dashboard and enrollment list reflect the grade immediately
      this.enrollmentStore.updateGrade(studentIdNum, courseIdNum, scoreNum);
    } catch (err: any) {
      this.isSuccess.set(false);
      this.submissionStatus.set(`Submission failed: ${err?.error?.detail || err?.message || 'Server error'}`);
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
