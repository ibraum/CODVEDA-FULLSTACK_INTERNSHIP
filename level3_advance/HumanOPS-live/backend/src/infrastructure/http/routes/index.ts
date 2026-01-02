import { Router } from 'express';
import authRoutes from './auth.routes.js';
import humanStateRoutes from './humanState.routes.js';
import userRoutes from './user.routes.js';
import teamRoutes from './team.routes.js';
import profileRoutes from './profile.routes.js';
import alertRoutes from './alert.routes.js';
import reinforcementRoutes from './reinforcement.routes.js';
import tensionRoutes from './tension.routes.js';
import rhSettingRoutes from './rhSetting.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/human-states', humanStateRoutes);
router.use('/users', userRoutes);
router.use('/teams', teamRoutes);
router.use('/profiles', profileRoutes);
router.use('/alerts', alertRoutes);
router.use('/reinforcements', reinforcementRoutes);
router.use('/tensions', tensionRoutes);
router.use('/settings', rhSettingRoutes);

export default router;
