'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAdminRole } from '@/hooks/useAdminRole';
import {
  Package, Search, RefreshCw, Plus, Minus, Save, Loader2,
  CheckCircle, XCircle, Clock, Archive, AlertTriangle, Sparkles,
  Edit, ExternalLink, Shield, ChevronDown
} from 'lucide-react';

interface DBProduct {
  id: string;
  slug: string;
  sku: string;
  name: string;
  subtitle: string;
  category: string;
  price: number;
  compare_price: number | null;
  image_url: string;
  badge: string | null;
  status: 'published' | 'draft' | 'coming_soon' | 'sold_out';
  stock_quantity: number;
  sort_order: number;
}

const STATUS_CONFIG = {
  published: { label: 'Published', icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', dot: 'bg-emerald-400' },
  draft: { label: 'Draft', icon: Archive, color: 'text-gray-400', bg: 'bg-gray-500/10', dot: 'bg-gray-400' },
  coming_soon: { label: 'Coming Soon', icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10', dot: 'bg-amber-400' },
  sold_out: { label: 'Sold Out', icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10', dot: 'bg-red-400' },
};

const BADGES = ['', 'Best Seller', 'Trending', 'New', 'Popular'];

export default function AdminInventoryPage() {
  const { can, isMaster } = useAdminRole();
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [stockModal, setStockModal] = useState<{ product: DBProduct; change: number; notes: string } | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/products');
      if (res.ok) setProducts(await res.json());
    } catch (err) { console.error(err); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const updateField = async (id: string, field: string, value: string | number | null) => {
    setSaving(id);
    try {
      const res = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, [field]: value }),
      });
      if (res.ok) {
        const updated = await res.json();
        setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
      }
    } catch (err) { console.error(err); }
    setSaving(null);
  };

  const adjustStock = async () => {
    if (!stockModal) return;
    setSaving(stockModal.product.id);
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: stockModal.product.id,
          quantityChange: stockModal.change,
          changeType: stockModal.change > 0 ? 'intake' : 'adjustment',
          notes: stockModal.notes,
        }),
      });
      if (res.ok) {
        const { newQuantity } = await res.json();
        setProducts((prev) =>
          prev.map((p) => (p.id === stockModal.product.id ? { ...p, stock_quantity: newQuantity } : p))
        );
      }
    } catch (err) { console.error(err); }
    setSaving(null);
    setStockModal(null);
  };

  const filtered = products.filter((p) => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (!search) return true;
    const s = search.toLowerCase();
    return p.name.toLowerCase().includes(s) || p.sku?.toLowerCase().includes(s) || p.category?.toLowerCase().includes(s);
  });

  // Publishing gate check
  const getGateStatus = (p: DBProduct): { ready: boolean; issues: string[] } => {
    const issues: string[] = [];
    if (!p.sku) issues.push('No SKU assigned');
    if (!p.price || p.price <= 0) issues.push('Price not set');
    if (!p.image_url) issues.push('No product image');
    return { ready: issues.length === 0, issues };
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Package size={22} className="text-emerald-400" />Inventory & Stock
          </h1>
          <p className="text-gray-500 text-sm mt-1">{products.length} products</p>
        </div>
        <button onClick={fetchProducts} className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-sm transition-colors">
          <RefreshCw size={13} />Refresh
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, SKU, category…"
            className="w-full pl-9 pr-3 py-2.5 bg-[#111827] border border-gray-800 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-teal-500"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 pr-8 py-2.5 bg-[#111827] border border-gray-800 rounded-xl text-sm text-white appearance-none focus:outline-none focus:border-teal-500"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="coming_soon">Coming Soon</option>
            <option value="sold_out">Sold Out</option>
          </select>
          <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {/* Product List */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 size={28} className="text-teal-400 animate-spin" /></div>
      ) : (
        <div className="space-y-2">
          {filtered.map((product) => {
            const statusCfg = STATUS_CONFIG[product.status] || STATUS_CONFIG.draft;
            const StatusIcon = statusCfg.icon;
            const gate = getGateStatus(product);
            const canPublish = can('can_publish_product') || isMaster;
            const canAdjust = can('can_adjust_stock') || isMaster;

            return (
              <div key={product.id} className="bg-[#111827] border border-gray-800 rounded-2xl overflow-hidden">
                <div className="flex items-start gap-3 px-4 py-3.5">
                  {/* Image */}
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-gray-800 shrink-0">
                    {product.image_url ? (
                      <Image src={product.image_url} alt={product.name} width={56} height={56} className="object-cover w-full h-full" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package size={18} className="text-gray-600" />
                      </div>
                    )}
                  </div>

                  {/* Product info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="text-white font-semibold text-sm truncate">{product.name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${statusCfg.color} ${statusCfg.bg} border-current/20`}>
                        {statusCfg.label}
                      </span>
                      {product.badge && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 font-medium">
                          {product.badge}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-gray-500 mt-1">
                      {product.sku && <span className="font-mono">{product.sku}</span>}
                      <span>${product.price.toFixed(2)}</span>
                      {product.compare_price && (
                        <span className="line-through text-gray-600">${product.compare_price.toFixed(2)}</span>
                      )}
                      <span className={product.stock_quantity > 0 ? 'text-emerald-400' : 'text-red-400'}>
                        {product.stock_quantity} in stock
                      </span>
                    </div>

                    {/* Publishing gate status */}
                    {!gate.ready && (
                      <div className="flex items-center gap-1 mt-1.5">
                        <AlertTriangle size={10} className="text-amber-500" />
                        <span className="text-[10px] text-amber-500">{gate.issues.join(' · ')}</span>
                      </div>
                    )}
                    {gate.ready && product.status !== 'published' && (
                      <div className="flex items-center gap-1 mt-1.5">
                        <Shield size={10} className="text-emerald-500" />
                        <span className="text-[10px] text-emerald-500">Ready to publish</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="shrink-0 flex flex-col items-end gap-1.5">
                    {/* Quick status change */}
                    {canPublish && (
                      <select
                        value={product.status}
                        onChange={(e) => updateField(product.id, 'status', e.target.value)}
                        disabled={saving === product.id}
                        className="text-[10px] px-2 py-1 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none"
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="coming_soon">Coming Soon</option>
                        <option value="sold_out">Sold Out</option>
                      </select>
                    )}

                    {/* Stock adjust */}
                    {canAdjust && (
                      <button
                        onClick={() => setStockModal({ product, change: 0, notes: '' })}
                        className="text-[10px] px-2 py-1 bg-gray-800 hover:bg-gray-700 text-gray-400 rounded-lg transition-colors"
                      >
                        ± Stock
                      </button>
                    )}

                    {/* Edit link */}
                    <Link
                      href={`/admin/inventory/${product.id}`}
                      className="text-[10px] px-2 py-1 text-teal-400 hover:text-teal-300 flex items-center gap-1"
                    >
                      <Edit size={9} />Edit
                    </Link>

                    {saving === product.id && <Loader2 size={12} className="text-teal-400 animate-spin" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {stockModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setStockModal(null)}>
          <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-white font-semibold text-lg mb-1">Adjust Stock</h3>
            <p className="text-gray-500 text-sm mb-4">{stockModal.product.name}</p>
            <p className="text-gray-400 text-xs mb-3">Current: <span className="text-white font-medium">{stockModal.product.stock_quantity}</span></p>

            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => setStockModal({ ...stockModal, change: stockModal.change - 1 })}
                className="w-10 h-10 bg-red-500/10 text-red-400 rounded-xl flex items-center justify-center hover:bg-red-500/20 transition-colors"
              >
                <Minus size={16} />
              </button>
              <input
                type="number"
                value={stockModal.change}
                onChange={(e) => setStockModal({ ...stockModal, change: parseInt(e.target.value) || 0 })}
                className="flex-1 px-3 py-2 bg-[#0a0f1c] border border-gray-700 rounded-xl text-white text-center text-lg font-bold focus:outline-none focus:border-teal-500"
              />
              <button
                onClick={() => setStockModal({ ...stockModal, change: stockModal.change + 1 })}
                className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center hover:bg-emerald-500/20 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="text-center mb-4">
              <span className="text-gray-400 text-xs">New total: </span>
              <span className={`text-lg font-bold ${stockModal.product.stock_quantity + stockModal.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {stockModal.product.stock_quantity + stockModal.change}
              </span>
            </div>

            <textarea
              value={stockModal.notes}
              onChange={(e) => setStockModal({ ...stockModal, notes: e.target.value })}
              placeholder="Reason for adjustment…"
              className="w-full px-3 py-2 bg-[#0a0f1c] border border-gray-700 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-teal-500 mb-4 h-16 resize-none"
            />

            <div className="flex gap-2">
              <button onClick={() => setStockModal(null)} className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-sm transition-colors">Cancel</button>
              <button
                onClick={adjustStock}
                disabled={stockModal.change === 0 || saving === stockModal.product.id}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-teal-600 hover:bg-teal-500 disabled:bg-gray-700 text-white rounded-xl text-sm font-medium transition-colors"
              >
                {saving === stockModal.product.id ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
