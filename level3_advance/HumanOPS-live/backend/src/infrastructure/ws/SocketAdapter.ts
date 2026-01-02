import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import jwt from 'jsonwebtoken';
import { config } from '../../config';
import { eventBus } from '../event-bus/EventBus';
import { Role } from '../../domain/value-objects/enums';

export interface AuthenticatedSocket extends Socket {
  user?: {
    userId: string;
    email: string;
    role: Role;
  };
}

export class SocketAdapter {
  private io: SocketIOServer;

  constructor(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: config.socket.cors,
    });

    if (config.redis?.url) {
      console.log('Initializing Redis Adapter for Socket.io...');
      const pubClient = createClient({ url: config.redis.url });
      const subClient = pubClient.duplicate();

      Promise.all([pubClient.connect(), subClient.connect()])
        .then(() => {
          this.io.adapter(createAdapter(pubClient, subClient));
          console.log('Redis Adapter initialized');
        })
        .catch((err) => {
          console.error('Failed to connect to Redis:', err);
        });
    }

    this.setupAuthentication();
    this.setupEventListeners();
    this.setupConnectionHandlers();
  }

  /**
   * Authentification Socket.io via JWT
   */
  private setupAuthentication(): void {
    this.io.use((socket: AuthenticatedSocket, next) => {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Authentication required'));
      }

      try {
        const decoded = jwt.verify(token, config.jwt.secret) as {
          userId: string;
          email: string;
          role: Role;
        };

        socket.user = decoded;
        next();
      } catch (error) {
        next(new Error('Invalid token'));
      }
    });
  }

  /**
   * Écoute des événements du domaine et diffusion temps réel
   */
  private setupEventListeners(): void {
    // Événement : État humain mis à jour
    eventBus.on('HumanStateUpdated', (event) => {
      const { userId, newState } = event.payload;
      
      // Diffuser à l'utilisateur concerné
      this.io.to(`user:${userId}`).emit('human_state:updated', {
        userId,
        state: newState,
      });

      // Diffuser aux managers et RH
      this.io.to('role:MANAGER').emit('team_member_state:updated', {
        userId,
        state: newState,
      });

      this.io.to('role:ADMIN_RH').emit('team_member_state:updated', {
        userId,
        state: newState,
      });
    });

    // Événement : Tension calculée (même si non critique)
    eventBus.on('TeamTensionComputed', (event) => {
      const { teamId, level, metrics } = event.payload;

      // Diffuser aux managers et RH pour affichage temps réel de la jauge
      this.io.to('role:MANAGER').emit('tension:updated', {
        teamId,
        level,
        metrics,
      });

      this.io.to('role:ADMIN_RH').emit('tension:updated', {
        teamId,
        level,
        metrics,
      });
    });

    // Événement : Tension critique détectée
    eventBus.on('CriticalTensionDetected', (event) => {
      const { teamId, metrics } = event.payload;

      // Alerter les managers et RH uniquement
      this.io.to('role:MANAGER').emit('tension:critical', {
        teamId,
        metrics,
      });

      this.io.to('role:ADMIN_RH').emit('tension:critical', {
        teamId,
        metrics,
      });
    });

    // Événement : Membre ajouté à une équipe
    eventBus.on('TeamMemberAdded', (event) => {
      const { teamId, userId } = event.payload;
      
      this.io.to('role:MANAGER').emit('team:member_added', { teamId, userId });
      this.io.to(`user:${userId}`).emit('team:joined', { teamId });
    });

    // Événement : Membre retiré d'une équipe
    eventBus.on('TeamMemberRemoved', (event) => {
      const { teamId, userId } = event.payload;
      
      this.io.to('role:MANAGER').emit('team:member_removed', { teamId, userId });
      this.io.to(`user:${userId}`).emit('team:left', { teamId });
    });

    // Événement : Demande de renfort
    eventBus.on('ReinforcementRequested', (event) => {
      const { requestId, teamId, requiredSkills, urgencyLevel } = event.payload;

      // Diffuser aux collaborateurs disponibles
      this.io.to('role:COLLABORATOR').emit('reinforcement:requested', {
        requestId,
        teamId,
        requiredSkills,
        urgencyLevel,
      });
    });

    // Événement : Renfort accepté
    eventBus.on('ReinforcementAccepted', (event) => {
      const { requestId, userId } = event.payload;

      // Notifier les managers
      this.io.to('role:MANAGER').emit('reinforcement:accepted', {
        requestId,
        userId,
      });
    });

    // Événement : Renfort refusé
    eventBus.on('ReinforcementRefused', (event) => {
      const { requestId, userId } = event.payload;

      // Notifier les managers (optionnel : uniquement le manager de l'équipe demanderesse si on filtrait par team)
      this.io.to('role:MANAGER').emit('reinforcement:refused', {
        requestId,
        userId,
      });
    });

    // Événement : Alerte créée
    eventBus.on('AlertCreated', (event) => {
      const { alertId, type, targetRole, userId } = event.payload;

      if (userId) {
        // Alerte ciblée utilisateur
        this.io.to(`user:${userId}`).emit('alert:new', {
          alertId,
          type,
        });
      } else if (targetRole) {
        // Alerte ciblée rôle
        this.io.to(`role:${targetRole}`).emit('alert:new', {
          alertId,
          type,
        });
      }
    });
  }

  /**
   * Gestion des connexions/déconnexions
   */
  private setupConnectionHandlers(): void {
    this.io.on('connection', (socket: AuthenticatedSocket) => {
      if (!socket.user) return;

      console.log(`User connected: ${socket.user.email} (${socket.user.role})`);

      // Rejoindre les rooms appropriées
      socket.join(`user:${socket.user.userId}`);
      socket.join(`role:${socket.user.role}`);

      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.user?.email}`);
      });
    });
  }

  /**
   * Obtenir l'instance Socket.io (si besoin d'accès direct)
   */
  getIO(): SocketIOServer {
    return this.io;
  }
}
