-- Kazi Complete Schema
-- Run in Supabase SQL editor to set up the database.

-- 1. Updated-at helper function
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- 2. Users
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text,
  role text check (role in ('worker', 'client')) not null,
  avatar_url text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

drop trigger if exists set_users_updated_at on users;
create trigger set_users_updated_at before update on users for each row execute function set_updated_at();

-- 3. Worker Profiles
create table if not exists worker_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  title text,
  bio text,
  skills text[],
  location_state text,
  location_city text,
  work_preference text check (work_preference in ('remote', 'onsite', 'both')),
  availability text check (availability in ('full-time', 'part-time', 'weekends')),
  min_rate numeric,
  years_experience text,
  bank_name text,
  account_number text,
  trust_score integer default 0,
  profile_views integer default 0,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

drop trigger if exists set_worker_profiles_updated_at on worker_profiles;
create trigger set_worker_profiles_updated_at before update on worker_profiles for each row execute function set_updated_at();

-- 4. Portfolio Links
create table if not exists portfolio_links (
  id uuid primary key default gen_random_uuid(),
  worker_id uuid references worker_profiles(id) on delete cascade,
  label text,
  url text,
  created_at timestamp default now()
);

-- 5. Jobs
create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references users(id) on delete cascade,
  title text not null,
  description text not null,
  category text not null,
  budget_min numeric,
  budget_max numeric,
  is_negotiable boolean default false,
  location_preference text check (location_preference in ('remote', 'onsite', 'both')),
  location_city text,
  deadline date,
  is_urgent boolean default false,
  status text default 'open' check (status in ('open', 'in_review', 'closed')),
  created_at timestamp default now(),
  updated_at timestamp default now()
);

drop trigger if exists set_jobs_updated_at on jobs;
create trigger set_jobs_updated_at before update on jobs for each row execute function set_updated_at();

-- 6. Applications (Bids)
create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references jobs(id) on delete cascade,
  worker_id uuid references users(id) on delete cascade,
  cover_letter text not null,
  proposed_rate numeric not null,
  estimated_delivery text not null,
  status text default 'pending' check (status in ('pending', 'viewed', 'accepted', 'rejected')),
  created_at timestamp default now(),
  updated_at timestamp default now()
);

drop trigger if exists set_applications_updated_at on applications;
create trigger set_applications_updated_at before update on applications for each row execute function set_updated_at();

-- 7. Application Portfolio Links
create table if not exists application_links (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references applications(id) on delete cascade,
  label text,
  url text
);

-- 8. Contracts
create table if not exists contracts (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references jobs(id),
  application_id uuid references applications(id),
  client_id uuid references users(id),
  worker_id uuid references users(id),
  amount numeric not null,
  status text default 'payment_pending' check (status in ('payment_pending', 'active', 'delivered', 'completed', 'disputed')),
  squad_payment_ref text unique,
  squad_transaction_ref text,
  delivered_at timestamp,
  completed_at timestamp,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

drop trigger if exists set_contracts_updated_at on contracts;
create trigger set_contracts_updated_at before update on contracts for each row execute function set_updated_at();

-- 9. Reviews
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid references contracts(id),
  reviewer_id uuid references users(id),
  reviewee_id uuid references users(id),
  rating integer check (rating between 1 and 5),
  comment text,
  created_at timestamp default now()
);

-- 10. Notifications
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  message text not null,
  type text,
  is_read boolean default false,
  created_at timestamp default now()
);
