-- ══════════════════════════════════════════════════════════════════
-- Storage Bucket Policies for packing-slips
-- Run this in Supabase Dashboard → SQL Editor
-- ══════════════════════════════════════════════════════════════════

-- Allow authenticated users to upload files
CREATE POLICY "Admin upload packing slips"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'packing-slips');

-- Allow authenticated users to update their uploads
CREATE POLICY "Admin update packing slips"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'packing-slips');

-- Allow anyone to view (public bucket)
CREATE POLICY "Public view packing slips"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'packing-slips');

-- Allow authenticated users to delete
CREATE POLICY "Admin delete packing slips"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'packing-slips');

-- ══════════════════════════════════════════════════════════════════
-- Same for dispatch-photos bucket (if it exists)
-- ══════════════════════════════════════════════════════════════════

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'dispatch-photos') THEN
    -- These will error if already exist, that's fine
    BEGIN
      INSERT INTO storage.objects SELECT; -- no-op, just trigger policy creation
    EXCEPTION WHEN OTHERS THEN NULL;
    END;
  END IF;
END $$;

CREATE POLICY "Admin upload dispatch photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'dispatch-photos');

CREATE POLICY "Public view dispatch photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'dispatch-photos');

CREATE POLICY "Admin delete dispatch photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'dispatch-photos');
