import { Router } from "express";
import { ProfileController } from "../controllers/ProfileController.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

// Collaborateur : gérer son propre profil
router.get("/skills", ProfileController.getAllSkills);
router.get("/me", ProfileController.getMe);
router.put("/me", ProfileController.updateMe);
router.post("/me/skills", ProfileController.addSkill);

export default router;
