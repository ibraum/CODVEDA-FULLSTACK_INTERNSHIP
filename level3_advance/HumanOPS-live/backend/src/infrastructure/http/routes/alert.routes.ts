import { Router } from 'express';
import { AlertController } from '../controllers/AlertController.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', AlertController.getMyAlerts);
router.put('/:id/read', AlertController.markAsRead);

export default router;
