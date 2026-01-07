import { IReinforcementRequestRepository } from "../../domain/repositories/IReinforcementRequestRepository.js";
import { ReinforcementRequest } from "../../domain/entities/ReinforcementRequest.js";

export class GetOpenReinforcementRequestsUseCase {
  constructor(
    private reinforcementRequestRepository: IReinforcementRequestRepository
  ) {}

  async execute(): Promise<ReinforcementRequest[]> {
    return this.reinforcementRequestRepository.findOpenRequests();
  }
}
