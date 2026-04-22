export enum UserRole {
  ADMIN = 'admin',
  MEMBER = 'member',
}

/** User record created by Cognito post-confirmation trigger */
export interface User {
  userId: string;       // Cognito sub
  email: string;
  name: string;
  role: UserRole;
  rootFolderId: string; // created on signup
  storageUsed: number;  // bytes
  storageLimit: number; // bytes
  createdAt: string;
  updatedAt: string;
}
