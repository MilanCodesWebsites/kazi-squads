-- Worker onboarding table for Kazi
-- Run in Supabase SQL editor.

create table if not exists public.worker_onboarding (
  id uuid primary key default gen_random_uuid(),

  -- Who submitted
  auth_provider text not null check (auth_provider in ('nextauth', 'supabase')),
  nextauth_user_id uuid null,
  supabase_user_id uuid null,

  -- Collected data
  first_name text null,
  last_name text null,
  job_title text not null,
  skills text[] not null default '{}',
  experience text not null,
  state text not null,
  city text not null,
  work_preference text not null,
  availability text not null,
  minimum_rate_naira integer not null,
  bio text not null,
  bank_name text not null,
  bank_code text not null,
  account_number text not null,
  account_name text null,
  role text null,

  created_at timestamptz not null default now()
);

create index if not exists worker_onboarding_created_at_idx on public.worker_onboarding (created_at desc);
create index if not exists worker_onboarding_supabase_user_id_idx on public.worker_onboarding (supabase_user_id);
create index if not exists worker_onboarding_nextauth_user_id_idx on public.worker_onboarding (nextauth_user_id);
