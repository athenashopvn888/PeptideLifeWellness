'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAdminRole } from '@/hooks/useAdminRole';
import {
  RotateCcw, Search, Filter, Loader2, CheckCircle, Clock,
  Package, ArrowRight, Eye, ChevronDown, AlertCircle,
  Camera, XCircle, Archive
} from 'lucide-react';

interface Return {
  id: string;
  order_id: string;
  product_id: string;
  qty: number;
  reason: string;
  status: string;
  condition_notes: string | null;
  inspection_photo_url: string | null;
  resolution: string | null;
  created_at: string;
  orders?: { order_number: string };
  products?: { name: string; sku: string; image_url: string | null };
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  RETURN_REQUESTED: { label: 'Requested', color: 'bg-amber-500/15 text-amber-400', icon: Clock },
  RECEIVED: { label: 'Received', color: 'bg-blue-500/15 text-blue-400', icon: Package },
  INSPECTED: { label: 'Inspected', color: 'bg-violet-500/15 text-violet-400', icon: Eye },
  RESTOCKED: { label: 'Restocked', color: 'bg-emerald-500/15 text-emerald-400', icon: CheckCircle },
  REFUNDED: { label: 'Refunded', color: 'bg-teal-500/15 text-teal-400', icon: CheckCircle },
  ARCHIVED: { label: 'Archived', color: 'bg-gray-500/15 text-gray-400', icon: Archive },
};

