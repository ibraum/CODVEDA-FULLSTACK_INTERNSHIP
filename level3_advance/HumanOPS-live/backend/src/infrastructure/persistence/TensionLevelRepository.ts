import { ITensionLevelRepository } from '../../domain/repositories/ITensionLevelRepository.js';
import { TensionLevelSnapshot, CreateTensionSnapshotDTO } from '../../domain/entities/TensionLevelSnapshot.js';
import { prisma } from './prisma.js';

export class TensionLevelRepository implements ITensionLevelRepository {
  async create(data: CreateTensionSnapshotDTO): Promise<TensionLevelSnapshot> {
    return await prisma.tensionLevelSnapshot.create({
      data: {
        teamId: data.teamId,
        level: data.level,
        metrics: data.metrics,
      },
    }) as unknown as TensionLevelSnapshot; 
    // Note: 'unknown' casting peut être nécessaire si le type JSON de Prisma
    // n'est pas parfaitement aligné avec l'interface TS stricte, mais ici ça devrait aller.
  }

  async findByTeamId(teamId: string, limit?: number): Promise<TensionLevelSnapshot[]> {
    return await prisma.tensionLevelSnapshot.findMany({
      where: { teamId },
      orderBy: { calculatedAt: 'desc' },
      take: limit,
    }) as unknown as TensionLevelSnapshot[];
  }

  async findLatestByTeamId(teamId: string): Promise<TensionLevelSnapshot | null> {
    return await prisma.tensionLevelSnapshot.findFirst({
      where: { teamId },
      orderBy: { calculatedAt: 'desc' },
    }) as unknown as TensionLevelSnapshot | null;
  }
}
