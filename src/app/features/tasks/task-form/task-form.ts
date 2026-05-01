import { Component, inject, Input, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task, TaskStatus } from '../../../core/models/task.model';
import { NgIf, NgFor } from '@angular/common';
import { UserService } from '../../users/user';
import { Auth } from '../../auth/auth';

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule, NgIf, NgFor],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css'
})
export class TaskForm implements OnInit {
  @Input() task: Task | null = null;
  @Output() save = new EventEmitter<Partial<Task>>();
  @Output() cancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  auth = inject(Auth);

  users = this.userService.users;

  taskForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required]],
    status: [TaskStatus.Pending as TaskStatus],
    assignedTo: ['']
  });

  isEditMode = signal(false);

  ngOnInit() {
    // Only load users if Manager or Team Lead (Employees will get 403 anyway)
    const currentUserRole = this.auth.currentUser()?.role;
    if (currentUserRole === 'Manager' || currentUserRole === 'Team Lead') {
      this.userService.loadUsers();
    } else {
      // For employee, default to their own ID invisibly
      this.taskForm.patchValue({ assignedTo: this.auth.currentUser()?.id });
    }

    if (this.task) {
      this.isEditMode.set(true);
      this.taskForm.patchValue({
        title: this.task.title,
        description: this.task.description,
        status: this.task.status,
        assignedTo: this.task.assignedTo || this.auth.currentUser()?.id
      });
    }
  }

  onSubmit() {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    this.save.emit(this.taskForm.getRawValue());
  }

  onCancel() {
    this.cancel.emit();
  }
}