export default function ReturnsPage() {
  const { can, isMaster } = useAdminRole();
  const [returns, setReturns] = useState<Return[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Inspection modal
  const [inspectModal, setInspectModal] = useState<{
    returnItem: Return;
    notes: string;
    resolution: string;
  } | null>(null);

  const fetchReturns = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      const res = await fetch(`/api/admin/returns?${params}`);
      if (res.ok) setReturns(await res.json());
    } catch (err) { console.error(err); }
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => { fetchReturns(); }, [fetchReturns]);

  const doAction = async (id: string, action: string, extra: Record<string, unknown> = {}) => {
    setActionLoading(id);
    try {
      const res = await fetch('/api/admin/returns', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action, ...extra }),
      });
      if (!res.ok) {
        const d = await res.json();
        alert(d.error || 'Action failed');
      }
      await fetchReturns();
    } catch (err) { console.error(err); }
    setActionLoading(null);
  };

  const handleInspectSubmit = async () => {
    if (!inspectModal) return;
    await doAction(inspectModal.returnItem.id, 'inspect', {
      conditionNotes: inspectModal.notes,
      resolution: inspectModal.resolution,
    });
    setInspectModal(null);
  };

  const filtered = returns.filter((r) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      r.products?.name?.toLowerCase().includes(s) ||
      r.products?.sku?.toLowerCase().includes(s) ||
      r.orders?.order_number?.toLowerCase().includes(s) ||
      r.reason?.toLowerCase().includes(s)
    );
  });

  const stats = {
    requested: returns.filter((r) => r.status === 'RETURN_REQUESTED').length,
    received: returns.filter((r) => r.status === 'RECEIVED').length,
    inspected: returns.filter((r) => r.status === 'INSPECTED').length,
    resolved: returns.filter((r) => ['RESTOCKED', 'REFUNDED', 'ARCHIVED'].includes(r.status)).length,
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <RotateCcw size={22} className="text-amber-400" />Returns
        </h1>
        <p className="text-gray-500 text-sm mt-1">Return requests and inspection workflow</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Requested', value: stats.requested, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Received', value: stats.received, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Inspected', value: stats.inspected, color: 'text-violet-400', bg: 'bg-violet-500/10' },
          { label: 'Resolved', value: stats.resolved, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-xl p-3 text-center`}>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search product, SKU, order…"
            className="w-full pl-9 pr-3 py-2.5 bg-[#111827] border border-gray-800 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-teal-500" />
        </div>
        <div className="relative">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-3 pr-8 py-2.5 bg-[#111827] border border-gray-800 rounded-xl text-sm text-white appearance-none focus:outline-none focus:border-teal-500">
            <option value="">All</option>
            <option value="RETURN_REQUESTED">Requested</option>
            <option value="RECEIVED">Received</option>
            <option value="INSPECTED">Inspected</option>
            <option value="RESTOCKED">Restocked</option>
            <option value="REFUNDED">Refunded</option>
          </select>
          <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {/* Returns List */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 size={28} className="text-teal-400 animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <RotateCcw size={32} className="text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No returns found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((ret) => {
            const cfg = STATUS_CONFIG[ret.status] || { label: ret.status, color: 'bg-gray-500/15 text-gray-400', icon: Package };
            const StatusIcon = cfg.icon;
            const isLoading = actionLoading === ret.id;
            const canApprove = can('can_approve_returns') || isMaster;

            return (
              <div key={ret.id} className="bg-[#111827] border border-gray-800 rounded-2xl px-4 py-3.5">
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${cfg.color.split(' ')[0]}`}>
                    <StatusIcon size={16} className={cfg.color.split(' ')[1]} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="text-white font-semibold text-sm truncate">{ret.products?.name || 'Unknown'}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${cfg.color}`}>{cfg.label}</span>
                    </div>
                    <p className="text-gray-500 text-xs">
                      {ret.products?.sku && <span className="font-mono mr-2">{ret.products.sku}</span>}
                      Qty: {ret.qty} · Order: {ret.orders?.order_number || '—'}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">Reason: {ret.reason}</p>
                    {ret.condition_notes && <p className="text-gray-500 text-[10px] mt-0.5">Notes: {ret.condition_notes}</p>}
                  </div>

                  <div className="shrink-0 flex flex-col gap-1.5 items-end">
                    {ret.status === 'RETURN_REQUESTED' && canApprove && (
                      <button onClick={() => doAction(ret.id, 'receive')} disabled={isLoading}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium">
                        {isLoading ? <Loader2 size={10} className="animate-spin" /> : <ArrowRight size={10} />}
                        Receive
                      </button>
                    )}
                    {ret.status === 'RECEIVED' && canApprove && (
                      <button onClick={() => setInspectModal({ returnItem: ret, notes: '', resolution: 'restock' })} disabled={isLoading}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-medium">
                        <Eye size={10} />Inspect
                      </button>
                    )}
                    {ret.status === 'INSPECTED' && ret.resolution && canApprove && (
                      <button onClick={() => doAction(ret.id, 'resolve', { resolution: ret.resolution })} disabled={isLoading}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium">
                        {isLoading ? <Loader2 size={10} className="animate-spin" /> : <CheckCircle size={10} />}
                        {ret.resolution === 'restock' ? 'Restock' : ret.resolution === 'refund' ? 'Refund' : 'Archive'}
                      </button>
                    )}
                    <span className="text-[10px] text-gray-600">
                      {new Date(ret.created_at).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Inspection Modal */}
      {inspectModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setInspectModal(null)}>
          <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-white font-semibold text-lg mb-1">Inspect Return</h3>
            <p className="text-gray-500 text-sm mb-4">{inspectModal.returnItem.products?.name}</p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Condition Notes</label>
                <textarea value={inspectModal.notes} onChange={(e) => setInspectModal({ ...inspectModal, notes: e.target.value })}
                  placeholder="Describe item condition…"
                  rows={3}
                  className="w-full px-3 py-2 bg-[#0a0f1c] border border-gray-700 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-teal-500 resize-none" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Resolution</label>
                <div className="flex gap-2">
                  {[
                    { value: 'restock', label: 'Restock', icon: Package, color: 'emerald' },
                    { value: 'refund', label: 'Refund', icon: RotateCcw, color: 'teal' },
                    { value: 'archive', label: 'Archive', icon: Archive, color: 'gray' },
                  ].map((opt) => {
                    const selected = inspectModal.resolution === opt.value;
                    const Icon = opt.icon;
                    return (
                      <button key={opt.value}
                        onClick={() => setInspectModal({ ...inspectModal, resolution: opt.value })}
                        className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs font-medium transition-colors border ${
                          selected
                            ? `bg-${opt.color}-500/10 border-${opt.color}-500/30 text-${opt.color}-400`
                            : 'bg-[#0a0f1c] border-gray-700 text-gray-500'
                        }`}
                      >
                        <Icon size={14} />
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button onClick={() => setInspectModal(null)} className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-sm">Cancel</button>
              <button onClick={handleInspectSubmit}
                className="flex-1 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-medium">
                Submit Inspection
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
