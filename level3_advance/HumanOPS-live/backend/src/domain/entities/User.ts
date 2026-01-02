import { Role } from '../value-objects/enums.js';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: Role;
  isActive: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDTO {
  email: string;
  password: string;
  role: Role;
}

export interface UpdateUserDTO {
  email?: string;
  role?: Role;
  isActive?: boolean;
}

export interface UserWithoutPassword extends Omit<User, 'passwordHash'> {}
