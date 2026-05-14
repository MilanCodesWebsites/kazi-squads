# Kazi

Work, matched by AI, paid by Squad.

Kazi is a Nigerian freelance marketplace that connects skilled informal workers with clients. Workers build a verified profile, AI matches them to relevant jobs, and payments flow through Squad escrow. Money moves only when work is done.

---

## what it does

- workers onboard with a guided profile setup flow
- clients post jobs in under 2 minutes
- Gemini AI matches workers to jobs based on skills, location, and context
- clients pay via Squad checkout into escrow
- Squad webhooks confirm payment and activate contracts
- workers mark jobs as delivered, clients approve
- Squad transfer API pays workers directly to their Nigerian bank account
- Kazi takes a 10% platform fee on every completed transaction

---

## tech stack

- **frontend/backend** - Next.js 14 (app router) on Vercel
- **database** - Supabase (PostgreSQL + RLS)
- **auth** - Supabase Auth (Google OAuth)
- **AI** - Gemini API (profile enrichment + job matching)
- **payments** - Squad API (checkout, webhooks, transfers)
- **email** - Resend

---

## getting started

### prerequisites

- Node.js 18+
- A Supabase project
- Squad sandbox account
- Gemini API key
- Resend account

### installation

```bash
git clone https://github.com/yourusername/kazi
cd kazi
npm install
```

### environment variables

create a `.env.local` file in the root:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

GEMINI_API_KEY=

SQUAD_SECRET_KEY=
SQUAD_PUBLIC_KEY=
SQUAD_WEBHOOK_SECRET=

RESEND_API_KEY=

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### database setup

run the SQL schema in your Supabase SQL editor:

```sql
-- users
create table users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text,
  role text check (role in ('worker', 'client')) not null,
  avatar_url text,
  created_at timestamp default now()
);

-- worker profiles
create table worker_profiles (
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
  created_at timestamp default now()
);

-- portfolio links
create table portfolio_links (
  id uuid primary key default gen_random_uuid(),
  worker_id uuid references worker_profiles(id) on delete cascade,
  label text,
  url text,
  created_at timestamp default now()
);

-- jobs
create table jobs (
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
  created_at timestamp default now()
);

-- applications
create table applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references jobs(id) on delete cascade,
  worker_id uuid references users(id) on delete cascade,
  cover_letter text not null,
  proposed_rate numeric not null,
  estimated_delivery text not null,
  status text default 'pending' check (status in ('pending', 'viewed', 'accepted', 'rejected')),
  created_at timestamp default now()
);

-- application portfolio links
create table application_links (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references applications(id) on delete cascade,
  label text,
  url text
);

-- contracts
create table contracts (
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
  created_at timestamp default now()
);

-- reviews
create table reviews (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid references contracts(id),
  reviewer_id uuid references users(id),
  reviewee_id uuid references users(id),
  rating integer check (rating between 1 and 5),
  comment text,
  created_at timestamp default now()
);

-- notifications
create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  message text not null,
  type text,
  is_read boolean default false,
  created_at timestamp default now()
);
```

### run locally

```bash
npm run dev
```

open [http://localhost:3000](http://localhost:3000)

---

## project structure

```
kazi/
├── app/
│   ├── page.tsx                  # landing page
│   ├── auth/                     # google auth callback
│   ├── onboarding/               # role selection + initial setup
│   ├── profile-setup/            # worker profile setup flow
│   ├── dashboard/                # worker + client dashboards
│   ├── jobs/                     # job listings + job detail
│   └── api/
│       ├── match/                # Gemini job matching
│       ├── checkout/             # Squad payment link creation
│       ├── webhook/              # Squad webhook handler
│       └── transfer/             # Squad payout to worker
├── components/
├── lib/
│   ├── supabase.ts
│   ├── gemini.ts
│   └── squad.ts
└── types/
```

---

## payment flow

```
client accepts bid
→ POST /api/checkout (creates Squad payment link)
→ client pays via Squad checkout
→ Squad fires webhook to POST /api/webhook
→ webhook verifies Squad signature
→ contract status flips to 'active'
→ worker delivers, client approves
→ POST /api/transfer (Squad pays worker bank account)
→ Kazi deducts 10% before transfer
→ contract status flips to 'completed'
```

---

## AI matching

when a job is posted, `/api/match` is called with the job description and all available worker profiles. Gemini scores compatibility based on skills, location, work preference, and experience. workers see jobs ranked by relevance. clients see the most suitable applicants surfaced first.

---

## squad API integration

kazi uses three Squad APIs:

| API | purpose |
|-----|---------|
| Checkout | generate payment links for contracts |
| Webhook | confirm payment and activate contracts |
| Transfer | pay workers to Nigerian bank accounts |

---

## deployment

the app deploys to Vercel. connect your repo and add all environment variables in the Vercel dashboard.

make sure your Squad webhook URL is set to:
```
https://your-domain.vercel.app/api/webhook
```

---

## built by

- **Izuehie Luckyprince Sochimaobi** - Team Lead, Lead Developer
- **Chife Chinonso** - Head of Operations
- **Ezekiel Iyeli** - Marketing Officer

built for Squad Hackathon 3.0 — Smart Systems: The Intelligent Economy
```
