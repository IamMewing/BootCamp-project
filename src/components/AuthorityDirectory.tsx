import React, { useState } from 'react';
import { HYDERABAD_AUTHORITIES } from '../data/authorities';
import { AuthorityInfo } from '../types';
import {
  Building2, Phone, ExternalLink, ShieldCheck, Search,
  Smartphone, Twitter, CheckCircle2, AlertCircle
} from 'lucide-react';

export const AuthorityDirectory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Hyderabad');

  const filteredAuthorities = HYDERABAD_AUTHORITIES.filter((auth) => {
    const matchesSearch =
      auth.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      auth.shortCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      auth.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      auth.categoriesHandled.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSearch;
  });

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0F382C] uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-lime-500" />
            <span>Verified Municipal Contacts</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Official Municipal Reporting Directory
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Verified official portals, mobile apps, and helpline numbers for municipal bodies in Hyderabad and surrounding jurisdictions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase">Region:</span>
          <span className="px-3 py-1 bg-[#0F382C] text-lime-300 font-bold rounded-lg text-xs">
            Hyderabad (Telangana)
          </span>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter by authority name or issue category (e.g. Roads, Water, Electricity)..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0F382C] outline-none"
        />
      </div>

      {/* Authorities Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredAuthorities.map((auth) => (
          <div
            key={auth.id}
            className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-5 flex flex-col justify-between"
          >
            <div>
              {/* Header Badge */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[11px] rounded-md">
                      Verified Government Body
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{auth.city}</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    {auth.name}
                  </h3>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 leading-relaxed mt-4">
                {auth.description}
              </p>

              {/* Categories Handled */}
              <div className="mt-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Handled Categories:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {auth.categoriesHandled.map((cat) => (
                    <span key={cat} className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact Info Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 mt-5">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#0F382C] shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Helpline</span>
                    <span className="font-bold text-slate-900 text-xs">{auth.helpline}</span>
                  </div>
                </div>

                {auth.mobileApp && (
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-[#0F382C] shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">App</span>
                      <span className="font-bold text-slate-900 text-xs truncate block">{auth.mobileApp}</span>
                    </div>
                  </div>
                )}

                {auth.twitterHandle && (
                  <div className="flex items-center gap-2">
                    <Twitter className="w-4 h-4 text-sky-600 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Twitter</span>
                      <span className="font-bold text-slate-900 text-xs">{auth.twitterHandle}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Direct Official Link Button */}
            <div className="pt-2">
              <a
                href={auth.officialPortalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#0F382C] hover:bg-[#164d3c] text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Open Official {auth.shortCode} Portal</span>
                <ExternalLink className="w-3.5 h-3.5 text-lime-400" />
              </a>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
