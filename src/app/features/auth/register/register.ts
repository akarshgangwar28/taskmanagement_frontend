import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../auth';
import { NgIf, NgFor } from '@angular/common';
import { UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, NgIf, NgFor],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private router = inject(Router);

  roles = Object.values(UserRole);

  registerForm = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: [UserRole.Employee as UserRole, [Validators.required]]
  });

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    const { username, email, password, role } = this.registerForm.getRawValue();

    this.auth.register(username, email, password, role).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.success) {
          this.router.navigate(['/login']);
        } else {
          this.errorMessage.set(res.error || 'Registration failed');
        }
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('An error occurred during registration');
      }
    });
  }
}
