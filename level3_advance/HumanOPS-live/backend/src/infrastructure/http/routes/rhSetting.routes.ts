import { Router } from 'express';
import { RHSettingController } from '../controllers/RHSettingController';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware';
import { Role } from '../../../domain/value-objects/enums';

const router = Router();

router.use(authMiddleware);

// Lecture : RH uniquement (ou Manager si certains settings publics, ici restreint RH par défaut)
router.get('/', requireRole(Role.ADMIN_RH), RHSettingController.getAll);
router.get('/:key', requireRole(Role.ADMIN_RH), RHSettingController.getByKey);

// Écriture : RH uniquement
router.put('/:key', requireRole(Role.ADMIN_RH), RHSettingController.update);

export default router;
