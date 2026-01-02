import { Router } from 'express';
import authRoutes from './auth.routes';
import humanStateRoutes from './humanState.routes';
import userRoutes from './user.routes';
import teamRoutes from './team.routes';
import profileRoutes from './profile.routes';
import alertRoutes from './alert.routes';
import reinforcementRoutes from './reinforcement.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/human-states', humanStateRoutes);
router.use('/users', userRoutes);
router.use('/teams', teamRoutes);
router.use('/profiles', profileRoutes);
router.use('/alerts', alertRoutes);
router.use('/reinforcements', reinforcementRoutes);

export default router;
