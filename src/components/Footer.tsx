import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Support Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-300">SUPPORT FOR RIVER PULSE</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-blue-300">✉</span>
                <a href="mailto:support@riverpulse-health.org" className="hover:text-blue-300 transition-colors">
                  support@riverpulse-health.org
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-blue-300">📞</span>
                <a href="tel:+1800-PULSE-01" className="hover:text-blue-300 transition-colors">
                  +1800-PULSE-01
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-300">QUICK LINKS</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Link href="/" className="block hover:text-blue-300 transition-colors flex items-center">
                  <span className="mr-2">▸</span> Home
                </Link>
                <Link href="/diseases" className="block hover:text-blue-300 transition-colors flex items-center">
                  <span className="mr-2">▸</span> Diseases
                </Link>
                <Link href="/map" className="block hover:text-blue-300 transition-colors flex items-center">
                  <span className="mr-2">▸</span> Risk Map
                </Link>
                <Link href="/report" className="block hover:text-blue-300 transition-colors flex items-center">
                  <span className="mr-2">▸</span> Report Case
                </Link>
              </div>
              <div className="space-y-2">
                <Link href="/chat" className="block hover:text-blue-300 transition-colors flex items-center">
                  <span className="mr-2">▸</span> AI Assistant
                </Link>
                <Link href="/about" className="block hover:text-blue-300 transition-colors flex items-center">
                  <span className="mr-2">▸</span> About
                </Link>
                <Link href="/privacy" className="block hover:text-blue-300 transition-colors flex items-center">
                  <span className="mr-2">▸</span> Privacy Policy
                </Link>
                <Link href="/disclaimer" className="block hover:text-blue-300 transition-colors flex items-center">
                  <span className="mr-2">▸</span> Disclaimer
                </Link>
              </div>
            </div>
          </div>

          {/* Health Authority Info */}
          <div>
            <div className="flex items-start space-x-3">
              <div className="bg-blue-600 p-2 rounded">
                <span className="text-white font-bold text-sm">WHO</span>
              </div>
              <div className="flex-1">
                <p className="text-sm leading-relaxed">
                  This platform is designed following <strong>World Health Organization (WHO)</strong> guidelines for water-borne disease surveillance and prevention.
                </p>
                <p className="text-sm mt-2 leading-relaxed">
                  Content and data protocols maintained by public health authorities.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-300">
              Copyright © 2024 - 2025. All Rights Reserved | River Pulse - Water-Borne Disease Prevention Platform
            </div>
            <div className="text-sm text-gray-300">
              Best viewed in Firefox 58.0.1 or above, Google Chrome 58.0 or above, Safari 11.0 or above.
            </div>
          </div>
          
          {/* Health Disclaimer */}
          <div className="mt-4 p-3 bg-red-900/30 rounded">
            <p className="text-sm text-red-200">
              <strong>⚠️ Medical Disclaimer:</strong> This platform provides educational information only. 
              Always consult qualified healthcare professionals for medical diagnosis and treatment. 
              In case of emergency, contact your local emergency services immediately.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
