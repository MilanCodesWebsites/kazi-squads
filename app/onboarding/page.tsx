import { redirect } from 'next/navigation'

type SearchParams = {
  role?: string
}

export default function LegacyOnboardingPage({
  searchParams,
}: {
  searchParams?: SearchParams
}) {
  const role = searchParams?.role

  if (role === 'client') {
    redirect('/dashboard/onboarding/client')
  }

  // Default to freelancer onboarding.
  redirect('/dashboard/onboarding/freelancer')
}
