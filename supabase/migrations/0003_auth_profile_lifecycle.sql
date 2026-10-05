-- Herfati DZ: Supabase Auth/profile lifecycle hardening
-- Apply after 0002_security_hardening.sql.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  display_name_value text;
begin
  display_name_value := nullif(trim(coalesce(new.raw_user_meta_data ->> 'display_name', '')), '');
  insert into public.profiles (id, role, display_name)
  values (new.id, 'customer', coalesce(display_name_value, split_part(coalesce(new.email, 'user'), '@', 1)));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

comment on function public.handle_new_user() is
'Creates a least-privilege customer profile for every new Supabase Auth user. Role escalation is server-managed.';
