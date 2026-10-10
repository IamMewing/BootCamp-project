import React, { useState } from 'react';
import { Camera, Menu, X, PlusCircle, FileText, Building2, HelpCircle } from 'lucide-react';

interface HeaderProps {
  activeTab: 'landing' | 'report' | 'my-reports' | 'authorities';
  setActiveTab: (tab: 'landing' | 'report' | 'my-reports' | 'authorities') => void;
  savedReportsCount: number;
  onOpenReportFlow: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  savedReportsCount,
  onOpenReportFlow,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (tab: 'landing' | 'report' | 'my-reports' | 'authorities', sectionId?: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    if (sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FBFBF9]/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => handleNav('landing')}
          className="flex items-center gap-2.5 text-left focus:outline-none focus:ring-2 focus:ring-[#0F382C] rounded-lg p-1 group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#0F382C] flex items-center justify-center text-lime-400 shadow-sm group-hover:bg-[#164d3c] transition-colors">
            <Camera className="w-5 h-5" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900 whitespace-nowrap shrink-0">
            Civic<span className="text-[#0F382C]">Snap</span>
          </span>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <button
            onClick={() => handleNav('landing', 'how-it-works')}
            className={`hover:text-[#0F382C] transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'landing' ? 'text-[#0F382C]' : ''
            }`}
          >
            How It Works
          </button>

          <button
            onClick={() => handleNav('landing', 'demo-showcase')}
            className="hover:text-[#0F382C] transition-colors whitespace-nowrap shrink-0 text-slate-600"
          >
            Demo Showcase
          </button>

          <button
            onClick={() => handleNav('authorities')}
            className={`hover:text-[#0F382C] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'authorities' ? 'text-[#0F382C] font-bold' : ''
            }`}
          >
            Official Channels
          </button>

          <button
            onClick={() => handleNav('my-reports')}
            className={`hover:text-[#0F382C] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'my-reports' ? 'text-[#0F382C] font-bold' : ''
            }`}
          >
            My Reports
            {savedReportsCount > 0 && (
              <span className="ml-1 px-2 py-0.5 text-xs font-bold bg-[#0F382C] text-lime-300 rounded-full">
                {savedReportsCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: Primary CTA */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenReportFlow}
            className="px-5 py-2.5 text-sm font-bold text-white bg-[#0F382C] hover:bg-[#164d3c] active:bg-[#0a261d] rounded-xl transition-all shadow-sm hover:shadow flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <PlusCircle className="w-4 h-4 text-lime-400" />
            Report an Issue
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onOpenReportFlow}
            className="px-3.5 py-2 text-xs font-bold text-white bg-[#0F382C] rounded-lg flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5 text-lime-400" />
            Report
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 py-4 space-y-3">
          <button
            onClick={() => handleNav('landing', 'how-it-works')}
            className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
          >
            <HelpCircle className="w-4 h-4 text-[#0F382C]" />
            How It Works
          </button>
          <button
            onClick={() => handleNav('authorities')}
            className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
          >
            <Building2 className="w-4 h-4 text-[#0F382C]" />
            Official Channels
          </button>
          <button
            onClick={() => handleNav('my-reports')}
            className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-between"
          >
            <span className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-[#0F382C]" />
              My Reports
            </span>
            {savedReportsCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold bg-[#0F382C] text-lime-300 rounded-full">
                {savedReportsCount}
              </span>
            )}
          </button>
        </div>
      )}
    </header>
  );
};
