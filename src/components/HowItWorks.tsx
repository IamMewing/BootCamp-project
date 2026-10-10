import React from 'react';
import { Camera, Sparkles, MapPin, Send, Check } from 'lucide-react';
import { motion } from 'motion/react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      icon: Camera,
      title: 'Snap or Upload Photo',
      description: 'Take a quick photograph of any pothole, overflowing garbage bin, water leak, or broken streetlight using your phone or desktop.',
      detail: 'Supports drag & drop, mobile camera capture, or sample selection.',
    },
    {
      number: '02',
      icon: Sparkles,
      title: 'AI Analyzes the Problem',
      description: 'Google Gemini AI analyzes the image, identifies the category, evaluates visual evidence, and assesses safety risks.',
      detail: 'Provides neutral evidence facts without assumptions.',
    },
    {
      number: '03',
      icon: MapPin,
      title: 'Confirm Location',
      description: 'Use auto GPS coordinates or enter street details and nearby landmarks so inspectors can easily find the spot.',
      detail: 'City-specific routing for Hyderabad & municipal authorities.',
    },
    {
      number: '04',
      icon: Send,
      title: 'Copy & Send to Official Channel',
      description: 'CivicSnap generates a formal municipal grievance draft and connects you directly to the verified official portal.',
      detail: 'Copy letter in 1 click and open GHMC / HMWSSB / TSSPDCL portal.',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0F382C] uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
            <span className="w-2 h-2 rounded-full bg-lime-500 animate-ping" />
            <span>Simple 4-Step Journey</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How CivicSnap Transforms Photos into Action
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal">
            No confusion over which department to email. CivicSnap handles the heavy lifting so your complaint is clear, structured, and ready to submit.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="bg-[#FBFBF9] rounded-2xl p-6 border border-slate-200/90 relative hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between hover:border-[#0F382C]/40"
              >
                <div>
                  {/* Step Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#0F382C] text-lime-400 flex items-center justify-center group-hover:bg-[#164d3c] group-hover:scale-110 transition-all duration-300 shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-3xl font-extrabold text-slate-300 font-mono group-hover:text-[#0F382C]/30 transition-colors">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-[#0F382C] transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    {step.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200/70 text-xs text-slate-500 font-medium flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>{step.detail}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
