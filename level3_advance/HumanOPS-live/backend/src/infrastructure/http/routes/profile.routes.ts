import { Router } from 'express';
import { ProfileController } from '../controllers/ProfileController';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

// Collaborateur : gérer son propre profil
router.get('/me', ProfileController.getMe);
router.put('/me', ProfileController.updateMe);
router.post('/me/skills', ProfileController.addSkill);

export default router;
