import { Router } from "express";
import nearbyPlaceController from "../../controllers/nearby-place.controller";
import { authGuard } from "../../middleware/auth-middleware";

const router = Router();

// @/api/v1/nearby-places/
router.post(
  "/properties/:propertyId/nearby-places",
  authGuard({ cantAccessBy: ["GUEST"] }),
  nearbyPlaceController.createNearbyPlace
);

router.get(
  "/properties/:propertyId/nearby-places",
  authGuard({ cantAccessBy: ["GUEST"] }),
  nearbyPlaceController.getNearbyPlaces
);

router.put(
  "/nearby-places/:id",
  authGuard({ cantAccessBy: ["GUEST"] }),
  nearbyPlaceController.updateNearbyPlace
);

router.delete(
  "/nearby-places/:id",
  authGuard({ cantAccessBy: ["GUEST"] }),
  nearbyPlaceController.deleteNearbyPlace
);

export { router as NearbyPlaceRouter };
