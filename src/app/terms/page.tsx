export const metadata = {
  title: 'Terms & Conditions | Granville Tattoo',
  description: 'Read the terms and conditions governing the use of Granville Tattoo services and website.',
};

export default function TermsPage() {
  return (
    <div className="policy-page">
      <div className="policy-container">
        <header className="policy-header">
          <h1>Terms and Conditions</h1>
          <p>Last updated: May 11, 2025</p>
          <p>
            These Terms and Conditions govern your use of the Granville Tattoo website and services.
            By accessing or using our services, you agree to be bound by these terms.
          </p>
        </header>

        <section className="policy-section">
          <h2>Interpretation and Definitions</h2>
          <h3>Interpretation</h3>
          <p>
            Words with capitalized initial letters have meanings defined under the following conditions.
            The same definitions apply whether the terms appear in singular or plural.
          </p>

          <h3>Definitions</h3>
          <ul>
            <li>
              <strong>Affiliate</strong> means an entity that controls, is controlled by, or is under
              common control with Granville Tattoo, where control means ownership of 50% or more of the
              shares entitled to vote for directors or other managing authority.
            </li>
            <li>
              <strong>Country</strong> refers to British Columbia, Canada.
            </li>
            <li>
              <strong>Company</strong> refers to Granville Tattoo, located at 1007 Granville St,
              Vancouver, BC V6Z 1M1, Canada.
            </li>
            <li>
              <strong>Device</strong> means any device capable of accessing our services, such as a
              computer, smartphone, or tablet.
            </li>
            <li>
              <strong>Service</strong> refers to the Granville Tattoo website and associated offerings.
            </li>
            <li>
              <strong>Terms</strong> refers to these Terms and Conditions forming the agreement between
              you and Granville Tattoo.
            </li>
            <li>
              <strong>Website</strong> refers to Granville Tattoo, accessible from
              {' '}<a href="https://granvilletattoo.com" target="_blank" rel="noopener noreferrer">granvilletattoo.com</a>.
            </li>
            <li>
              <strong>You</strong> means the individual or entity accessing or using the services.
            </li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>Acknowledgment</h2>
          <p>
            These Terms explain the rights and obligations of all users regarding the use of Granville
            Tattoo services. Your access to and use of the Service is conditioned on your acceptance of
            these Terms and our Privacy Policy. If you disagree with any part of the Terms, please do not
            use our services.
          </p>
          <p>
            You represent that you are at least 16 years old. Granville Tattoo does not provide tattoo
            services to anyone under 16, regardless of parental consent.
          </p>
          <p>
            Some parts of the Service may require registration or account creation. You are responsible
            for maintaining the confidentiality of your account credentials.
          </p>
        </section>

        <section className="policy-section">
          <h2>Links to Other Websites</h2>
          <p>
            Our Service may contain links to third-party websites that are not owned or controlled by
            Granville Tattoo. We have no control over—and assume no responsibility for—the content,
            privacy policies, or practices of third-party websites. We strongly advise you to read the
            terms and privacy policies of every site you visit.
          </p>
        </section>

        <section className="policy-section">
          <h2>Termination</h2>
          <p>
            We may terminate or suspend access to our Service immediately, without prior notice or
            liability, for any reason, including if you breach these Terms. Upon termination, your right
            to use the Service will cease immediately.
          </p>
        </section>

        <section className="policy-section">
          <h2>Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, Granville Tattoo and its suppliers shall not be liable
            for indirect, incidental, special, consequential, or punitive damages. In any event, our total
            liability is limited to the amount you have paid through the Service, or 100 CAD if no such
            payments were made.
          </p>
        </section>

        <section className="policy-section">
          <h2>&quot;As Is&quot; and &quot;As Available&quot; Disclaimer</h2>
          <p>
            Our Service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind,
            express or implied. Granville Tattoo does not warrant that the Service will meet your
            expectations, be uninterrupted, secure, or error-free.
          </p>
        </section>

        <section className="policy-section">
          <h2>Governing Law</h2>
          <p>
            These Terms are governed by the laws of British Columbia, Canada, without regard to conflict
            of law provisions. Your use of the Service may also be subject to other local, state, national,
            or international laws.
          </p>
        </section>

        <section className="policy-section">
          <h2>Dispute Resolution</h2>
          <p>
            If you have a concern or dispute regarding the Service, you agree to first attempt to resolve
            the issue informally by contacting Granville Tattoo at
            {' '}<a href="mailto:info@granvilletattoo.com">info@granvilletattoo.com</a>.
          </p>
        </section>

        <section className="policy-section">
          <h2>Severability and Waiver</h2>
          <p>
            If any provision of these Terms is held to be unenforceable, the remaining provisions will
            remain in effect. Failure to enforce any right or provision under these Terms shall not be
            considered a waiver of those rights.
          </p>
        </section>

        <section className="policy-section">
          <h2>Changes to These Terms</h2>
          <p>
            We reserve the right to modify or replace these Terms at any time. Material changes will be
            communicated via the website prior to taking effect. By continuing to use the Service after
            revisions become effective, you agree to be bound by the updated Terms.
          </p>
        </section>

        <section className="policy-section">
          <h2>Contact Us</h2>
          <p>
            If you have any questions about these Terms and Conditions, contact us at
            {' '}<a href="mailto:info@granvilletattoo.com">info@granvilletattoo.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}

