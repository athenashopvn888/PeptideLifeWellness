'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  ClipboardList, Plus, RefreshCw, Loader2, Search,
  ArrowRight, AlertTriangle, CheckCircle, Package,
  Trash2, X, Save
} from 'lucide-react';

interface POItem {
  productId: string;
  sku: string;
  productName: string;
  qtyOrdered: number;
  unitCost: number;
}

interface PO {
  id: string;
  po_number: string;
  supplier_name: string;
  status: string;
  expected_date: string | null;
  created_at: string;
  po_items: { qty_ordered: number; qty_received: number }[];
}

interface Product {
  id: string;
  sku: string;
  name: string;
  stock_quantity: number;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  draft:    { label: 'Draft',    color: 'text-gray-400',   bg: 'bg-gray-500/10' },
  ordered:  { label: 'Ordered',  color: 'text-blue-400',   bg: 'bg-blue-500/10' },
  partial:  { label: 'Partial',  color: 'text-amber-400',  bg: 'bg-amber-500/10' },
  received: { label: 'Received', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  closed:   { label: 'Closed',   color: 'text-gray-500',   bg: 'bg-gray-800' },
};

const STATUS_TABS = ['all', 'draft', 'ordered', 'partial', 'received', 'closed'];

export default function PurchaseOrdersPage() {
  const [pos, setPOs] = useState<PO[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [showNewPO, setShowNewPO] = useState(false);

  // New PO form
  const [supplierName, setSupplierName] = useState('');
  const [expectedDate, setExpectedDate] = useState('');
  const [poNotes, setPoNotes] = useState('');
  const [lineItems, setLineItems] = useState<POItem[]>([{ productId: '', sku: '', productName: '', qtyOrdered: 1, unitCost: 0 }]);
  const [saving, setSaving] = useState(false);
  const [productSearch, setProductSearch] = useState('');


  const fetchPOs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/warehouse');
      if (res.ok) setPOs(await res.json());
    } catch (err) { console.error(err); }
    setLoading(false);
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/products');
      if (res.ok) setProducts(await res.json());
    } catch (err) { console.error(err); }
  }, []);

  useEffect(() => { fetchPOs(); fetchProducts(); }, [fetchPOs, fetchProducts]);

  const filtered = pos.filter((p) => {
    if (activeTab !== 'all' && p.status !== activeTab) return false;
    if (search) {
      const q = search.toLowerCase();
      return p.po_number.toLowerCase().includes(q) || p.supplier_name.toLowerCase().includes(q);
    }
    return true;
  });

  const getProgress = (po: PO) => {
    const ordered = po.po_items?.reduce((s, i) => s + i.qty_ordered, 0) || 0;
    const received = po.po_items?.reduce((s, i) => s + i.qty_received, 0) || 0;
    const pct = ordered > 0 ? Math.round((received / ordered) * 100) : 0;
    return { ordered, received, pct };
  };

  const addLineItem = () => setLineItems([...lineItems, { productId: '', sku: '', productName: '', qtyOrdered: 1, unitCost: 0 }]);
  const removeLineItem = (idx: number) => setLineItems(lineItems.filter((_, i) => i !== idx));

  const selectProduct = (idx: number, product: Product) => {
    const updated = [...lineItems];
    updated[idx] = { ...updated[idx], productId: product.id, sku: product.sku, productName: product.name };
    setLineItems(updated);
    setProductSearch('');
  };

  const updateLineItem = (idx: number, field: keyof POItem, value: string | number) => {
    const updated = [...lineItems];
    updated[idx] = { ...updated[idx], [field]: value };
    setLineItems(updated);
  };

  const subtotal = lineItems.reduce((s, i) => s + i.qtyOrdered * i.unitCost, 0);

  const handleCreatePO = async () => {
    if (!supplierName.trim() || lineItems.some((i) => !i.productName || i.qtyOrdered < 1)) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/warehouse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ supplierName, expectedDate: expectedDate || undefined, notes: poNotes || undefined, items: lineItems }),
      });
      if (res.ok) {
        setShowNewPO(false);
        setSupplierName(''); setExpectedDate(''); setPoNotes('');
        setLineItems([{ productId: '', sku: '', productName: '', qtyOrdered: 1, unitCost: 0 }]);
        await fetchPOs();
      }
    } catch (err) { console.error(err); }
    setSaving(false);
  };

  const advancePO = async (id: string, currentStatus: string) => {
    const next: Record<string, string> = { draft: 'ordered', ordered: 'partial', partial: 'received' };
    const nextStatus = next[currentStatus];
    if (!nextStatus) return;
    await fetch('/api/admin/warehouse', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: nextStatus }),
    });
    await fetchPOs();
  };

  const filteredProducts = products.filter((p) =>
    !productSearch || p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.sku.toLowerCase().includes(productSearch.toLowerCase())
  ).slice(0, 6);

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ClipboardList size={24} className="text-teal-400" />Purchase Orders
          </h1>
          <p className="text-sm text-gray-500 mt-1">Create and manage supplier purchase orders</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchPOs}
            className="flex items-center gap-1.5 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors">
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />Refresh
          </button>
          <button onClick={() => setShowNewPO(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-sm transition-colors">
            <Plus size={13} />New PO
          </button>
        </div>
      </div>

      {/* Search + Tabs */}
      <div className="relative mb-3">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search PO number or supplier..."
          className="w-full pl-9 pr-4 py-2.5 bg-[#111827] border border-gray-800 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-teal-500" />
      </div>
      <div className="flex gap-1.5 overflow-x-auto mb-4 pb-1">
        {STATUS_TABS.map((tab) => {
          const count = tab === 'all' ? pos.length : pos.filter((p) => p.status === tab).length;
          return (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-teal-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
              {tab === 'all' ? 'All' : STATUS_CONFIG[tab]?.label}
              {count > 0 && <span className={`rounded-full px-1.5 text-xs ${activeTab === tab ? 'bg-white/20' : 'bg-gray-700'}`}>{count}</span>}
            </button>
          );
        })}
      </div>

      {/* PO List */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 size={32} className="text-teal-400 animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <ClipboardList size={40} className="text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500">{pos.length === 0 ? 'No purchase orders yet.' : 'No POs match filters.'}</p>
        </div>
      ) : (
        <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-3 px-4 text-xs text-gray-500 font-medium">PO #</th>
                  <th className="text-left py-3 px-3 text-xs text-gray-500 font-medium">Supplier</th>
                  <th className="text-left py-3 px-3 text-xs text-gray-500 font-medium">Status</th>
                  <th className="text-left py-3 px-3 text-xs text-gray-500 font-medium">Progress</th>
                  <th className="text-left py-3 px-3 text-xs text-gray-500 font-medium">Expected</th>
                  <th className="text-left py-3 px-3 text-xs text-gray-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((po) => {
                  const sc = STATUS_CONFIG[po.status];
                  const { ordered, received, pct } = getProgress(po);
                  const overdue = po.expected_date && new Date(po.expected_date) < new Date() && po.status !== 'received';
                  const nextLabels: Record<string, string> = { draft: 'Mark Ordered', ordered: 'Mark Partial', partial: 'Mark Received' };
                  return (
                    <tr key={po.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                      <td className="py-3 px-4">
                        <p className="text-white font-mono font-semibold text-xs">{po.po_number}</p>
                        <p className="text-gray-600 text-xs">{new Date(po.created_at).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}</p>
                      </td>
                      <td className="py-3 px-3">
                        <p className="text-gray-300 text-xs">{po.supplier_name}</p>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`text-xs px-2 py-0.5 rounded ${sc.bg} ${sc.color} font-medium`}>{sc.label}</span>
                      </td>
                      <td className="py-3 px-3 w-32">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500">{received}/{ordered}</span>
                          <span className={pct === 100 ? 'text-emerald-400' : 'text-gray-400'}>{pct}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-800 rounded-full">
                          <div className={`h-full rounded-full ${pct === 100 ? 'bg-emerald-400' : pct > 0 ? 'bg-amber-400' : 'bg-gray-600'}`} style={{ width: `${pct}%` }} />
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        {po.expected_date ? (
                          <p className={`text-xs ${overdue ? 'text-red-400 flex items-center gap-1' : 'text-gray-400'}`}>
                            {overdue && <AlertTriangle size={10} />}
                            {new Date(po.expected_date).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}
                          </p>
                        ) : <span className="text-gray-600 text-xs">—</span>}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <Link href={`/admin/warehouse/purchase-orders/${po.id}`}
                            className="flex items-center gap-1 px-2 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-xs transition-colors">
                            <Package size={10} />Receive
                          </Link>
                          {nextLabels[po.status] && (
                            <button onClick={() => advancePO(po.id, po.status)}
                              className="flex items-center gap-1 px-2 py-1.5 bg-teal-600/20 hover:bg-teal-600/30 text-teal-400 rounded-lg text-xs transition-colors">
                              <CheckCircle size={10} />{nextLabels[po.status]}
                            </button>
                          )}
                          <Link href={`/admin/warehouse/purchase-orders/${po.id}`}
                            className="p-1.5 hover:bg-gray-800 rounded-lg text-gray-500 hover:text-white transition-colors">
                            <ArrowRight size={12} />
                          </Link>
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

      {/* New PO Modal */}
      {showNewPO && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-[#111827] border border-gray-800 rounded-2xl w-full max-w-2xl my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-800">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus size={18} className="text-teal-400" />New Purchase Order
              </h2>
              <button onClick={() => setShowNewPO(false)} className="text-gray-500 hover:text-white"><X size={18} /></button>
            </div>

            <div className="p-5 space-y-5">
              {/* Supplier + Date */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Supplier Name *</label>
                  <input type="text" value={supplierName} onChange={(e) => setSupplierName(e.target.value)}
                    placeholder="e.g. Peptide Sciences"
                    className="w-full px-3 py-2.5 bg-[#0a0f1c] border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-teal-500" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Expected Delivery</label>
                  <input type="date" value={expectedDate} onChange={(e) => setExpectedDate(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#0a0f1c] border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-teal-500" />
                </div>
              </div>

              {/* Line Items */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-gray-400 font-medium">Line Items</label>
                  <button onClick={addLineItem} className="text-xs text-teal-400 hover:underline flex items-center gap-1">
                    <Plus size={11} />Add Item
                  </button>
                </div>

                {/* Product Search */}
                <div className="relative mb-3">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input type="text" value={productSearch} onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search products to add..."
                    className="w-full pl-8 pr-4 py-2 bg-[#0a0f1c] border border-gray-700 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-teal-500" />
                  {productSearch && filteredProducts.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a2235] border border-gray-700 rounded-lg overflow-hidden z-10 shadow-xl">
                      {filteredProducts.map((p) => (
                        <button key={p.id} onClick={() => {
                          // Add to last empty item or create new
                          const emptyIdx = lineItems.findIndex((i) => !i.productName);
                          if (emptyIdx >= 0) selectProduct(emptyIdx, p);
                          else { addLineItem(); setTimeout(() => selectProduct(lineItems.length, p), 0); }
                        }}
                          className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-700 transition-colors text-left">
                          <div>
                            <p className="text-white text-xs font-medium">{p.name}</p>
                            <p className="text-gray-500 text-xs font-mono">{p.sku}</p>
                          </div>
                          <span className="text-gray-500 text-xs">Stock: {p.stock_quantity}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  {lineItems.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-center p-3 bg-[#0a0f1c] rounded-lg border border-gray-800">
                      <div className="col-span-5">
                        <input type="text" value={item.productName} onChange={(e) => updateLineItem(idx, 'productName', e.target.value)}
                          placeholder="Product name"
                          className="w-full bg-transparent text-white text-xs placeholder-gray-600 focus:outline-none" />
                        <input type="text" value={item.sku} onChange={(e) => updateLineItem(idx, 'sku', e.target.value)}
                          placeholder="SKU"
                          className="w-full bg-transparent text-gray-500 text-xs font-mono placeholder-gray-700 focus:outline-none mt-0.5" />
                      </div>
                      <div className="col-span-3 flex items-center gap-1">
                        <span className="text-gray-600 text-xs">Qty</span>
                        <input type="number" value={item.qtyOrdered || ''} min={1}
                          onChange={(e) => updateLineItem(idx, 'qtyOrdered', parseInt(e.target.value) || 0)}
                          className="w-full bg-transparent text-white text-xs text-center focus:outline-none font-mono" />
                      </div>
                      <div className="col-span-3 flex items-center gap-1">
                        <span className="text-gray-600 text-xs">$</span>
                        <input type="number" value={item.unitCost || ''} min={0} step={0.01}
                          onChange={(e) => updateLineItem(idx, 'unitCost', parseFloat(e.target.value) || 0)}
                          className="w-full bg-transparent text-white text-xs focus:outline-none font-mono" />
                      </div>
                      <div className="col-span-1 text-right">
                        {lineItems.length > 1 && (
                          <button onClick={() => removeLineItem(idx)} className="text-gray-600 hover:text-red-400 transition-colors">
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end mt-2">
                  <p className="text-sm text-gray-400">Subtotal: <span className="text-white font-semibold">${subtotal.toFixed(2)}</span></p>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Notes</label>
                <textarea value={poNotes} onChange={(e) => setPoNotes(e.target.value)} rows={2}
                  placeholder="e.g. Rush order, specific instructions..."
                  className="w-full px-3 py-2 bg-[#0a0f1c] border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 resize-none" />
              </div>
            </div>

            <div className="flex gap-3 p-5 border-t border-gray-800">
              <button onClick={() => setShowNewPO(false)}
                className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors">
                Cancel
              </button>
              <button onClick={handleCreatePO} disabled={saving || !supplierName.trim()}
                className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                Create PO
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
