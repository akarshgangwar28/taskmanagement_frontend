import { Injectable, signal } from '@angular/core';
import { User, UserRole } from '../../core/models/user.model';
import { delay, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  // Use Angular Signals for reactive state
  currentUser = signal<User | null>(null);

  // Mock users
  private mockUsers: User[] = [
    { id: '1', username: 'manager', email: 'manager@test.com', role: UserRole.Manager },
    { id: '2', username: 'teamlead', email: 'lead@test.com', role: UserRole.TeamLead },
    { id: '3', username: 'employee', email: 'employee@test.com', role: UserRole.Employee }
  ];

  constructor() {
    this.loadUserFromStorage();
  }

  login(email: string, password: string): Observable<{ success: boolean; user?: User; error?: string }> {
    // In a real app, this would be an HTTP POST
    const user = this.mockUsers.find(u => u.email === email);
    
    // Simulate API delay, expect password to be 'password' for mocking
    if (user && password === 'password') {
      this.currentUser.set(user);
      localStorage.setItem('auth_token', 'mock-jwt-token');
      localStorage.setItem('user', JSON.stringify(user));
      return of({ success: true, user }).pipe(delay(500));
    }
    
    return of({ success: false, error: 'Invalid credentials. Hint: use password as password' }).pipe(delay(500));
  }

  register(username: string, email: string, password: string, role: UserRole): Observable<{ success: boolean; error?: string }> {
    if (this.mockUsers.find(u => u.email === email)) {
      return of({ success: false, error: 'User already exists with this email' }).pipe(delay(500));
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      username,
      email,
      role
    };

    this.mockUsers.push(newUser);
    return of({ success: true }).pipe(delay(500));
  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }

  // Restore session on app load
  loadUserFromStorage() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr) as User;
        this.currentUser.set(user);
      } catch (e) {
        this.logout();
      }
    }
  }
}
