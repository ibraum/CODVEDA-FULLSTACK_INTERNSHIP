import { ITeamRepository } from '../../domain/repositories/ITeamRepository';
import { Team } from '../../domain/entities/Team';

export class ListTeamsUseCase {
  constructor(private teamRepository: ITeamRepository) {}

  async execute(managerId?: string): Promise<Team[]> {
    if (managerId) {
      return await this.teamRepository.findByManagerId(managerId);
    }
    return await this.teamRepository.findAll();
  }
}
