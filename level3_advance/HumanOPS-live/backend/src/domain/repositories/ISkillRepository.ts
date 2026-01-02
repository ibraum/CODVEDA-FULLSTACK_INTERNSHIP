import { Skill, CreateSkillDTO } from '../entities/Skill';

export interface ISkillRepository {
  create(data: CreateSkillDTO): Promise<Skill>;
  findAll(): Promise<Skill[]>;
  findById(id: string): Promise<Skill | null>;
  findByName(name: string): Promise<Skill | null>;
}
