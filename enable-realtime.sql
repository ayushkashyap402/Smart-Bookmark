-- Enable realtime for bookmarks table
alter publication supabase_realtime add table bookmarks;

-- Verify it's enabled
select * from pg_publication_tables where pubname = 'supabase_realtime';
