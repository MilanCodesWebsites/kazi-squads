-- NextAuth schema for Supabase (Postgres)
-- Run this in the Supabase SQL editor.
--
-- IMPORTANT:
-- Your installed @next-auth/supabase-adapter hardcodes the Postgres schema name "next_auth".
-- If you create tables in "public", Google OAuth callback will fail with:
--   "Invalid schema: next_auth"

-- Create the schema the adapter expects
create schema if not exists next_auth;

-- Ensure the Supabase service role can access it
grant usage on schema next_auth to service_role;
grant all on schema next_auth to postgres;

-- Users
create table if not exists next_auth.users (
  id uuid not null default gen_random_uuid(),
  name text null,
  email text null,
  "emailVerified" timestamptz null,
  image text null,
  constraint users_pkey primary key (id),
  constraint users_email_key unique (email)
);

grant all on table next_auth.users to postgres;
grant all on table next_auth.users to service_role;

-- Sessions
create table if not exists next_auth.sessions (
  id uuid not null default gen_random_uuid(),
  expires timestamptz not null,
  "sessionToken" text not null,
  "userId" uuid null,
  constraint sessions_pkey primary key (id),
  constraint sessions_session_token_key unique ("sessionToken"),
  constraint sessions_user_id_fkey foreign key ("userId") references next_auth.users (id) on delete cascade
);

grant all on table next_auth.sessions to postgres;
grant all on table next_auth.sessions to service_role;

-- Accounts
create table if not exists next_auth.accounts (
  id uuid not null default gen_random_uuid(),
  type text not null,
  provider text not null,
  "providerAccountId" text not null,
  refresh_token text null,
  access_token text null,
  expires_at bigint null,
  token_type text null,
  scope text null,
  id_token text null,
  session_state text null,
  oauth_token_secret text null,
  oauth_token text null,
  "userId" uuid null,
  constraint accounts_pkey primary key (id),
  constraint accounts_provider_provider_account_id_key unique (provider, "providerAccountId"),
  constraint accounts_user_id_fkey foreign key ("userId") references next_auth.users (id) on delete cascade
);

create index if not exists accounts_user_id_idx on next_auth.accounts ("userId");

grant all on table next_auth.accounts to postgres;
grant all on table next_auth.accounts to service_role;

-- Verification tokens (only needed if you later add NextAuth Email provider)
create table if not exists next_auth.verification_tokens (
  identifier text null,
  token text not null,
  expires timestamptz not null,
  constraint verification_tokens_pkey primary key (token),
  constraint verification_tokens_identifier_token_key unique (identifier, token)
);

grant all on table next_auth.verification_tokens to postgres;
grant all on table next_auth.verification_tokens to service_role;

-- NOTE (optional migration):
-- If you previously created NextAuth tables in "public" (public.users/public.accounts/etc),
-- you can leave them in place, or migrate data across manually.
