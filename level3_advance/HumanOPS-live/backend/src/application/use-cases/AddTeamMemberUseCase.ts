import { ITeamRepository } from '../../domain/repositories/ITeamRepository.js';
import { IUserRepository } from '../../domain/repositories/IUserRepository.js';
import { eventBus } from '../../infrastructure/event-bus/EventBus.js';

export class AddTeamMemberUseCase {
  constructor(
    private teamRepository: ITeamRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(teamId: string, userId: string): Promise<void> {
    const team = await this.teamRepository.findById(teamId);
    if (!team) throw new Error('Team not found');

    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error('User not found');

    await this.teamRepository.addMember(teamId, userId);

    await eventBus.publish({
      eventName: 'TeamMemberAdded',
      occurredAt: new Date(),
      payload: { teamId, userId }
    });
  }
}
