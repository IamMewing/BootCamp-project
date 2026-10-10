import React, { useState, useEffect } from 'react';
import {
  Camera, Upload, MapPin, Sparkles, AlertTriangle, FileText,
  Copy, Check, ExternalLink, RefreshCw, Edit3, ArrowLeft, ArrowRight,
  ShieldCheck, HelpCircle, X, ChevronRight, Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LocationInfo, AIAnalysisResult, GeneratedComplaint, AuthorityInfo, SampleCivicIssue, SavedReport } from '../types';
import { SAMPLE_CIVIC_ISSUES } from '../data/sampleIssues';
import { getAuthorityForCategory } from '../data/authorities';

interface ReportingWorkflowProps {
  initialSample?: SampleCivicIssue | null;
  onClose: () => void;
  onSaveReport: (report: SavedReport) => void;
  onShowToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const ReportingWorkflow: React.FC<ReportingWorkflowProps> = ({
  initialSample,
  onClose,
  onSaveReport,
  onShowToast,
}) => {
  // Step State: 1 = Upload, 2 = Location, 3 = AI Analysis, 4 = Complaint, 5 = Authority Guidance
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form States
  const [imagePreview, setImagePreview] = useState<string | null>(initialSample ? initialSample.imageUrl : null);
  const [imageFileName, setImageFileName] = useState<string>(initialSample ? `${initialSample.id}.jpg` : 'issue_photo.jpg');

  const [location, setLocation] = useState<LocationInfo>(
    initialSample
      ? initialSample.location
      : {
          city: 'Hyderabad',
          area: 'Jubilee Hills',
          street: 'Road No. 36',
          landmark: 'Near Metro Station',
          formattedAddress: 'Road No. 36, Jubilee Hills, Hyderabad, Telangana',
        }
  );
  const [gpsLoading, setGpsLoading] = useState(false);

  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStepIndex, setAnalysisStepIndex] = useState(0);
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(initialSample ? initialSample.analysis : null);

  // Complaint State
  const [isGeneratingComplaint, setIsGeneratingComplaint] = useState(false);
  const [complaint, setComplaint] = useState<GeneratedComplaint | null>(null);
  const [editedBody, setEditedBody] = useState<string>('');
  const [isEditingBody, setIsEditingBody] = useState(false);
  const [copied, setCopied] = useState(false);

  // User notes
  const [userNotes, setUserNotes] = useState('');

  // Selected Authority
  const [recommendedAuthority, setRecommendedAuthority] = useState<AuthorityInfo>(
    getAuthorityForCategory(initialSample ? initialSample.category : 'Road Damage / Pothole')
  );

  // Pre-load sample if provided
  useEffect(() => {
    if (initialSample) {
      setImagePreview(initialSample.imageUrl);
      setLocation(initialSample.location);
      setAnalysis(initialSample.analysis);
      setRecommendedAuthority(getAuthorityForCategory(initialSample.category));
    }
  }, [initialSample]);

