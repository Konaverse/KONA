import type { Metadata } from 'next'
import TransitionLink from '@/components/layout/TransitionLink'

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Terms and conditions governing the use of Konaverse services and this website.',
  alternates: { canonical: 'https://kona-verse.com/terms' },
  robots: { index: true, follow: true },
}

const LAST_UPDATED = 'April 2025'

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[var(--color-obsidian)] text-[var(--color-off-white)]">
      {/* Header */}
      <section className="container-padding pt-40 pb-20 border-b border-white/[0.06]">
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--color-sage)] mb-6 block">
          Legal
        </span>
        <h1 className="font-display text-5xl md:text-7xl font-light mb-8 leading-[1.05]">
          Terms of Use
        </h1>
        <p className="font-sans font-light text-white/40 text-sm">
          Last updated: {LAST_UPDATED}
        </p>
      </section>

      {/* Content */}
      <section className="container-padding py-20">
        <div className="max-w-3xl space-y-16">

          <div className="space-y-5">
            <p className="font-sans font-light text-white/60 leading-relaxed">
              These Terms of Use (&ldquo;Terms&rdquo;) govern your use of the website at <strong className="text-white/80 font-normal">kona-verse.com</strong> and the professional services provided by Konaverse, a creative studio based in Cyprus. By accessing this website or engaging our services, you agree to be bound by these Terms.
            </p>
            <p className="font-sans font-light text-white/60 leading-relaxed">
              If you do not agree with any part of these Terms, please do not use this website or engage our services.
            </p>
          </div>

          <Section title="1. Services">
            <p>
              Konaverse provides creative and technical services including, but not limited to, web development, web application engineering, brand identity, and digital strategy. The exact scope, deliverables, and timeline for each project are defined in a separate written agreement or proposal accepted by both parties.
            </p>
          </Section>

          <Section title="2. Engaging Our Services">
            <p>
              A project engagement begins upon written confirmation from both parties (email confirmation is sufficient) and receipt of the initial deposit as outlined in Section 5. We reserve the right to decline any project request at our discretion.
            </p>
          </Section>

          <Section title="3. Client Responsibilities">
            <p>To ensure a smooth project, clients agree to:</p>
            <ul className="mt-4 space-y-2 list-none">
              <Li>Provide accurate, complete, and timely information and materials required for the project</Li>
              <Li>Assign a designated point of contact for decision-making</Li>
              <Li>Respond to requests for feedback or approvals within an agreed timeframe (default: 5 business days)</Li>
              <Li>Ensure they hold all rights to materials provided to us (images, text, logos, trademarks)</Li>
            </ul>
            <p className="mt-4">
              Delays caused by the client&rsquo;s failure to meet these responsibilities may result in project timeline adjustments and may incur additional costs.
            </p>
          </Section>

          <Section title="4. Project Timeline">
            <p>
              Estimated timelines are provided in good faith and are contingent on timely client feedback and delivery of required materials. Konaverse shall not be held liable for delays caused by circumstances outside our reasonable control, including client delays, third-party service outages, or force majeure events.
            </p>
          </Section>

          <Section title="5. Pricing & Payment">
            <p>All projects are priced individually. Our standard payment structure is:</p>
            <ul className="mt-4 space-y-3 list-none">
              <Li><strong className="text-white/80 font-normal">50% deposit</strong> required to initiate work</Li>
              <Li>Remaining balance split across agreed delivery milestones</Li>
              <Li>Final payment due prior to the delivery of final assets or site launch</Li>
            </ul>
            <p className="mt-4">
              All prices are quoted in Euros (€) unless otherwise agreed. Invoices are due within <strong className="text-white/80 font-normal">14 days</strong> of issue. Late payments may incur interest at the statutory rate under Cyprus law. We reserve the right to pause work on projects with overdue invoices.
            </p>
          </Section>

          <Section title="6. Revisions & Change Requests">
            <p>
              Each project proposal includes a defined number of revision rounds. Additional revisions or changes outside the agreed scope will be quoted and invoiced separately. Significant scope changes may require a new proposal and restart the project timeline.
            </p>
          </Section>

          <Section title="7. Intellectual Property">
            <p>
              Upon receipt of full payment, Konaverse assigns to the client full ownership of the final deliverables created specifically for their project (websites, custom code, final design files).
            </p>
            <p className="mt-4">
              The following are explicitly <strong className="text-white/80 font-normal">not</strong> included in the transfer:
            </p>
            <ul className="mt-4 space-y-2 list-none">
              <Li>Proprietary tools, frameworks, libraries, or codebases developed independently by Konaverse</Li>
              <Li>Third-party assets licensed for use in the project (fonts, plugins, etc.) — the client must obtain their own licences where required</Li>
              <Li>Project files and source materials not explicitly agreed as deliverables</Li>
            </ul>
            <p className="mt-4">
              Konaverse retains the right to display completed work in our portfolio and marketing materials unless the client requests confidentiality in writing prior to project commencement.
            </p>
          </Section>

          <Section title="8. Confidentiality">
            <p>
              Both parties agree to treat as confidential any non-public information disclosed during the project. This obligation survives the completion or termination of the project for a period of <strong className="text-white/80 font-normal">3 years</strong>.
            </p>
          </Section>

          <Section title="9. Cancellation & Termination">
            <p>
              Either party may terminate a project engagement with <strong className="text-white/80 font-normal">14 days&rsquo; written notice</strong>.
            </p>
            <ul className="mt-4 space-y-3 list-none">
              <Li><strong className="text-white/80 font-normal">Client cancellation:</strong> The deposit is non-refundable. Work completed to date will be invoiced at our standard day rate; any amount exceeding the deposit will be invoiced and is due within 14 days.</Li>
              <Li><strong className="text-white/80 font-normal">Konaverse cancellation:</strong> We will refund a pro-rated portion of any amounts paid beyond the work completed, except where termination is due to a material breach by the client.</Li>
            </ul>
          </Section>

          <Section title="10. Warranties & Limitation of Liability">
            <p>
              Konaverse warrants that services will be performed with reasonable skill and care. We do not guarantee specific business outcomes (e.g. search rankings, conversion rates, revenue) resulting from our work.
            </p>
            <p className="mt-4">
              To the fullest extent permitted by applicable law, Konaverse&rsquo;s total liability for any claim arising from our services shall not exceed the total fees paid by the client for the specific project giving rise to the claim.
            </p>
            <p className="mt-4">
              We are not liable for indirect, incidental, or consequential damages including loss of profits, data loss, or business interruption.
            </p>
          </Section>

          <Section title="11. Website Use">
            <p>
              The content on kona-verse.com — including text, images, design, and code — is the intellectual property of Konaverse and may not be reproduced, copied, or distributed without prior written consent. You may view and access the site for personal, informational purposes only.
            </p>
          </Section>

          <Section title="12. Governing Law & Dispute Resolution">
            <p>
              These Terms are governed by the laws of the <strong className="text-white/80 font-normal">Republic of Cyprus</strong>. Any disputes arising from these Terms or our services shall first be attempted to be resolved through good-faith negotiation. If unresolved within 30 days, disputes shall be submitted to the exclusive jurisdiction of the courts of Cyprus.
            </p>
          </Section>

          <Section title="13. Changes to These Terms">
            <p>
              We may update these Terms at any time. The &ldquo;Last updated&rdquo; date will reflect changes. Continued use of the website or engagement of our services after changes are posted constitutes acceptance of the revised Terms.
            </p>
          </Section>

          <Section title="14. Contact">
            <p>For any questions regarding these Terms:</p>
            <div className="mt-4 pl-5 border-l border-white/10 space-y-1 font-mono text-[13px] text-white/50">
              <p>Konaverse</p>
              <p>Cyprus</p>
              <p><a href="mailto:info@kona-verse.com" className="text-[var(--color-sage)] hover:underline">info@kona-verse.com</a></p>
            </div>
          </Section>

          <div className="pt-10 border-t border-white/[0.06]">
            <TransitionLink href="/privacy" className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--color-sage)] hover:text-white transition-colors duration-300">
              Read Privacy Policy →
            </TransitionLink>
          </div>

        </div>
      </section>
    </main>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl md:text-3xl font-light">{title}</h2>
      <div className="font-sans font-light text-white/60 leading-relaxed space-y-4">
        {children}
      </div>
    </div>
  )
}

function Li({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3 items-start">
      <span className="mt-2 w-1 h-1 rounded-full bg-[var(--color-sage)]/60 shrink-0" />
      <span>{children}</span>
    </li>
  )
}
