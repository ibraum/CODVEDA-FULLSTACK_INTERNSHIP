import { IReinforcementRequestRepository } from "../../domain/repositories/IReinforcementRequestRepository.js";
import {
  ReinforcementRequest,
  CreateReinforcementRequestDTO,
  UpdateReinforcementRequestDTO,
} from "../../domain/entities/ReinforcementRequest.js";
import { ReinforcementStatus } from "../../domain/value-objects/enums.js";
import { prisma } from "./prisma.js";

export class ReinforcementRequestRepository
  implements IReinforcementRequestRepository
{
  async create(
    data: CreateReinforcementRequestDTO
  ): Promise<ReinforcementRequest> {
    return (await prisma.reinforcementRequest.create({
      data: {
        teamId: data.teamId,
        requiredSkills: data.requiredSkills,
        urgencyLevel: data.urgencyLevel,
        status: ReinforcementStatus.OPEN,
        expiresAt: data.expiresAt,
      },
    })) as ReinforcementRequest;
  }

  async findById(id: string): Promise<ReinforcementRequest | null> {
    return (await prisma.reinforcementRequest.findUnique({
      where: { id },
    })) as ReinforcementRequest | null;
  }

  async findByTeamId(teamId: string): Promise<ReinforcementRequest[]> {
    return (await prisma.reinforcementRequest.findMany({
      where: { teamId },
      orderBy: { createdAt: "desc" },
    })) as ReinforcementRequest[];
  }

  async findOpenRequests(): Promise<ReinforcementRequest[]> {
    return (await prisma.reinforcementRequest.findMany({
      where: {
        status: ReinforcementStatus.OPEN,
        expiresAt: { gt: new Date() }, // Non expiré
      },
      orderBy: { urgencyLevel: "desc" },
      include: { team: true },
    })) as unknown as ReinforcementRequest[];
  }

  async findExpiredRequests(): Promise<ReinforcementRequest[]> {
    return (await prisma.reinforcementRequest.findMany({
      where: {
        status: ReinforcementStatus.OPEN,
        expiresAt: { lte: new Date() },
      },
    })) as ReinforcementRequest[];
  }

  async update(
    id: string,
    data: UpdateReinforcementRequestDTO
  ): Promise<ReinforcementRequest> {
    return (await prisma.reinforcementRequest.update({
      where: { id },
      data,
    })) as ReinforcementRequest;
  }

  async delete(id: string): Promise<void> {
    await prisma.reinforcementRequest.delete({
      where: { id },
    });
  }
}
