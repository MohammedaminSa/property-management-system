import { Router } from "express";
import highlightController from "../../controllers/highlight.controller";
import { authGuard } from "../../middleware/auth-middleware";

const router = Router();

// @/api/v1/highlights/
router.post(
  "/properties/:propertyId/highlights",
  authGuard({ cantAccessBy: ["GUEST"] }),
  highlightController.createHighlight
);

router.get(
  "/properties/:propertyId/highlights",
  authGuard({ cantAccessBy: ["GUEST"] }),
  highlightController.getHighlights
);

router.put(
  "/highlights/:id",
  authGuard({ cantAccessBy: ["GUEST"] }),
  highlightController.updateHighlight
);

router.delete(
  "/highlights/:id",
  authGuard({ cantAccessBy: ["GUEST"] }),
  highlightController.deleteHighlight
);

export { router as HighlightRouter };
