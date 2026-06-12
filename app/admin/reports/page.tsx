'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';
import {
  BarChart2, TrendingUp, ShoppingCart, Users, DollarSign,
  Package, AlertTriangle, RefreshCw, Loader2, ArrowRight,
  CheckCircle, Clock, Truck, Crown
} from 'lucide-react';

interface ReportData {
  summary: {
    revenue: number;
    pendingRevenue: number;
    orderCount: number;
    paidCount: number;
    newCustomers: number;
    aov: number;
    fulfilmentRate: number;
  };
  statusCounts: Record<string, number>;
  revenueSeries: { date: string; amount: number }[];
  topProducts: { name: string; sku: string; qty: number; revenue: number }[];
  lowStock: { id: string; name: string; sku: string; stock_quantity: number }[];
  topCustomers: { name: string; email: string; totalSpent: number; totalOrders: number }[];
}

const RANGES = [
  { key: '7', label: '7 days' },
  { key: '30', label: '30 days' },
  { key: '90', label: '90 days' },
  { key: '365', label: '12 months' },
];

const STATUS_LABELS: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending_payment: { label: 'Pending Payment', color: 'text-amber-400', icon: Clock },
  confirmed:       { label: 'Confirmed',       color: 'text-emerald-400', icon: CheckCircle },
  picking:         { label: 'Picking',         color: 'text-blue-400',   icon: Package },
  packed:          { label: 'Packed',          color: 'text-violet-400', icon: Package },
  shipped:         { label: 'Shipped',         color: 'text-teal-400',   icon: Truck },
  delivered:       { label: 'Delivered',       color: 'text-green-400',  icon: CheckCircle },
  cancelled:       { label: 'Cancelled',       color: 'text-red-400',    icon: AlertTriangle },
};

