import { Router } from 'express';
import { HumanStateController } from '../controllers/HumanStateController';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware';
import { Role } from '../../../domain/value-objects/enums';

const router = Router();

// Routes protégées - nécessitent authentification
router.use(authMiddleware);

// Collaborateur : gérer son propre état
router.get('/me', HumanStateController.getMyState);
router.put('/me', HumanStateController.updateMyState);

// Manager/RH : voir les états d'une équipe
router.get(
  '/team/:teamId',
  requireRole(Role.MANAGER, Role.ADMIN_RH),
  HumanStateController.getTeamStates
);

export default router;
