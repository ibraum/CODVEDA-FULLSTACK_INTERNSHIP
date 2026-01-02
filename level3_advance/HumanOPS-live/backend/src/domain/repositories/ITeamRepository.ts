import { Team, CreateTeamDTO, UpdateTeamDTO } from '../entities/Team.js';

export interface ITeamRepository {
  create(data: CreateTeamDTO): Promise<Team>;
  findById(id: string): Promise<Team | null>;
  findByManagerId(managerId: string): Promise<Team[]>;
  findAll(): Promise<Team[]>;
  update(id: string, data: UpdateTeamDTO): Promise<Team>;
  delete(id: string): Promise<void>;
  hasActiveMembers(teamId: string): Promise<boolean>;
  addMember(teamId: string, userId: string): Promise<void>;
  removeMember(teamId: string, userId: string): Promise<void>;
  updateMember(teamId: string, userId: string): Promise<void>; // Pour changer d'équipe
}