  // Handle File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        onShowToast('error', 'File too large', 'Please upload an image smaller than 15MB.');
        return;
      }
      setImageFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag and Drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImageFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Request Browser Geolocation
  const handleFetchGps = () => {
    if (!navigator.geolocation) {
      onShowToast('error', 'Geolocation unsupported', 'Please enter your street address manually.');
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation((prev) => ({
          ...prev,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          landmark: prev.landmark || 'Current GPS Location',
        }));
        setGpsLoading(false);
        onShowToast('success', 'Location updated', `GPS coordinates captured: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
      },
      (err) => {
        setGpsLoading(false);
        console.warn('Geolocation permission denied or timeout:', err);
        onShowToast('info', 'GPS Access Unavailable', 'Defaulted to Hyderabad city center. Please edit landmark or street.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Run AI Vision Analysis
  const handleRunAnalysis = async () => {
    if (!imagePreview) {
      onShowToast('error', 'Photo required', 'Please upload or capture a photo of the civic issue.');
      return;
    }

    setIsAnalyzing(true);
    setCurrentStep(3);
    setAnalysisStepIndex(0);

    const timer1 = setTimeout(() => setAnalysisStepIndex(1), 700);
    const timer2 = setTimeout(() => setAnalysisStepIndex(2), 1600);

    try {
      const response = await fetch('/api/analyze-issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imagePreview,
          location,
          sampleId: initialSample?.id,
        }),
      });

      const data = await response.json();

      clearTimeout(timer1);
      clearTimeout(timer2);

      if (data.success && data.analysis) {
        setAnalysis(data.analysis);
        setRecommendedAuthority(getAuthorityForCategory(data.analysis.issueType));
        if (data.analysis.isDemoFallback) {
          onShowToast('info', 'Demo Analysis Ready', 'Analyzed using built-in vision intelligence model.');
        } else {
          onShowToast('success', 'AI Analysis Complete', `Identified: ${data.analysis.issueType}`);
        }
      } else {
        throw new Error(data.error || 'Failed to analyze image');
      }
    } catch (err: any) {
      console.error('Analysis error:', err);
      // Fallback
      setAnalysis({
        issueType: 'Road Damage / Pothole',
        severity: 'High',
        confidenceScore: 0.88,
        visualEvidence: [
          'Visible road asphalt erosion exposing sub-base layer.',
          'Uneven depression situated in active traffic lane.'
        ],
        safetyImplications: 'Risk for two-wheeler commuters and vehicular alignment.',
        conciseDescription: 'Asphalt road surface damage requiring municipal bitumen patch.',
        investigationNotes: 'Inspect asphalt binding depth and drainage margin.',
        suggestedAction: 'Dispatch maintenance crew for surface patching.',
        isDemoFallback: true,
      });
      setRecommendedAuthority(getAuthorityForCategory('Road Damage / Pothole'));
      onShowToast('info', 'Analysis Completed', 'Defaulted to standard analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Generate Complaint Letter
  const handleGenerateComplaint = async () => {
    if (!analysis) return;
    setIsGeneratingComplaint(true);

    try {
      const response = await fetch('/api/generate-complaint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          analysis,
          location,
          userNotes,
          authorityName: recommendedAuthority.name,
        }),
      });

      const data = await response.json();
      if (data.success && data.complaint) {
        setComplaint(data.complaint);
        setEditedBody(data.complaint.formalBody);
      } else {
        throw new Error(data.error || 'Complaint generation failed');
      }
    } catch (err: any) {
      console.error('Complaint generation error:', err);
      // Fallback draft
      const fallbackLoc = `${location.street}, ${location.area}, ${location.city}${location.landmark ? ` (Landmark: ${location.landmark})` : ''}`;
      const fallbackText = `To,
The Competent Authority,
${recommendedAuthority.name},
${location.city}.

Subject: [URGENT ATTENTION REQUIRED] Civic Grievance: ${analysis.issueType} at ${location.area}

Respected Sir/Madam,

I am writing to formally report a civic infrastructure concern observed at:
Exact Location: ${fallbackLoc}
Category: ${analysis.issueType} (Severity: ${analysis.severity})

Description of Observed Issue:
${analysis.conciseDescription}

Visible Evidence:
${analysis.visualEvidence.map((e) => `• ${e}`).join('\n')}

Safety & Community Risk:
${analysis.safetyImplications}

In the interest of public safety and municipal upkeep, I respectfully request your department to inspect this site and initiate immediate corrective repair.

Thanking you,
A Concerned Citizen`;

      const fallbackComplaint: GeneratedComplaint = {
        subject: `[URGENT ATTENTION REQUIRED] Civic Grievance: ${analysis.issueType} at ${location.area}`,
        category: analysis.issueType,
        severity: analysis.severity,
        summary: `Formal grievance regarding ${analysis.issueType} at ${location.area}.`,
        locationDetails: fallbackLoc,
        landmark: location.landmark,
        formalBody: fallbackText,
        safetyImpact: analysis.safetyImplications,
        suggestedAuthority: recommendedAuthority.name,
        dateGenerated: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
      };
      setComplaint(fallbackComplaint);
      setEditedBody(fallbackText);
    } finally {
      setIsGeneratingComplaint(false);
      setCurrentStep(4);
    }
  };

  // Copy Complaint to Clipboard
  const handleCopyComplaint = () => {
    const textToCopy = isEditingBody ? editedBody : complaint?.formalBody || '';
    if (!textToCopy) return;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    onShowToast('success', 'Complaint Copied!', 'The formal grievance letter is ready to paste into the official portal.');
  };

  // Finalize & Save Report to History
  const handleFinalizeReport = (status: SavedReport['status'] = 'Opened Official Channel') => {
    if (!imagePreview || !analysis || !complaint) return;

    const newReport: SavedReport = {
      id: `report-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      imageDataUrl: imagePreview,
      imageFileName,
      location,
      analysis,
      complaint: {
        ...complaint,
        formalBody: editedBody || complaint.formalBody,
      },
      recommendedAuthority,
      status,
      userNotes,
    };

    onSaveReport(newReport);
    onShowToast('success', 'Report Saved to History', 'You can revisit or re-copy this complaint anytime under "My Reports".');
  };

  // Open Official Reporting Channel Link
  const handleOpenOfficialChannel = () => {
    handleCopyComplaint();
    handleFinalizeReport('Opened Official Channel');
    window.open(recommendedAuthority.officialPortalUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="bg-[#FBFBF9] w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
      >
        
        {/* Modal Top Header */}
        <div className="bg-[#0F382C] text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-lime-400/20 text-lime-400 flex items-center justify-center font-bold text-sm">
              {currentStep}/5
            </div>
            <div>
              <h2 className="text-lg font-bold leading-tight">Report a Civic Issue</h2>
              <p className="text-xs text-slate-300">
                {currentStep === 1 && 'Step 1: Upload or capture photograph'}
                {currentStep === 2 && 'Step 2: Confirm address & landmark'}
                {currentStep === 3 && 'Step 3: AI Gemini Vision Analysis'}
                {currentStep === 4 && 'Step 4: Review formal complaint draft'}
                {currentStep === 5 && 'Step 5: Official reporting channel guidance'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-slate-200 h-1.5 shrink-0 flex">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`h-full flex-1 transition-all duration-300 ${
                s <= currentStep ? 'bg-[#0F382C]' : 'bg-transparent'
              }`}
            />
          ))}
        </div>

        {/* Modal Scrollable Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* ================= STEP 1: UPLOAD PHOTO ================= */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="text-left space-y-1">
                <h3 className="text-xl font-bold text-slate-900">Step 1 — Upload a Photo</h3>
                <p className="text-sm text-slate-600">
                  Select or take a clear photograph showing the civic problem and its immediate surroundings.
                </p>
              </div>

              {/* Upload Drop Zone / Image Preview */}
              {!imagePreview ? (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-slate-300 hover:border-[#0F382C] bg-white rounded-3xl p-8 sm:p-12 text-center transition-all group cursor-pointer hover:shadow-sm"
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="photo-upload-input"
                  />
                  <label htmlFor="photo-upload-input" className="cursor-pointer space-y-4 block">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 text-[#0F382C] group-hover:bg-[#0F382C] group-hover:text-lime-400 group-hover:scale-110 mx-auto flex items-center justify-center transition-all duration-200">
                      <Camera className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-base font-bold text-slate-900">
                        Drag & drop photo here, or <span className="text-[#0F382C] underline">browse files</span>
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Supports JPG, PNG, WEBP up to 15MB. Mobile camera supported.
                      </p>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
                  <div className="relative rounded-2xl overflow-hidden bg-slate-900 max-h-80 flex items-center justify-center group">
                    <img
                      src={imagePreview}
                      alt="Civic Issue Upload Preview"
                      className="max-h-80 w-auto object-contain rounded-2xl"
                    />
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <label
                        htmlFor="photo-upload-replace"
                        className="px-3 py-1.5 text-xs font-bold bg-white/90 hover:bg-white text-slate-800 rounded-xl cursor-pointer shadow transition-colors flex items-center gap-1.5 active:scale-95"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Replace
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="photo-upload-replace"
                      />
                      <button
                        onClick={() => setImagePreview(null)}
                        className="px-3 py-1.5 text-xs font-bold bg-rose-600 text-white rounded-xl shadow hover:bg-rose-700 transition-colors flex items-center gap-1 active:scale-95 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>File: {imageFileName}</span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600" /> Photo Ready for Analysis
                    </span>
                  </div>
                </div>
              )}

              {/* Sample Loader Buttons for instant testing */}
              <div className="pt-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Or load a sample test issue instantly:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {SAMPLE_CIVIC_ISSUES.map((sample) => (
                    <button
                      key={sample.id}
                      onClick={() => {
                        setImagePreview(sample.imageUrl);
                        setImageFileName(`${sample.id}.jpg`);
                        setLocation(sample.location);
                        setAnalysis(sample.analysis);
                        setRecommendedAuthority(getAuthorityForCategory(sample.category));
                        onShowToast('info', 'Sample Loaded', sample.title);
                      }}
                      className="p-3 bg-white border border-slate-200 hover:border-[#0F382C] rounded-2xl text-left transition-all hover:shadow-xs active:scale-98 cursor-pointer hover:bg-emerald-50/40"
                    >
                      <p className="text-xs font-bold text-slate-900 truncate">{sample.category}</p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{sample.location.area}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Nav */}
              <div className="flex justify-end pt-4 border-t border-slate-200">
                <button
                  disabled={!imagePreview}
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 bg-[#0F382C] text-white hover:bg-[#164d3c] active:scale-98 disabled:opacity-40 font-bold rounded-2xl transition-all flex items-center gap-2 cursor-pointer shadow-xs hover:shadow"
                >
                  <span>Next: Add Location</span>
                  <ArrowRight className="w-4 h-4 text-lime-400" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ================= STEP 2: ADD LOCATION ================= */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="text-left space-y-1">
                <h3 className="text-xl font-bold text-slate-900">Step 2 — Add Location & Landmark</h3>
                <p className="text-sm text-slate-600">
                  Municipal inspection teams rely heavily on accurate street details and nearby landmarks to find the issue.
                </p>
              </div>

              {/* GPS Auto Button */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0F382C] text-lime-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Detect Current GPS Location</p>
                    <p className="text-xs text-slate-600">Request browser GPS access for high-precision coordinates.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleFetchGps}
                  disabled={gpsLoading}
                  className="px-4 py-2 bg-[#0F382C] text-white hover:bg-[#164d3c] active:scale-98 text-xs font-bold rounded-xl transition-all shrink-0 flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  {gpsLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <MapPin className="w-3.5 h-3.5 text-lime-400" />}
                  <span>{gpsLoading ? 'Detecting...' : 'Use My Location'}</span>
                </button>
              </div>

              {/* Location Fields Form */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      City / Municipal Region
                    </label>
                    <input
                      type="text"
                      value={location.city}
                      onChange={(e) => setLocation({ ...location, city: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-[#0F382C] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Area / Neighborhood
                    </label>
                    <input
                      type="text"
                      value={location.area}
                      onChange={(e) => setLocation({ ...location, area: e.target.value })}
                      placeholder="e.g. Jubilee Hills, Madhapur"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-[#0F382C] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Street Name / Road Number
                  </label>
                  <input
                    type="text"
                    value={location.street}
                    onChange={(e) => setLocation({ ...location, street: e.target.value })}
                    placeholder="e.g. Road No. 36, 100 Feet Road"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-[#0F382C] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nearest Landmark / Pillar Number (Crucial)
                  </label>
                  <input
                    type="text"
                    value={location.landmark}
                    onChange={(e) => setLocation({ ...location, landmark: e.target.value })}
                    placeholder="e.g. Opposite Metro Pillar 1640, Beside Fuel Pump"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-[#0F382C] outline-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-5 py-2.5 text-slate-600 hover:text-slate-900 text-sm font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>

                <button
                  onClick={handleRunAnalysis}
                  className="px-6 py-3 bg-[#0F382C] text-white hover:bg-[#164d3c] active:scale-98 font-bold rounded-2xl transition-all flex items-center gap-2 shadow cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-lime-400" />
                  <span>Analyze with Gemini AI</span>
                  <ArrowRight className="w-4 h-4 text-lime-400" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ================= STEP 3: AI ANALYSIS ================= */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              
              {/* Loading Scan State with Scanning Light Beam Microanimation */}
              {isAnalyzing ? (
                <div className="py-12 text-center space-y-6">
                  
                  {/* Photo with active Scanning Beam Laser */}
                  {imagePreview && (
                    <div className="relative w-64 h-44 mx-auto rounded-2xl overflow-hidden border-2 border-[#0F382C] shadow-lg bg-slate-900">
                      <img
                        src={imagePreview}
                        alt="Scanning"
                        className="w-full h-full object-cover opacity-80"
                      />
                      {/* Laser Beam Sweep Line */}
                      <div className="absolute left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-lime-400 to-transparent shadow-[0_0_15px_#a3e635] animate-scan-beam" />
                      
                      <div className="absolute inset-0 bg-emerald-950/20 backdrop-blur-[1px]" />
                      <div className="absolute bottom-2 left-2 right-2 bg-black/70 backdrop-blur-md text-lime-300 text-[11px] font-mono py-1 px-2.5 rounded-lg border border-lime-400/30 flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-3 h-3 animate-spin" />
                          Gemini Vision Scan
                        </span>
                        <span className="font-bold">
                          {analysisStepIndex === 0 && '35%'}
                          {analysisStepIndex === 1 && '70%'}
                          {analysisStepIndex === 2 && '95%'}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 max-w-sm mx-auto">
                    <h4 className="text-lg font-bold text-slate-900">
                      {analysisStepIndex === 0 && 'Scanning Image Features...'}
                      {analysisStepIndex === 1 && 'Extracting Visual Evidence & Scale...'}
                      {analysisStepIndex === 2 && 'Assessing Severity & Safety Impact...'}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Google Gemini AI is evaluating the issue type and evidence.
                    </p>
                  </div>
                </div>
              ) : (
                /* Analysis Results View */
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Step 3 — AI Vision Breakdown</h3>
                      <p className="text-sm text-slate-600">Review the evidence detected by Google Gemini AI.</p>
                    </div>
                    {analysis?.isDemoFallback && (
                      <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold shrink-0">
                        Demonstration Mode Analysis
                      </span>
                    )}
                  </div>

                  {/* Result Summary Card */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-6 border-b border-slate-100">
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Issue Category
                        </span>
                        <p className="text-base font-extrabold text-[#0F382C]">
                          {analysis?.issueType}
                        </p>
                      </div>

                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Evaluated Severity
                        </span>
                        <span className={`inline-block px-3 py-0.5 text-xs font-bold rounded-full ${
                          analysis?.severity === 'High' || analysis?.severity === 'Critical'
                            ? 'bg-rose-100 text-rose-800 animate-pulse-glow'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {analysis?.severity} Severity
                        </span>
                      </div>

                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Assigned Authority
                        </span>
                        <p className="text-sm font-bold text-slate-800">
                          {recommendedAuthority.shortCode} ({recommendedAuthority.city})
                        </p>
                      </div>
                    </div>

                    {/* Evidence & Details */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Observed Visual Evidence
                        </h4>
                        <ul className="space-y-1.5">
                          {analysis?.visualEvidence.map((item, idx) => (
                            <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#0F382C] mt-1.5 shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Public Safety Implications
                        </h4>
                        <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                          {analysis?.safetyImplications}
                        </p>
                      </div>

                      {/* User Notes Input */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Add Optional Citizen Remarks (e.g. "Water leaking for 3 days")
                        </label>
                        <input
                          type="text"
                          value={userNotes}
                          onChange={(e) => setUserNotes(e.target.value)}
                          placeholder="Provide any additional context or duration..."
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-[#0F382C] outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="px-5 py-2.5 text-slate-600 hover:text-slate-900 text-sm font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to Location
                    </button>

                    <button
                      onClick={handleGenerateComplaint}
                      disabled={isGeneratingComplaint}
                      className="px-6 py-3 bg-[#0F382C] text-white hover:bg-[#164d3c] active:scale-98 font-bold rounded-2xl transition-all flex items-center gap-2 shadow cursor-pointer"
                    >
                      {isGeneratingComplaint ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-lime-400" />
                          <span>Generating Formal Letter...</span>
                        </>
                      ) : (
                        <>
                          <FileText className="w-4 h-4 text-lime-400" />
                          <span>Generate Formal Complaint</span>
                          <ArrowRight className="w-4 h-4 text-lime-400" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

            </motion.div>
          )}

          {/* ================= STEP 4: COMPLAINT GENERATED ================= */}
          {currentStep === 4 && complaint && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Step 4 — Review Complaint Draft</h3>
                  <p className="text-sm text-slate-600">
                    Formatted according to Indian municipal grievance guidelines.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsEditingBody(!isEditingBody)}
                    className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer active:scale-95"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#0F382C]" />
                    {isEditingBody ? 'View Formatted' : 'Edit Text'}
                  </button>

                  <button
                    onClick={handleCopyComplaint}
                    className="px-4 py-1.5 bg-[#0F382C] text-white hover:bg-[#164d3c] text-xs font-bold rounded-xl flex items-center gap-1.5 shadow transition-all cursor-pointer active:scale-95"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-lime-400 animate-pop-in" /> : <Copy className="w-3.5 h-3.5 text-lime-400" />}
                    <span>{copied ? 'Copied!' : 'Copy Complaint'}</span>
                  </button>
                </div>
              </div>

              {/* Subject Line Display */}
              <div className="p-3.5 bg-slate-900 text-white rounded-2xl font-mono text-xs shadow-xs">
                <span className="text-slate-400 font-sans block text-[10px] uppercase font-bold tracking-wider mb-0.5">
                  Subject Line:
                </span>
                <p className="font-semibold text-lime-300">{complaint.subject}</p>
              </div>

              {/* Letter Body (Edit vs View) */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                {isEditingBody ? (
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Customizing Complaint Body:
                    </label>
                    <textarea
                      rows={12}
                      value={editedBody}
                      onChange={(e) => setEditedBody(e.target.value)}
                      className="w-full p-4 font-mono text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-[#0F382C] outline-none leading-relaxed"
                    />
                  </div>
                ) : (
                  <div className="prose prose-slate max-w-none">
                    <pre className="font-sans text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80">
                      {editedBody || complaint.formalBody}
                    </pre>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-5 py-2.5 text-slate-600 hover:text-slate-900 text-sm font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>

                <button
                  onClick={() => setCurrentStep(5)}
                  className="px-6 py-3 bg-[#0F382C] text-white hover:bg-[#164d3c] active:scale-98 font-bold rounded-2xl transition-all flex items-center gap-2 shadow cursor-pointer"
                >
                  <span>Next: Official Guidance</span>
                  <ArrowRight className="w-4 h-4 text-lime-400" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ================= STEP 5: OFFICIAL CHANNELS & GUIDANCE ================= */}
          {currentStep === 5 && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="text-left space-y-1">
                <h3 className="text-xl font-bold text-slate-900">Step 5 — Official Reporting Guidance</h3>
                <p className="text-sm text-slate-600">
                  Submit your copied grievance letter through the verified municipal portal.
                </p>
              </div>

              {/* Honest Submission Disclaimer */}
              <div className="bg-amber-50 border border-amber-300/80 rounded-2xl p-4 flex items-start gap-3 text-amber-900">
                <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <p className="font-bold">Important Honest Notice</p>
                  <p className="mt-0.5 text-amber-800">
                    CivicSnap prepares your evidence-backed report. To complete your grievance submission, please click the button below to open the official government portal and paste your copied complaint.
                  </p>
                </div>
              </div>

              {/* Recommended Authority Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
                <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-md text-xs font-bold">
                        Verified Authority
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        {recommendedAuthority.city} Region
                      </span>
                    </div>
                    <h4 className="text-lg font-extrabold text-slate-900 mt-1">
                      {recommendedAuthority.name}
                    </h4>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {recommendedAuthority.description}
                </p>

                {/* Helpline & Apps */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <div>
                    <span className="font-bold text-slate-500 block text-[10px] uppercase">Helpline</span>
                    <span className="font-bold text-slate-900">{recommendedAuthority.helpline}</span>
                  </div>
                  {recommendedAuthority.mobileApp && (
                    <div>
                      <span className="font-bold text-slate-500 block text-[10px] uppercase">Official App</span>
                      <span className="font-bold text-slate-900">{recommendedAuthority.mobileApp}</span>
                    </div>
                  )}
                  {recommendedAuthority.twitterHandle && (
                    <div>
                      <span className="font-bold text-slate-500 block text-[10px] uppercase">Twitter Support</span>
                      <span className="font-bold text-slate-900">{recommendedAuthority.twitterHandle}</span>
                    </div>
                  )}
                </div>

                {/* Instructions List */}
                <div>
                  <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    How to Submit on Official Portal:
                  </h5>
                  <ol className="space-y-1.5 text-xs text-slate-700">
                    {recommendedAuthority.submissionInstructions.map((inst, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="font-mono font-bold text-[#0F382C] shrink-0">{i + 1}.</span>
                        <span>{inst}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Main Actions */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={handleOpenOfficialChannel}
                  className="w-full py-4 bg-[#0F382C] hover:bg-[#164d3c] active:scale-[0.99] text-white font-extrabold rounded-2xl text-sm transition-all shadow-lg flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Open Official {recommendedAuthority.shortCode} Reporting Channel</span>
                  <ExternalLink className="w-4 h-4 text-lime-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleCopyComplaint}
                    className="py-3 bg-white border border-slate-300 hover:bg-slate-50 active:scale-98 text-slate-800 font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5 text-[#0F382C]" />
                    <span>{copied ? 'Complaint Copied!' : 'Copy Complaint Text'}</span>
                  </button>

                  <button
                    onClick={() => {
                      handleFinalizeReport('Ready to Report');
                      onClose();
                    }}
                    className="py-3 bg-slate-100 hover:bg-slate-200 active:scale-98 text-slate-800 font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" />
                    <span>Save to My Reports</span>
                  </button>
                </div>
              </div>

            </motion.div>
          )}

        </div>
      </motion.div>
    </div>
  );
};
