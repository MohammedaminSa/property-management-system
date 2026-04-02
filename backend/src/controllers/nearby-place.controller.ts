import { tryCatch } from "../utils/async-handler";
import { prisma } from "../lib/prisma";

export default {
  // Create nearby place
  createNearbyPlace: tryCatch(async (req, res) => {
    const { propertyId } = req.params;
    const { name, category, distance, icon, order } = req.body;

    if (!name || !category || !distance) {
      return res.status(400).json({ 
        error: "name, category, and distance are required" 
      });
    }

    const validCategories = ["ATTRACTION", "TRANSPORT", "RESTAURANT"];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ 
        error: "Invalid category. Must be ATTRACTION, TRANSPORT, or RESTAURANT" 
      });
    }

    const nearbyPlace = await prisma.nearbyPlace.create({
      data: {
        name,
        category,
        distance,
        icon,
        order: order || 0,
        propertyId,
      },
    });

    res.status(201).json({ 
      message: "Nearby place created successfully", 
      success: true,
      data: nearbyPlace 
    });
  }),

  // Get all nearby places for a property
  getNearbyPlaces: tryCatch(async (req, res) => {
    const { propertyId } = req.params;

    const nearbyPlaces = await prisma.nearbyPlace.findMany({
      where: { propertyId },
      orderBy: [{ category: "asc" }, { order: "asc" }],
    });

    res.json({ data: nearbyPlaces, success: true });
  }),

  // Update nearby place
  updateNearbyPlace: tryCatch(async (req, res) => {
    const { id } = req.params;
    const { name, category, distance, icon, order } = req.body;

    const nearbyPlace = await prisma.nearbyPlace.findUnique({ 
      where: { id } 
    });

    if (!nearbyPlace) {
      return res.status(404).json({ error: "Nearby place not found" });
    }

    if (category) {
      const validCategories = ["ATTRACTION", "TRANSPORT", "RESTAURANT"];
      if (!validCategories.includes(category)) {
        return res.status(400).json({ 
          error: "Invalid category. Must be ATTRACTION, TRANSPORT, or RESTAURANT" 
        });
      }
    }

    const updatedNearbyPlace = await prisma.nearbyPlace.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(category && { category }),
        ...(distance && { distance }),
        ...(icon !== undefined && { icon }),
        ...(order !== undefined && { order }),
      },
    });

    res.json({ 
      message: "Nearby place updated successfully",
      success: true,
      data: updatedNearbyPlace 
    });
  }),

  // Delete nearby place
  deleteNearbyPlace: tryCatch(async (req, res) => {
    const { id } = req.params;

    const nearbyPlace = await prisma.nearbyPlace.findUnique({ 
      where: { id } 
    });

    if (!nearbyPlace) {
      return res.status(404).json({ error: "Nearby place not found" });
    }

    await prisma.nearbyPlace.delete({ where: { id } });

    res.json({ 
      message: "Nearby place deleted successfully",
      success: true 
    });
  }),
};
