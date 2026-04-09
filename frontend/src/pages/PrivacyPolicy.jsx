import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const SITE_NAME     = 'Travelyug';
const SITE_DOMAIN   = 'travelyug.in';
const CONTACT_EMAIL = 'infotravelyug@gmail.com';
const LAST_UPDATED  = 'April 2026';

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo({ top: 0 });
    document.title = `Privacy Policy | ${SITE_NAME}`;
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12">

        {/* Header */}
        <div className="border-b border-gray-200 pb-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-sm text-gray-500">Last updated: <strong>{LAST_UPDATED}</strong></p>
        </div>

        {/* 1. Introduction */}
        <Section title="1. Introduction">
          <p>
            Welcome to <strong>{SITE_NAME}</strong>. We operate the website{' '}
            <a href={`https://${SITE_DOMAIN}`} className="text-blue-600 hover:underline">{SITE_DOMAIN}</a>,
            which provides travel guides and itineraries for adventure travellers exploring Ladakh
            bike trips, Spiti Valley winter tours, and Northeast India journeys.
          </p>
          <p>
            This Privacy Policy explains what information we collect when you visit our website,
            how we use it, and what rights you have. By using our site, you agree to this policy.
          </p>
          <p>
            Questions? Email us at{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-blue-600 hover:underline">
              {CONTACT_EMAIL}
            </a>.
          </p>
        </Section>

        {/* 2. Information We Collect */}
        <Section title="2. Information We Collect">
          <h3 className="text-base font-semibold text-gray-800 mt-5 mb-2">
            2.1 Information You Provide
          </h3>
          <p>
            When you fill out a contact or booking form, you may provide your name, email
            address, phone number, and travel preferences. We use this only to respond to
            your inquiry. We never sell this information.
          </p>

          <h3 className="text-base font-semibold text-gray-800 mt-5 mb-2">
            2.2 Information Collected Automatically
          </h3>
          <p>
            Our servers automatically collect certain information when you visit, including:
          </p>
          <ul className="list-disc pl-6 space-y-1 my-3">
            <li>IP address</li>
            <li>Browser type and version</li>
            <li>Pages visited and time spent</li>
            <li>Date and time of visit</li>
            <li>Referring website</li>
            <li>Device and operating system</li>
          </ul>
          <p>
            This data is used only to analyse trends and improve our website. It is not
            linked to your personal identity.
          </p>

          <h3 className="text-base font-semibold text-gray-800 mt-5 mb-2">
            2.3 Cookies
          </h3>
          <p>
            We and our third-party partners use cookies to improve your experience and
            show relevant advertisements. See Section 5 for full details.
          </p>
        </Section>

        {/* 3. How We Use Information */}
        <Section title="3. How We Use Your Information">
          <ul className="list-disc pl-6 space-y-2 my-3">
            <li>
              <strong>To respond to your inquiries and bookings</strong> — we use your
              name and email to reply to you.
            </li>
            <li>
              <strong>To improve our website</strong> — log data helps us fix errors and
              understand which content is useful.
            </li>
            <li>
              <strong>To display advertisements</strong> — we use Google AdSense to show
              ads. Google uses cookies based on your browsing history. See Section 4.
            </li>
            <li>
              <strong>To comply with legal obligations</strong> — we may retain certain
              data as required by law.
            </li>
          </ul>
        </Section>

        {/* 4. Google AdSense */}
        <Section title="4. Google AdSense and Third-Party Advertising">
          <div className="bg-blue-50 border border-blue-200 border-l-4 border-l-blue-500 rounded-lg p-4 my-4 text-blue-900 text-sm">
            We may display advertisements on our site served by Google AdSense. These ads
            use cookies to show you relevant content based on your browsing behaviour.
          </div>

          <h3 className="text-base font-semibold text-gray-800 mt-5 mb-2">
            4.1 How Google AdSense Works
          </h3>
          <p>
            Google AdSense may place cookies on your browser to serve personalised ads
            based on your interests. Google uses the <strong>DoubleClick cookie</strong> to
            help manage ads across the web. This cookie does not contain personally
            identifiable information but helps Google recognise your browser.
          </p>

          <h3 className="text-base font-semibold text-gray-800 mt-5 mb-2">
            4.2 How to Opt Out of Personalised Ads
          </h3>
          <p>You can control interest-based advertising at any time:</p>
          <ul className="list-disc pl-6 space-y-2 my-3">
            <li>
              <a
                href="https://adssettings.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Google Ads Settings
              </a>{' '}
              — review and adjust your preferences
            </li>
            <li>
              <a
                href="https://optout.aboutads.info/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                aboutads.info
              </a>{' '}
              — opt out from participating advertisers
            </li>
            <li>
              <a
                href="https://optout.networkadvertising.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                networkadvertising.org
              </a>{' '}
              — additional opt-out options
            </li>
          </ul>
          <p>
            Opting out means ads will no longer be personalised to you, but you will still
            see ads.
          </p>

          <h3 className="text-base font-semibold text-gray-800 mt-5 mb-2">
            4.3 Google's Privacy Policy
          </h3>
          <p>
            For more details, see{' '}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Google's Privacy Policy
            </a>{' '}
            and{' '}
            <a
              href="https://policies.google.com/technologies/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              how Google uses ad data
            </a>.
          </p>
        </Section>

        {/* 5. Cookies */}
        <Section title="5. Cookies and Web Beacons">
          <p>We use the following types of cookies:</p>
          <div className="overflow-x-auto my-4 rounded-xl border border-gray-200">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-700 font-semibold">
                <tr>
                  <th className="px-4 py-3 border-b border-gray-200">Type</th>
                  <th className="px-4 py-3 border-b border-gray-200">Purpose</th>
                  <th className="px-4 py-3 border-b border-gray-200">Set By</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr className="border-b border-gray-100">
                  <td className="px-4 py-3 font-medium">Essential</td>
                  <td className="px-4 py-3">Required for the site to function</td>
                  <td className="px-4 py-3">Us</td>
                </tr>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <td className="px-4 py-3 font-medium">Analytics</td>
                  <td className="px-4 py-3">Understand how visitors use the site</td>
                  <td className="px-4 py-3">Google Analytics</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="px-4 py-3 font-medium">Advertising</td>
                  <td className="px-4 py-3">Serve relevant ads and track performance</td>
                  <td className="px-4 py-3">Google AdSense / DoubleClick</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Preferences</td>
                  <td className="px-4 py-3">Remember your settings across visits</td>
                  <td className="px-4 py-3">Us</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            You can delete or block cookies in your browser settings. Note that doing so
            may affect parts of our site. To manage cookies in your browser, visit the
            support page for{' '}
            <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Chrome</a>,{' '}
            <a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Firefox</a>, or{' '}
            <a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Safari</a>.
          </p>
        </Section>

        {/* 6. Third-Party */}
        <Section title="6. Third-Party Privacy Policies">
          <p>
            This policy does not apply to third-party websites we link to or integrate with.
            We encourage you to review their policies directly:
          </p>
          <ul className="list-disc pl-6 space-y-2 my-3">
            <li>
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Google (Analytics + AdSense)
              </a>
            </li>
            <li>
              <a href="https://cloudinary.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Cloudinary (image hosting)
              </a>
            </li>
            <li>
              <a href="https://www.mongodb.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                MongoDB Atlas (database)
              </a>
            </li>
            <li>
              <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Vercel (hosting)
              </a>
            </li>
          </ul>
        </Section>

        {/* 7. Data Sharing */}
        <Section title="7. Data Sharing">
          <p>
            We do not sell or rent your personal information. We may share it only in these
            limited situations:
          </p>
          <ul className="list-disc pl-6 space-y-2 my-3">
            <li>
              <strong>Service providers</strong> — trusted third parties who help us operate
              our site, under strict confidentiality.
            </li>
            <li>
              <strong>Legal requirements</strong> — if required by law or a court order.
            </li>
            <li>
              <strong>Business transfer</strong> — if our business is acquired, we will
              notify you before your data is transferred.
            </li>
          </ul>
        </Section>

        {/* 8. Data Retention */}
        <Section title="8. Data Retention">
          <ul className="list-disc pl-6 space-y-2 my-3">
            <li>Contact form submissions — kept for up to 2 years then deleted</li>
            <li>Booking inquiries — kept for the duration of the relationship plus 3 years</li>
            <li>Server logs — automatically deleted after 90 days</li>
          </ul>
          <p>
            You may request deletion at any time by emailing{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-blue-600 hover:underline">
              {CONTACT_EMAIL}
            </a>.
          </p>
        </Section>

        {/* 9. GDPR Rights */}
        <Section title="9. Your Data Protection Rights">
          <p>You have the following rights regarding your personal data:</p>
          <ul className="list-disc pl-6 space-y-2 my-3">
            <li><strong>Access</strong> — request a copy of data we hold about you</li>
            <li><strong>Rectification</strong> — ask us to correct inaccurate information</li>
            <li><strong>Erasure</strong> — request we delete your data ("right to be forgotten")</li>
            <li><strong>Restriction</strong> — ask us to limit how we process your data</li>
            <li><strong>Portability</strong> — request your data in a machine-readable format</li>
            <li><strong>Objection</strong> — object to processing for direct marketing</li>
            <li><strong>Withdraw consent</strong> — withdraw at any time where consent was given</li>
          </ul>
          <p>
            To exercise any right, email{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-blue-600 hover:underline">
              {CONTACT_EMAIL}
            </a>. We respond within 30 days.
          </p>
        </Section>

        {/* 10. Children */}
        <Section title="10. Children's Privacy">
          <p>
            Our site is not directed at children under 13. We do not knowingly collect
            personal information from anyone under 13. If you believe your child has
            provided us information, please email us and we will delete it promptly.
          </p>
        </Section>

        {/* 11. Security */}
        <Section title="11. Security">
          <p>
            We protect your information using HTTPS encryption, hashed password storage,
            and strict access controls. No internet transmission is 100% secure, but we
            apply industry-standard safeguards.
          </p>
        </Section>

        {/* 12. Consent */}
        <Section title="12. Your Consent">
          <p>
            By using <strong>{SITE_DOMAIN}</strong>, you consent to this Privacy Policy.
            If you do not agree, please stop using our site. Continued use after any
            update to this policy means you accept the changes.
          </p>
        </Section>

        {/* 13. Changes */}
        <Section title="13. Changes to This Policy">
          <p>
            We may update this policy from time to time. We will update the "Last updated"
            date at the top when we do. We recommend checking this page periodically.
          </p>
        </Section>

        {/* 14. Contact */}
        <Section title="14. Contact Us">
          <p>For any privacy-related questions or requests:</p>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 my-4">
            <p className="font-semibold text-gray-900">{SITE_NAME}</p>
            <p className="text-sm text-gray-600 mt-1">
              Website:{' '}
              <a href={`https://${SITE_DOMAIN}`} className="text-blue-600 hover:underline">
                {SITE_DOMAIN}
              </a>
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Email:{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-blue-600 hover:underline">
                {CONTACT_EMAIL}
              </a>
            </p>
          </div>
          <p>We aim to reply within <strong>5 business days</strong>.</p>
        </Section>

        {/* Footer */}
        <div className="border-t border-gray-200 pt-6 mt-8 text-xs text-gray-400 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            This policy applies to <strong>{SITE_DOMAIN}</strong> and was last reviewed{' '}
            <strong>{LAST_UPDATED}</strong>.
          </p>
          <Link to="/" className="text-blue-500 hover:underline whitespace-nowrap">
            ← Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}

/* Reusable section wrapper */
function Section({ title, children }) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">
        {title}
      </h2>
      <div className="text-gray-600 leading-relaxed space-y-3">
        {children}
      </div>
    </section>
  );
}
