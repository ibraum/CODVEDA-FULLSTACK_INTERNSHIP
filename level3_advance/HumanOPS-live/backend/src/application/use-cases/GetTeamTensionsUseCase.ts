import { ITensionLevelRepository } from '../../domain/repositories/ITensionLevelRepository.js';
import { TensionLevelSnapshot } from '../../domain/entities/TensionLevelSnapshot.js';

export class GetTeamTensionsUseCase {
  constructor(private tensionRepository: ITensionLevelRepository) {}

  async execute(teamId: string, limit: number = 10): Promise<TensionLevelSnapshot[]> {
    return await this.tensionRepository.findByTeamId(teamId, limit);
  }
}
