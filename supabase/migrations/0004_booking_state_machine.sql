-- Herfati DZ: booking state machine and abuse-resistant write paths
-- Apply after 0003_auth_profile_lifecycle.sql.

create or replace function public.transition_booking(p_booking_id uuid, p_next public.booking_status)
returns public.bookings
language plpgsql
security definer
set search_path = public
as $$
declare
  current public.bookings;
  allowed boolean := false;
begin
  select * into current from public.bookings where id = p_booking_id for update;
  if current.id is null then raise exception 'booking not found'; end if;

  if auth.uid() = current.customer_user_id then
    allowed := (current.status = 'pending' and p_next = 'cancelled')
      or (current.status = 'accepted' and p_next = 'cancelled');
  elsif auth.uid() = current.artisan_user_id then
    allowed := (current.status = 'pending' and p_next in ('accepted','rejected'))
      or (current.status = 'accepted' and p_next in ('in_progress','cancelled'))
      or (current.status = 'in_progress' and p_next = 'completed');
  end if;

  if not allowed then raise exception 'invalid booking transition'; end if;

  update public.bookings
  set status = p_next, updated_at = now()
  where id = current.id
  returning * into current;

  return current;
end;
$$;

revoke all on function public.transition_booking(uuid, public.booking_status) from public;
grant execute on function public.transition_booking(uuid, public.booking_status) to authenticated;

drop policy if exists "customers update own bookings" on public.bookings;
drop policy if exists "artisans update assigned bookings" on public.bookings;

-- All booking status changes must go through the transition function.
revoke update on public.bookings from anon, authenticated;

create or replace function public.submit_review(
  p_booking_id uuid,
  p_rating integer,
  p_comment text
)
returns public.reviews
language plpgsql
security definer
set search_path = public
as $$
declare
  b public.bookings;
  r public.reviews;
begin
  select * into b from public.bookings
  where id = p_booking_id and customer_user_id = auth.uid() and status = 'completed';

  if b.id is null then raise exception 'review requires completed owned booking'; end if;
  if exists (select 1 from public.reviews where booking_id = p_booking_id) then
    raise exception 'booking already reviewed';
  end if;
  if p_rating < 1 or p_rating > 5 then raise exception 'rating must be between 1 and 5'; end if;

  insert into public.reviews (booking_id, customer_user_id, artisan_user_id, rating, comment, status)
  values (b.id, auth.uid(), b.artisan_user_id, p_rating, left(trim(coalesce(p_comment,'')),2000), 'pending')
  returning * into r;
  return r;
end;
$$;

revoke insert on public.reviews from anon, authenticated;
grant execute on function public.submit_review(uuid, integer, text) to authenticated;

create index if not exists bookings_customer_status_idx on public.bookings(customer_user_id, status);
create index if not exists bookings_artisan_status_idx on public.bookings(artisan_user_id, status);
