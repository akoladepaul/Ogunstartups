-- Create storage buckets
insert into storage.buckets (id, name, public) values
  ('startup-logos', 'startup-logos', true),
  ('startup-covers', 'startup-covers', true),
  ('org-logos', 'org-logos', true),
  ('product-images', 'product-images', true),
  ('avatars', 'avatars', true);

-- Storage RLS: authenticated users can upload to any bucket
create policy "storage_upload_auth"
  on storage.objects for insert
  with check (
    auth.role() = 'authenticated'
  );

-- Users manage only their own objects (path starts with their user ID)
create policy "storage_manage_own"
  on storage.objects for all
  using (
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Public read for all buckets
create policy "storage_public_read"
  on storage.objects for select
  using (true);
