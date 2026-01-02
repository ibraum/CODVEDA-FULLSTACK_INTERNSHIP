import { IReinforcementResponseRepository } from '../../domain/repositories/IReinforcementResponseRepository.js';
import { ReinforcementResponseModel, CreateReinforcementResponseDTO } from '../../domain/entities/ReinforcementResponse.js';
import { prisma } from './prisma.js';

export class ReinforcementResponseRepository implements IReinforcementResponseRepository {
  async create(data: CreateReinforcementResponseDTO): Promise<ReinforcementResponseModel> {
    return await prisma.reinforcementResponseModel.create({
      data: {
        requestId: data.requestId,
        userId: data.userId,
        response: data.response,
      },
    }) as unknown as ReinforcementResponseModel; // Cast nécessaire car le modèle Prisma s'appelle ReinforcementResponse (conflit de nom avec enum) -> Non, Prisma génère ReinforcementResponse comme modèle. Voir imports.
    // L'entité du domaine s'appelle ReinforcementResponseModel pour éviter conflit avec Enum ReinforcementResponse
  }

  async findByRequestId(requestId: string): Promise<ReinforcementResponseModel[]> {
    return await prisma.reinforcementResponseModel.findMany({
      where: { requestId },
    }) as unknown as ReinforcementResponseModel[];
  }

  async findByUserResponse(requestId: string, userId: string): Promise<ReinforcementResponseModel | null> {
    return await prisma.reinforcementResponseModel.findUnique({
      where: {
        requestId_userId: { // Unique constraint composée supposée exister dans le schema
          requestId,
          userId,
        },
      },
    }) as unknown as ReinforcementResponseModel | null;
  }
}
