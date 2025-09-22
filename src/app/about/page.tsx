export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">About River Pulse</h1>
      
      <div className="prose max-w-none">
        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-semibold text-blue-800 mb-4">🩺 Our Mission</h2>
          <p className="text-lg text-blue-700">
            River Pulse is a comprehensive water-borne disease prevention and monitoring platform designed to 
            protect communities through early detection, education, and rapid response capabilities.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4 text-green-700">🎯 What We Do</h3>
            <ul className="space-y-2">
              <li>• AI-powered disease identification from symptoms</li>
              <li>• Real-time risk zone mapping and monitoring</li>
              <li>• Community reporting and alert systems</li>
              <li>• Educational resources on water-borne diseases</li>
              <li>• Data-driven outbreak prediction</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4 text-purple-700">🏥 Health Focus</h3>
            <p>We monitor and provide information on 8 major water-borne diseases:</p>
            <div className="grid grid-cols-2 gap-1 mt-2 text-sm">
              <span>• Cholera</span>
              <span>• Typhoid</span>
              <span>• Hepatitis A</span>
              <span>• Dysentery</span>
              <span>• Giardiasis</span>
              <span>• Leptospirosis</span>
              <span>• Salmonellosis</span>
              <span>• Diarrheal Diseases</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <h3 className="text-xl font-semibold mb-4">🌍 Global Health Impact</h3>
          <p className="mb-4">
            Water-borne diseases affect millions of people worldwide, particularly in developing regions. 
            Our platform aims to reduce the burden of these preventable diseases through:
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">🚨</div>
              <h4 className="font-semibold">Early Detection</h4>
              <p className="text-sm">Rapid symptom analysis and disease identification</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">📊</div>
              <h4 className="font-semibold">Data Intelligence</h4>
              <p className="text-sm">Predictive analytics for outbreak prevention</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">👥</div>
              <h4 className="font-semibold">Community Care</h4>
              <p className="text-sm">Empowering communities with health knowledge</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-yellow-800">⚠️ Important Notice</h3>
          <p className="text-yellow-700">
            River Pulse is an educational and monitoring platform designed to complement, not replace, 
            professional medical care. Always consult qualified healthcare providers for diagnosis, 
            treatment, and medical advice. In emergencies, contact your local emergency services immediately.
          </p>
        </div>
      </div>
    </div>
  );
}