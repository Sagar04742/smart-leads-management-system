import React, { useState } from 'react';
import { Lead, LeadFilters, LeadStatus, LeadSource } from '../../types';
import StatusBadge from '../ui/StatusBadge';
import { useAuth } from '../../context/AuthContext';

const STATUSES: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost'];
const SOURCES: LeadSource[] = ['Website', 'Instagram', 'Referral'];

interface Props {
  leads: Lead[];
  isLoading: boolean;
  filters: LeadFilters;
  onFiltersChange: (f: Partial<LeadFilters>) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
  onView: (lead: Lead) => void;
  searchValue: string;
  onSearchChange: (v: string) => void;
}

const sourceIcon: Record<LeadSource, React.ReactNode> = {
  Website: <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" /></svg>,
  Instagram: <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>,
  Referral: <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
};

export default function LeadsTable({ leads, isLoading, filters, onFiltersChange, onEdit, onDelete, onView, searchValue, onSearchChange }: Props) {
  const { user } = useAuth();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const colCount = user?.role === 'admin' ? 6 : 5;

  const handleDelete = (id: string) => {
    if (deleteId === id) { onDelete(id); setDeleteId(null); }
    else { setDeleteId(id); setTimeout(() => setDeleteId(null), 3000); }
  };

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        {/* Search */}
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-neutral-200 rounded-lg text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all"
            placeholder="Search by name or email…"
            value={searchValue}
            onChange={e => onSearchChange(e.target.value)}
          />
        </div>

        {/* Filters row */}
        <div className="flex gap-2">
          <select className="px-3 py-2.5 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-600 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all"
            value={filters.status || ''} onChange={e => onFiltersChange({ status: e.target.value as LeadStatus | '', page: 1 })}>
            <option value="">All status</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select className="px-3 py-2.5 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-600 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all"
            value={filters.source || ''} onChange={e => onFiltersChange({ source: e.target.value as LeadSource | '', page: 1 })}>
            <option value="">All sources</option>
            {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select className="px-3 py-2.5 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-600 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all"
            value={filters.sort || 'latest'} onChange={e => onFiltersChange({ sort: e.target.value as 'latest' | 'oldest', page: 1 })}>
            <option value="latest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50/60">
              <th className="text-left px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Contact</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Source</th>
              {user?.role === 'admin' && <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Owner</th>}
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Added</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-50">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: colCount }).map((_, j) => (
                    <td key={j} className="px-4 py-4">
                      <div className={`h-4 bg-neutral-100 rounded animate-pulse ${j === 0 ? 'w-36' : j === colCount - 1 ? 'w-16' : 'w-20'}`} />
                    </td>
                  ))}
                </tr>
              ))
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan={colCount} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center">
                      <svg className="w-6 h-6 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-600">No leads found</p>
                      <p className="text-xs text-neutral-400 mt-0.5">Try adjusting your search or filters</p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              leads.map((lead, i) => (
                <tr key={lead._id}
                  className="hover:bg-neutral-50/80 transition-colors group"
                  style={{ animationDelay: `${i * 30}ms` }}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-xs font-semibold text-neutral-500 flex-shrink-0">
                        {lead.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-ink">{lead.name}</p>
                        <p className="text-xs text-neutral-400">{lead.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5"><StatusBadge status={lead.status} /></td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500">
                      {sourceIcon[lead.source]}
                      {lead.source}
                    </span>
                  </td>
                  {user?.role === 'admin' && (
                    <td className="px-4 py-3.5 text-xs text-neutral-500">{lead.createdBy?.name}</td>
                  )}
                  <td className="px-4 py-3.5 text-xs text-neutral-400">
                    {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => onView(lead)} title="View"
                        className="p-1.5 rounded-md text-neutral-400 hover:text-ink hover:bg-neutral-100 transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      </button>
                      <button onClick={() => onEdit(lead)} title="Edit"
                        className="p-1.5 rounded-md text-neutral-400 hover:text-ink hover:bg-neutral-100 transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button onClick={() => handleDelete(lead._id)} title={deleteId === lead._id ? 'Click to confirm' : 'Delete'}
                        className={`p-1.5 rounded-md transition-colors ${deleteId === lead._id ? 'text-red-500 bg-red-50' : 'text-neutral-400 hover:text-red-500 hover:bg-red-50'}`}>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
