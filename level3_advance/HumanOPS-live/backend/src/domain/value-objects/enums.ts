// Enums conformes au schéma Prisma et au PRD

export enum Role {
  ADMIN_RH = 'ADMIN_RH',
  MANAGER = 'MANAGER',
  COLLABORATOR = 'COLLABORATOR',
}

export enum Workload {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
}

export enum Availability {
  AVAILABLE = 'AVAILABLE',
  MOBILISABLE = 'MOBILISABLE',
  UNAVAILABLE = 'UNAVAILABLE',
}

export enum TensionLevel {
  LOW = 'LOW',
  MODERATE = 'MODERATE',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum ReinforcementStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  EXPIRED = 'EXPIRED',
}

export enum ReinforcementResponse {
  ACCEPTED = 'ACCEPTED',
  REFUSED = 'REFUSED',
  NO_RESPONSE = 'NO_RESPONSE',
}
