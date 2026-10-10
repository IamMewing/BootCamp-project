import React from 'react';
import { SAMPLE_CIVIC_ISSUES } from '../data/sampleIssues';
import { SampleCivicIssue } from '../types';
import { Sparkles, MapPin, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface InteractiveShowcaseProps {
  onSelectSample: (sample: SampleCivicIssue) => void;
}

export const InteractiveShowcase: React.FC<InteractiveShowcaseProps> = ({ onSelectSample }) => {
  return (
    <section id="demo-showcase" className="py-20 bg-[#FBFBF9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0F382C] uppercase tracking-wider mb-2 bg-emerald-50/80 px-3 py-1 rounded-full border border-emerald-200/60">
              <span className="w-2 h-2 rounded-full bg-lime-500 animate-ping" />
              <span>Interactive Test Scenarios</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Test CivicSnap on Real Examples
            </h2>
            <p className="text-slate-600 mt-1 max-w-2xl text-sm sm:text-base">
              Don't have a photo on hand? Select any verified municipal scenario below to experience instant AI vision analysis and formal complaint generation.
            </p>
          </div>
        </div>

        {/* Sample Cards Grid with staggered entrance animation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SAMPLE_CIVIC_ISSUES.map((sample, idx) => (
            <motion.div
              key={sample.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Image Container */}
                <div className="relative h-44 bg-slate-800 overflow-hidden">
                  <img
                    src={sample.imageUrl}
                    alt={sample.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 text-xs font-bold bg-[#0F382C] text-white rounded-md shadow-sm">
                      {sample.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-0.5 text-xs font-extrabold rounded-md ${
                      sample.analysis.severity === 'High' ? 'bg-rose-500 text-white animate-pulse-glow' : 'bg-amber-500 text-white'
                    }`}>
                      {sample.analysis.severity} Severity
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2 group-hover:text-[#0F382C] transition-colors">
                    {sample.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{sample.location.area}, {sample.location.city}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 text-slate-600 border border-slate-200/60 group-hover:bg-emerald-50/50 transition-colors">
                    <div className="flex items-center justify-between text-[#0F382C] font-semibold text-[11px]">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        AI Assessment
                      </span>
                      <span>{Math.round(sample.analysis.confidenceScore * 100)}% Match</span>
                    </div>
                    <p className="line-clamp-2 text-slate-700 leading-tight">
                      {sample.analysis.conciseDescription}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => onSelectSample(sample)}
                  className="w-full py-2.5 px-4 bg-[#0F382C] hover:bg-[#164d3c] active:scale-98 text-white font-bold rounded-xl text-xs transition-all duration-200 flex items-center justify-center gap-2 group-hover:shadow-md cursor-pointer"
                >
                  <span>Test Reporting Workflow</span>
                  <ArrowRight className="w-3.5 h-3.5 text-lime-400 group-hover:translate-x-1.5 transition-transform duration-200" />
                </button>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
