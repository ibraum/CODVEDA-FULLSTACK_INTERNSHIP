// Base Event interface
export interface DomainEvent {
  eventName: string;
  occurredAt: Date;
  payload: any;
}

// Événements liés aux états humains
export interface HumanStateUpdatedEvent extends DomainEvent {
  eventName: 'HumanStateUpdated';
  payload: {
    userId: string;
    previousState: {
      workload: string;
      availability: string;
    };
    newState: {
      workload: string;
      availability: string;
    };
  };
}

// Événements liés aux tensions
export interface TeamTensionComputedEvent extends DomainEvent {
  eventName: 'TeamTensionComputed';
  payload: {
    teamId: string;
    level: string;
    metrics: Record<string, number>;
  };
}

export interface CriticalTensionDetectedEvent extends DomainEvent {
  eventName: 'CriticalTensionDetected';
  payload: {
    teamId: string;
    metrics: Record<string, number>;
  };
}

// Événements liés aux renforts
export interface ReinforcementRequestedEvent extends DomainEvent {
  eventName: 'ReinforcementRequested';
  payload: {
    requestId: string;
    teamId: string;
    requiredSkills: Record<string, any>;
    urgencyLevel: number;
  };
}

export interface ReinforcementAcceptedEvent extends DomainEvent {
  eventName: 'ReinforcementAccepted';
  payload: {
    requestId: string;
    userId: string;
  };
}

export interface ReinforcementRefusedEvent extends DomainEvent {
  eventName: 'ReinforcementRefused';
  payload: {
    requestId: string;
    userId: string;
  };
}

export interface ReinforcementExpiredEvent extends DomainEvent {
  eventName: 'ReinforcementExpired';
  payload: {
    requestId: string;
  };
}

// Événements liés aux alertes
export interface AlertCreatedEvent extends DomainEvent {
  eventName: 'AlertCreated';
  payload: {
    alertId: string;
    type: string;
    targetRole?: string;
    userId?: string;
  };
}

// Type union de tous les événements
export type AllDomainEvents =
  | HumanStateUpdatedEvent
  | TeamTensionComputedEvent
  | CriticalTensionDetectedEvent
  | ReinforcementRequestedEvent
  | ReinforcementAcceptedEvent
  | ReinforcementRefusedEvent
  | ReinforcementExpiredEvent
  | AlertCreatedEvent;
