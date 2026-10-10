export type IssueCategory = 
  | 'Road Damage / Pothole'
  | 'Garbage / Waste Overflow'
  | 'Water Supply / Leakage'
  | 'Broken Streetlight'
  | 'Drainage / Sewage Issue'
  | 'Traffic / Footpath Hazard'
  | 'Parks / Public Property'
  | 'Other Civic Issue';

export type SeverityLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface LocationInfo {
  latitude?: number;
  longitude?: number;
  city: string;
  area: string;
  street: string;
  landmark: string;
  postalCode?: string;
  formattedAddress: string;
}

export interface AIAnalysisResult {
  issueType: IssueCategory;
  severity: SeverityLevel;
  confidenceScore: number; // 0 to 1
  visualEvidence: string[];
  safetyImplications: string;
  conciseDescription: string;
  investigationNotes: string;
  suggestedAction: string;
  isDemoFallback?: boolean;
}

export interface GeneratedComplaint {
  subject: string;
  category: IssueCategory;
  severity: SeverityLevel;
  summary: string;
  locationDetails: string;
  landmark: string;
  formalBody: string;
  safetyImpact: string;
  suggestedAuthority: string;
  dateGenerated: string;
}

export interface AuthorityInfo {
  id: string;
  name: string;
  shortCode: string;
  city: string;
  description: string;
  categoriesHandled: IssueCategory[];
  officialPortalUrl: string;
  mobileApp?: string;
  helpline: string;
  twitterHandle?: string;
  submissionInstructions: string[];
  verified: boolean;
}

export type LocalReportStatus = 
  | 'Draft'
  | 'Ready to Report'
  | 'Opened Official Channel'
  | 'Submission Confirmed by User';

export interface SavedReport {
  id: string;
  createdAt: string;
  updatedAt: string;
  imageDataUrl: string;
  imageFileName: string;
  location: LocationInfo;
  analysis: AIAnalysisResult;
  complaint: GeneratedComplaint;
  recommendedAuthority: AuthorityInfo;
  status: LocalReportStatus;
  userNotes?: string;
}

export interface SampleCivicIssue {
  id: string;
  title: string;
  category: IssueCategory;
  location: LocationInfo;
  imageUrl: string;
  analysis: AIAnalysisResult;
  authorityId: string;
}
