export default function Privacy() {
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
          <h1 className="text-5xl font-bold mb-8">Privacy Policy</h1>
          <p className="text-lg opacity-90 mb-12">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <div className="space-y-8 text-lg leading-relaxed">
            <section>
              <h2 className="text-3xl font-bold mb-4">Overview</h2>
              <p className="opacity-90">
                RecCli is a tri-layer memory system for AI coding agents. This policy explains how we handle data when you use the RecCli website and memory engine.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4">Data We Collect</h2>
              <h3 className="text-2xl font-semibold mb-2 mt-4">Open-source memory engine</h3>
              <p className="opacity-90 mb-4">
                RecCli stores its three memory layers—your <code>.devproject</code> map, compact <code>.devsession</code> summaries, and full <code>.devsession</code> conversations—<strong>locally in your project</strong>. RecCli does not upload those files to RecCli-operated servers.
              </p>
              <p className="opacity-90 mb-4">
                If you configure a third-party model or embedding provider, RecCli may send the content required for that feature directly to the provider you selected. That processing is governed by the provider&apos;s terms and privacy policy.
              </p>

              <h3 className="text-2xl font-semibold mb-2 mt-4">Waitlist</h3>
              <p className="opacity-90 mb-4">
                When you sign up for the RecCli Team waitlist, we collect:
              </p>
              <ul className="list-disc list-inside space-y-2 opacity-90 ml-4">
                <li>Your email address</li>
                <li>Timestamp of signup</li>
              </ul>
              <p className="opacity-90 mt-4">
                We use this information solely to notify you about the Team product. We do not sell your email address.
              </p>

              <h3 className="text-2xl font-semibold mb-2 mt-4">Website analytics</h3>
              <p className="opacity-90">
                The website uses privacy-conscious analytics to understand aggregate traffic and improve the site. Website analytics are separate from your local RecCli project memory.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4">Data Security</h2>
              <p className="opacity-90 mb-4">
                We take security seriously:
              </p>
              <ul className="list-disc list-inside space-y-2 opacity-90 ml-4">
                <li>The RecCli website is served over HTTPS</li>
                <li>Project memory remains in local, human-readable files by default</li>
                <li>You control which third-party model or embedding providers you configure</li>
                <li>Secrets are redacted before supported summarization workflows</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4">Data Retention</h2>
              <p className="opacity-90">
                <strong>Waitlist emails:</strong> Stored while the Team waitlist is active or until you ask us to delete your address. You can request deletion at any time by emailing <a href="mailto:support@reccli.com" className="underline hover:text-purple-200">support@reccli.com</a>.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4">Your Rights</h2>
              <p className="opacity-90 mb-4">You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 opacity-90 ml-4">
                <li>Access your personal data</li>
                <li>Request correction of your data</li>
                <li>Request deletion of your data</li>
                <li>Opt out of communications</li>
                <li>Export your data</li>
              </ul>
              <p className="opacity-90 mt-4">
                To exercise these rights, contact us at <a href="mailto:support@reccli.com" className="underline hover:text-purple-200">support@reccli.com</a>.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4">Open Source</h2>
              <p className="opacity-90">
                The RecCli memory engine is open source under the MIT License. You can review its code, security practices, and data handling at <a href="https://github.com/reccli/reccli" className="underline hover:text-purple-200">github.com/reccli/reccli</a>.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4">Changes to This Policy</h2>
              <p className="opacity-90">
                We may update this privacy policy from time to time. We will notify you of significant changes via email (if you're on the waitlist or have an account) or by posting a notice on our website.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4">Contact</h2>
              <p className="opacity-90">
                Questions about this privacy policy? Contact us at <a href="mailto:support@reccli.com" className="underline hover:text-purple-200">support@reccli.com</a>.
              </p>
            </section>
          </div>
        </div>
      </section>
    </div>
  )
}
