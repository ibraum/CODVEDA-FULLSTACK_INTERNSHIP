import { Router } from 'express';
import { TensionController } from '../controllers/TensionController';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware';
import { Role } from '../../../domain/value-objects/enums';

const router = Router();

router.use(authMiddleware);

// Historique : Accessible aux Managers et RH
router.get('/team/:teamId', requireRole(Role.MANAGER, Role.ADMIN_RH), TensionController.getTeamHistory);

// Recalcul manuel : RH ou System (ici RH pour debug)
router.post('/team/:teamId/calculate', requireRole(Role.ADMIN_RH), TensionController.calculateNow);

export default router;
