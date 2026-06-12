'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAdminRole } from '@/hooks/useAdminRole';
import {
  BoxIcon, Search, Filter, Loader2, CheckCircle, Clock, Eye,
  Package, ArrowRight, AlertCircle, Truck, ShieldCheck, Tag,
  ChevronDown
} from 'lucide-react';

interface Batch {
  id: string;
  batch_code: string;
  product_id: string;
  received_qty: number;
  verified_qty: number;
  available_qty: number;
  reserved_qty: number;
  shipped_qty: number;
  status: string;
  batch_number: string | null;
  lot_number: string | null;
  expiry_date: string | null;
  packing_slip_photo_url: string | null;
  signed_off_by: string | null;
  signed_off_at: string | null;
  received_at: string;
  product_name: string | null;
  product_sku: string | null;
  po_number: string | null;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  PO_PENDING:          { label: 'PO Pending',    color: 'bg-gray-500/15 text-gray-400 border-gray-500/30',     icon: Clock },
  RECEIVED_IN_REVIEW:  { label: 'In Review',     color: 'bg-amber-500/15 text-amber-400 border-amber-500/30',  icon: Eye },
  VERIFIED:            { label: 'Verified',       color: 'bg-blue-500/15 text-blue-400 border-blue-500/30',    icon: ShieldCheck },
  MERCHANDISED:        { label: 'Merchandised',   color: 'bg-violet-500/15 text-violet-400 border-violet-500/30', icon: Tag },
  LIVE:                { label: 'Live',            color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', icon: CheckCircle },
  RESERVED:            { label: 'Reserved',        color: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',   icon: Package },
  PICKING:             { label: 'Picking',         color: 'bg-orange-500/15 text-orange-400 border-orange-500/30', icon: Package },
  PACKED:              { label: 'Packed',           color: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30', icon: Package },
  SHIPPED:             { label: 'Shipped',          color: 'bg-teal-500/15 text-teal-400 border-teal-500/30',  icon: Truck },
  DELIVERED:           { label: 'Delivered',        color: 'bg-green-500/15 text-green-400 border-green-500/30', icon: CheckCircle },
};

const STATUS_FILTERS = [
  { value: '', label: 'All' },
  { value: 'RECEIVED_IN_REVIEW', label: 'In Review' },
  { value: 'VERIFIED', label: 'Verified' },
  { value: 'MERCHANDISED', label: 'Merchandised' },
  { value: 'LIVE', label: 'Live' },
  { value: 'SHIPPED', label: 'Shipped' },
];

export default function BatchesPage() {
  const { can, isMaster } = useAdminRole();
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchBatches = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      const res = await fetch(`/api/admin/batches?${params}`);
      if (res.ok) setBatches(await res.json());
    } catch (err) { console.error(err); }
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => { fetchBatches(); }, [fetchBatches]);

  const doAction = async (batchId: string, action: string) => {
    setActionLoading(batchId);
    try {
      const res = await fetch('/api/admin/batches', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, batchId }),
      });
      if (!res.ok) {
        const d = await res.json();
        alert(d.error || 'Action failed');
      }
      await fetchBatches();
    } catch (err) { console.error(err); }
    setActionLoading(null);
  };

  const getNextAction = (status: string): { label: string; action: string; color: string } | null => {
    switch (status) {
      case 'RECEIVED_IN_REVIEW': return { label: 'Verify & Sign Off', action: 'sign_off', color: 'bg-blue-600 hover:bg-blue-500' };
      case 'VERIFIED': return { label: 'Mark Merchandised', action: 'merchandise', color: 'bg-violet-600 hover:bg-violet-500' };
      case 'MERCHANDISED': return { label: 'Publish Live', action: 'publish_live', color: 'bg-emerald-600 hover:bg-emerald-500' };
      default: return null;
    }
  };

  const filtered = batches.filter((b) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      b.batch_code.toLowerCase().includes(s) ||
      b.product_name?.toLowerCase().includes(s) ||
      b.product_sku?.toLowerCase().includes(s) ||
      b.po_number?.toLowerCase().includes(s)
    );
  });

  // Stats
  const stats = {
    review: batches.filter((b) => b.status === 'RECEIVED_IN_REVIEW').length,
    verified: batches.filter((b) => b.status === 'VERIFIED').length,
    live: batches.filter((b) => b.status === 'LIVE').length,
    total: batches.length,
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <BoxIcon size={22} className="text-amber-400" />Batch Registry
        </h1>
        <p className="text-gray-500 text-sm mt-1">Track every batch through the pipeline</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'In Review', value: stats.review, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Verified', value: stats.verified, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Live', value: stats.live, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Total', value: stats.total, color: 'text-gray-300', bg: 'bg-gray-800' },
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
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search batch code, product, SKU, PO…"
            className="w-full pl-9 pr-3 py-2.5 bg-[#111827] border border-gray-800 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-teal-500"
          />
        </div>
        <div className="relative">
          <Filter size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-8 pr-8 py-2.5 bg-[#111827] border border-gray-800 rounded-xl text-sm text-white appearance-none focus:outline-none focus:border-teal-500"
          >
            {STATUS_FILTERS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>
          <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {/* Batch List */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 size={28} className="text-teal-400 animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <BoxIcon size={32} className="text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No batches found</p>
          <p className="text-gray-600 text-xs mt-1">Batches are created when you receive purchase orders in the warehouse</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((batch) => {
            const cfg = STATUS_CONFIG[batch.status] || { label: batch.status, color: 'bg-gray-500/15 text-gray-400 border-gray-500/30', icon: Package };
            const StatusIcon = cfg.icon;
            const nextAction = getNextAction(batch.status);
            const isLoading = actionLoading === batch.id;

            return (
              <div key={batch.id} className="bg-[#111827] border border-gray-800 rounded-2xl overflow-hidden">
                <div className="flex items-start gap-3 px-4 py-3.5">
                  {/* Status icon */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${cfg.color.split(' ')[0]}`}>
                    <StatusIcon size={16} className={cfg.color.split(' ')[1]} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-white font-semibold text-sm font-mono">{batch.batch_code}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${cfg.color}`}>
                        {cfg.label}
                      </span>
                    </div>

                    <p className="text-gray-400 text-xs truncate">
                      {batch.product_name || 'Unknown product'}
                      {batch.product_sku && <span className="text-gray-600"> · {batch.product_sku}</span>}
                    </p>

                    <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-500">
                      <span>Rcvd: <span className="text-gray-300 font-medium">{batch.received_qty}</span></span>
                      {batch.available_qty > 0 && (
                        <span>Avail: <span className="text-emerald-400 font-medium">{batch.available_qty}</span></span>
                      )}
                      {batch.reserved_qty > 0 && (
                        <span>Rsrvd: <span className="text-cyan-400 font-medium">{batch.reserved_qty}</span></span>
                      )}
                      {batch.shipped_qty > 0 && (
                        <span>Shipped: <span className="text-teal-400 font-medium">{batch.shipped_qty}</span></span>
                      )}
                      {batch.po_number && (
                        <span className="text-gray-600">PO: {batch.po_number}</span>
                      )}
                    </div>

                    {batch.expiry_date && (
                      <p className="text-[10px] text-gray-600 mt-1">
                        Expires: {new Date(batch.expiry_date).toLocaleDateString('en-CA')}
                      </p>
                    )}
                  </div>

                  {/* Action button */}
                  <div className="shrink-0 flex flex-col items-end gap-1.5">
                    {nextAction && (can('can_sign_off_batch') || isMaster) && (
                      <button
                        onClick={() => doAction(batch.id, nextAction.action)}
                        disabled={isLoading}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-colors ${nextAction.color} disabled:bg-gray-700`}
                      >
                        {isLoading ? <Loader2 size={11} className="animate-spin" /> : <ArrowRight size={11} />}
                        {nextAction.label}
                      </button>
                    )}
                    <span className="text-[10px] text-gray-600">
                      {new Date(batch.received_at).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>

                {/* Packing slip indicator */}
                {batch.packing_slip_photo_url && (
                  <div className="px-4 pb-3 -mt-1">
                    <span className="text-[10px] text-emerald-500 flex items-center gap-1">
                      <CheckCircle size={10} />Packing slip attached
                    </span>
                  </div>
                )}

                {/* Missing packing slip warning */}
                {batch.status === 'RECEIVED_IN_REVIEW' && !batch.packing_slip_photo_url && (
                  <div className="px-4 pb-3 -mt-1">
                    <span className="text-[10px] text-amber-500 flex items-center gap-1">
                      <AlertCircle size={10} />Packing slip photo required before sign-off
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}
