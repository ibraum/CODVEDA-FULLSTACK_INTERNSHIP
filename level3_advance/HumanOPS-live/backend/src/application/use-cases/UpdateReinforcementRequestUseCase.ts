import { IReinforcementRequestRepository } from "../../domain/repositories/IReinforcementRequestRepository.js";
import {
  ReinforcementRequest,
  UpdateReinforcementRequestDTO,
} from "../../domain/entities/ReinforcementRequest.js";

export class UpdateReinforcementRequestUseCase {
  constructor(
    private reinforcementRequestRepository: IReinforcementRequestRepository
  ) {}

  async execute(
    id: string,
    data: UpdateReinforcementRequestDTO
  ): Promise<ReinforcementRequest> {
    const existing = await this.reinforcementRequestRepository.findById(id);

    if (!existing) {
      throw new Error("Reinforcement request not found");
    }

    return this.reinforcementRequestRepository.update(id, data);
  }
}
