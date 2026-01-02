import { HumanState, CreateHumanStateDTO, UpdateHumanStateDTO } from '../entities/HumanState';

export interface IHumanStateRepository {
  create(data: CreateHumanStateDTO): Promise<HumanState>;
  findByUserId(userId: string): Promise<HumanState | null>;
  update(userId: string, data: UpdateHumanStateDTO): Promise<HumanState>;
  findByTeamId(teamId: string): Promise<HumanState[]>;
}
