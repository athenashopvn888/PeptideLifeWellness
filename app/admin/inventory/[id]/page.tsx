'use client';

import { useState, useEffect, useCallback, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import PhotoCapture from '@/components/admin/PhotoCapture';
import { useAdminRole } from '@/hooks/useAdminRole';
import {
  ArrowLeft, Save, Loader2, Package, Tag, DollarSign,
  CheckCircle, XCircle, Shield, AlertTriangle, Sparkles,
  Image as ImageIcon, Hash, FileText, Layers
} from 'lucide-react';

interface Product {
  id: string;
  slug: string;
  sku: string | null;
  name: string;
  subtitle: string | null;
  description: string | null;
  category: string | null;
  price: number;
  compare_price: number | null;
  image_url: string | null;
  images: string[] | null;
  badge: string | null;
  status: 'published' | 'draft' | 'coming_soon' | 'sold_out';
  stock_quantity: number;
  sort_order: number;
}

const BADGES = ['', 'Best Seller', 'Trending', 'New', 'Popular'];
const STATUSES = [
  { value: 'published', label: 'Published', color: 'text-emerald-400' },
  { value: 'draft', label: 'Draft', color: 'text-gray-400' },
  { value: 'coming_soon', label: 'Coming Soon', color: 'text-amber-400' },
  { value: 'sold_out', label: 'Sold Out', color: 'text-red-400' },
];

export default function ProductEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { can, isMaster } = useAdminRole();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  // Edit state
  const [form, setForm] = useState({
    name: '', subtitle: '', description: '', sku: '', category: '',
    price: 0, compare_price: 0, image_url: '',
    badge: '', status: 'draft' as string, sort_order: 0,
  });

  const fetchProduct = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/products');
      if (res.ok) {
        const all = await res.json();
        const found = all.find((p: Product) => p.id === id);
        if (found) {
          setProduct(found);
          setForm({
            name: found.name || '',
            subtitle: found.subtitle || '',
            description: found.description || '',
            sku: found.sku || '',
            category: found.category || '',
            price: found.price || 0,
            compare_price: found.compare_price || 0,
            image_url: found.image_url || '',
            badge: found.badge || '',
            status: found.status || 'draft',
            sort_order: found.sort_order || 0,
          });
        }
      }
    } catch (err) { console.error(err); }
    setLoading(false);
  }, [id]);

  useEffect(() => { fetchProduct(); }, [fetchProduct]);

  const handleSave = async () => {
    setSaving(true);
    setSaveMsg(null);
    try {
      const res = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...form, compare_price: form.compare_price || null }),
      });
      if (res.ok) {
        const updated = await res.json();
        setProduct((p) => p ? { ...p, ...updated } : p);
        setSaveMsg('Saved');
        setTimeout(() => setSaveMsg(null), 2000);
      } else {
        const d = await res.json();
        setSaveMsg(d.error || 'Save failed');
      }
    } catch { setSaveMsg('Network error'); }
    setSaving(false);
  };

  // Publishing Gate Checklist
  const gates = [
    { label: 'SKU assigned', pass: !!form.sku, icon: Hash },
    { label: 'Price set (> $0)', pass: form.price > 0, icon: DollarSign },
    { label: 'Product image', pass: !!form.image_url, icon: ImageIcon },
    { label: 'Name set', pass: !!form.name, icon: FileText },
  ];
  const gatesPassed = gates.filter((g) => g.pass).length;
  const allGatesPassed = gatesPassed === gates.length;

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-16"><Loader2 size={28} className="text-teal-400 animate-spin" /></div>
      </AdminLayout>
    );
  }

  if (!product) {
    return (
      <AdminLayout>
        <div className="text-center py-16">
          <Package size={32} className="text-gray-700 mx-auto mb-3" />
          <p className="text-gray-400">Product not found</p>
          <Link href="/admin/inventory" className="text-teal-400 text-sm hover:underline mt-2 block">← Back to inventory</Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/inventory" className="text-gray-500 hover:text-white transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-white truncate">{form.name || 'Edit Product'}</h1>
          <p className="text-gray-500 text-xs mt-0.5">{form.sku || 'No SKU'} · {form.category}</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-500 disabled:bg-gray-700 text-white rounded-xl text-sm font-medium transition-colors"
        >
          {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
          Save
        </button>
      </div>

      {saveMsg && (
        <div className={`mb-4 px-4 py-2 rounded-xl text-sm ${saveMsg === 'Saved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
          {saveMsg}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Main form */}
        <div className="lg:col-span-2 space-y-5">
          {/* Basic Info */}
          <section className="bg-[#111827] border border-gray-800 rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><FileText size={14} className="text-gray-400" />Basic Info</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Product Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0a0f1c] border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-teal-500" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Subtitle / Short Description</label>
                <input type="text" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0a0f1c] border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-teal-500" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Full Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 bg-[#0a0f1c] border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-teal-500 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">SKU *</label>
                  <input type="text" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })}
                    placeholder="e.g. BPC-157-5MG"
                    className="w-full px-3 py-2 bg-[#0a0f1c] border border-gray-700 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-teal-500" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Category</label>
                  <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0a0f1c] border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-teal-500" />
                </div>
              </div>
            </div>
          </section>

          {/* Pricing */}
          <section className="bg-[#111827] border border-gray-800 rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><DollarSign size={14} className="text-gray-400" />Pricing</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Price ($) *</label>
                <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-[#0a0f1c] border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-teal-500" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Compare Price (strikethrough)</label>
                <input type="number" step="0.01" value={form.compare_price || ''} onChange={(e) => setForm({ ...form, compare_price: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                  className="w-full px-3 py-2 bg-[#0a0f1c] border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-teal-500" />
              </div>
            </div>
          </section>

          {/* Image */}
          <section className="bg-[#111827] border border-gray-800 rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><ImageIcon size={14} className="text-gray-400" />Product Image</h2>
            <div className="flex gap-4 items-start">
              {form.image_url && (
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-800 shrink-0">
                  <Image src={form.image_url} alt={form.name} width={96} height={96} className="object-cover w-full h-full" />
                </div>
              )}
              <div className="flex-1">
                <label className="block text-xs text-gray-400 mb-1">Image URL</label>
                <input type="text" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-[#0a0f1c] border border-gray-700 rounded-lg text-xs text-white focus:outline-none focus:border-teal-500" />
                <p className="text-[10px] text-gray-600 mt-1">Or upload via Supabase Storage</p>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar — Status + Gates */}
        <div className="space-y-5">
          {/* Status & Display */}
          <section className="bg-[#111827] border border-gray-800 rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><Layers size={14} className="text-gray-400" />Status & Display</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0a0f1c] border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-teal-500">
                  {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Badge</label>
                <select value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0a0f1c] border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-teal-500">
                  {BADGES.map((b) => <option key={b} value={b}>{b || '— None —'}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Sort Order</label>
                <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-[#0a0f1c] border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-teal-500" />
              </div>
            </div>
          </section>

          {/* Publishing Gate Checklist */}
          <section className={`rounded-2xl p-5 border ${allGatesPassed ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-amber-500/5 border-amber-500/20'}`}>
            <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Shield size={14} className={allGatesPassed ? 'text-emerald-400' : 'text-amber-400'} />
              Publishing Gate
            </h2>
            <p className="text-[10px] text-gray-500 mb-3">All gates must pass before a linked batch can go LIVE</p>

            <div className="space-y-2">
              {gates.map((g) => {
                const GateIcon = g.icon;
                return (
                  <div key={g.label} className={`flex items-center gap-2 text-xs ${g.pass ? 'text-emerald-400' : 'text-gray-500'}`}>
                    {g.pass ? <CheckCircle size={13} /> : <XCircle size={13} className="text-gray-600" />}
                    <GateIcon size={11} className={g.pass ? 'text-emerald-400' : 'text-gray-600'} />
                    <span>{g.label}</span>
                  </div>
                );
              })}
            </div>

            <div className={`mt-3 pt-3 border-t ${allGatesPassed ? 'border-emerald-500/20' : 'border-amber-500/20'}`}>
              <div className="flex items-center gap-2 text-xs font-medium">
                {allGatesPassed ? (
                  <>
                    <CheckCircle size={14} className="text-emerald-400" />
                    <span className="text-emerald-400">{gatesPassed}/{gates.length} — Ready to publish</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle size={14} className="text-amber-400" />
                    <span className="text-amber-400">{gatesPassed}/{gates.length} — Not ready</span>
                  </>
                )}
              </div>
            </div>
          </section>

          {/* Stock info */}
          <section className="bg-[#111827] border border-gray-800 rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><Package size={14} className="text-gray-400" />Stock</h2>
            <p className="text-2xl font-bold text-white">{product.stock_quantity}</p>
            <p className="text-gray-500 text-xs">units in stock</p>
            <Link href="/admin/warehouse/batches" className="text-teal-400 text-xs hover:underline mt-2 block">
              View batch history →
            </Link>
          </section>
        </div>
      </div>
    </AdminLayout>
  );
}
