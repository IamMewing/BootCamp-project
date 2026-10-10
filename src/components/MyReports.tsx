import React, { useState } from 'react';
import { SavedReport, LocalReportStatus } from '../types';
import {
  FileText, MapPin, Calendar, Copy, Check, Trash2, ExternalLink,
  Search, Filter, Eye, ChevronRight, Download, CheckCircle2, AlertCircle, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MyReportsProps {
  reports: SavedReport[];
  onUpdateStatus: (id: string, newStatus: LocalReportStatus) => void;
  onDeleteReport: (id: string) => void;
  onShowToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
  onOpenNewReport: () => void;
}

export const MyReports: React.FC<MyReportsProps> = ({
  reports,
  onUpdateStatus,
  onDeleteReport,
  onShowToast,
  onOpenNewReport,
}) => {
  const [selectedReport, setSelectedReport] = useState<SavedReport | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filtered reports list
  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.analysis.issueType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.location.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.location.street.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.location.landmark.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || r.status.toLowerCase().replace(/\s+/g, '-') === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
    onShowToast('success', 'Complaint Copied', 'Copied formal grievance text to clipboard.');
  };

  // Status Badge Colors (Honest local statuses)
  const getStatusBadge = (status: LocalReportStatus) => {
    switch (status) {
      case 'Submission Confirmed by User':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'Opened Official Channel':
        return 'bg-sky-100 text-sky-900 border-sky-300';
      case 'Ready to Report':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            My Civic Reports
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Access, manage, and re-copy your saved evidence-backed complaints anytime.
          </p>
        </div>

        <button
          onClick={onOpenNewReport}
          className="px-5 py-2.5 bg-[#0F382C] text-white hover:bg-[#164d3c] active:scale-98 font-bold rounded-2xl text-sm transition-all shadow-xs shrink-0 flex items-center gap-2 cursor-pointer"
        >
          <FileText className="w-4 h-4 text-lime-400" />
          <span>Create New Report</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by category, locality, or landmark..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0F382C] outline-none"
          />
        </div>

        {/* Status Filter segmented tabs (interactive button elements) */}
        <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-xl overflow-x-auto shrink-0">
          {[
            { id: 'all', label: 'All Reports' },
            { id: 'ready-to-report', label: 'Ready to Report' },
            { id: 'opened-official-channel', label: 'Opened Portal' },
            { id: 'submission-confirmed-by-user', label: 'Confirmed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-white text-[#0F382C] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Grid or Empty State */}
      {filteredReports.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 space-y-4 max-w-lg mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">No Reports Found</h3>
            <p className="text-xs text-slate-500 mt-1">
              {reports.length === 0
                ? 'You have not created any civic issue reports yet.'
                : 'No reports match your current filter query.'}
            </p>
          </div>
          {reports.length === 0 && (
            <button
              onClick={onOpenNewReport}
              className="px-5 py-2.5 bg-[#0F382C] text-white font-bold text-xs rounded-xl hover:bg-[#164d3c] transition-colors cursor-pointer"
            >
              Report Your First Issue
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredReports.map((report) => (
              <motion.div
                key={report.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Image Header */}
                  <div className="relative h-44 bg-slate-900 overflow-hidden">
                    <img
                      src={report.imageDataUrl}
                      alt={report.analysis.issueType}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 text-xs font-bold bg-[#0F382C] text-white rounded-md shadow-xs">
                        {report.analysis.issueType}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className={`px-2.5 py-1 text-[11px] font-bold border rounded-md shadow-xs ${getStatusBadge(report.status)}`}>
                        {report.status}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{report.location.street}, {report.location.area}</span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {report.analysis.conciseDescription}
                    </p>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Created: {new Date(report.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-5 pt-0 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedReport(report)}
                    className="flex-1 py-2.5 bg-[#0F382C] text-white hover:bg-[#164d3c] active:scale-98 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Eye className="w-3.5 h-3.5 text-lime-400" />
                    <span>View Details</span>
                  </button>

                  <button
                    onClick={() => handleCopy(report.complaint.formalBody, report.id)}
                    className="p-2.5 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 rounded-xl transition-all cursor-pointer"
                    title="Copy Complaint"
                  >
                    {copiedId === report.id ? <Check className="w-4 h-4 text-emerald-700 animate-pop-in" /> : <Copy className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => onDeleteReport(report.id)}
                    className="p-2.5 bg-rose-50 hover:bg-rose-100 active:scale-95 text-rose-700 rounded-xl transition-all cursor-pointer"
                    title="Delete Report"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white max-w-2xl w-full rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col"
          >
            
            {/* Modal Header */}
            <div className="bg-[#0F382C] text-white p-6 flex items-start justify-between">
              <div>
                <span className={`px-2.5 py-0.5 text-xs font-bold border rounded-md inline-block mb-2 ${getStatusBadge(selectedReport.status)}`}>
                  {selectedReport.status}
                </span>
                <h3 className="text-lg font-bold">
                  {selectedReport.analysis.issueType}
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  {selectedReport.location.street}, {selectedReport.location.area}, {selectedReport.location.city}
                </p>
              </div>

              <button
                onClick={() => setSelectedReport(null)}
                className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Scroll Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-left">
              
              {/* Photo & Metadata */}
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <img
                  src={selectedReport.imageDataUrl}
                  alt="Civic Issue"
                  className="w-full sm:w-44 h-32 object-cover rounded-2xl border border-slate-200 shrink-0"
                />
                <div className="space-y-1.5 text-xs text-slate-600">
                  <p><strong>Authority:</strong> {selectedReport.recommendedAuthority.name}</p>
                  <p><strong>Landmark:</strong> {selectedReport.location.landmark || 'N/A'}</p>
                  <p><strong>Severity:</strong> {selectedReport.analysis.severity}</p>
                  <p><strong>Date Created:</strong> {new Date(selectedReport.createdAt).toLocaleString()}</p>
                </div>
              </div>

              {/* Status Selector */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Update Citizen Status:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {(['Ready to Report', 'Opened Official Channel', 'Submission Confirmed by User'] as LocalReportStatus[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        onUpdateStatus(selectedReport.id, st);
                        setSelectedReport({ ...selectedReport, status: st });
                        onShowToast('success', 'Status Updated', `Set to "${st}"`);
                      }}
                      className={`p-2 text-xs font-bold rounded-xl border transition-all cursor-pointer active:scale-98 ${
                        selectedReport.status === st
                          ? 'bg-[#0F382C] text-white border-[#0F382C]'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Complaint Letter Display */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Generated Complaint Text:
                </h4>
                <pre className="font-sans text-xs text-slate-800 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 whitespace-pre-wrap leading-relaxed">
                  {selectedReport.complaint.formalBody}
                </pre>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  onClick={() => handleCopy(selectedReport.complaint.formalBody, selectedReport.id)}
                  className="px-4 py-2.5 bg-[#0F382C] text-white hover:bg-[#164d3c] active:scale-98 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-lime-400" />
                  <span>Copy Complaint Text</span>
                </button>

                <button
                  onClick={() => {
                    window.open(selectedReport.recommendedAuthority.officialPortalUrl, '_blank');
                  }}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 active:scale-98 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Official Portal</span>
                </button>
              </div>

            </div>

          </motion.div>
        </div>
      )}

    </div>
  );
};
