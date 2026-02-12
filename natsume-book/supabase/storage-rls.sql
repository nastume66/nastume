-- Fix for image upload error:
-- new row violates row-level security policy (storage.objects)

-- 1) Ensure bucket exists (public bucket for blog images)
insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do nothing;

-- 2) Replace policies for this bucket
DROP POLICY IF EXISTS "blog images public read" ON storage.objects;
create policy "blog images public read"
on storage.objects
for select
to public
using (bucket_id = 'blog-images');

DROP POLICY IF EXISTS "blog images auth upload" ON storage.objects;
create policy "blog images auth upload"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'blog-images');

DROP POLICY IF EXISTS "blog images owner update" ON storage.objects;
create policy "blog images owner update"
on storage.objects
for update
to authenticated
using (bucket_id = 'blog-images' and owner = auth.uid())
with check (bucket_id = 'blog-images' and owner = auth.uid());

DROP POLICY IF EXISTS "blog images owner delete" ON storage.objects;
create policy "blog images owner delete"
on storage.objects
for delete
to authenticated
using (bucket_id = 'blog-images' and owner = auth.uid());
