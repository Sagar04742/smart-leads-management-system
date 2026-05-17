import React from 'react';
import { LeadStatus } from '../../types';

const config: Record<LeadStatus, { dot: string; text: string; bg: string }> = {
  New:       { dot: 'bg-blue-500',    text: 'text-blue-700',   bg: 'bg-blue-50 border-blue-100' },
  Contacted: { dot: 'bg-amber-500',   text: 'text-amber-700',  bg: 'bg-amber-50 border-amber-100' },
  Qualified: { dot: 'bg-emerald-500', text: 'text-emerald-700',bg: 'bg-emerald-50 border-emerald-100' },
  Lost:      { dot: 'bg-neutral-400', text: 'text-neutral-500',bg: 'bg-neutral-50 border-neutral-200' },
};

export default function StatusBadge({ status }: { status: LeadStatus }) {
  const c = config[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {status}
    </span>
  );
}
