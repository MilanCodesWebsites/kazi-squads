-- Client profiles + jobs schema for Kazi
-- Run in Supabase SQL editor.

-- Updated-at helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Client profile
create table if not exists public.client_profiles (
  id uuid primary key defaualt gen_random_uuid(),

  -- Who owns this profile
  auth_provider text not null check (auth_provider in ('nextauth', 'supabase')),
  nextauth_user_id uuid unique,
  supabase_user_id uuid unique,

  -- Client details
  full_name text,
  email text,
  company_name text not null,
  website text,
  org_size text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_client_profiles_updated_at on public.client_profiles;
create trigger set_client_profiles_updated_at
before update on public.client_profiles
for each row
execute function public.set_updated_at();

create index if not exists client_profiles_created_at_idx on public.client_profiles (created_at desc);
create index if not exists client_profiles_nextauth_user_id_idx on public.client_profiles (nextauth_user_id);
create index if not exists client_profiles_supabase_user_id_idx on public.client_profiles (supabase_user_id);

-- Jobs
create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),

  client_profile_id uuid not null references public.client_profiles(id) on delete cascade,

  title text not null,
  category text not null,
  description text not null,

  status text not null default 'open' check (status in ('open', 'closed')),

  -- Budget (naira)
  budget_mode text not null default 'fixed' check (budget_mode in ('fixed', 'range')),
  budget_fixed_naira integer,
  budget_min_naira integer,
  budget_max_naira integer,
  open_to_negotiation boolean not null default false,

  -- Location preference
  location_preference text not null default 'remote' check (location_preference in ('remote', 'onsite', 'both')),
  city text,

  -- Timeline
  due_date date,
  asap boolean not null default false,

  -- AI assist (optional)
  created_with_ai boolean not null default false,
  ai_prompt text,

  posted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_jobs_updated_at on public.jobs;
create trigger set_jobs_updated_at
before update on public.jobs
for each row
execute function public.set_updated_at();

create index if not exists jobs_client_profile_id_idx on public.jobs (client_profile_id);
create index if not exists jobs_status_idx on public.jobs (status);
create index if not exists jobs_posted_at_idx on public.jobs (posted_at desc);

-- Client activity feed (optional but used by dashboard "Recent Activity")
create table if not exists public.client_activity (
  id uuid primary key default gen_random_uuid(),
  client_profile_id uuid not null references public.client_profiles(id) on delete cascade,
  type text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists client_activity_client_profile_id_idx on public.client_activity (client_profile_id);
create index if not exists client_activity_created_at_idx on public.client_activity (created_at desc);

-- Job bids (optional but used by dashboard "Open Bids")
create table if not exists public.job_bids (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  worker_onboarding_id uuid references public.worker_onboarding(id) on delete set null,
  bid_amount_naira integer,
  message text,
  status text not null default 'open' check (status in ('open', 'accepted', 'rejected', 'withdrawn')),
  created_at timestamptz not null default now()
);

create index if not exists job_bids_job_id_idx on public.job_bids (job_id);
create index if not exists job_bids_status_idx on public.job_bids (status);

-- Contracts (optional but used by dashboard "Contracts" tab)
create table if not exists public.contracts (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  worker_onboarding_id uuid references public.worker_onboarding(id) on delete set null,
  amount_naira integer not null,
  status text not null default 'active' check (status in ('active', 'completed', 'cancelled')),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists contracts_job_id_idx on public.contracts (job_id);
create index if not exists contracts_status_idx on public.contracts (status);

-- Payments (optional but used by profile "Payment History")
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  client_profile_id uuid not null references public.client_profiles(id) on delete cascade,
  job_id uuid references public.jobs(id) on delete set null,
  amount_naira integer not null,
  status text not null default 'confirmed' check (status in ('pending', 'confirmed', 'failed', 'refunded')),
  paid_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists payments_client_profile_id_idx on public.payments (client_profile_id);
create index if not exists payments_paid_at_idx on public.payments (paid_at desc);
