import { ITeamRepository } from '../../domain/repositories/ITeamRepository';
import { eventBus } from '../../infrastructure/event-bus/EventBus';

export class RemoveTeamMemberUseCase {
  constructor(private teamRepository: ITeamRepository) {}

  async execute(teamId: string, userId: string): Promise<void> {
    const team = await this.teamRepository.findById(teamId);
    if (!team) {
      throw new Error('Team not found');
    }

    await this.teamRepository.removeMember(teamId, userId);

    await eventBus.publish({
      eventName: 'TeamMemberRemoved',
      occurredAt: new Date(),
      payload: { teamId, userId }
    });
  }
}
