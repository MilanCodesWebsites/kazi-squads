-- 1. Update contracts table to support payment_pending status
alter table public.contracts drop constraint if exists contracts_status_check;
alter table public.contracts add constraint contracts_status_check check (status in ('payment_pending', 'active', 'completed', 'cancelled'));

-- 2. Add Squad transaction tracking fields
alter table public.contracts add column if not exists squad_payment_ref text unique;
alter table public.contracts add column if not exists squad_transaction_ref text;

-- 3. Create generic notifications table for dashboard alerts
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id text not null, -- This will hold client_profile_id or worker_onboarding_id
  message text not null,
  type text,
  is_read boolean default false,
  created_at timestamptz default now()
);

create index if not exists notifications_user_id_idx on public.notifications (user_id);
create index if not exists notifications_created_at_idx on public.notifications (created_at desc);
