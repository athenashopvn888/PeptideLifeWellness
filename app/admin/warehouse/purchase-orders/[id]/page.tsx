'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  ArrowLeft, Package, CheckCircle, Loader2, AlertCircle,
  Save, Calendar, Hash, Truck, ClipboardList, Camera
} from 'lucide-react';
import PhotoCapture from '@/components/admin/PhotoCapture';

interface POItem {
  id: string; sku: string; product_name: string;
  qty_ordered: number; qty_received: number; unit_cost: number;
  products?: { id: string; stock_quantity: number };
}
interface Receipt {
  id: string; sku: string; product_name: string;
  qty_received: number; batch_number: string | null;
  received_at: string; received_by: string;
}
type POData = Record<string, unknown>;

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  draft:    { label: 'Draft',    color: 'text-gray-400',   bg: 'bg-gray-500/10' },
  ordered:  { label: 'Ordered',  color: 'text-blue-400',   bg: 'bg-blue-500/10' },
  partial:  { label: 'Partial',  color: 'text-amber-400',  bg: 'bg-amber-500/10' },
  received: { label: 'Received', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  closed:   { label: 'Closed',   color: 'text-gray-500',   bg: 'bg-gray-800' },
};

interface ReceiveRow {
  poItemId: string; productId: string; sku: string; productName: string;
  qty: number; batchNumber: string; expiryDate: string; lotNumber: string;
}

