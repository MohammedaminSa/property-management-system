import { tryCatch } from "../utils/async-handler";
import { prisma } from "../lib/prisma";

export default {
  // Create or update policy
  createOrUpdatePolicy: tryCatch(async (req, res) => {
    const { propertyId } = req.params;
    const { 
      checkInTime, 
      checkOutTime, 
      cancellationPolicy, 
      childrenPolicy, 
      petsPolicy, 
      smokingPolicy, 
      extraInfo 
    } = req.body;

    // Check if policy already exists
    const existingPolicy = await prisma.propertyPolicy.findUnique({
      where: { propertyId },
    });

    let policy;
    if (existingPolicy) {
      // Update existing policy
      policy = await prisma.propertyPolicy.update({
        where: { propertyId },
        data: {
          ...(checkInTime && { checkInTime }),
          ...(checkOutTime && { checkOutTime }),
          ...(cancellationPolicy !== undefined && { cancellationPolicy }),
          ...(childrenPolicy !== undefined && { childrenPolicy }),
          ...(petsPolicy !== undefined && { petsPolicy }),
          ...(smokingPolicy !== undefined && { smokingPolicy }),
          ...(extraInfo !== undefined && { extraInfo }),
        },
      });
    } else {
      // Create new policy
      policy = await prisma.propertyPolicy.create({
        data: {
          propertyId,
          checkInTime: checkInTime || "15:00",
          checkOutTime: checkOutTime || "12:00",
          cancellationPolicy,
          childrenPolicy,
          petsPolicy,
          smokingPolicy,
          extraInfo,
        },
      });
    }

    res.status(existingPolicy ? 200 : 201).json({ 
      message: existingPolicy ? "Policy updated successfully" : "Policy created successfully",
      success: true,
      data: policy 
    });
  }),

  // Get policy for a property
  getPolicy: tryCatch(async (req, res) => {
    const { propertyId } = req.params;

    const policy = await prisma.propertyPolicy.findUnique({
      where: { propertyId },
    });

    // Always return success, even if no policy exists
    res.json({ data: policy, success: true });
  }),

  // Update policy
  updatePolicy: tryCatch(async (req, res) => {
    const { id } = req.params;
    const { 
      checkInTime, 
      checkOutTime, 
      cancellationPolicy, 
      childrenPolicy, 
      petsPolicy, 
      smokingPolicy, 
      extraInfo 
    } = req.body;

    const policy = await prisma.propertyPolicy.findUnique({ 
      where: { id } 
    });

    if (!policy) {
      return res.status(404).json({ error: "Policy not found" });
    }

    const updatedPolicy = await prisma.propertyPolicy.update({
      where: { id },
      data: {
        ...(checkInTime && { checkInTime }),
        ...(checkOutTime && { checkOutTime }),
        ...(cancellationPolicy !== undefined && { cancellationPolicy }),
        ...(childrenPolicy !== undefined && { childrenPolicy }),
        ...(petsPolicy !== undefined && { petsPolicy }),
        ...(smokingPolicy !== undefined && { smokingPolicy }),
        ...(extraInfo !== undefined && { extraInfo }),
      },
    });

    res.json({ 
      message: "Policy updated successfully",
      success: true,
      data: updatedPolicy 
    });
  }),
};