export default function ReportsPage() {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('30');

  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/reports?range=${range}`);
      if (res.ok) setData(await res.json());
    } catch (err) { console.error(err); }
    setLoading(false);
  }, [range]);

  useEffect(() => { fetchReport(); }, [fetchReport]);

  // Simple bar chart using CSS
  const maxRevenue = data?.revenueSeries.reduce((m, d) => Math.max(m, d.amount), 0) || 1;
  const maxTopProd = data?.topProducts[0]?.revenue || 1;

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BarChart2 size={24} className="text-teal-400" />Reports
          </h1>
          <p className="text-sm text-gray-500 mt-1">Business performance metrics</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Range selector */}
          <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-lg p-1">
            {RANGES.map((r) => (
              <button key={r.key} onClick={() => setRange(r.key)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${range === r.key ? 'bg-teal-600 text-white' : 'text-gray-400 hover:text-white'}`}>
                {r.label}
              </button>
            ))}
          </div>
          <button onClick={fetchReport}
            className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 size={32} className="text-teal-400 animate-spin" /></div>
      ) : !data ? (
        <div className="text-center py-20"><p className="text-gray-500">Failed to load report data</p></div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {[
              {
                label: 'Revenue',
                value: `$${data.summary.revenue.toFixed(2)}`,
                sub: `$${data.summary.pendingRevenue.toFixed(2)} pending`,
                icon: DollarSign,
                color: 'text-emerald-400',
                bg: 'bg-emerald-500/10',
              },
              {
                label: 'Orders',
                value: data.summary.orderCount,
                sub: `${data.summary.paidCount} paid`,
                icon: ShoppingCart,
                color: 'text-teal-400',
                bg: 'bg-teal-500/10',
              },
              {
                label: 'Avg Order Value',
                value: `$${data.summary.aov.toFixed(2)}`,
                sub: 'per paid order',
                icon: TrendingUp,
                color: 'text-blue-400',
                bg: 'bg-blue-500/10',
              },
              {
                label: 'Fulfilment Rate',
                value: `${data.summary.fulfilmentRate}%`,
                sub: 'shipped or delivered',
                icon: Truck,
                color: data.summary.fulfilmentRate >= 80 ? 'text-emerald-400' : 'text-amber-400',
                bg: data.summary.fulfilmentRate >= 80 ? 'bg-emerald-500/10' : 'bg-amber-500/10',
              },
            ].map(({ label, value, sub, icon: Icon, color, bg }) => (
              <div key={label} className={`${bg} border border-gray-800 rounded-xl p-5`}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={14} className={color} />
                  <p className="text-xs text-gray-400">{label}</p>
                </div>
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                <p className="text-xs text-gray-500 mt-1">{sub}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-6">
            {/* Revenue Chart */}
            <div className="lg:col-span-2 bg-[#111827] border border-gray-800 rounded-xl p-5">
              <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp size={14} className="text-teal-400" />
                Daily Revenue — Last {RANGES.find((r) => r.key === range)?.label}
              </h2>
              {data.revenueSeries.length === 0 ? (
                <div className="flex items-center justify-center h-32">
                  <p className="text-gray-500 text-sm">No paid orders in this period</p>
                </div>
              ) : (
                <div className="flex items-end gap-1 h-40 overflow-x-auto pb-6">
                  {data.revenueSeries.map((d) => {
                    const height = Math.max(4, Math.round((d.amount / maxRevenue) * 140));
                    return (
                      <div key={d.date} className="flex flex-col items-center gap-1 flex-1 min-w-[28px] group relative">
                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-1 hidden group-hover:flex flex-col items-center z-10">
                          <div className="bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs text-white whitespace-nowrap shadow-xl">
                            <p className="text-gray-400">{d.date}</p>
                            <p className="text-emerald-400 font-bold">${d.amount.toFixed(2)}</p>
                          </div>
                        </div>
                        <div
                          className="w-full rounded-t-sm bg-gradient-to-t from-teal-600 to-teal-400 hover:from-teal-500 hover:to-teal-300 transition-colors cursor-default"
                          style={{ height: `${height}px` }}
                        />
                        <span className="text-gray-600 text-[8px] rotate-45 origin-left mt-0.5 hidden sm:block truncate w-6">
                          {d.date.slice(5)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Order Status Breakdown */}
            <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
              <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <ShoppingCart size={14} className="text-teal-400" />Order Status
              </h2>
              <div className="space-y-2">
                {Object.entries(data.statusCounts).map(([status, count]) => {
                  const cfg = STATUS_LABELS[status];
                  const Icon = cfg?.icon || Package;
                  const total = data.summary.orderCount || 1;
                  const pct = Math.round((count / total) * 100);
                  return (
                    <div key={status}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className={`flex items-center gap-1 ${cfg?.color || 'text-gray-400'}`}>
                          <Icon size={10} />{cfg?.label || status}
                        </span>
                        <span className="text-gray-300 font-mono">{count} <span className="text-gray-600">({pct}%)</span></span>
                      </div>
                      <div className="h-1.5 bg-gray-800 rounded-full">
                        <div className={`h-full rounded-full bg-current ${cfg?.color || 'text-gray-400'}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
                {Object.keys(data.statusCounts).length === 0 && (
                  <p className="text-gray-500 text-xs text-center py-4">No orders in this period</p>
                )}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Top Products */}
            <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Package size={14} className="text-teal-400" />Top Products
                </h2>
                <Link href="/admin/inventory" className="text-xs text-teal-400 hover:underline flex items-center gap-1">
                  View inventory <ArrowRight size={10} />
                </Link>
              </div>
              {data.topProducts.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-8">No order data in this period</p>
              ) : (
                <div className="p-5 space-y-3">
                  {data.topProducts.map((p, idx) => (
                    <div key={p.sku}>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-gray-600 font-mono w-4 text-right">{idx + 1}</span>
                          <div className="min-w-0">
                            <p className="text-white font-medium truncate">{p.name}</p>
                            <p className="text-gray-500 font-mono">{p.sku} · {p.qty} units</p>
                          </div>
                        </div>
                        <span className="text-emerald-400 font-semibold shrink-0 ml-2">
                          ${p.revenue.toFixed(2)}
                        </span>
                      </div>
                      <div className="h-1 bg-gray-800 rounded-full ml-6">
                        <div className="h-full rounded-full bg-gradient-to-r from-teal-600 to-emerald-400"
                          style={{ width: `${Math.round((p.revenue / maxTopProd) * 100)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Low Stock Alert + New Customers */}
            <div className="space-y-4">
              {/* Low Stock */}
              <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                    <AlertTriangle size={14} className="text-amber-400" />Low Stock Alerts
                  </h2>
                  <Link href="/admin/inventory" className="text-xs text-teal-400 hover:underline">Manage →</Link>
                </div>
                {data.lowStock.length === 0 ? (
                  <div className="text-center py-6">
                    <CheckCircle size={20} className="text-emerald-400 mx-auto mb-1" />
                    <p className="text-emerald-400 text-xs font-medium">All stock levels healthy</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-800">
                    {data.lowStock.map((p) => (
                      <div key={p.id} className="flex items-center justify-between px-5 py-3">
                        <div>
                          <p className="text-white text-xs font-medium">{p.name}</p>
                          <p className="text-gray-500 text-xs font-mono">{p.sku}</p>
                        </div>
                        <span className={`text-sm font-bold font-mono ${p.stock_quantity === 0 ? 'text-red-400' : p.stock_quantity <= 3 ? 'text-amber-400' : 'text-yellow-400'}`}>
                          {p.stock_quantity === 0 ? 'OUT' : `${p.stock_quantity} left`}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* New Customers */}
              <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
                <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Users size={14} className="text-teal-400" />New Customers
                </h2>
                <div className="flex items-end gap-3">
                  <p className="text-4xl font-bold text-white">{data.summary.newCustomers}</p>
                  <div className="mb-1">
                    <p className="text-gray-500 text-xs">new customers</p>
                    <p className="text-gray-600 text-xs">in the last {RANGES.find((r) => r.key === range)?.label}</p>
                  </div>
                </div>
                <Link href="/admin/crm"
                  className="mt-3 flex items-center gap-1.5 text-xs text-teal-400 hover:underline">
                  View all customers <ArrowRight size={10} />
                </Link>
              </div>
            </div>
          </div>

          {/* Top Customers */}
          {data.topCustomers && data.topCustomers.length > 0 && (
            <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden mt-6">
              <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Crown size={14} className="text-amber-400" />Top Customers (All-Time)
                </h2>
                <Link href="/admin/crm" className="text-xs text-teal-400 hover:underline flex items-center gap-1">
                  View CRM <ArrowRight size={10} />
                </Link>
              </div>
              <div className="divide-y divide-gray-800">
                {data.topCustomers.slice(0, 5).map((c, i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${i === 0 ? 'bg-amber-500/20 text-amber-400' : i === 1 ? 'bg-gray-300/20 text-gray-300' : i === 2 ? 'bg-orange-500/20 text-orange-400' : 'bg-gray-800 text-gray-500'}`}>
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-white text-xs font-medium">{c.name}</p>
                        <p className="text-gray-600 text-[10px]">{c.totalOrders} orders</p>
                      </div>
                    </div>
                    <span className="text-emerald-400 text-sm font-bold">${c.totalSpent.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
}
