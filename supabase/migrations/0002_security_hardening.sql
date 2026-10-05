-- Herfati DZ: security hardening layer
-- Apply after 0001_initial.sql.

create or replace function public.prevent_profile_role_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role then
    if auth.uid() is not null and auth.uid() = old.id then
      raise exception 'profile role is server-managed';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_role_guard on public.profiles;
create trigger profiles_role_guard
before update on public.profiles
for each row execute function public.prevent_profile_role_change();

drop policy if exists "customer reviews completed booking" on public.reviews;
create policy "customer reviews completed booking"
on public.reviews for insert
with check (
  auth.uid() = customer_user_id
  and status = 'pending'
  and exists (
    select 1 from public.bookings b
    where b.id = booking_id
      and b.customer_user_id = auth.uid()
      and b.artisan_user_id = reviews.artisan_user_id
      and b.status = 'completed'
  )
);

revoke insert, update, delete on public.audit_events from anon, authenticated;
revoke update, delete on public.verification_cases from anon, authenticated;
revoke update, delete on public.reviews from anon, authenticated;

drop policy if exists "customers create bookings" on public.bookings;
create policy "customers create bookings"
on public.bookings for insert
with check (
  auth.uid() = customer_user_id
  and status = 'pending'
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists artisan_profiles_updated_at on public.artisan_profiles;
create trigger artisan_profiles_updated_at
before update on public.artisan_profiles
for each row execute function public.set_updated_at();

drop trigger if exists bookings_updated_at on public.bookings;
create trigger bookings_updated_at
before update on public.bookings
for each row execute function public.set_updated_at();

comment on table public.artisan_profiles is
'Public directory is restricted by RLS to verification_status=verified. Trust fields are server-managed.';
