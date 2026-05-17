import React, { useState, useEffect } from 'react';
import { Lead, CreateLeadDto, LeadStatus, LeadSource } from '../../types';

const STATUSES: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost'];
const SOURCES: LeadSource[] = ['Website', 'Instagram', 'Referral'];

interface Props {
  lead?: Lead | null;
  onSubmit: (data: CreateLeadDto) => void;
  onClose: () => void;
  isLoading: boolean;
}

interface Errors { name?: string; email?: string; source?: string; }

export default function LeadForm({ lead, onSubmit, onClose, isLoading }: Props) {
  const [form, setForm] = useState<CreateLeadDto>({
    name: '', email: '', status: 'New', source: 'Website', notes: '',
  });
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (lead) setForm({ name: lead.name, email: lead.email, status: lead.status, source: lead.source, notes: lead.notes || '' });
  }, [lead]);

  const validate = () => {
    const e: Errors = {};
    if (!form.name.trim() || form.name.length < 2) e.name = 'At least 2 characters';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.source) e.source = 'Pick a source';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = (ev: React.FormEvent) => { ev.preventDefault(); if (validate()) onSubmit(form); };

  const ic = (field: keyof Errors) =>
    `input-field ${errors[field] ? 'input-error' : ''}`;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-neutral-100 animate-fade-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
          <div>
            <h2 className="font-display text-lg font-semibold text-ink">
              {lead ? 'Edit lead' : 'New lead'}
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              {lead ? 'Update lead details below' : 'Fill in the details to add a new lead'}
            </p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-ink transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Full name</label>
            <input className={ic('name')} placeholder="e.g. Rahul Sharma"
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Email address</label>
            <input type="email" className={ic('email')} placeholder="rahul@company.com"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Status</label>
              <select className="input-field" value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value as LeadStatus })}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Source</label>
              <select className={`input-field ${errors.source ? 'input-error' : ''}`} value={form.source}
                onChange={e => setForm({ ...form, source: e.target.value as LeadSource })}>
                {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.source && <p className="mt-1 text-xs text-red-500">{errors.source}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Notes <span className="font-normal text-neutral-400">(optional)</span>
            </label>
            <textarea className="input-field resize-none" rows={3}
              placeholder="Add any context about this lead…"
              value={form.notes} maxLength={500}
              onChange={e => setForm({ ...form, notes: e.target.value })} />
          </div>

          <div className="flex gap-2.5 pt-1">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={isLoading} className="btn-primary flex-1 justify-center">
              {isLoading ? (
                <><div className="w-4 h-4 border-2 border-cream border-t-transparent rounded-full animate-spin" />Saving…</>
              ) : lead ? 'Update lead' : 'Add lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
