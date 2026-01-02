import { ITeamRepository } from '../../domain/repositories/ITeamRepository.js';
import { CreateTeamDTO, Team } from '../../domain/entities/Team.js';

export class CreateTeamUseCase {
  constructor(private teamRepository: ITeamRepository) {}

  async execute(data: CreateTeamDTO): Promise<Team> {
    // Vérifier si le manager est déjà assigné à trop d'équipes ? (Règle métier optionnelle)
    // Ici on permet à un manager de gérer plusieurs équipes (conforme PRD)
    
    return await this.teamRepository.create(data);
  }
}
