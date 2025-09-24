import React from 'react';

const MedicalServicesPage = () => {
  const states = [
    {
      name: 'Arunachal Pradesh',
      helplines: [
        { service: 'Medical Helpline', number: '104', source: 'India Customer Care' },
        { service: 'Ambulance / General Emergency', number: '108 / 102', source: 'kradaadi.nic.in' },
        { service: 'Arunachal State Hospital, Naharlagun', number: '0360-2246677', source: 'sdma-arunachal.in' },
      ],
    },
    {
      name: 'Mizoram',
      helplines: [
        { service: 'Medical / Hospital Emergency, Civil Hospital Aizawl', number: '0389-2322318', source: 'health.mizoram.gov.in' },
        { service: 'National Ambulance Service', number: '102 (All Mizoram)', source: 'health.mizoram.gov.in' },
        { service: 'Health / RSBY contact', number: '1800-3455729', source: 'health.mizoram.gov.in' },
      ],
    },
    {
      name: 'Manipur',
      helplines: [
        { service: 'Medical Helpline (24×7) under CMHT scheme', number: '1800-103-2015', source: 'cmhtmanipur.gov.in' },
        { service: 'Ambulance / Medical Emergency', number: '102', source: 'noney.nic.in' },
        { service: 'Imphal East Hospital Casualty Services', number: '0385-2450385', source: 'Imphal East District' },
      ],
    },
    {
      name: 'Tripura',
      helplines: [
        { service: 'State Emergency Operation Centre (SEOC)', number: '1070', source: 'northtripura.nic.in' },
        { service: 'National Ambulance / Medical', number: '102', source: 'District South Tripura' },
      ],
    },
    {
      name: 'Assam',
      helplines: [
        { service: 'Sarathi 104 (Health Helpline)', number: '104', details: '24×7 free health information, medical advice, counselling in Assam.', source: 'HFW Assam' },
        { service: 'Emergency Medical, Fire, Medical', number: '108', details: 'General medical emergency number across Assam.', source: 'GAD Assam' },
      ],
    },
    {
      name: 'Meghalaya',
      helplines: [
        { service: 'Medical Emergency', number: '108', details: 'Used for emergencies including ambulance response.', source: 'Meghalaya Government' },
        { service: 'Health Queries Helpline (State)', number: '14410', details: 'For non-emergency health related queries within Meghalaya.', source: 'MegHealth' },
        { service: 'Health & Family Welfare (General Contact)', number: '0364-222-4354 / 0364-222-8493', details: 'State health department offices.' },
      ],
    },
    {
      name: 'Nagaland',
      helplines: [
        { service: 'Nagaland Health Protection Society (Chief Minister Health Insurance Scheme - CMHIS) Helpline', number: '1800-202-3380', source: 'cmhis.nagaland.gov.in' },
        { service: 'Ambulance Service', number: '102', source: 'Indianhelpline.com' },
        { service: 'General Emergency Services (Police / Fire / Medical) via single emergency number', number: '112', source: 'India Today NE, Indianhelpline.com' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-block p-6 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg mb-6 transform hover:scale-105 transition-all duration-300 animate-fadeIn">
            <h1 className="text-4xl font-bold text-white font-heading-serif">
              24/7 Medical Services
            </h1>
          </div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed animate-slideInDown">
            Emergency medical helpline numbers and contacts for Northeast India states
          </p>
        </div>

        {/* States List */}
        <div className="space-y-8">
          {states.map((state, index) => (
            <div 
              key={state.name} 
              className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] animate-slideInLeft"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* State Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-blue-700/80"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold font-heading-serif transform hover:scale-105 transition-transform duration-300">
                      {state.name}
                    </h2>
                    <div className="text-sm bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm animate-pulse">
                      {state.helplines.length} Services
                    </div>
                  </div>
                </div>
              </div>

              {/* Services Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider hover:text-blue-600 transition-colors duration-300">
                        Helpline / Service
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider hover:text-blue-600 transition-colors duration-300">
                        Contact Number
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider hover:text-blue-600 transition-colors duration-300">
                        Details / Source
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {state.helplines.map((helpline, helplineIndex) => (
                      <tr 
                        key={helplineIndex} 
                        className="hover:bg-blue-50 transition-all duration-300 transform hover:scale-[1.01] group"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 group-hover:text-blue-700 transition-colors duration-300">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse opacity-75"></div>
                            {helpline.service}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className="inline-block px-4 py-2 bg-blue-600 text-white font-mono font-bold rounded-lg hover:bg-blue-700 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg">
                            {helpline.number}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                          {'details' in helpline ? helpline.details : helpline.source}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        {/* Emergency Instructions */}
        <div className="mt-16 bg-red-600 text-white p-8 rounded-xl shadow-lg animate-fadeIn">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-6 animate-slideInDown">Emergency Guidelines</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-all duration-300 transform hover:scale-105 animate-slideInLeft" style={{ animationDelay: '200ms' }}>
                <div className="text-3xl mb-3 animate-bounce">📞</div>
                <p className="font-semibold text-lg mb-2">Call Immediately</p>
                <p className="text-red-100 text-sm">Dial the appropriate emergency number</p>
              </div>
              <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-all duration-300 transform hover:scale-105 animate-slideInLeft" style={{ animationDelay: '400ms' }}>
                <div className="text-3xl mb-3 animate-bounce" style={{ animationDelay: '1s' }}>📍</div>
                <p className="font-semibold text-lg mb-2">Provide Location</p>
                <p className="text-red-100 text-sm">Share exact address or landmarks</p>
              </div>
              <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-all duration-300 transform hover:scale-105 animate-slideInLeft" style={{ animationDelay: '600ms' }}>
                <div className="text-3xl mb-3 animate-bounce" style={{ animationDelay: '2s' }}>🩺</div>
                <p className="font-semibold text-lg mb-2">Stay Calm</p>
                <p className="text-red-100 text-sm">Follow operator instructions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalServicesPage;
