import { Router } from "express";
import { TeamController } from "../controllers/TeamController.js";
import { authMiddleware, requireRole } from "../middlewares/auth.middleware.js";
import { Role } from "../../../domain/value-objects/enums.js";

const router = Router();

router.use(authMiddleware);

// Création d'équipe : ADMIN_RH uniquement
router.post("/", requireRole(Role.ADMIN_RH), TeamController.create);

// Liste des équipes : Tous rôles (filtrage possible)
router.get("/", TeamController.list); // TODO: Restreindre liste complète ?

// Détails d'une équipe
router.get("/:id/details", TeamController.getDetails);

// Gestion membres : ADMIN_RH ou MANAGER (de l'équipe - à affiner pour MANAGER si besoin)
// Pour l'instant, disons que seuls les ADMIN_RH peuvent assigner/désassigner librement
// Les MANAGERS pourraient le faire si c'est leur équipe (middleware plus complexe requis pour check owner)
router.post(
  "/:id/members",
  requireRole(Role.ADMIN_RH, Role.MANAGER),
  TeamController.addMember
);
router.delete(
  "/:id/members/:userId",
  requireRole(Role.ADMIN_RH, Role.MANAGER),
  TeamController.removeMember
);

export default router;
