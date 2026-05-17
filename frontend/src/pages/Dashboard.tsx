import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLeads, useCreateLead, useUpdateLead, useDeleteLead, useExportCSV, useDebounce } from '../hooks';
import LeadsTable from '../components/leads/LeadsTable';
import LeadForm from '../components/leads/LeadForm';
import Pagination from '../components/ui/Pagination';
import StatCard from '../components/ui/StatCard';
import Sidebar from '../components/layout/Sidebar';
import { Lead, LeadFilters, CreateLeadDto } from '../types';

export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('leads');
  const [filters, setFilters] = useState<LeadFilters>({ sort: 'latest', page: 1 });
  const [searchInput, setSearchInput] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [viewLead, setViewLead] = useState<Lead | null>(null);

  const debouncedSearch = useDebounce(searchInput, 400);
  const queryFilters = { ...filters, search: debouncedSearch || undefined };

  const { data, isLoading, isFetching } = useLeads(queryFilters);
  const createMutation = useCreateLead();
  const updateMutation = useUpdateLead();
  const deleteMutation = useDeleteLead();
  const { exportCSV } = useExportCSV();

  const leads = data?.data || [];
  const meta = data?.meta;

  const handleFiltersChange = (newF: Partial<LeadFilters>) => setFilters(p => ({ ...p, ...newF }));
  const handleSubmit = async (formData: CreateLeadDto) => {
    if (editLead) await updateMutation.mutateAsync({ id: editLead._id, data: formData });
    else await createMutation.mutateAsync(formData);
    setShowForm(false);
    setEditLead(null);
  };

  const todayLeads = leads.filter(l => {
    const d = new Date(l.createdAt);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  }).length;

  const stats = [
    { label: 'Total leads', value: meta?.total ?? 0, color: 'text-ink' },
    { label: 'New this page', value: leads.filter(l => l.status === 'New').length, color: 'text-blue-600' },
    { label: 'Qualified', value: leads.filter(l => l.status === 'Qualified').length, color: 'text-emerald-600' },
    { label: 'Added today', value: todayLeads, color: 'text-amber-600' },
  ];

  return (
    <div className="flex min-h-screen bg-cream">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main */}
      <div className="ml-56 flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-10 bg-cream/80 backdrop-blur-sm border-b border-neutral-200/60">
          <div className="px-8 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="font-display text-lg font-semibold text-ink">All Leads</h1>
              {isFetching && !isLoading && (
                <div className="w-3.5 h-3.5 border border-neutral-300 border-t-neutral-600 rounded-full animate-spin" />
              )}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => exportCSV(queryFilters)} className="btn-secondary text-xs">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export CSV
              </button>
              <button onClick={() => { setEditLead(null); setShowForm(true); }} className="btn-primary text-xs">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add lead
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 px-8 py-7 space-y-7">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <div key={s.label} style={{ animationDelay: `${i * 60}ms` }}>
                <StatCard label={s.label} value={s.value} color={s.color} />
              </div>
            ))}
          </div>

          {/* Table */}
          <LeadsTable
            leads={leads} isLoading={isLoading} filters={filters}
            onFiltersChange={handleFiltersChange}
            onEdit={l => { setEditLead(l); setShowForm(true); }}
            onDelete={id => deleteMutation.mutate(id)}
            onView={setViewLead}
            searchValue={searchInput}
            onSearchChange={v => { setSearchInput(v); handleFiltersChange({ page: 1 }); }}
          />

          {meta && meta.totalPages > 1 && (
            <Pagination meta={meta} onPageChange={page => handleFiltersChange({ page })} />
          )}
        </main>
      </div>

      {/* Lead Form */}
      {showForm && (
        <LeadForm
          lead={editLead}
          onSubmit={handleSubmit}
          onClose={() => { setShowForm(false); setEditLead(null); }}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      )}

      {/* Detail drawer */}
      {viewLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/25 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl border border-neutral-100 animate-fade-up overflow-hidden">
            {/* Header strip */}
            <div className="bg-ink px-6 py-5 text-cream">
              <div className="flex items-start justify-between">
                <div>
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-base font-semibold mb-3">
                    {viewLead.name.charAt(0).toUpperCase()}
                  </div>
                  <h2 className="font-display text-xl font-semibold">{viewLead.name}</h2>
                  <p className="text-white/50 text-sm mt-0.5">{viewLead.email}</p>
                </div>
                <button onClick={() => setViewLead(null)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-3">
              {[
                { label: 'Status', value: viewLead.status },
                { label: 'Source', value: viewLead.source },
                { label: 'Added by', value: viewLead.createdBy?.name },
                { label: 'Date', value: new Date(viewLead.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' }) },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-2 border-b border-neutral-50">
                  <span className="text-xs text-neutral-400 font-medium">{label}</span>
                  <span className="text-sm font-medium text-ink">{value}</span>
                </div>
              ))}
              {viewLead.notes && (
                <div className="pt-2">
                  <p className="text-xs text-neutral-400 font-medium mb-1.5">Notes</p>
                  <p className="text-sm text-neutral-600 leading-relaxed bg-neutral-50 rounded-lg p-3">{viewLead.notes}</p>
                </div>
              )}
              <button onClick={() => { setViewLead(null); setEditLead(viewLead); setShowForm(true); }}
                className="btn-secondary w-full justify-center mt-2 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit this lead
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
