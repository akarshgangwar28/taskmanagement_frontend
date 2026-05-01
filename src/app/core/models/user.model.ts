export enum UserRole {
  Manager = 'Manager',
  TeamLead = 'Team Lead',
  Employee = 'Employee'
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  teamLead?: string;
}
