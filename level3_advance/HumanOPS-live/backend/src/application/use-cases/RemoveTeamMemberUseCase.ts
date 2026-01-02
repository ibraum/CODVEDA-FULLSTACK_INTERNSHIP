import { ITeamRepository } from '../../domain/repositories/ITeamRepository';

export class RemoveTeamMemberUseCase {
  constructor(private teamRepository: ITeamRepository) {}

  async execute(teamId: string, userId: string): Promise<void> {
    const team = await this.teamRepository.findById(teamId);
    if (!team) {
      throw new Error('Team not found');
    }

    await this.teamRepository.removeMember(teamId, userId);
  }
}
