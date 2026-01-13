import { Router } from "express";
import { ReinforcementController } from "../controllers/ReinforcementController.js";
import { authMiddleware, requireRole } from "../middlewares/auth.middleware.js";
import { Role } from "../../../domain/value-objects/enums.js";

const router = Router();

router.use(authMiddleware);

// Création : Manager ou Admin RH
router.post(
  "/",
  requireRole(Role.MANAGER, Role.ADMIN_RH),
  ReinforcementController.create
);

// Mise à jour : Manager ou Admin RH
router.put(
  "/:id",
  requireRole(Role.MANAGER, Role.ADMIN_RH),
  ReinforcementController.update
);

// Suppression : Manager ou Admin RH
router.delete(
  "/:id",
  requireRole(Role.MANAGER, Role.ADMIN_RH),
  ReinforcementController.delete
);

// Réponse : Collaborateur (ou tout rôle connecté susceptible d'aider)
router.post("/:id/respond", ReinforcementController.respond);

// Liste les demandes ouvertes (accessibles à tous les connectés)
router.get("/", ReinforcementController.list);

export default router;
