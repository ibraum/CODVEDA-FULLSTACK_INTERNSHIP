import {
  User,
  CreateUserDTO,
  UpdateUserDTO,
  UserWithoutPassword,
} from "../entities/User.js";

export interface IUserRepository {
  create(data: CreateUserDTO): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(filters?: {
    role?: string;
    isActive?: boolean;
  }): Promise<UserWithoutPassword[]>;
  update(id: string, data: UpdateUserDTO): Promise<User>;
  softDelete(id: string): Promise<void>;
  restore(id: string): Promise<void>;
  findWithSkills(skills: string[]): Promise<UserWithoutPassword[]>;
}
