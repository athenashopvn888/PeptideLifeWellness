'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Package, Search, RefreshCw, Plus, Minus, Save, Loader2,
  CheckCircle, XCircle, Clock, Archive, AlertTriangle, Sparkles
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
  image: string;
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
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [seedStatus, setSeedStatus] = useState<string>('');
  const [stockModal, setStockModal] = useState<{ product: DBProduct; change: number; notes: string } | null>(null);

  const getAuth = () => localStorage.getItem('plw-admin-auth') || '';

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/products', {
        headers: { 'x-admin-password': getAuth() },
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Fetch failed:', err);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const updateField = async (id: string, field: string, value: string | number | null) => {
    setSaving(id);
    try {
      const res = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': getAuth() },
        body: JSON.stringify({ id, [field]: value }),
      });
      if (res.ok) {
        const updated = await res.json();
        setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
      }
    } catch (err) {
      console.error('Update failed:', err);
    }
    setSaving(null);
  };

  const adjustStock = async () => {
    if (!stockModal) return;
    setSaving(stockModal.product.id);
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': getAuth() },
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
    } catch (err) {
      console.error('Stock adjust failed:', err);
    }
    setSaving(null);
    setStockModal(null);
  };

  const seedDatabase = async () => {
    setSeedStatus('Seeding...');
    try {
      const res = await fetch('/api/admin/seed', {
        method: 'POST',
        headers: { 'x-admin-password': getAuth() },
      });
      const data = await res.json();
      setSeedStatus(data.message || data.error || 'Done');
      if (!data.skipped) fetchProducts();
    } catch {
      setSeedStatus('Seed failed');
    }
  };

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: products.length,
    published: products.filter((p) => p.status === 'published').length,
    draft: products.filter((p) => p.status === 'draft').length,
    lowStock: products.filter((p) => p.stock_quantity <= 5 && p.status === 'published').length,
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Package size={24} className="text-teal-400" />
            Inventory Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage products, pricing, and stock levels</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchProducts}
            className="flex items-center gap-1.5 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            onClick={seedDatabase}
            className="flex items-center gap-1.5 px-3 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-sm transition-colors"
            id="seed-db-btn"
          >
            <Sparkles size={14} />
            Seed DB
          </button>
        </div>
      </div>

      {seedStatus && (
        <div className="bg-teal-500/10 border border-teal-500/20 rounded-lg p-3 mb-4">
          <p className="text-sm text-teal-300">{seedStatus}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Products', value: stats.total, color: 'text-white' },
          { label: 'Published', value: stats.published, color: 'text-emerald-400' },
          { label: 'Drafts', value: stats.draft, color: 'text-gray-400' },
          { label: 'Low Stock', value: stats.lowStock, color: 'text-amber-400' },
        ].map((s) => (
          <div key={s.label} className="bg-[#111827] border border-gray-800 rounded-xl p-4">
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-9 pr-4 py-2.5 bg-[#111827] border border-gray-800 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-teal-500"
            id="admin-search"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto">
          {['all', 'published', 'draft', 'coming_soon', 'sold_out'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                statusFilter === s ? 'bg-teal-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {s === 'all' ? 'All' : STATUS_CONFIG[s as keyof typeof STATUS_CONFIG]?.label || s}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="text-teal-400 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Package size={40} className="text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500">
            {products.length === 0 ? 'No products in database. Click "Seed DB" to import.' : 'No products match your filters.'}
          </p>
        </div>
      ) : (
        <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-3 px-4 text-xs text-gray-500 font-medium">Product</th>
                  <th className="text-left py-3 px-2 text-xs text-gray-500 font-medium">Status</th>
                  <th className="text-left py-3 px-2 text-xs text-gray-500 font-medium">Price</th>
                  <th className="text-left py-3 px-2 text-xs text-gray-500 font-medium">Stock</th>
                  <th className="text-left py-3 px-2 text-xs text-gray-500 font-medium">Badge</th>
                  <th className="text-left py-3 px-2 text-xs text-gray-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => {
                  const sc = STATUS_CONFIG[product.status];
                  const isLow = product.stock_quantity <= 5 && product.status === 'published';
                  return (
                    <tr key={product.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                      {/* Product info */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-900 overflow-hidden shrink-0">
                            <Image src={product.image} alt={product.name} width={40} height={40} className="object-contain w-full h-full" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-white font-medium truncate">{product.name}</p>
                            <p className="text-xs text-gray-500 truncate">{product.category}</p>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-2">
                        <select
                          value={product.status}
                          onChange={(e) => updateField(product.id, 'status', e.target.value)}
                          className={`text-xs font-medium px-2 py-1 rounded-lg border-0 cursor-pointer ${sc.bg} ${sc.color} bg-transparent focus:outline-none`}
                        >
                          {Object.entries(STATUS_CONFIG).map(([val, cfg]) => (
                            <option key={val} value={val} className="bg-gray-900 text-white">{cfg.label}</option>
                          ))}
                        </select>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500 text-xs">$</span>
                          <input
                            type="number"
                            defaultValue={product.price}
                            step="0.01"
                            onBlur={(e) => {
                              const val = parseFloat(e.target.value);
                              if (!isNaN(val) && val !== product.price) {
                                updateField(product.id, 'price', val);
                              }
                            }}
                            className="w-20 bg-transparent text-white text-sm font-mono focus:outline-none focus:bg-gray-900 rounded px-1 py-0.5"
                          />
                        </div>
                      </td>

                      {/* Stock */}
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-mono ${isLow ? 'text-amber-400' : 'text-white'}`}>
                            {product.stock_quantity}
                          </span>
                          {isLow && <AlertTriangle size={12} className="text-amber-400" />}
                        </div>
                      </td>

                      {/* Badge */}
                      <td className="py-3 px-2">
                        <select
                          value={product.badge || ''}
                          onChange={(e) => updateField(product.id, 'badge', e.target.value || null)}
                          className="text-xs bg-transparent text-gray-300 focus:outline-none cursor-pointer"
                        >
                          {BADGES.map((b) => (
                            <option key={b} value={b} className="bg-gray-900">{b || '—'}</option>
                          ))}
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setStockModal({ product, change: 10, notes: '' })}
                            className="p-1.5 hover:bg-teal-500/10 rounded-lg text-teal-400 transition-colors"
                            title="Adjust stock"
                          >
                            <Plus size={14} />
                          </button>
                          {saving === product.id && <Loader2 size={14} className="text-teal-400 animate-spin" />}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {stockModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-white mb-1">Adjust Stock</h3>
            <p className="text-sm text-gray-500 mb-4">{stockModal.product.name}</p>
            <p className="text-xs text-gray-500 mb-2">Current: <span className="text-white font-mono">{stockModal.product.stock_quantity}</span></p>

            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => setStockModal({ ...stockModal, change: stockModal.change - 1 })}
                className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center text-white"
              >
                <Minus size={16} />
              </button>
              <input
                type="number"
                value={stockModal.change}
                onChange={(e) => setStockModal({ ...stockModal, change: parseInt(e.target.value) || 0 })}
                className="flex-1 px-3 py-2 bg-[#0a0f1c] border border-gray-700 rounded-lg text-white text-center font-mono focus:outline-none focus:border-teal-500"
              />
              <button
                onClick={() => setStockModal({ ...stockModal, change: stockModal.change + 1 })}
                className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center text-white"
              >
                <Plus size={16} />
              </button>
            </div>

            <input
              type="text"
              value={stockModal.notes}
              onChange={(e) => setStockModal({ ...stockModal, notes: e.target.value })}
              placeholder="Notes (optional)"
              className="w-full px-3 py-2 bg-[#0a0f1c] border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 mb-4"
            />

            <p className="text-xs text-gray-500 mb-4">
              New quantity: <span className={`font-mono font-bold ${(stockModal.product.stock_quantity + stockModal.change) < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                {stockModal.product.stock_quantity + stockModal.change}
              </span>
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setStockModal(null)}
                className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={adjustStock}
                disabled={(stockModal.product.stock_quantity + stockModal.change) < 0}
                className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <Save size={14} />
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
