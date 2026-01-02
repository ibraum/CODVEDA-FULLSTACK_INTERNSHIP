import { Router } from 'express';
import { UserController } from '../controllers/UserController.js';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware.js';
import { Role } from '../../../domain/value-objects/enums.js';

const router = Router();

router.use(authMiddleware);

// Seuls les ADMIN_RH peuvent gérer les utilisateurs
router.get('/', requireRole(Role.ADMIN_RH), UserController.list);
router.put('/:id', requireRole(Role.ADMIN_RH), UserController.update);
router.delete('/:id', requireRole(Role.ADMIN_RH), UserController.delete);

export default router;
