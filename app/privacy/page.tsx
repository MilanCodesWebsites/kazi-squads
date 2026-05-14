import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy — Kazi',
  description: 'Kazi Privacy Policy. How we collect, use, and protect your data.',
}

export default function PrivacyPage() {
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
        <h1>Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: May 14, 2026</p>

        <h2>1. Information We Collect</h2>
        <h3>Account Information</h3>
        <p>
          When you create a Kazi account, we collect your name, email address, and profile picture from your
          Google account. If you sign up as a freelancer, we also collect your job title, skills, location,
          work preferences, and bank details for payment processing.
        </p>

        <h3>Usage Data</h3>
        <p>
          We automatically collect information about how you interact with the platform, including pages visited,
          features used, and device information. We use Vercel Analytics for this purpose.
        </p>

        <h3>Payment Information</h3>
        <p>
          Payment processing is handled by Paystack. We store transaction records (amounts, dates, statuses)
          but do not directly store your card details or full bank credentials.
        </p>

        <h2>2. How We Use Your Information</h2>
        <ul>
          <li>To create and manage your account.</li>
          <li>To match freelancers with relevant job opportunities using AI.</li>
          <li>To process payments and maintain transaction records.</li>
          <li>To communicate with you about your account, jobs, and platform updates.</li>
          <li>To improve our platform and develop new features.</li>
          <li>To prevent fraud and ensure platform security.</li>
        </ul>

        <h2>3. Information Sharing</h2>
        <p>We do not sell your personal information. We may share your information with:</p>
        <ul>
          <li>
            <strong>Other Kazi users</strong> — Your public profile information is visible to clients when you
            apply for jobs or list services.
          </li>
          <li>
            <strong>Payment providers</strong> — Paystack processes your payment information securely.
          </li>
          <li>
            <strong>Service providers</strong> — We use Supabase for data storage and Vercel for hosting.
          </li>
          <li>
            <strong>Legal requirements</strong> — We may disclose information when required by Nigerian law.
          </li>
        </ul>

        <h2>4. Data Security</h2>
        <p>
          We implement industry-standard security measures to protect your personal information, including
          encryption in transit (HTTPS), secure database access controls, and regular security reviews.
        </p>

        <h2>5. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access your personal information stored on Kazi.</li>
          <li>Update or correct inaccurate information.</li>
          <li>Delete your account and associated data.</li>
          <li>Opt out of marketing communications.</li>
          <li>Request a copy of your data in a portable format.</li>
        </ul>

        <h2>6. Data Retention</h2>
        <p>
          We retain your account information for as long as your account is active. Transaction records are
          retained for a minimum of 6 years in compliance with Nigerian financial regulations. You may request
          deletion of your account at any time.
        </p>

        <h2>7. Cookies</h2>
        <p>
          We use essential cookies for authentication and session management. We use Vercel Analytics for
          anonymous usage tracking. You can control cookie settings in your browser.
        </p>

        <h2>8. Children&apos;s Privacy</h2>
        <p>
          Kazi is not intended for users under 18 years of age. We do not knowingly collect information
          from children.
        </p>

        <h2>9. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of significant changes
          via email or platform notification.
        </p>

        <h2>10. Contact</h2>
        <p>
          For privacy-related questions or requests, contact us at{' '}
          <a href="mailto:privacy@kazi.ng">privacy@kazi.ng</a>.
        </p>

        <hr />

        <p className="text-sm text-muted-foreground">
          See also: <Link href="/terms">Terms of Service</Link>
        </p>
      </article>
    </main>
  )
}
