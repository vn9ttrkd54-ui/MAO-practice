begin;
select cron.schedule(
  'multiplayer-room-cleanup',
  '* * * * *',
  'select public.cleanup_multiplayer_rooms()'
);
commit;
