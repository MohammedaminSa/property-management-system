-- Add missing columns to PropertyImage table
ALTER TABLE "PropertyImage" ADD COLUMN "category" TEXT NOT NULL DEFAULT 'property';

-- Add missing category rating columns to Review table
ALTER TABLE "Review" ADD COLUMN "serviceRating" INTEGER;
ALTER TABLE "Review" ADD COLUMN "cleanlinessRating" INTEGER;
ALTER TABLE "Review" ADD COLUMN "locationRating" INTEGER;
ALTER TABLE "Review" ADD COLUMN "facilitiesRating" INTEGER;
ALTER TABLE "Review" ADD COLUMN "staffRating" INTEGER;
ALTER TABLE "Review" ADD COLUMN "valueRating" INTEGER;
