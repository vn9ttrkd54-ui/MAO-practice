-- MAO Practice: Multiplayer Pack M4 guest nickname rules

begin;

alter table public.multiplayer_players
  drop constraint multiplayer_players_guest_nickname_format;

alter table public.multiplayer_players
  add constraint multiplayer_players_guest_nickname_format check (
    guest_nickname is null
    or (
      guest_nickname = btrim(guest_nickname)
      and char_length(guest_nickname) between 1 and 20
    )
  );

-- The existing room-scoped, case-insensitive unique index continues to prevent
-- two guests in the same room from choosing the same nickname.

commit;