export default function PODetailPage() {
  const params = useParams();
  const poId = params.id as string;
  const [po, setPO] = useState<POData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [receiveRows, setReceiveRows] = useState<ReceiveRow[]>([]);
  const [showReceiveForm, setShowReceiveForm] = useState(false);
  const [receiptPhotos, setReceiptPhotos] = useState<string[]>([]);

  const fetchPO = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/warehouse?id=${poId}`);
      if (res.ok) {
        const data = await res.json();
        setPO(data);
        const items = (data.po_items as POItem[]) || [];
        setReceiveRows(items.filter((i) => i.qty_received < i.qty_ordered).map((i) => ({
          poItemId: i.id, productId: i.products?.id || '', sku: i.sku,
          productName: i.product_name, qty: i.qty_ordered - i.qty_received,
          batchNumber: '', expiryDate: '', lotNumber: '',
        })));
      }
    } catch (err) { console.error(err); }
    setLoading(false);
  }, [poId]);

  useEffect(() => { fetchPO(); }, [fetchPO]);

  const handleReceive = async () => {
    const toReceive = receiveRows.filter((r) => r.qty > 0);
    if (!toReceive.length) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/warehouse?action=receive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receipts: toReceive.map((r) => ({
            poId, poItemId: r.poItemId || undefined, productId: r.productId || undefined,
            sku: r.sku, productName: r.productName, qtyReceived: r.qty,
            batchNumber: r.batchNumber || undefined, expiryDate: r.expiryDate || undefined,
            lotNumber: r.lotNumber || undefined,
          })),
        }),
      });
      if (res.ok) { setShowReceiveForm(false); await fetchPO(); }
    } catch (err) { console.error(err); }
    setSaving(false);
  };

  const updateRow = (idx: number, field: keyof ReceiveRow, value: string | number) => {
    const updated = [...receiveRows];
    updated[idx] = { ...updated[idx], [field]: value };
    setReceiveRows(updated);
  };

  if (loading) return <AdminLayout><div className="flex justify-center py-20"><Loader2 size={32} className="text-teal-400 animate-spin" /></div></AdminLayout>;
  if (!po) return <AdminLayout><div className="text-center py-20"><AlertCircle size={40} className="text-gray-700 mx-auto mb-3" /><p className="text-gray-500">PO not found</p><Link href="/admin/warehouse/purchase-orders" className="text-teal-400 text-sm hover:underline mt-2 inline-block">← Back</Link></div></AdminLayout>;

  const items = (po.po_items as POItem[]) || [];
  const receipts = (po.stock_receipts as Receipt[]) || [];
  const sc = STATUS_CONFIG[po.status as string] || STATUS_CONFIG.draft;
  const totalOrdered = items.reduce((s, i) => s + i.qty_ordered, 0);
  const totalReceived = items.reduce((s, i) => s + i.qty_received, 0);
  const pct = totalOrdered > 0 ? Math.round((totalReceived / totalOrdered) * 100) : 0;
  const allReceived = totalReceived >= totalOrdered && totalOrdered > 0;

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/warehouse/purchase-orders" className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white font-mono">{po.po_number as string}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-xs px-2 py-0.5 rounded ${sc.bg} ${sc.color} font-medium`}>{sc.label}</span>
              <span className="text-gray-500 text-xs">{po.supplier_name as string}</span>
            </div>
          </div>
        </div>
        {!allReceived && (
          <button onClick={() => setShowReceiveForm(!showReceiveForm)}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-sm font-medium transition-colors">
            <Package size={14} />{showReceiveForm ? 'Cancel' : 'Receive Stock'}
          </button>
        )}
      </div>

      {/* Progress */}
      <div className="bg-[#111827] border border-gray-800 rounded-xl p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <div><p className="text-xs text-gray-500">Progress</p><p className="text-2xl font-bold text-white">{pct}%</p></div>
            <div className="h-10 w-px bg-gray-800" />
            <div><p className="text-xs text-gray-500">Received</p><p className="text-lg font-bold text-emerald-400">{totalReceived}<span className="text-gray-500 text-sm">/{totalOrdered}</span></p></div>
          </div>
          <div className="text-right text-xs text-gray-500 space-y-1">
            {!!po.expected_date && <p className="flex items-center gap-1 justify-end"><Calendar size={10} />{new Date(po.expected_date as string).toLocaleDateString('en-CA')}</p>}
            <p className="flex items-center gap-1 justify-end"><Hash size={10} />{new Date(po.created_at as string).toLocaleDateString('en-CA')}</p>
          </div>
        </div>
        <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-500 ${allReceived ? 'bg-emerald-400' : pct > 0 ? 'bg-amber-400' : 'bg-gray-600'}`} style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Receive Form */}
          {showReceiveForm && receiveRows.length > 0 && (
            <div className="bg-teal-500/5 border border-teal-500/20 rounded-xl p-5">
              <h2 className="text-sm font-semibold text-teal-400 mb-4 flex items-center gap-2"><Package size={14} />Receiving Form</h2>
              <div className="space-y-4">
                {receiveRows.map((row, idx) => (
                  <div key={row.poItemId} className="bg-[#111827] border border-gray-800 rounded-lg p-4">
                    <p className="text-white text-sm font-medium">{row.productName}</p>
                    <p className="text-gray-500 text-xs font-mono mb-3">{row.sku}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { label: 'Qty Receiving *', field: 'qty' as keyof ReceiveRow, type: 'number', value: row.qty },
                        { label: 'Batch #', field: 'batchNumber' as keyof ReceiveRow, type: 'text', value: row.batchNumber, placeholder: 'e.g. B240101' },
                        { label: 'Expiry Date', field: 'expiryDate' as keyof ReceiveRow, type: 'date', value: row.expiryDate },
                        { label: 'Lot #', field: 'lotNumber' as keyof ReceiveRow, type: 'text', value: row.lotNumber, placeholder: 'Optional' },
                      ].map(({ label, field, type, value, placeholder }) => (
                        <div key={field}>
                          <label className="block text-xs text-gray-500 mb-1">{label}</label>
                          <input type={type} value={value}
                            placeholder={placeholder}
                            onChange={(e) => updateRow(idx, field, type === 'number' ? parseInt(e.target.value) || 0 : e.target.value)}
                            className="w-full px-2 py-1.5 bg-[#0a0f1c] border border-gray-700 rounded text-sm text-white focus:outline-none focus:border-teal-500 font-mono" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* 📸 Receipt Photo Capture */}
              <div className="mt-4 pt-4 border-t border-gray-800">
                <h3 className="text-xs font-semibold text-gray-400 mb-3 flex items-center gap-1.5">
                  <Camera size={12} /> Packing Slip / Delivery Photo (optional)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {receiptPhotos.map((url, i) => (
                    <div key={i} className="relative rounded-lg overflow-hidden border border-gray-700">
                      <img src={url} alt={`Receipt ${i + 1}`} className="w-full h-24 object-cover" />
                      <button
                        onClick={() => setReceiptPhotos(receiptPhotos.filter((_, j) => j !== i))}
                        className="absolute top-1 right-1 w-5 h-5 bg-black/70 rounded-full flex items-center justify-center text-white hover:bg-red-500 text-[10px]"
                      >✕</button>
                    </div>
                  ))}
                  <PhotoCapture
                    bucket="packing-slips"
                    folder={`po-${poId}`}
                    label=""
                    onUploadComplete={(url) => setReceiptPhotos([...receiptPhotos, url])}
                  />
                </div>
              </div>

              <button onClick={handleReceive} disabled={saving}
                className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-500 disabled:bg-gray-700 text-white rounded-lg text-sm font-semibold transition-colors">
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                Confirm Receipt & Update Inventory
              </button>
            </div>
          )}

          {/* Items Table */}
          <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-800">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2"><ClipboardList size={14} className="text-teal-400" />Line Items</h2>
            </div>
            <table className="w-full">
              <thead><tr className="border-b border-gray-800">
                <th className="text-left py-2 px-5 text-xs text-gray-500">Product</th>
                <th className="text-center py-2 px-3 text-xs text-gray-500">Ordered</th>
                <th className="text-center py-2 px-3 text-xs text-gray-500">Received</th>
                <th className="text-left py-2 px-3 text-xs text-gray-500">Status</th>
              </tr></thead>
              <tbody>
                {items.map((item) => {
                  const done = item.qty_received >= item.qty_ordered;
                  const itemPct = item.qty_ordered > 0 ? Math.round((item.qty_received / item.qty_ordered) * 100) : 0;
                  return (
                    <tr key={item.id} className="border-b border-gray-800/50">
                      <td className="py-3 px-5">
                        <p className="text-white text-sm">{item.product_name}</p>
                        <p className="text-gray-500 text-xs font-mono">{item.sku}</p>
                        {item.products && <p className="text-gray-600 text-xs">In stock: {item.products.stock_quantity}</p>}
                      </td>
                      <td className="py-3 px-3 text-center text-gray-300 font-mono">{item.qty_ordered}</td>
                      <td className="py-3 px-3 text-center font-mono font-bold">
                        <span className={done ? 'text-emerald-400' : 'text-amber-400'}>{item.qty_received}</span>
                      </td>
                      <td className="py-3 px-3 w-36">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-gray-800 rounded-full">
                            <div className={`h-full rounded-full ${done ? 'bg-emerald-400' : itemPct > 0 ? 'bg-amber-400' : 'bg-gray-600'}`} style={{ width: `${itemPct}%` }} />
                          </div>
                          {done && <CheckCircle size={12} className="text-emerald-400 shrink-0" />}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Receipt History */}
          {receipts.length > 0 && (
            <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-800">
                <h2 className="text-sm font-semibold text-white flex items-center gap-2"><Truck size={14} className="text-teal-400" />Receiving History</h2>
              </div>
              <div className="divide-y divide-gray-800">
                {receipts.map((r) => (
                  <div key={r.id} className="px-5 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-white text-xs font-medium">{r.product_name}</p>
                      <div className="flex gap-3 mt-0.5">
                        <span className="text-gray-500 text-xs font-mono">{r.sku}</span>
                        {r.batch_number && <span className="text-gray-600 text-xs">Batch: {r.batch_number}</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-emerald-400 font-bold">+{r.qty_received}</p>
                      <p className="text-gray-600 text-xs">{new Date(r.received_at).toLocaleDateString('en-CA')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: PO Info */}
        <div className="space-y-4">
          <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white mb-3">PO Details</h2>
            <div className="space-y-2 text-xs">
              {[
                ['PO #', po.po_number as string],
                ['Supplier', po.supplier_name as string],
                ['Status', sc.label],
                ['Expected', po.expected_date ? new Date(po.expected_date as string).toLocaleDateString('en-CA') : '—'],
                ['Created', new Date(po.created_at as string).toLocaleDateString('en-CA')],
              ].map(([l, v]) => (
                <div key={l} className="flex justify-between">
                  <span className="text-gray-500">{l}</span><span className="text-white">{v}</span>
                </div>
              ))}
              {!!po.notes && <p className="pt-2 border-t border-gray-800 text-gray-400 italic text-xs">{String(po.notes)}</p>}
            </div>
          </div>
          {allReceived && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2 text-emerald-400 mb-1"><CheckCircle size={16} /><span className="font-semibold text-sm">Fully Received</span></div>
              <p className="text-xs text-gray-400">All items received and inventory updated.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
