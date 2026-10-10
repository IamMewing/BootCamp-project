import { AuthorityInfo } from '../types';

export const HYDERABAD_AUTHORITIES: AuthorityInfo[] = [
  {
    id: 'ghmc',
    name: 'Greater Hyderabad Municipal Corporation (GHMC)',
    shortCode: 'GHMC',
    city: 'Hyderabad',
    description: 'Responsible for road maintenance, potholes, solid waste management, street cleaning, footpaths, public parks, and general civic infrastructure across 6 zones in Hyderabad.',
    categoriesHandled: [
      'Road Damage / Pothole',
      'Garbage / Waste Overflow',
      'Drainage / Sewage Issue',
      'Traffic / Footpath Hazard',
      'Parks / Public Property',
      'Other Civic Issue'
    ],
    officialPortalUrl: 'https://www.ghmc.gov.in/',
    mobileApp: 'MyGHMC App (Android & iOS)',
    helpline: '040-21111111 / 155304',
    twitterHandle: '@GHMCOnline',
    submissionInstructions: [
      'Copy the AI-generated complaint text below.',
      'Click "Open Official Reporting Channel" to launch the official GHMC Portal or download MyGHMC App.',
      'Log in or register with your mobile number.',
      'Select "Grievances" -> Choose the appropriate category (e.g. Roads, Sanitation).',
      'Paste the copied complaint text and attach your issue photo.',
      'Submit and note down your official GHMC Complaint Reference Number.'
    ],
    verified: true
  },
  {
    id: 'hmwssb',
    name: 'Hyderabad Metro Water Supply & Sewerage Board (HMWSSB)',
    shortCode: 'HMWSSB',
    city: 'Hyderabad',
    description: 'Authority for water supply pipelines, drinking water contamination, main sewer line blockages, manhole overflows, and water meter grievances.',
    categoriesHandled: [
      'Water Supply / Leakage',
      'Drainage / Sewage Issue'
    ],
    officialPortalUrl: 'https://www.hyderabadwater.gov.in/',
    mobileApp: 'HMWSSB Customer App',
    helpline: '155313 / 040-23442844',
    twitterHandle: '@HMWSSBOnline',
    submissionInstructions: [
      'Copy the AI-generated complaint text below.',
      'Open the official HMWSSB Portal or HMWSSB Consumer App.',
      'Go to "Online Services" -> "Register Complaint / Grievance".',
      'Enter your CAN number if available, or register as a general citizen.',
      'Paste the complaint text, select your ward/section, and upload photo evidence.',
      'Submit to receive an automated SMS ticket confirmation.'
    ],
    verified: true
  },
  {
    id: 'tsspdcl',
    name: 'Telangana State Southern Power Distribution Company Ltd (TSSPDCL)',
    shortCode: 'TSSPDCL',
    city: 'Hyderabad',
    description: 'Handles electricity supply, faulty or broken streetlights, dangling power cables, transformer issues, and hazardous electric poles.',
    categoriesHandled: [
      'Broken Streetlight',
      'Traffic / Footpath Hazard',
      'Other Civic Issue'
    ],
    officialPortalUrl: 'https://www.tssouthernpower.com/',
    mobileApp: 'TSSPDCL Consumer App',
    helpline: '1912 / 040-23456888',
    twitterHandle: '@TSSPDCLNews',
    submissionInstructions: [
      'Copy the AI-generated complaint text.',
      'Open the TSSPDCL Portal or dial 1912 Electricity Helpline.',
      'Select "Streetlight / Cable Hazard Reporting".',
      'Provide street location, landmark, and paste complaint text.',
      'Upload photo if using the web portal or mobile app.'
    ],
    verified: true
  },
  {
    id: 'htp',
    name: 'Hyderabad Traffic Police',
    shortCode: 'HTP',
    city: 'Hyderabad',
    description: 'Manages traffic hazards, missing or obscured traffic signs, broken signal lights, illegal encroachments blocking road traffic, and road safety concerns.',
    categoriesHandled: [
      'Traffic / Footpath Hazard',
      'Road Damage / Pothole'
    ],
    officialPortalUrl: 'https://www.hyderabadtrafficpolice.gov.in/',
    mobileApp: 'HawkEye App',
    helpline: '040-27852482 / WhatsApp: 9010203626',
    twitterHandle: '@HydTP',
    submissionInstructions: [
      'Copy complaint text.',
      'Open the official Traffic Police portal, HawkEye App, or WhatsApp Helpline (9010203626).',
      'Send the photo evidence along with the complaint text and location landmark.',
      'Save the WhatsApp response ticket number for follow-up.'
    ],
    verified: true
  }
];

export function getAuthorityForCategory(category: string): AuthorityInfo {
  const match = HYDERABAD_AUTHORITIES.find(a => a.categoriesHandled.includes(category as any));
  return match || HYDERABAD_AUTHORITIES[0]; // Default to GHMC
}
