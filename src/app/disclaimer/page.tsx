export default function DisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Medical Disclaimer</h1>
      
      <div className="prose max-w-none space-y-6">
        <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <span className="text-3xl mr-3">⚠️</span>
            <h2 className="text-2xl font-bold text-red-800">IMPORTANT MEDICAL DISCLAIMER</h2>
          </div>
          <p className="text-lg text-red-700 font-semibold">
            The information provided on River Pulse is for educational and informational purposes only. 
            It is NOT intended as a substitute for professional medical advice, diagnosis, or treatment.
          </p>
        </div>

        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Not a Medical Device</h2>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <ul className="list-disc pl-6 space-y-2 text-yellow-800">
              <li>River Pulse is an educational platform and is <strong>NOT a medical device</strong></li>
              <li>Our AI assistant provides information only, not medical diagnosis</li>
              <li>Platform recommendations are based on general health information</li>
              <li>Individual health conditions require professional medical evaluation</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Seek Professional Medical Care</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white p-4 border-l-4 border-red-500">
              <h3 className="font-semibold text-red-700 mb-2">🚨 Emergency Situations</h3>
              <p className="text-sm">
                For severe symptoms, medical emergencies, or life-threatening conditions, 
                <strong> contact emergency services immediately</strong> (911, 108, or your local emergency number).
              </p>
            </div>
            <div className="bg-white p-4 border-l-4 border-blue-500">
              <h3 className="font-semibold text-blue-700 mb-2">🏥 Medical Consultation</h3>
              <p className="text-sm">
                Always consult qualified healthcare professionals for proper diagnosis, 
                treatment plans, and medical advice tailored to your specific condition.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Platform Limitations</h2>
          
          <h3 className="text-lg font-semibold mb-2">AI Assistant Limitations</h3>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>AI responses are based on general medical knowledge, not individual assessment</li>
            <li>Cannot replace physical examination by healthcare professionals</li>
            <li>May not account for complex medical histories or multiple conditions</li>
            <li>Accuracy depends on quality and completeness of symptom information provided</li>
          </ul>

          <h3 className="text-lg font-semibold mb-2">Information Accuracy</h3>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Medical information is updated regularly but may not reflect latest research</li>
            <li>Disease information represents general patterns, not individual cases</li>
            <li>Risk predictions are statistical estimates, not definitive forecasts</li>
            <li>Local health conditions may vary from general information provided</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. User Responsibilities</h2>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">As a River Pulse User, You Should:</h3>
            <ul className="list-disc pl-6 space-y-2 text-blue-700">
              <li>Use the platform as an educational resource only</li>
              <li>Verify all health information with qualified medical professionals</li>
              <li>Provide accurate symptom information for better AI responses</li>
              <li>Seek immediate medical attention for serious or worsening symptoms</li>
              <li>Follow local health authority guidelines and recommendations</li>
              <li>Report suspected disease outbreaks to appropriate health authorities</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Liability Limitations</h2>
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h3 className="font-semibold mb-2">Legal Disclaimer</h3>
            <p className="text-sm mb-4">
              River Pulse, its developers, and associated organizations shall not be liable for any direct, 
              indirect, incidental, consequential, or special damages arising from:
            </p>
            <ul className="list-disc pl-6 text-sm space-y-1">
              <li>Use or inability to use the platform</li>
              <li>Reliance on information provided by the AI assistant</li>
              <li>Delays in seeking appropriate medical care</li>
              <li>Actions taken based on platform recommendations</li>
              <li>Technical failures or data inaccuracies</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Regional Variations</h2>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h3 className="font-semibold text-yellow-800 mb-2">Geographic Considerations</h3>
            <ul className="list-disc pl-6 space-y-2 text-yellow-700">
              <li>Disease patterns and risks vary by geographic region</li>
              <li>Local health regulations and treatment protocols may differ</li>
              <li>Environmental factors affect disease transmission and severity</li>
              <li>Always consult local healthcare providers familiar with regional health patterns</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Data and Privacy</h2>
          <p className="mb-4">
            While we maintain strict privacy protections, users should be aware that:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Health information shared may be used for disease surveillance purposes</li>
            <li>Anonymous data may be shared with public health authorities</li>
            <li>Platform usage data helps improve AI accuracy and public health insights</li>
            <li>Users control their data sharing preferences through privacy settings</li>
          </ul>
        </section>

        <div className="bg-red-50 border border-red-200 p-6 rounded-lg mt-8">
          <h3 className="font-semibold text-red-800 mb-4">⚕️ Remember: When in Doubt, Seek Medical Care</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl mb-2">🚨</div>
              <strong>Emergency</strong>
              <p>Call emergency services for severe symptoms</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🏥</div>
              <strong>Medical Care</strong>
              <p>Consult healthcare providers for diagnosis</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">💊</div>
              <strong>Treatment</strong>
              <p>Follow professional medical treatment plans</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <p className="text-sm text-gray-600">
            <strong>Last Updated:</strong> September 22, 2025 | 
            <strong> Questions?</strong> Contact us at 
            <a href="mailto:support@riverpulse-health.org" className="text-blue-600 hover:underline ml-1">
              support@riverpulse-health.org
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}