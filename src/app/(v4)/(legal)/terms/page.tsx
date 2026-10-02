import type { Metadata } from 'next'
import {
  LegalPage,
  LegalIntro,
  LegalSection,
  LegalList,
  LegalCard,
} from '@/components/v4/Legal'
import { CONTACT_EMAIL, OG_DEFAULTS, SITE_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Terms of Use',
  description:
    'The terms that govern the use of kona-verse.com and the services Konaverse provides.',
  alternates: { canonical: `${SITE_URL}/terms` },
  openGraph: { ...OG_DEFAULTS, type: 'website', title: 'Terms of Use | Konaverse', url: `${SITE_URL}/terms` },
  robots: { index: true, follow: true },
}

/** Carried over from the April 2025 text; re-set in v4 on 2026-08-28. */
const UPDATED = 'August 2026'

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Use"
      updated={UPDATED}
      next={[
        { href: '/privacy', label: 'Privacy Policy' },
        { href: '/cookies', label: 'Cookie Policy' },
      ]}
    >
      <LegalIntro>
        <p>
          These Terms of Use (&ldquo;Terms&rdquo;) govern your use of the website at{' '}
          <strong>kona-verse.com</strong> and the professional services provided by Konaverse, a
          web studio based in Cyprus. By using this website or engaging our services, you agree to
          be bound by them.
        </p>
        <p>If you do not agree with any part of these Terms, please do not use the site or engage our services.</p>
      </LegalIntro>

      <LegalSection title="1. Services">
        <p>
          Konaverse provides creative and technical services including, but not limited to, web
          design, web development, 3D and immersive websites, one-page websites, website redesign
          and search engine optimisation. The exact scope, deliverables and timeline of each
          project are defined in a separate written proposal or agreement accepted by both
          parties.
        </p>
      </LegalSection>

      <LegalSection title="2. Engaging our services">
        <p>
          A project begins upon written confirmation from both parties (email is sufficient) and
          receipt of the initial deposit set out in section 5. We reserve the right to decline any
          project at our discretion.
        </p>
      </LegalSection>

      <LegalSection title="3. Client responsibilities">
        <p>To keep a project on track, clients agree to:</p>
        <LegalList>
          <li>Provide accurate, complete and timely information and materials</li>
          <li>Name one point of contact for decisions</li>
          <li>Respond to requests for feedback or approval within the agreed time (by default, 5 business days)</li>
          <li>Hold the rights to every material they provide — images, text, logos, trademarks</li>
        </LegalList>
        <p>
          Delays caused by a client&rsquo;s failure to meet these responsibilities may move the
          project timeline and may incur additional costs.
        </p>
      </LegalSection>

      <LegalSection title="4. Project timeline">
        <p>
          Estimated timelines are given in good faith and depend on timely feedback and delivery
          of the required materials. Konaverse is not liable for delays caused by circumstances
          outside its reasonable control, including client delays, third-party service outages or
          force majeure.
        </p>
      </LegalSection>

      <LegalSection title="5. Pricing and payment">
        <p>Every project is priced individually. Our standard structure is:</p>
        <LegalList>
          <li>
            <strong>50% deposit</strong> to start work
          </li>
          <li>The remaining balance split across the agreed delivery milestones</li>
          <li>Final payment due before the final assets are delivered or the site goes live</li>
        </LegalList>
        <p>
          Prices are quoted in euros (€) unless otherwise agreed. Invoices are due within{' '}
          <strong>14 days</strong> of issue. Late payments may incur interest at the statutory
          rate under Cyprus law, and we may pause work on projects with overdue invoices.
        </p>
      </LegalSection>

      <LegalSection title="6. Revisions and change requests">
        <p>
          Each proposal includes a defined number of revision rounds. Further revisions, or
          changes outside the agreed scope, are quoted and invoiced separately. A significant
          change of scope may require a new proposal and restart the timeline.
        </p>
      </LegalSection>

      <LegalSection title="7. Intellectual property">
        <p>
          On receipt of full payment, Konaverse assigns to the client full ownership of the final
          deliverables created specifically for the project — the website, custom code and final
          design files.
        </p>
        <p>
          The following are explicitly <strong>not</strong> included in that transfer:
        </p>
        <LegalList>
          <li>Proprietary tools, frameworks, libraries or code developed independently by Konaverse</li>
          <li>
            Third-party assets licensed for the project (fonts, plugins and the like) — the client
            obtains their own licences where required
          </li>
          <li>Project files and source materials not explicitly agreed as deliverables</li>
        </LegalList>
        <p>
          Konaverse may show completed work in its portfolio and marketing unless the client asks
          for confidentiality in writing before the project starts.
        </p>
      </LegalSection>

      <LegalSection title="8. Confidentiality">
        <p>
          Both parties treat as confidential any non-public information disclosed during the
          project. This obligation survives completion or termination for <strong>3 years</strong>.
        </p>
      </LegalSection>

      <LegalSection title="9. Cancellation and termination">
        <p>
          Either party may end a project with <strong>14 days&rsquo; written notice</strong>.
        </p>
        <LegalList>
          <li>
            <strong>Cancellation by the client:</strong> the deposit is non-refundable. Work
            completed to date is invoiced at our standard day rate; any amount above the deposit
            is due within 14 days.
          </li>
          <li>
            <strong>Cancellation by Konaverse:</strong> we refund a pro-rated share of any amount
            paid beyond the work completed, except where termination follows a material breach by
            the client.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="10. Warranties and limitation of liability">
        <p>
          Konaverse warrants that its services are performed with reasonable skill and care. We do
          not guarantee specific business outcomes — search rankings, conversion rates, revenue —
          resulting from our work.
        </p>
        <p>
          To the fullest extent permitted by law, Konaverse&rsquo;s total liability for any claim
          arising from its services is limited to the total fees paid for the specific project the
          claim concerns.
        </p>
        <p>
          We are not liable for indirect, incidental or consequential damages, including loss of
          profit, loss of data or business interruption.
        </p>
      </LegalSection>

      <LegalSection title="11. Use of the website">
        <p>
          The content of kona-verse.com — text, images, design and code — is the intellectual
          property of Konaverse and may not be reproduced, copied or distributed without prior
          written consent. You may view the site for personal, informational purposes only.
        </p>
      </LegalSection>

      <LegalSection title="12. Governing law and disputes">
        <p>
          These Terms are governed by the laws of the <strong>Republic of Cyprus</strong>. Any
          dispute arising from them or from our services is first addressed through good-faith
          negotiation; if unresolved within 30 days, it is submitted to the exclusive jurisdiction
          of the courts of Cyprus.
        </p>
      </LegalSection>

      <LegalSection title="13. Changes to these Terms">
        <p>
          We may update these Terms at any time; the &ldquo;last updated&rdquo; date reflects the
          current version. Continued use of the site or of our services after a change is posted
          constitutes acceptance of the revised Terms.
        </p>
      </LegalSection>

      <LegalSection title="14. Contact">
        <p>For any question about these Terms:</p>
        <LegalCard>
          <p>Konaverse</p>
          <p>Cyprus</p>
          <p>
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </p>
        </LegalCard>
      </LegalSection>
    </LegalPage>
  )
}
