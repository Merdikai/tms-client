import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  isLoading = signal(false);
  error = signal<string | null>(null);

  loginForm = this.fb.group({
    username: ['admin', [Validators.required]],
    password: ['Password123!', [Validators.required]],
  });

  async onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.error.set(null);

    try {
      const { username, password } = this.loginForm.getRawValue();
      await this.auth.login({ username: username!, password: password! });
      this.router.navigate(['/dashboard']);
    } catch (err: any) {
      this.error.set(err.error?.detail || 'Login failed. Please check your credentials.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
