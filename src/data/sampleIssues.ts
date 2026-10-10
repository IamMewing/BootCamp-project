import { SampleCivicIssue } from '../types';

export const SAMPLE_CIVIC_ISSUES: SampleCivicIssue[] = [
  {
    id: 'sample-pothole',
    title: 'Severe Road Pothole on Jubilee Hills Rd No. 36',
    category: 'Road Damage / Pothole',
    location: {
      city: 'Hyderabad',
      area: 'Jubilee Hills',
      street: 'Road No. 36, Near Metro Pillar 1640',
      landmark: 'Opposite Peddamma Temple Metro Station',
      postalCode: '500033',
      formattedAddress: 'Road No. 36, Jubilee Hills, Hyderabad, Telangana 500033',
      latitude: 17.4325,
      longitude: 78.4071
    },
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="%231E293B"/><rect x="0" y="250" width="800" height="350" fill="%23334155"/><line x1="0" y1="425" x2="800" y2="425" stroke="%23F59E0B" stroke-width="12" stroke-dasharray="40 30"/><path d="M 280 340 C 320 310, 480 310, 520 350 C 560 390, 490 460, 420 470 C 350 480, 260 410, 280 340 Z" fill="%230F172A" stroke="%23475569" stroke-width="8"/><path d="M 320 360 C 350 340, 450 340, 470 370 C 490 400, 440 440, 390 445 C 340 450, 300 410, 320 360 Z" fill="%231E293B"/><text x="400" y="120" font-family="sans-serif" font-size="28" font-weight="bold" fill="%23FFFFFF" text-anchor="middle">Civic Issue Photo: Severe Road Pothole</text><text x="400" y="160" font-family="sans-serif" font-size="18" fill="%2394A3B8" text-anchor="middle">Jubilee Hills Road No. 36, Hyderabad</text><rect x="30" y="30" width="160" height="36" rx="18" fill="%23EF4444"/><text x="110" y="53" font-family="sans-serif" font-size="14" font-weight="bold" fill="%23FFFFFF" text-anchor="middle">HIGH SEVERITY</text></svg>',
    analysis: {
      issueType: 'Road Damage / Pothole',
      severity: 'High',
      confidenceScore: 0.94,
      visualEvidence: [
        'Visible road surface asphalt erosion approximately 1.2 meters wide.',
        'Exposed underlying gravel bed creating uneven depression.',
        'Cracks propagating outward into active vehicular lane.'
      ],
      safetyImplications: 'High risk for two-wheeler commuters and potential vehicle wheel alignment damage during rush hour traffic.',
      conciseDescription: 'Significant asphalt pothole depression situated directly in the middle lane of Road No. 36 near Metro Pillar 1640. Needs immediate bitumen patch repair.',
      investigationNotes: 'Inspect asphalt binding depth and surrounding lane drainage to prevent further water erosion.',
      suggestedAction: 'Deploy GHMC Road Maintenance unit for cold-mix bitumen patching and surface leveling.'
    },
    authorityId: 'ghmc'
  },
  {
    id: 'sample-garbage',
    title: 'Overflowing Municipal Garbage Bin in Madhapur',
    category: 'Garbage / Waste Overflow',
    location: {
      city: 'Hyderabad',
      area: 'Madhapur',
      street: '100 Feet Road, Ayyappa Society',
      landmark: 'Near Petrol Pump Signal',
      postalCode: '500081',
      formattedAddress: '100 Feet Road, Ayyappa Society, Madhapur, Hyderabad, Telangana 500081',
      latitude: 17.4483,
      longitude: 78.3915
    },
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="%230F172A"/><rect x="0" y="380" width="800" height="220" fill="%23334155"/><rect x="300" y="220" width="200" height="220" rx="12" fill="%23166534" stroke="%2322C55E" stroke-width="4"/><path d="M 260 220 Q 400 120 540 220 C 510 280, 290 280, 260 220 Z" fill="%23854D0E"/><circle cx="340" cy="190" r="25" fill="%23CA8A04"/><circle cx="450" cy="170" r="30" fill="%23A16207"/><rect x="240" y="380" width="320" height="80" rx="8" fill="%23713F12" opacity="0.9"/><text x="400" y="80" font-family="sans-serif" font-size="28" font-weight="bold" fill="%23FFFFFF" text-anchor="middle">Civic Issue Photo: Waste Overflow</text><text x="400" y="120" font-family="sans-serif" font-size="18" fill="%2394A3B8" text-anchor="middle">Ayyappa Society 100ft Road, Madhapur</text><rect x="30" y="30" width="160" height="36" rx="18" fill="%23F59E0B"/><text x="110" y="53" font-family="sans-serif" font-size="14" font-weight="bold" fill="%23FFFFFF" text-anchor="middle">MEDIUM SEVERITY</text></svg>',
    analysis: {
      issueType: 'Garbage / Waste Overflow',
      severity: 'Medium',
      confidenceScore: 0.92,
      visualEvidence: [
        'Green municipal waste receptacle completely filled beyond capacity.',
        'Domestic waste bags and plastic containers spilled onto pedestrian footpath.',
        'Accumulated litter extending into road margin.'
      ],
      safetyImplications: 'Hygiene and public health risk, stray animal attraction, and blockage of pedestrian walkway.',
      conciseDescription: 'Uncollected solid waste overflowing onto sidewalk on 100 Feet Road, Ayyappa Society. Receptacle requires urgent clearance and sanitization spray.',
      investigationNotes: 'Ensure daily clearance schedule adherence by GHMC Sanitation vehicle.',
      suggestedAction: 'Dispatch GHMC Sanitation compactor truck for waste removal and disinfectant wash.'
    },
    authorityId: 'ghmc'
  },
  {
    id: 'sample-water-leak',
    title: 'Pipeline Leakage & Water Loss in Banjara Hills',
    category: 'Water Supply / Leakage',
    location: {
      city: 'Hyderabad',
      area: 'Banjara Hills',
      street: 'Road No. 12, Near MLA Colony',
      landmark: 'Beside Cancer Hospital Junction',
      postalCode: '500034',
      formattedAddress: 'Road No. 12, Banjara Hills, Hyderabad, Telangana 500034',
      latitude: 17.4156,
      longitude: 78.4347
    },
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="%230284C7"/><rect x="0" y="320" width="800" height="280" fill="%231E293B"/><ellipse cx="400" cy="460" rx="300" ry="90" fill="%2338BDF8" opacity="0.8"/><circle cx="400" cy="380" r="25" fill="%23E0F2FE"/><path d="M 400 320 Q 380 360 400 380 Q 420 360 400 320 Z" fill="%23BAE6FD"/><text x="400" y="80" font-family="sans-serif" font-size="28" font-weight="bold" fill="%23FFFFFF" text-anchor="middle">Civic Issue Photo: Water Pipeline Leakage</text><text x="400" y="120" font-family="sans-serif" font-size="18" fill="%23E0F2FE" text-anchor="middle">Banjara Hills Road No. 12, Hyderabad</text><rect x="30" y="30" width="160" height="36" rx="18" fill="%23EF4444"/><text x="110" y="53" font-family="sans-serif" font-size="14" font-weight="bold" fill="%23FFFFFF" text-anchor="middle">HIGH SEVERITY</text></svg>',
    analysis: {
      issueType: 'Water Supply / Leakage',
      severity: 'High',
      confidenceScore: 0.96,
      visualEvidence: [
        'Continuous potable water stream erupting from subsurface pipe joint.',
        'Standing water pool pooling over 15 meters along kerb line.',
        'Signs of road foundation softening near asphalt seam.'
      ],
      safetyImplications: 'Wastage of clean municipal drinking water and potential weakening of adjacent road subgrade.',
      conciseDescription: 'Underground drinking water main line joint leak creating waterlogging on Road No. 12 near MLA Colony junction. HMWSSB repair required.',
      investigationNotes: 'Check line valve pressure and inspect distribution main for joint replacement.',
      suggestedAction: 'Dispatch HMWSSB maintenance crew to isolate valve and clamp leaky pipe joint.'
    },
    authorityId: 'hmwssb'
  },
  {
    id: 'sample-streetlight',
    title: 'Non-Functional Streetlight Grid in Hitec City',
    category: 'Broken Streetlight',
    location: {
      city: 'Hyderabad',
      area: 'Hitec City',
      street: 'Cyber Towers Flyover Slip Road',
      landmark: 'Near Mindspace Junction',
      postalCode: '500081',
      formattedAddress: 'Cyber Towers Slip Road, Hitec City, Hyderabad, Telangana 500081',
      latitude: 17.4504,
      longitude: 78.3808
    },
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="%23090D16"/><path d="M 500 150 L 480 500 L 510 500 L 520 150 Z" fill="%23475569"/><path d="M 500 150 Q 420 130 380 180" fill="none" stroke="%2364748B" stroke-width="12"/><circle cx="370" cy="190" r="18" fill="%23334155"/><circle cx="370" cy="190" r="24" fill="%23EF4444" opacity="0.3"/><text x="400" y="80" font-family="sans-serif" font-size="28" font-weight="bold" fill="%23FFFFFF" text-anchor="middle">Civic Issue Photo: Dark Streetlight Grid</text><text x="400" y="120" font-family="sans-serif" font-size="18" fill="%2394A3B8" text-anchor="middle">Cyber Towers Slip Road, Hitec City</text><rect x="30" y="30" width="160" height="36" rx="18" fill="%23F59E0B"/><text x="110" y="53" font-family="sans-serif" font-size="14" font-weight="bold" fill="%23FFFFFF" text-anchor="middle">MEDIUM SEVERITY</text></svg>',
    analysis: {
      issueType: 'Broken Streetlight',
      severity: 'Medium',
      confidenceScore: 0.91,
      visualEvidence: [
        'Single LED pole luminaire inactive while surrounding street remains unlit.',
        'Exposed wiring panel cover at base of pole.',
        'Dark zone along IT corridor pedestrian path.'
      ],
      safetyImplications: 'Reduced nighttime visibility for pedestrians and increased vulnerability for night-shift IT employees.',
      conciseDescription: 'Multiple non-functional LED streetlights along the Cyber Towers slip road creating a dark stretch after 7 PM. TSSPDCL electrical inspection needed.',
      investigationNotes: 'Inspect pole junction box fuse and timer relay circuit.',
      suggestedAction: 'Notify TSSPDCL / EESL streetlight repair team to replace driver/fuse unit.'
    },
    authorityId: 'tsspdcl'
  }
];
