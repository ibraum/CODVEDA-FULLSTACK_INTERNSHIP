import { IReinforcementRequestRepository } from "../../domain/repositories/IReinforcementRequestRepository.js";

export class DeleteReinforcementRequestUseCase {
  constructor(
    private reinforcementRequestRepository: IReinforcementRequestRepository
  ) {}

  async execute(id: string): Promise<void> {
    const existing = await this.reinforcementRequestRepository.findById(id);

    if (!existing) {
      throw new Error("Reinforcement request not found");
    }

    await this.reinforcementRequestRepository.delete(id);
  }
}
