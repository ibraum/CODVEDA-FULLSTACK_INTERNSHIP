import { TensionLevelSnapshot, CreateTensionSnapshotDTO } from '../entities/TensionLevelSnapshot';

export interface ITensionLevelRepository {
  create(data: CreateTensionSnapshotDTO): Promise<TensionLevelSnapshot>;
  findByTeamId(teamId: string, limit?: number): Promise<TensionLevelSnapshot[]>;
  findLatestByTeamId(teamId: string): Promise<TensionLevelSnapshot | null>;
}
