import { TensionLevel } from '../value-objects/enums.js';

export interface TensionLevelSnapshot {
  id: string;
  teamId: string;
  level: TensionLevel;
  metrics: {
    overloadPercentage: number;
    averageDuration: number;
    requestToAvailabilityRatio: number;
    refusalRate: number;
  };
  calculatedAt: Date;
}

export interface CreateTensionSnapshotDTO {
  teamId: string;
  level: TensionLevel;
  metrics: TensionLevelSnapshot['metrics'];
}
