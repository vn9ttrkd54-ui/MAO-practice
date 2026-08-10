-- Mathematics Daily: make Auth dashboard users identifiable by username.

update auth.users as users
set raw_user_meta_data = coalesce(users.raw_user_meta_data, '{}'::jsonb)
  || jsonb_build_object(
    'username', profiles.username,
    'display_name', profiles.username,
    'full_name', profiles.username
  )
from public.profiles as profiles
where profiles.id = users.id
  and (
    users.raw_user_meta_data ->> 'username' is distinct from profiles.username
    or users.raw_user_meta_data ->> 'display_name' is distinct from profiles.username
    or users.raw_user_meta_data ->> 'full_name' is distinct from profiles.username
  );
