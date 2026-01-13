import { IReinforcementRequestRepository } from "../../domain/repositories/IReinforcementRequestRepository.js";
import { IUserRepository } from "../../domain/repositories/IUserRepository.js";
import { IAlertRepository } from "../../domain/repositories/IAlertRepository.js";
import {
  CreateReinforcementRequestDTO,
  ReinforcementRequest,
} from "../../domain/entities/ReinforcementRequest.js";
import { eventBus } from "../../infrastructure/event-bus/EventBus.js";
import {
  ReinforcementRequestedEvent,
  AlertCreatedEvent,
} from "../../domain/events/index.js";
import { Role } from "../../domain/value-objects/enums.js";

export class CreateReinforcementRequestUseCase {
  constructor(
    private reinforcementRepository: IReinforcementRequestRepository,
    private userRepository: IUserRepository,
    private alertRepository: IAlertRepository
  ) {}

  async execute(
    data: CreateReinforcementRequestDTO
  ): Promise<ReinforcementRequest> {
    const request = await this.reinforcementRepository.create(data);

    // Émettre l'événement pour notify les collaborateurs éligibles (Legacy / General)
    const event: ReinforcementRequestedEvent = {
      eventName: "ReinforcementRequested",
      occurredAt: new Date(),
      payload: {
        requestId: request.id,
        teamId: request.teamId,
        requiredSkills: request.requiredSkills,
        urgencyLevel: request.urgencyLevel,
      },
    };

    await eventBus.publish(event);

    // --- Logique d'alerte ciblée ---
    const skillNames = Object.keys(data.requiredSkills || {});
    let matchingUsers: { id: string }[] = [];

    if (skillNames.length > 0) {
      matchingUsers = await this.userRepository.findWithSkills(skillNames);
    }

    if (matchingUsers.length > 0) {
      // Créer des alertes pour chaque utilisateur correspondant
      for (const user of matchingUsers) {
        // Skip creator if we had that info, but we don't pass creatorId in DTO yet.

        const alert = await this.alertRepository.create({
          type: "REINFORCEMENT_SKILL_MATCH",
          userId: user.id,
          payload: {
            requestId: request.id,
            teamId: request.teamId,
            skills: skillNames,
            urgency: request.urgencyLevel,
            message: `Renfort demandé : Vos compétences (${skillNames.join(
              ", "
            )}) sont requises !`,
          },
        });

        const alertEvent: AlertCreatedEvent = {
          eventName: "AlertCreated",
          occurredAt: new Date(),
          payload: {
            alertId: alert.id,
            type: alert.type,
            userId: user.id,
          },
        };
        await eventBus.publish(alertEvent);
      }
    } else {
      // Aucune correspondance : Diffuser à tous les collaborateurs
      const alert = await this.alertRepository.create({
        type: "REINFORCEMENT_BROADCAST",
        targetRole: Role.COLLABORATOR,
        payload: {
          requestId: request.id,
          teamId: request.teamId,
          urgency: request.urgencyLevel,
          message:
            "Renfort demandé : Besoin d'aide urgente (Aucune compétence spécifique trouvée)",
        },
      });

      const alertEvent: AlertCreatedEvent = {
        eventName: "AlertCreated",
        occurredAt: new Date(),
        payload: {
          alertId: alert.id,
          type: alert.type,
          targetRole: Role.COLLABORATOR,
        },
      };
      await eventBus.publish(alertEvent);
    }

    return request;
  }
}
