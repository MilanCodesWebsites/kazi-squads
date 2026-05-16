# kazi.

kazi is an ai-powered, fully end-to-end freelance marketplace built specifically for the nigerian informal economy. it connects skilled workers with clients looking to hire, ensuring that talent is discovered, jobs are completed, and payments are secured.

## the stack
- **frontend:** next.js (app router), react, tailwind css
- **backend:** next.js server actions & api routes
- **database & auth:** supabase
- **ai matching & generation:** google gemini ai (gemini-3.1-flash-lite)
- **payments & escrow:** squad api & paystack (bank resolution)

## core features

### 1. dual-sided onboarding
- users can easily sign up via google oauth or email/password.
- **client flow:** businesses can set up their company profile, providing details about what they do and who they are looking to hire.
- **worker flow:** freelancers go through a multi-step onboarding wizard to define their skills, location, experience level, availability, hourly rates, and bank account details for direct payout.

### 2. job posting & management
- clients can post jobs with specific requirements, fixed budgets or negotiable ranges, required skills, and location preferences (remote or on-site).
- jobs go live instantly and are broadcasted to matching freelancers on the platform.

### 3. ai-powered job matching
- powered by google gemini ai, kazi analyzes every worker's profile (skills, location, experience, bio) against all open job postings.
- the ai ranks the jobs and assigns a "match score" (e.g. 94% match) along with a one-sentence reason why the job is a good fit.
- workers see the most relevant opportunities the moment they log in, eliminating endless searching and scrolling.

### 4. ai cover letter assistant
- applying for a job shouldn't be a chore. when a worker finds a matching job, they can click "write with ai ✦".
- gemini ai instantly drafts a warm, professional, human-sounding cover letter that highlights the worker's specific skills relevant to that exact job description.
- it's fully editable before submission.

### 5. integrated escrow payments (squad)
- trust is the biggest hurdle in freelancing. kazi solves this with built-in escrow.
- when a client accepts a worker's bid, they click "accept & pay". this redirects them to a squad checkout page to deposit the contract amount.
- the funds are held safely in escrow. kazi uses squad webhooks to instantly verify the payment and automatically activate the contract so the freelancer can begin working.

### 6. automated payouts (paystack & squad)
- when the job is completed and approved, the client clicks "mark as complete".
- the platform automatically calculates the 10% platform fee and instantly initiates a direct bank transfer of the remaining 90% to the freelancer's registered nigerian bank account.
- no digital wallets, no manual withdrawals, no delays.

### 7. real-time notifications
- both clients and freelancers have a notification bell in their dashboard that updates them on the status of their jobs, bids, contracts, and payments in real time.

## how to run locally

1. clone the repository.
2. run `pnpm install` to install dependencies.
3. duplicate `.env.example` to `.env` and fill in your keys:
   - `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GEMINI_API_KEY`
   - `SQUAD_SECRET_KEY` and `SQUAD_PUBLIC_KEY`
   - `PAYSTACK_SECRET_KEY`
4. run `pnpm dev` to start the local development server on `localhost:3000`.

## the vision
kazi isn't just a job board. it's a trust infrastructure. by combining ai discovery with secure escrow payments, kazi empowers nigerian freelancers to focus on what they do best—delivering great work—while clients get exactly what they paid for without the headache of whatsapp negotiations.
