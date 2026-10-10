import React from 'react';
import { Camera, ArrowRight, ShieldCheck, Sparkles, MapPin, CheckCircle2, FileText, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { SAMPLE_CIVIC_ISSUES } from '../data/sampleIssues';
import { SampleCivicIssue } from '../types';

interface HeroProps {
  onStartReporting: () => void;
  onSelectSample: (sample: SampleCivicIssue) => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartReporting, onSelectSample }) => {
  const featuredSample = SAMPLE_CIVIC_ISSUES[0];

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 bg-[#FBFBF9]">
      {/* Background Subtle Gradient Blobs with floating animation */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden opacity-40">
        <div className="absolute top-[-10%] right-[10%] w-[500px] h-[500px] rounded-full bg-emerald-200/40 blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute bottom-[5%] left-[5%] w-[400px] h-[400px] rounded-full bg-lime-200/30 blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-8 text-left"
          >
            {/* Kicker tag */}
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0F382C] uppercase tracking-wider bg-emerald-50/80 px-3 py-1 rounded-full border border-emerald-200/60 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-lime-500 animate-ping" />
              <span>AI-Powered Municipal Grievance Intelligence</span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-500 font-medium lowercase">hyderabad & urban centers</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] text-balance">
              See a problem. <br />
              <span className="text-[#0F382C] relative inline-block">
                Snap it.
                <span className="absolute bottom-1 left-0 w-full h-2 bg-lime-300/60 -z-10 rounded-xs" />
              </span> <br />
              Start the change.
            </h1>

            {/* Supporting text */}
            <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-xl">
              Turn everyday civic issues into clear, actionable, evidence-backed complaints ready for official municipal authorities in minutes.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={onStartReporting}
                className="px-8 py-4 text-base font-bold text-white bg-[#0F382C] hover:bg-[#164d3c] active:scale-[0.98] rounded-2xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group hover:scale-[1.02] duration-200 cursor-pointer"
              >
                <Camera className="w-5 h-5 text-lime-400 group-hover:rotate-12 transition-transform duration-300" />
                <span>Report an Issue Now</span>
                <ArrowRight className="w-5 h-5 text-lime-400 group-hover:translate-x-1.5 transition-transform duration-200" />
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('how-it-works');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-4 text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-2xl transition-all shadow-xs hover:shadow-sm text-center active:scale-[0.98] cursor-pointer"
              >
                Explore How It Works
              </button>
            </div>

            {/* Quick Trust Statements */}
            <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1.5 hover:text-slate-800 transition-colors">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Verified GHMC & Municipal Guidance</span>
              </div>
              <div className="flex items-center gap-1.5 hover:text-slate-800 transition-colors">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <span>Powered by Gemini AI Vision</span>
              </div>
              <div className="flex items-center gap-1.5 hover:text-slate-800 transition-colors">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>100% Free & Citizen First</span>
              </div>
            </div>
          </motion.div>

          {/* Right Hero Column: Signature Visual Transformation Journey */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative"
          >
            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-200/90 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
              
              {/* Top Card Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="ml-2 text-xs font-mono font-medium text-slate-400">Live AI Transformation Preview</span>
                </div>
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md flex items-center gap-1.5 border border-emerald-200/60">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                  GHMC Ready Draft
                </span>
              </div>

              {/* Transformation Workflow Steps */}
              <div className="space-y-4">
                
                {/* Visual Step 1: Input Photo */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center gap-4 hover:border-[#0F382C]/30 transition-all">
                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-slate-300 relative bg-slate-800 group-hover:scale-105 transition-transform duration-300">
                    <img
                      src={featuredSample.imageUrl}
                      alt={featuredSample.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-1 right-1 bg-black/70 text-white p-1 rounded backdrop-blur-xs">
                      <Camera className="w-3 h-3" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                      <span>Step 1: Photo Upload</span>
                      <span>·</span>
                      <span className="text-emerald-700 font-semibold">Jubilee Hills, Hyderabad</span>
                    </div>
                    <p className="text-sm font-bold text-slate-900 truncate mt-0.5">
                      {featuredSample.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      Road No. 36, Near Peddamma Temple Metro Station
                    </p>
                  </div>
                </div>

                {/* Visual Step 2: AI Vision Breakdown */}
                <div className="p-3.5 bg-[#0F382C] text-white rounded-2xl shadow-sm relative overflow-hidden group-hover:bg-[#144839] transition-colors">
                  <div className="flex items-center justify-between text-xs text-lime-400 font-semibold mb-2">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
                      Step 2: AI Gemini Vision Analysis
                    </span>
                    <span className="bg-emerald-900/90 text-lime-300 px-2 py-0.5 rounded text-[11px] font-mono border border-lime-400/30">
                      94% Confidence
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-200">
                    <p className="font-semibold text-white">
                      Identified: <span className="text-lime-300 font-bold">Road Damage / Pothole (High Severity)</span>
                    </p>
                    <p className="text-slate-300 line-clamp-2">
                      Visible 1.2m asphalt erosion with exposed sub-base gravel. High risk to two-wheelers during rush hours.
                    </p>
                  </div>
                </div>

                {/* Visual Step 3: Formal Generated Complaint */}
                <div className="p-3.5 bg-amber-50/80 border border-amber-200/90 rounded-2xl text-slate-800 hover:bg-amber-50 transition-colors">
                  <div className="flex items-center justify-between text-xs font-semibold text-amber-900 mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-amber-700" />
                      Step 3: Official Grievance Draft
                    </span>
                    <span className="text-amber-800 font-medium">Auto-formatted for GHMC</span>
                  </div>
                  <p className="text-xs font-bold text-slate-900 font-mono line-clamp-1">
                    Subject: [URGENT ATTENTION REQUIRED] Civic Grievance: Road Damage at Jubilee Hills Rd 36
                  </p>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 italic">
                    "I respectfully request the GHMC Road Maintenance Department to inspect and repair the asphalt erosion near Metro Pillar 1640..."
                  </p>
                </div>

              </div>

              {/* Action Bar at bottom of card */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectSample(featuredSample)}
                  className="w-full py-3 px-4 bg-[#0F382C] text-white hover:bg-[#164d3c] active:scale-[0.99] rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 group/btn cursor-pointer shadow-xs hover:shadow-md"
                >
                  <span>Test Reporting Workflow with This Example</span>
                  <ExternalLink className="w-3.5 h-3.5 text-lime-400 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </button>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
