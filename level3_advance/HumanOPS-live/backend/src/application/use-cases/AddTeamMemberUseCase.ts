import { ITeamRepository } from '../../domain/repositories/ITeamRepository';
import { IUserRepository } from '../../domain/repositories/IUserRepository';

export class AddTeamMemberUseCase {
  constructor(
    private teamRepository: ITeamRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(teamId: string, userId: string): Promise<void> {
    const team = await this.teamRepository.findById(teamId);
    if (!team) {
      throw new Error('Team not found');
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Vérifier si l'utilisateur est déjà dans une équipe ?
    // Prisma lancera une erreur unique constraint violation si c'est le cas,
    // mais on pourrait vérifier avant pour un message d'erreur plus clair.
    try {
      await this.teamRepository.addMember(teamId, userId);
    } catch (error: any) {
      if (error.code === 'P2002') { // Erreur Prisma contrainte unique
        throw new Error('User is already member of a team');
      }
      throw error;
    }
  }
}
