import { Router } from 'express';
import { ReinforcementController } from '../controllers/ReinforcementController';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware';
import { Role } from '../../../domain/value-objects/enums';

const router = Router();

router.use(authMiddleware);

// Création : Manager ou Admin RH
router.post('/', requireRole(Role.MANAGER, Role.ADMIN_RH), ReinforcementController.create);

// Réponse : Collaborateur (ou tout rôle connecté susceptible d'aider)
router.post('/:id/respond', ReinforcementController.respond);

export default router;
