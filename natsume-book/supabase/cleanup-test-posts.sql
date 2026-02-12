-- Delete the known historical test post(s) safely

delete from public.posts
where slug = 'supabase-test'
   or title = 'Supabase连通测试';
