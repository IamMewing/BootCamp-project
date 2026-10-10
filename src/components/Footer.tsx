import React from 'react';
import { Camera, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: 'landing' | 'report' | 'my-reports' | 'authorities') => void;
  onOpenReportFlow: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onOpenReportFlow }) => {
  return (
    <footer className="bg-[#0F382C] text-white pt-16 pb-12 border-t border-emerald-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-emerald-800/60">
          {/* Col 1: Brand */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-lime-400 text-[#0F382C] flex items-center justify-center font-bold">
                <Camera className="w-5 h-5" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white">
                Civic<span className="text-lime-400">Snap</span>
              </span>
            </div>
            <p className="text-sm text-slate-300 max-w-sm leading-relaxed">
              Empowering citizens to turn everyday infrastructure problems into clear, evidence-backed complaints ready for municipal action.
            </p>
            <div className="text-xs text-lime-300 flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-lime-400" />
              <span>Verified Municipal Guidance · Citizen First</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="md:col-span-3 space-y-3">
            <p className="text-xs font-bold uppercase text-lime-400 tracking-wider">Quick Navigation</p>
            <ul className="space-y-2 text-sm text-slate-300 font-medium">
              <li>
                <button onClick={() => setActiveTab('landing')} className="hover:text-white transition-colors">
                  Home & Overview
                </button>
              </li>
              <li>
                <button onClick={onOpenReportFlow} className="hover:text-white transition-colors">
                  Report an Issue
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('authorities')} className="hover:text-white transition-colors">
                  Official Channels
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('my-reports')} className="hover:text-white transition-colors">
                  My Saved Reports
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Hyderabad Municipal Portals */}
          <div className="md:col-span-4 space-y-3">
            <p className="text-xs font-bold uppercase text-lime-400 tracking-wider">Official Channels</p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <a href="https://www.ghmc.gov.in/" target="_blank" rel="noreferrer" className="hover:text-lime-300 transition-colors">
                  GHMC Portal (Greater Hyderabad Municipal Corp)
                </a>
              </li>
              <li>
                <a href="https://www.hyderabadwater.gov.in/" target="_blank" rel="noreferrer" className="hover:text-lime-300 transition-colors">
                  HMWSSB Portal (Water Supply & Sewerage Board)
                </a>
              </li>
              <li>
                <a href="https://www.tssouthernpower.com/" target="_blank" rel="noreferrer" className="hover:text-lime-300 transition-colors">
                  TSSPDCL Electricity Grievance Portal
                </a>
              </li>
              <li>
                <a href="https://www.hyderabadtrafficpolice.gov.in/" target="_blank" rel="noreferrer" className="hover:text-lime-300 transition-colors">
                  Hyderabad Traffic Police WhatsApp & HawkEye
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} CivicSnap. Built with passion for better civic infrastructure.</p>
          <div className="flex items-center gap-2">
            <span>Powered by Google Gemini AI</span>
            <span>·</span>
            <span>Public Civic Tool</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
