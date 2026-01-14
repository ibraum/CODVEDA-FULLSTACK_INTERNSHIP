import { ITeamRepository } from "../../domain/repositories/ITeamRepository.js";

export class GetTeamDetailsUseCase {
  constructor(private teamRepository: ITeamRepository) {}

  async execute(teamId: string): Promise<any> {
    return await this.teamRepository.getByIdWithDetails(teamId);
  }
}
