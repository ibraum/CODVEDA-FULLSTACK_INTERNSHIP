import bcrypt from "bcrypt";
import { IUserRepository } from "../../domain/repositories/IUserRepository.js";
import {
  User,
  CreateUserDTO,
  UpdateUserDTO,
  UserWithoutPassword,
} from "../../domain/entities/User.js";
import { prisma } from "./prisma.js";

export class UserRepository implements IUserRepository {
  async create(data: CreateUserDTO): Promise<User> {
    const passwordHash = await bcrypt.hash(data.password, 10);

    return (await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
      },
    })) as User;
  }

  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { teamMember: true },
    });

    if (!user) return null;

    return {
      ...user,
      teamId: user.teamMember?.teamId,
    } as User;
  }

  async findByEmail(email: string): Promise<User | null> {
    return (await prisma.user.findUnique({
      where: { email },
    })) as User | null;
  }

  async findAll(filters?: {
    role?: string;
    isActive?: boolean;
  }): Promise<UserWithoutPassword[]> {
    const users = await prisma.user.findMany({
      where: {
        ...(filters?.role && { role: filters.role as any }),
        ...(filters?.isActive !== undefined && { isActive: filters.isActive }),
        deletedAt: null, // Exclude soft-deleted users
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        deletedAt: true,
        createdAt: true,
        updatedAt: true,
        humanState: true,
      },
    });

    return users as UserWithoutPassword[];
  }

  async update(id: string, data: UpdateUserDTO): Promise<User> {
    const { password, ...rest } = data;
    const updateData: any = { ...rest };

    if (password) {
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }

    return (await prisma.user.update({
      where: { id },
      data: updateData,
    })) as User;
  }

  async softDelete(id: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });
  }

  async restore(id: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { deletedAt: null, isActive: true },
    });
  }
}
