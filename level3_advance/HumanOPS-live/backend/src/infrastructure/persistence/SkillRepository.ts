import { ISkillRepository } from '../../domain/repositories/ISkillRepository';
import { Skill, CreateSkillDTO } from '../../domain/entities/Skill';
import { prisma } from './prisma';

export class SkillRepository implements ISkillRepository {
  async create(data: CreateSkillDTO): Promise<Skill> {
    return await prisma.skill.create({
      data,
    }) as Skill;
  }

  async findAll(): Promise<Skill[]> {
    return await prisma.skill.findMany() as Skill[];
  }

  async findById(id: string): Promise<Skill | null> {
    return await prisma.skill.findUnique({
      where: { id },
    }) as Skill | null;
  }

  async findByName(name: string): Promise<Skill | null> {
    return await prisma.skill.findFirst({ // findFirst car name n'est pas @unique dans tous les schemas par défaut, mais ici supposons qu'on veut juste le trouver
      where: { name },
    }) as Skill | null;
  }
}
