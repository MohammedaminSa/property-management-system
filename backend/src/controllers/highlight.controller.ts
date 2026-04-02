import { tryCatch } from "../utils/async-handler";
import { prisma } from "../lib/prisma";

export default {
  // Create highlight
  createHighlight: tryCatch(async (req, res) => {
    const { propertyId } = req.params;
    const { icon, title, description, order } = req.body;

    if (!icon || !title || !description) {
      return res.status(400).json({ 
        error: "icon, title, and description are required" 
      });
    }

    const highlight = await prisma.highlight.create({
      data: {
        icon,
        title,
        description,
        order: order || 0,
        propertyId,
      },
    });

    res.status(201).json({ 
      message: "Highlight created successfully", 
      success: true,
      data: highlight 
    });
  }),

  // Get all highlights for a property
  getHighlights: tryCatch(async (req, res) => {
    const { propertyId } = req.params;

    const highlights = await prisma.highlight.findMany({
      where: { propertyId },
      orderBy: { order: "asc" },
    });

    res.json({ data: highlights, success: true });
  }),

  // Update highlight
  updateHighlight: tryCatch(async (req, res) => {
    const { id } = req.params;
    const { icon, title, description, order } = req.body;

    const highlight = await prisma.highlight.findUnique({ 
      where: { id } 
    });

    if (!highlight) {
      return res.status(404).json({ error: "Highlight not found" });
    }

    const updatedHighlight = await prisma.highlight.update({
      where: { id },
      data: {
        ...(icon && { icon }),
        ...(title && { title }),
        ...(description && { description }),
        ...(order !== undefined && { order }),
      },
    });

    res.json({ 
      message: "Highlight updated successfully",
      success: true,
      data: updatedHighlight 
    });
  }),

  // Delete highlight
  deleteHighlight: tryCatch(async (req, res) => {
    const { id } = req.params;

    const highlight = await prisma.highlight.findUnique({ 
      where: { id } 
    });

    if (!highlight) {
      return res.status(404).json({ error: "Highlight not found" });
    }

    await prisma.highlight.delete({ where: { id } });

    res.json({ 
      message: "Highlight deleted successfully",
      success: true 
    });
  }),
};
