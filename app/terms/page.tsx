import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service — Kazi',
  description: 'Kazi Terms of Service and User Agreement.',
}

export default function TermsPage() {
  return (
    <main className="min-h-dvh bg-white">
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 md:px-8">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Kazi.
          </Link>
        </div>
      </header>

      <article className="prose prose-neutral mx-auto max-w-3xl px-4 py-12 md:px-8 md:py-16">
        <h1>Terms of Service</h1>
        <p className="text-muted-foreground">Last updated: May 14, 2026</p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using the Kazi platform (&quot;Service&quot;), you agree to be bound by these Terms of Service
          (&quot;Terms&quot;). If you do not agree, you may not use the Service.
        </p>

        <h2>2. Description of Service</h2>
        <p>
          Kazi is an AI-matched hiring platform that connects skilled workers (&quot;Freelancers&quot;) with clients
          (&quot;Clients&quot;) across Nigeria. Our platform facilitates job posting, bidding, contract management,
          and payment processing.
        </p>

        <h2>3. User Accounts</h2>
        <p>
          You must create an account to use the Service. You are responsible for maintaining the confidentiality of your
          account credentials. You agree to provide accurate and current information during registration.
        </p>

        <h2>4. User Obligations</h2>
        <h3>For Freelancers</h3>
        <ul>
          <li>Provide accurate information about your skills, experience, and qualifications.</li>
          <li>Deliver work as agreed upon in accepted contracts.</li>
          <li>Communicate promptly and professionally with clients.</li>
          <li>Comply with all applicable Nigerian labour laws and regulations.</li>
        </ul>

        <h3>For Clients</h3>
        <ul>
          <li>Provide clear and accurate job descriptions.</li>
          <li>Make timely payments as agreed in contracts.</li>
          <li>Communicate project requirements and feedback clearly.</li>
          <li>Respect freelancers&apos; rights and professional boundaries.</li>
        </ul>

        <h2>5. Payments</h2>
        <p>
          All payments on the Kazi platform are processed in Nigerian Naira (₦) through our integrated payment
          provider, Squads. Kazi may charge service fees for platform usage. Fee schedules are available on the
          platform and may be updated from time to time.
        </p>

        <h2>6. Intellectual Property</h2>
        <p>
          Unless otherwise agreed in writing, upon full payment for completed work, the client receives ownership
          of the deliverables produced under the contract. Freelancers retain the right to display completed work
          in their portfolio.
        </p>

        <h2>7. Prohibited Conduct</h2>
        <ul>
          <li>Circumventing the Kazi platform for direct payments.</li>
          <li>Submitting false or misleading information.</li>
          <li>Harassment, discrimination, or abusive behaviour.</li>
          <li>Using the platform for any unlawful purpose.</li>
          <li>Attempting to interfere with the platform&apos;s operation.</li>
        </ul>

        <h2>8. Dispute Resolution</h2>
        <p>
          Kazi provides mediation services for disputes between freelancers and clients. If mediation fails,
          disputes will be resolved under the laws of the Federal Republic of Nigeria.
        </p>

        <h2>9. Limitation of Liability</h2>
        <p>
          Kazi is a marketplace platform and is not a party to contracts between freelancers and clients.
          We are not liable for the quality of work, missed deadlines, or disputes between users.
        </p>

        <h2>10. Termination</h2>
        <p>
          Kazi reserves the right to suspend or terminate accounts that violate these Terms or engage in fraudulent
          activity. Users may delete their accounts at any time.
        </p>

        <h2>11. Changes to Terms</h2>
        <p>
          We may update these Terms from time to time. Continued use of the Service after changes constitutes
          acceptance of the revised Terms.
        </p>

        <h2>12. Contact</h2>
        <p>
          For questions about these Terms, please contact us at{' '}
          <a href="mailto:legal@kazi.ng">legal@kazi.ng</a>.
        </p>

        <hr />

        <p className="text-sm text-muted-foreground">
          See also: <Link href="/privacy">Privacy Policy</Link>
        </p>
      </article>
    </main>
  )
}
