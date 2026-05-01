import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../user';
import { Auth } from '../../auth/auth';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-user-list',
  imports: [NgIf, NgFor],
  templateUrl: './user-list.html'
})
export class UserList implements OnInit {
  userService = inject(UserService);
  auth = inject(Auth);

  users = this.userService.users;

  ngOnInit() {
    this.userService.loadUsers();
  }

  assignLead(userId: string, targetLeadId: string) {
    this.userService.assignLead(userId, targetLeadId || null).subscribe();
  }

  getTeamLeads() {
    return this.users().filter(u => u.role === 'Team Lead');
  }

  getEmployees() {
    return this.users().filter(u => u.role === 'Employee');
  }
}
