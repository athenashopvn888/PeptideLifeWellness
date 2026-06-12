'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Warehouse, RefreshCw, Loader2, Package, TrendingUp,
  ClipboardList, Plus, CheckCircle, Clock, AlertTriangle, ArrowRight
} from 'lucide-react';

interface POSummary {
  id: string;
  po_number: string;
  supplier_name: string;
  status: string;
  expected_date: string | null;
  created_at: string;
  po_items: { qty_ordered: number; qty_received: number }[];
}

interface Receipt {
  id: string;
  sku: string;
  product_name: string;
  qty_received: number;
  batch_number: string | null;
  received_at: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  draft:     { label: 'Draft',     color: 'text-gray-400',   bg: 'bg-gray-500/10' },
  ordered:   { label: 'Ordered',   color: 'text-blue-400',   bg: 'bg-blue-500/10' },
  partial:   { label: 'Partial',   color: 'text-amber-400',  bg: 'bg-amber-500/10' },
  received:  { label: 'Received',  color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  closed:    { label: 'Closed',    color: 'text-gray-500',   bg: 'bg-gray-800' },
};

export default function WarehouseDashboard() {
  const [activePOs, setActivePOs] = useState<POSummary[]>([]);
  const [recentReceipts, setRecentReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);

  

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [posRes, receiptsRes] = await Promise.all([
        fetch('/api/admin/warehouse'),
        fetch('/api/admin/warehouse?action=receipts'),
      ]);
      if (posRes.ok) {
        const all: POSummary[] = await posRes.json();
        setActivePOs(all.filter((p) => !['received', 'closed'].includes(p.status)));
      }
      if (receiptsRes.ok) setRecentReceipts(await receiptsRes.json());
    } catch (err) { console.error(err); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const getProgress = (po: POSummary) => {
    const ordered = po.po_items?.reduce((s, i) => s + i.qty_ordered, 0) || 0;
    const received = po.po_items?.reduce((s, i) => s + i.qty_received, 0) || 0;
    const pct = ordered > 0 ? Math.round((received / ordered) * 100) : 0;
    return { ordered, received, pct };
  };

  const isOverdue = (po: POSummary) =>
    po.expected_date && new Date(po.expected_date) < new Date() && po.status !== 'received';

  const stats = {
    active: activePOs.length,
    overdue: activePOs.filter(isOverdue).length,
    todayReceived: recentReceipts.filter(
      (r) => new Date(r.received_at).toDateString() === new Date().toDateString()
    ).reduce((s, r) => s + r.qty_received, 0),
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Warehouse size={24} className="text-teal-400" />
            Warehouse
          </h1>
          <p className="text-sm text-gray-500 mt-1">Stock receiving and purchase order management</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchData}
            className="flex items-center gap-1.5 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors">
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />Refresh
          </button>
          <Link href="/admin/warehouse/purchase-orders"
            className="flex items-center gap-1.5 px-3 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-sm transition-colors">
            <Plus size={13} />New PO
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Active POs', value: stats.active, color: 'text-white', icon: ClipboardList },
          { label: 'Overdue', value: stats.overdue, color: stats.overdue > 0 ? 'text-red-400' : 'text-gray-500', icon: AlertTriangle },
          { label: 'Units In Today', value: stats.todayReceived, color: 'text-emerald-400', icon: TrendingUp },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-[#111827] border border-gray-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Icon size={13} className="text-gray-500" />
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Active POs */}
        <div className="lg:col-span-3">
          <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <ClipboardList size={14} className="text-teal-400" />
                Active Purchase Orders
              </h2>
              <Link href="/admin/warehouse/purchase-orders"
                className="text-xs text-teal-400 hover:underline flex items-center gap-1">
                View all <ArrowRight size={11} />
              </Link>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 size={24} className="text-teal-400 animate-spin" />
              </div>
            ) : activePOs.length === 0 ? (
              <div className="text-center py-12">
                <Package size={32} className="text-gray-700 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No active purchase orders</p>
                <Link href="/admin/warehouse/purchase-orders"
                  className="inline-block mt-3 text-xs text-teal-400 hover:underline">
                  Create your first PO →
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-800">
                {activePOs.slice(0, 8).map((po) => {
                  const { ordered, received, pct } = getProgress(po);
                  const sc = STATUS_CONFIG[po.status];
                  const overdue = isOverdue(po);
                  return (
                    <Link
                      key={po.id}
                      href={`/admin/warehouse/purchase-orders/${po.id}`}
                      className="flex items-center gap-4 px-5 py-4 hover:bg-gray-800/40 transition-colors group"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-mono text-sm font-semibold">{po.po_number}</span>
                          <span className={`text-xs px-1.5 py-0.5 rounded ${sc.bg} ${sc.color} font-medium`}>{sc.label}</span>
                          {overdue && <AlertTriangle size={11} className="text-red-400" />}
                        </div>
                        <p className="text-gray-400 text-xs truncate">{po.supplier_name}</p>
                        {po.expected_date && (
                          <p className={`text-xs mt-0.5 ${overdue ? 'text-red-400' : 'text-gray-500'}`}>
                            Expected: {new Date(po.expected_date).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}
                          </p>
                        )}
                      </div>
                      <div className="w-32 shrink-0">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500">{received}/{ordered} units</span>
                          <span className={pct === 100 ? 'text-emerald-400' : 'text-gray-400'}>{pct}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${pct === 100 ? 'bg-emerald-400' : pct > 0 ? 'bg-amber-400' : 'bg-gray-600'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                      <ArrowRight size={14} className="text-gray-600 group-hover:text-teal-400 transition-colors shrink-0" />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Recent Receipts */}
        <div className="lg:col-span-2">
          <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <CheckCircle size={14} className="text-teal-400" />
                Recent Receipts
              </h2>
              <Link href="/admin/warehouse/labels"
                className="text-xs text-teal-400 hover:underline flex items-center gap-1">
                Print Labels <ArrowRight size={11} />
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center py-8"><Loader2 size={20} className="text-teal-400 animate-spin" /></div>
            ) : recentReceipts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">No stock received yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-800 max-h-[420px] overflow-y-auto">
                {recentReceipts.map((r) => (
                  <div key={r.id} className="px-4 py-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-white text-xs font-medium truncate">{r.product_name}</p>
                        <p className="text-gray-500 text-xs font-mono">{r.sku}</p>
                        {r.batch_number && (
                          <p className="text-gray-600 text-xs">Batch: {r.batch_number}</p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-emerald-400 font-bold text-sm">+{r.qty_received}</p>
                        <p className="text-gray-600 text-xs flex items-center gap-0.5 justify-end">
                          <Clock size={9} />
                          {new Date(r.received_at).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick links */}
          <div className="mt-4 space-y-2">
            <Link href="/admin/warehouse/purchase-orders"
              className="flex items-center justify-between w-full px-4 py-3 bg-[#111827] border border-gray-800 hover:bg-gray-800 rounded-xl text-sm text-gray-300 transition-colors group">
              <span className="flex items-center gap-2"><ClipboardList size={14} className="text-teal-400" />Purchase Orders</span>
              <ArrowRight size={13} className="text-gray-600 group-hover:text-teal-400 transition-colors" />
            </Link>
            <Link href="/admin/warehouse/labels"
              className="flex items-center justify-between w-full px-4 py-3 bg-[#111827] border border-gray-800 hover:bg-gray-800 rounded-xl text-sm text-gray-300 transition-colors group">
              <span className="flex items-center gap-2"><Package size={14} className="text-teal-400" />Print SKU Labels</span>
              <ArrowRight size={13} className="text-gray-600 group-hover:text-teal-400 transition-colors" />
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
