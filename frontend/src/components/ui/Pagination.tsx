import React from 'react';
import { PaginationMeta } from '../../types';

interface Props { meta: PaginationMeta; onPageChange: (page: number) => void; }

export default function Pagination({ meta, onPageChange }: Props) {
  const { page, totalPages, total, limit, hasNextPage, hasPrevPage } = meta;
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  const pages: (number | '...')[] = [];
  if (totalPages <= 7) { for (let i = 1; i <= totalPages; i++) pages.push(i); }
  else {
    pages.push(1);
    if (page > 3) pages.push('...');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-neutral-100">
      <p className="text-sm text-neutral-400">
        {from}–{to} of <span className="font-medium text-ink">{total}</span> leads
      </p>
      <div className="flex items-center gap-1">
        <button onClick={() => onPageChange(page - 1)} disabled={!hasPrevPage}
          className="p-1.5 rounded-md text-neutral-400 hover:text-ink hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
        {pages.map((p, i) =>
          p === '...' ? <span key={`e${i}`} className="px-1 text-neutral-400 text-sm">…</span> : (
            <button key={p} onClick={() => onPageChange(p as number)}
              className={`min-w-[32px] h-8 rounded-md text-sm font-medium transition-colors ${p === page ? 'bg-ink text-cream' : 'text-neutral-500 hover:bg-neutral-100 hover:text-ink'}`}>
              {p}
            </button>
          )
        )}
        <button onClick={() => onPageChange(page + 1)} disabled={!hasNextPage}
          className="p-1.5 rounded-md text-neutral-400 hover:text-ink hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  );
}
