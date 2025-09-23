export interface Hospital {
  id: string;
  name: string;
  address: string;
  phone: string;
  website: string;
  lat: number;
  lng: number;
  type: 'government' | 'private' | 'specialty';
}

export const hospitals: Hospital[] = [

  {
    id: 'apollo-guwahati',
    name: 'Apollo Hospitals, Guwahati',
    address: 'G.S. Road, Christian Basti, Guwahati, Assam',
    phone: '+91-361-2347700',
    website: 'https://www.apollohospitals.com/guwahati',
    lat: 26.1445,
    lng: 91.7362,
    type: 'private'
  },
  {
    id: 'hayat-hospital',
    name: 'Hayat Hospital',
    address: 'Kahilipara Road, Odalbakra, Lalganesh, Guwahati, Assam 781034',
    phone: '+91-80110-03111',
    website: 'https://hayathospital.in',
    lat: 26.1158,
    lng: 91.7086,
    type: 'private'
  },
  {
    id: 'gmch',
    name: 'Gauhati Medical College & Hospital (GMCH)',
    address: 'Bhangagarh, Guwahati, Assam – PIN 781032',
    phone: '0361-2452244',
    website: 'https://gmch.assam.gov.in',
    lat: 26.1547,
    lng: 91.7417,
    type: 'government'
  },
  {
    id: 'narayana-guwahati',
    name: 'Narayana Superspeciality Hospital',
    address: 'Tularam Bafna Civil Hospital Complex, Amingaon, Guwahati, Assam',
    phone: 'Contact via website',
    website: 'https://www.narayanahealth.org/hospitals/guwahati/narayana-superspeciality-hospital-guwahati',
    lat: 26.1748,
    lng: 91.6917,
    type: 'specialty'
  },
  {
    id: 'metro-hospital',
    name: 'Metro Hospital, Guwahati',
    address: 'Uday Nagar, Khanapara, opp. Bodoland Guest, Guwahati-781022',
    phone: '+91-361-2962335',
    website: 'https://www.metrohospitals.in',
    lat: 26.1061,
    lng: 91.7697,
    type: 'private'
  },

  {
    id: 'swagat-hospital',
    name: 'Swagat Hospital',
    address: 'Guwahati, Assam',
    phone: 'Contact via website',
    website: 'https://www.swagathospitals.in',
    lat: 26.1833,
    lng: 91.7417,
    type: 'private'
  },

  {
    id: 'cihsr-nagaland',
    name: 'Christian Institute of Health Sciences & Research (CIHSR)',
    address: 'Chümoukedima, Nagaland',
    phone: 'Contact via website',
    website: 'https://cihsr.in',
    lat: 25.8919,
    lng: 93.7169,
    type: 'specialty'
  },
  // Dibrugarh, Assam Hospitals
  {
    id: 'amch-dibrugarh',
    name: 'Assam Medical College & Hospital (AMCH)',
    address: 'Barbari, Dibrugarh, Assam-786002',
    phone: '0373-2300080 / 0373-2300352',
    website: 'http://www.assammedicalcollege.in/web/',
    lat: 27.4728,
    lng: 94.9120,
    type: 'government'
  },
  {
    id: 'swastha-dibrugarh',
    name: 'Swastha Hospital, Dibrugarh',
    address: 'A.T. Road, Dibrugarh, Assam',
    phone: '+91-600 221 8341 / +91-690 125 8075',
    website: 'https://www.swasthahospital.com/',
    lat: 27.4728,
    lng: 94.9120,
    type: 'private'
  },
  {
    id: 'srishti-dibrugarh',
    name: 'Srishti Hospitals & Research Centre Pvt. Ltd.',
    address: 'Near Assam Medical College Road, Paltan Bazaar, Dibrugarh, Assam',
    phone: '0373-2301300 / 2300024',
    website: 'https://www.srishtihospitals.org/',
    lat: 27.4708,
    lng: 94.9100,
    type: 'private'
  },
  {
    id: 'apeksha-dibrugarh',
    name: 'Apeksha Hospital, Dibrugarh',
    address: 'Jalan Nagar, AMC Road, Dibrugarh-786005, Assam',
    phone: 'Reception: +91-70990 89555; Gynae: +91-70990 12444; General OPD: +91-60024 24694',
    website: 'https://www.apekshahospitals.com/',
    lat: 27.4688,
    lng: 94.9080,
    type: 'private'
  },
  // Shillong, Meghalaya Hospitals
  {
    id: 'woodland-shillong',
    name: 'Woodland Hospital',
    address: 'Dhankheti, Malki, Shillong, Meghalaya 793003',
    phone: '0364-2225240; also 0364-2502375 / 0364-2502374',
    website: 'http://woodlandhospital.org/',
    lat: 25.5788,
    lng: 91.8933,
    type: 'private'
  },
  {
    id: 'nazareth-shillong',
    name: 'Nazareth Hospital',
    address: 'Near Police Point, Arbuthnot Road, Laitumkhrah, Shillong, Meghalaya',
    phone: '0364-2224052',
    website: 'http://www.nazarethshillong.in/',
    lat: 25.5788,
    lng: 91.8933,
    type: 'private'
  },
  {
    id: 'neigrihms-shillong',
    name: 'NEIGRIHMS (North Eastern Indira Gandhi Regional Institute)',
    address: 'Mawdiangdiang, Shillong-793018, Meghalaya',
    phone: 'Contact via main office',
    website: 'http://www.neigrihms.gov.in/',
    lat: 25.5678,
    lng: 91.8800,
    type: 'government'
  },
  // Aizawl, Mizoram Hospitals
  {
    id: 'zmc-aizawl',
    name: 'Zoram Medical College & Hospital (ZMC&H)',
    address: 'Falkawn, Aizawl, Mizoram - 796005',
    phone: '+91-9862391873',
    website: 'https://zmc.edu.in',
    lat: 23.7271,
    lng: 92.7176,
    type: 'government'
  },
  {
    id: 'ebenezer-aizawl',
    name: 'Ebenezer Hospital',
    address: 'Chawnpui Veng, Aizawl, Mizoram - 796009',
    phone: '8118900590',
    website: 'https://ebenezerhospital.com',
    lat: 23.7367,
    lng: 92.7187,
    type: 'private'
  }
];