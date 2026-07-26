export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white">
      {/* Header */}
      <header className="py-8">
        <nav className="container mx-auto px-6 md:px-10 flex justify-between items-center max-w-7xl">
          <a href="/" className="flex items-center gap-3 text-3xl font-bold tracking-tight hover:opacity-80 transition-opacity">
            <div className="w-4 h-4 bg-[#ff5757] rounded-full"></div>
            reccli
          </a>
        </nav>
      </header>

      {/* Content */}
      <section className="py-12 pb-28">
        <div className="container mx-auto px-6 md:px-10 max-w-4xl">
          <h1 className="text-5xl font-bold mb-8">Terms of Service</h1>
          <p className="text-lg opacity-90 mb-12">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <div className="space-y-8 text-lg leading-relaxed">
            <section>
              <h2 className="text-3xl font-bold mb-4">Agreement to Terms</h2>
              <p className="opacity-90">
                By using RecCli, you agree to these Terms of Service. If you don't agree, please don't use RecCli.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4">Description of Service</h2>
              <p className="opacity-90 mb-4">
                RecCli is a tri-layer memory system for AI coding agents:
              </p>
              <ul className="list-disc list-inside space-y-2 opacity-90 ml-4">
                <li><strong><code>.devproject</code>:</strong> a durable map of project features and structure</li>
                <li><strong><code>.devsession</code> summary:</strong> compact working memory for decisions, changes, and next steps</li>
                <li><strong><code>.devsession</code> conversation:</strong> the full source of truth for exact recovery</li>
              </ul>
              <p className="opacity-90 mt-4">
                The open-source engine runs locally and integrates with compatible coding agents through MCP. Optional shared Team features may be offered separately in the future.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4">License</h2>
              <p className="opacity-90 mb-4">
                The RecCli memory engine is licensed under the MIT License. The <code>.devsession</code> and <code>.devproject</code> format specifications are released under CC0. See <a href="https://github.com/reccli/reccli" className="underline hover:text-purple-200">github.com/reccli/reccli</a> for details.
              </p>

              <h3 className="text-2xl font-semibold mb-2 mt-4">Future Team features</h3>
              <p className="opacity-90">
                Hosted or shared Team features may be offered under separate commercial terms presented before purchase.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4">User Responsibilities</h2>
              <p className="opacity-90 mb-4">You agree to:</p>
              <ul className="list-disc list-inside space-y-2 opacity-90 ml-4">
                <li>Use RecCli only for lawful purposes</li>
                <li>Use project and conversation data only when you are authorized to do so</li>
                <li>Protect credentials, API keys, and other secrets in your environment</li>
                <li>Comply with the terms of any third-party model providers you configure</li>
                <li>Not use RecCli to violate privacy, intellectual-property, or other applicable laws</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4">Data Ownership</h2>
              <p className="opacity-90 mb-4">
                <strong>You own your data.</strong> Your project maps, session summaries, and full session conversations belong to you. We claim no ownership over that content.
              </p>
              <p className="opacity-90">
                The open-source engine stores these files locally. If you choose a third-party model provider or a future hosted Team feature, you authorize the processing required to provide the feature you selected.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4">Acceptable Use</h2>
              <p className="opacity-90 mb-4">You may not use RecCli to:</p>
              <ul className="list-disc list-inside space-y-2 opacity-90 ml-4">
                <li>Capture or process confidential project data without authorization</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Transmit malware, viruses, or harmful code</li>
                <li>Abuse or overload our services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4">Payment Terms (Future Team Features)</h2>
              <p className="opacity-90 mb-4">
                If paid Team features launch:
              </p>
              <ul className="list-disc list-inside space-y-2 opacity-90 ml-4">
                <li>Pricing will be clearly displayed before purchase</li>
                <li>Subscriptions renew automatically unless cancelled</li>
                <li>You can cancel anytime from your account settings</li>
                <li>Refunds may be issued at our discretion within 30 days</li>
                <li>We reserve the right to change pricing with 30 days notice</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4">Disclaimers</h2>
              <p className="opacity-90 mb-4">
                RecCli is provided "AS IS" without warranties of any kind. We make no guarantees about:
              </p>
              <ul className="list-disc list-inside space-y-2 opacity-90 ml-4">
                <li>Uninterrupted or error-free operation</li>
                <li>Data loss prevention (always maintain backups)</li>
                <li>Fitness for a particular purpose</li>
                <li>Compatibility with all systems or configurations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4">Limitation of Liability</h2>
              <p className="opacity-90">
                To the maximum extent permitted by law, RecCli and its creators shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service, including but not limited to data loss, lost profits, or business interruption.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4">Account Termination</h2>
              <p className="opacity-90 mb-4">
                We reserve the right to suspend or terminate accounts that:
              </p>
              <ul className="list-disc list-inside space-y-2 opacity-90 ml-4">
                <li>Violate these Terms of Service</li>
                <li>Engage in fraudulent activity</li>
                <li>Abuse the service or harm other users</li>
              </ul>
              <p className="opacity-90 mt-4">
                You may delete your account at any time by contacting <a href="mailto:support@reccli.com" className="underline hover:text-purple-200">support@reccli.com</a>.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4">Open Source</h2>
              <p className="opacity-90">
                The RecCli memory engine is open source software. Contributions, bug reports, and feature requests are welcome at <a href="https://github.com/reccli/reccli" className="underline hover:text-purple-200">github.com/reccli/reccli</a>.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4">Changes to Terms</h2>
              <p className="opacity-90">
                We may update these Terms from time to time. Material changes will be communicated via email or a notice on our website. Continued use of RecCli after changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4">Governing Law</h2>
              <p className="opacity-90">
                These Terms are governed by the laws of the United States. Any disputes will be resolved in the courts of [Your State/Jurisdiction].
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4">Contact</h2>
              <p className="opacity-90">
                Questions about these Terms? Contact us at <a href="mailto:support@reccli.com" className="underline hover:text-purple-200">support@reccli.com</a>.
              </p>
            </section>
          </div>
        </div>
      </section>
    </div>
  )
}
