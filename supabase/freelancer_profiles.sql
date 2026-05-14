-- Comprehensive Freelancer Profile Schema for Kazi
-- Run in Supabase SQL editor.

create table if not exists public.freelancer_profiles (
  id uuid primary key default gen_random_uuid(),
  
  -- Auth linking
  auth_provider text not null check (auth_provider in ('nextauth', 'supabase')),
  nextauth_user_id uuid unique null,
  supabase_user_id uuid unique null,
  
  -- Step 1: Work Category
  category text null,
  specialties text[] null default '{}',
  
  -- Step 2 & 3: Skills and Title
  skills text[] null default '{}',
  title text null,
  
  -- Step 7: Bio
  bio text null,
  
  -- Step 8: Rate
  hourly_rate_naira integer null,
  
  -- Step 9: Location & Details
  city text null,
  state text null,
  phone_number text null,
  photo_url text null,
  
  -- Submission status
  is_published boolean not null default false,
  
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trigger for updated_at
drop trigger if exists set_freelancer_profiles_updated_at on public.freelancer_profiles;
create trigger set_freelancer_profiles_updated_at
before update on public.freelancer_profiles
for each row
execute function public.set_updated_at();

-- Work Experience
create table if not exists public.freelancer_experiences (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.freelancer_profiles(id) on delete cascade,
  title text not null,
  company text not null,
  city text null,
  country text null,
  start_month text null,
  start_year text null,
  end_month text null,
  end_year text null,
  is_current boolean not null default false,
  description text null,
  created_at timestamptz not null default now()
);

-- Education
create table if not exists public.freelancer_education (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.freelancer_profiles(id) on delete cascade,
  school text not null,
  degree text null,
  field_of_study text null,
  start_year text null,
  end_year text null,
  description text null,
  created_at timestamptz not null default now()
);

-- Languages
create table if not exists public.freelancer_languages (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.freelancer_profiles(id) on delete cascade,
  language text not null,
  proficiency text not null,
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists freelancer_profiles_nextauth_idx on public.freelancer_profiles (nextauth_user_id);
create index if not exists freelancer_profiles_supabase_idx on public.freelancer_profiles (supabase_user_id);
create index if not exists freelancer_experiences_profile_idx on public.freelancer_experiences (profile_id);
create index if not exists freelancer_education_profile_idx on public.freelancer_education (profile_id);
create index if not exists freelancer_languages_profile_idx on public.freelancer_languages (profile_id);
