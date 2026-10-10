import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { InteractiveShowcase } from './components/InteractiveShowcase';
import { ReportingWorkflow } from './components/ReportingWorkflow';
import { MyReports } from './components/MyReports';
import { AuthorityDirectory } from './components/AuthorityDirectory';
import { Footer } from './components/Footer';
import { Toast, ToastMessage } from './components/Toast';
import { SavedReport, SampleCivicIssue, LocalReportStatus } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'landing' | 'report' | 'my-reports' | 'authorities'>('landing');
  const [isReportWorkflowOpen, setIsReportWorkflowOpen] = useState(false);
  const [selectedSampleForWorkflow, setSelectedSampleForWorkflow] = useState<SampleCivicIssue | null>(null);

  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Load saved reports from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('civicsnap_reports');
      if (stored) {
        setSavedReports(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Failed to load reports from localStorage:', e);
    }
  }, []);

  // Save report to state and localStorage
  const handleSaveReport = (report: SavedReport) => {
    setSavedReports((prev) => {
      const existingIdx = prev.findIndex((r) => r.id === report.id);
      let updated: SavedReport[];
      if (existingIdx >= 0) {
        updated = [...prev];
        updated[existingIdx] = report;
      } else {
        updated = [report, ...prev];
      }
      try {
        localStorage.setItem('civicsnap_reports', JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to persist report to localStorage:', e);
      }
      return updated;
    });
  };

  // Update report status in localStorage
  const handleUpdateStatus = (id: string, newStatus: LocalReportStatus) => {
    setSavedReports((prev) => {
      const updated = prev.map((r) => (r.id === id ? { ...r, status: newStatus, updatedAt: new Date().toISOString() } : r));
      try {
        localStorage.setItem('civicsnap_reports', JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save status update to localStorage:', e);
      }
      return updated;
    });
  };

  // Delete report
  const handleDeleteReport = (id: string) => {
    setSavedReports((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      try {
        localStorage.setItem('civicsnap_reports', JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save deletion to localStorage:', e);
      }
      return updated;
    });
    showToast('info', 'Report Deleted', 'The saved report was removed from history.');
  };

  // Toast Helper
  const showToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    setToast({
      id: `toast-${Date.now()}`,
      type,
      title,
      message,
    });
  };

  // Open reporting flow modal
  const handleOpenReportFlow = (sample?: SampleCivicIssue) => {
    setSelectedSampleForWorkflow(sample || null);
    setIsReportWorkflowOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBF9] text-slate-800 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedReportsCount={savedReports.length}
        onOpenReportFlow={() => handleOpenReportFlow()}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'landing' && (
          <>
            <Hero
              onStartReporting={() => handleOpenReportFlow()}
              onSelectSample={(sample) => handleOpenReportFlow(sample)}
            />
            <HowItWorks />
            <InteractiveShowcase
              onSelectSample={(sample) => handleOpenReportFlow(sample)}
            />
          </>
        )}

        {activeTab === 'my-reports' && (
          <MyReports
            reports={savedReports}
            onUpdateStatus={handleUpdateStatus}
            onDeleteReport={handleDeleteReport}
            onShowToast={showToast}
            onOpenNewReport={() => handleOpenReportFlow()}
          />
        )}

        {activeTab === 'authorities' && <AuthorityDirectory />}
      </main>

      {/* Reporting Workflow Modal */}
      {isReportWorkflowOpen && (
        <ReportingWorkflow
          initialSample={selectedSampleForWorkflow}
          onClose={() => {
            setIsReportWorkflowOpen(false);
            setSelectedSampleForWorkflow(null);
          }}
          onSaveReport={handleSaveReport}
          onShowToast={showToast}
        />
      )}

      {/* Footer */}
      <Footer
        setActiveTab={setActiveTab}
        onOpenReportFlow={() => handleOpenReportFlow()}
      />

      {/* Toast Notifications */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
