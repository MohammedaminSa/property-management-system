import { Router } from "express";
import policyController from "../../controllers/policy.controller";
import { authGuard } from "../../middleware/auth-middleware";

const router = Router();

// @/api/v1/policies/
router.post(
  "/properties/:propertyId/policy",
  authGuard({ cantAccessBy: ["GUEST"] }),
  policyController.createOrUpdatePolicy
);

router.get(
  "/properties/:propertyId/policy",
  authGuard({ cantAccessBy: ["GUEST"] }),
  policyController.getPolicy
);

router.put(
  "/policies/:id",
  authGuard({ cantAccessBy: ["GUEST"] }),
  policyController.updatePolicy
);

export { router as PolicyRouter };
