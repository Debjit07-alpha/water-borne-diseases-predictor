export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Privacy Policy</h1>
      
      <div className="prose max-w-none space-y-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <p className="text-lg">
            <strong>Last Updated:</strong> September 22, 2025
          </p>
          <p className="mt-2">
            At River Pulse, we are committed to protecting your privacy and maintaining the confidentiality 
            of your health-related information.
          </p>
        </div>

        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
          
          <h3 className="text-lg font-semibold mb-2">Health Information</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>Symptoms you report through our AI assistant</li>
            <li>Images you upload for symptom analysis (processed locally when possible)</li>
            <li>Location data when reporting incidents (with your permission)</li>
            <li>Anonymous health trends and patterns</li>
          </ul>

          <h3 className="text-lg font-semibold mb-2">Technical Information</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>Browser type and version</li>
            <li>Device information and screen resolution</li>
            <li>IP address (anonymized for analytics)</li>
            <li>Usage patterns and feature interactions</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide disease identification and health information</li>
            <li>Generate anonymous health trend reports</li>
            <li>Improve our AI models and prediction accuracy</li>
            <li>Monitor and prevent disease outbreaks</li>
            <li>Enhance platform security and performance</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Information Sharing</h2>
          
          <div className="bg-green-50 p-4 rounded-lg mb-4">
            <h3 className="font-semibold text-green-800">✅ We DO NOT share:</h3>
            <ul className="list-disc pl-6 text-green-700">
              <li>Personal health information with third parties</li>
              <li>Individual symptom reports or images</li>
              <li>Identifiable user data for commercial purposes</li>
            </ul>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-semibold text-yellow-800">⚠️ We MAY share anonymized data with:</h3>
            <ul className="list-disc pl-6 text-yellow-700">
              <li>Public health authorities for outbreak monitoring</li>
              <li>Research institutions for disease prevention studies</li>
              <li>WHO and health organizations for global health initiatives</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>End-to-end encryption for sensitive health data</li>
            <li>Secure cloud storage with regular backups</li>
            <li>Access controls and authentication requirements</li>
            <li>Regular security audits and vulnerability assessments</li>
            <li>Compliance with healthcare data protection standards</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Access & Control</h3>
              <ul className="text-sm space-y-1">
                <li>• View data we have about you</li>
                <li>• Request data corrections</li>
                <li>• Delete your account and data</li>
                <li>• Export your health reports</li>
              </ul>
            </div>
            <div className="bg-white p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Consent Management</h3>
              <ul className="text-sm space-y-1">
                <li>• Withdraw consent anytime</li>
                <li>• Opt-out of data sharing</li>
                <li>• Control location tracking</li>
                <li>• Manage notification preferences</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Cookies and Tracking</h2>
          <p className="mb-4">We use cookies and similar technologies to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Remember your preferences and settings</li>
            <li>Analyze platform usage and performance</li>
            <li>Provide personalized health recommendations</li>
            <li>Ensure platform security and prevent fraud</li>
          </ul>
          <p className="text-sm text-gray-600">
            You can control cookie settings through your browser preferences.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Children's Privacy</h2>
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <p className="text-red-700">
              <strong>Age Restriction:</strong> River Pulse is intended for users 13 years and older. 
              We do not knowingly collect personal information from children under 13. 
              If you believe a child has provided information, please contact us immediately.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">8. Contact Information</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="mb-2">For privacy-related questions or requests:</p>
            <ul className="space-y-1">
              <li>📧 Email: <a href="mailto:privacy@riverpulse-health.org" className="text-blue-600 hover:underline">privacy@riverpulse-health.org</a></li>
              <li>📞 Phone: <a href="tel:+1800-PULSE-01" className="text-blue-600 hover:underline">+1800-PULSE-01</a></li>
              <li>🏢 Address: River Pulse Privacy Office, Health Technology Center</li>
            </ul>
          </div>
        </section>

        <div className="bg-blue-50 p-6 rounded-lg mt-8">
          <h3 className="font-semibold mb-2">Policy Updates</h3>
          <p className="text-sm">
            We may update this privacy policy periodically. Significant changes will be 
            communicated through platform notifications and email updates. Continued use 
            of River Pulse constitutes acceptance of any policy updates.
          </p>
        </div>
      </div>
    </div>
  );
}