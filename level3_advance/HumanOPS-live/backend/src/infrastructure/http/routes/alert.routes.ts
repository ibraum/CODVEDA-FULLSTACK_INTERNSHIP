import { Router } from 'express';
import { AlertController } from '../controllers/AlertController';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', AlertController.getMyAlerts);
router.put('/:id/read', AlertController.markAsRead);

export default router;
