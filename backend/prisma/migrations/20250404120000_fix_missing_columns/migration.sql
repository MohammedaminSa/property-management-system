-- Add missing columns to PropertyImage table (idempotent)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='PropertyImage' AND column_name='category') THEN
        ALTER TABLE "PropertyImage" ADD COLUMN "category" TEXT NOT NULL DEFAULT 'property';
    END IF;
END $$;

-- Add missing category rating columns to Review table (idempotent)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='Review' AND column_name='serviceRating') THEN
        ALTER TABLE "Review" ADD COLUMN "serviceRating" INTEGER;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='Review' AND column_name='cleanlinessRating') THEN
        ALTER TABLE "Review" ADD COLUMN "cleanlinessRating" INTEGER;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='Review' AND column_name='locationRating') THEN
        ALTER TABLE "Review" ADD COLUMN "locationRating" INTEGER;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='Review' AND column_name='facilitiesRating') THEN
        ALTER TABLE "Review" ADD COLUMN "facilitiesRating" INTEGER;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='Review' AND column_name='staffRating') THEN
        ALTER TABLE "Review" ADD COLUMN "staffRating" INTEGER;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='Review' AND column_name='valueRating') THEN
        ALTER TABLE "Review" ADD COLUMN "valueRating" INTEGER;
    END IF;
END $$;
