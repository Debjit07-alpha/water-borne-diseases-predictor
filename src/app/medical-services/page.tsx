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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white transition-all duration-500 hover:text-blue-600 dark:hover:text-blue-400 hover:scale-105 cursor-default">24/7 Medical Services</h1>
      <p className="mb-8 text-lg text-gray-600 dark:text-gray-300 transition-all duration-300 hover:text-gray-800 dark:hover:text-gray-100">
        Here you can find a list of 24/7 medical helpline numbers and emergency contacts for various states.
      </p>

      <div className="space-y-12">
        {states.map((state) => (
          <div key={state.name} className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-gray-700 dark:hover:to-gray-600">
            <h2 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400 transition-colors duration-300 hover:text-blue-800 dark:hover:text-blue-300">🏥 {state.name}</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700 transition-colors duration-300 hover:bg-gray-100 dark:hover:bg-gray-600">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider transition-all duration-200 hover:text-gray-700 dark:hover:text-gray-100">
                      Helpline / Service
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider transition-all duration-200 hover:text-gray-700 dark:hover:text-gray-100">
                      Contact Number
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider transition-all duration-200 hover:text-gray-700 dark:hover:text-gray-100">
                      Details / Source
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {state.helplines.map((helpline, index) => (
                    <tr key={index} className="transition-all duration-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:scale-[1.02] hover:shadow-md cursor-pointer">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white transition-colors duration-200 hover:text-blue-700 dark:hover:text-blue-300">
                        {helpline.service}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 transition-all duration-200 hover:text-blue-600 dark:hover:text-blue-400 hover:font-semibold hover:animate-bounce">
                        <span className="inline-block transition-transform duration-200 hover:scale-110 hover:animate-pulse">
                          {helpline.number}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-normal text-sm text-gray-500 dark:text-gray-300 transition-colors duration-200 hover:text-gray-700 dark:hover:text-gray-100">
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
    </div>
  );
};

export default MedicalServicesPage;
