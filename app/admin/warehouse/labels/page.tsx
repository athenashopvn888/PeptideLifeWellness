'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Printer, Search, Loader2, Package, Tag, Minus, Plus } from 'lucide-react';

interface Product {
  id: string;
  sku: string;
  name: string;
  price: number;
  category: string;
  stock_quantity: number;
}

interface LabelItem {
  product: Product;
  count: number;
}

export default function WarehouseLabelsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedItems, setSelectedItems] = useState<LabelItem[]>([]);
  const [labelSize, setLabelSize] = useState<'avery5160' | 'thermal'>('avery5160');
  const [showPrice, setShowPrice] = useState(true);


  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/products');
      if (res.ok) setProducts(await res.json());
    } catch (err) { console.error(err); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const filtered = products.filter((p) =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const addProduct = (product: Product) => {
    setSelectedItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) return prev.map((i) => i.product.id === product.id ? { ...i, count: i.count + 1 } : i);
      return [...prev, { product, count: 1 }];
    });
  };

  const updateCount = (productId: string, delta: number) => {
    setSelectedItems((prev) =>
      prev.map((i) => i.product.id === productId ? { ...i, count: Math.max(1, i.count + delta) } : i)
    );
  };

  const removeItem = (productId: string) => {
    setSelectedItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const totalLabels = selectedItems.reduce((s, i) => s + i.count, 0);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Build label HTML
    const isAvery = labelSize === 'avery5160';
    const labelsHTML = selectedItems.flatMap((item) =>
      Array(item.count).fill(null).map(() => `
        <div class="label">
          <div class="label-name">${item.product.name}</div>
          <div class="label-sku">${item.product.sku}</div>
          ${showPrice ? `<div class="label-price">$${Number(item.product.price).toFixed(2)}</div>` : ''}
          <div class="label-cat">${item.product.category}</div>
        </div>
      `)
    ).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>PLW SKU Labels</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; background: white; }
          @media print { @page { margin: 0.25in; size: letter; } }

          ${isAvery ? `
          /* Avery 5160 — 3 columns × 10 rows = 30 labels per sheet */
          .labels-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 0;
          }
          .label {
            width: 2.625in;
            height: 1in;
            padding: 6px 8px;
            border: 0.5px solid #e0e0e0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            overflow: hidden;
          }
          .label-name { font-size: 9pt; font-weight: bold; line-height: 1.2; }
          .label-sku { font-size: 7pt; color: #666; font-family: monospace; margin-top: 1px; }
          .label-price { font-size: 10pt; font-weight: bold; margin-top: 2px; }
          .label-cat { font-size: 6pt; color: #999; margin-top: 1px; }
          ` : `
          /* Thermal 4"×2" — 1 column */
          .labels-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 4px;
          }
          .label {
            width: 4in;
            height: 2in;
            padding: 12px 16px;
            border: 1px solid #ccc;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          .label-name { font-size: 14pt; font-weight: bold; line-height: 1.3; }
          .label-sku { font-size: 11pt; color: #444; font-family: monospace; margin-top: 4px; }
          .label-price { font-size: 18pt; font-weight: bold; margin-top: 6px; }
          .label-cat { font-size: 9pt; color: #888; margin-top: 4px; }
          `}
        </style>
      </head>
      <body>
        <div class="labels-grid">${labelsHTML}</div>
        <script>window.onload = () => window.print();<\/script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Tag size={24} className="text-teal-400" />Print SKU Labels
          </h1>
          <p className="text-sm text-gray-500 mt-1">Generate barcode labels for inventory items</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Product Picker */}
        <div className="lg:col-span-3">
          <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-gray-800">
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-9 pr-4 py-2 bg-[#0a0f1c] border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-teal-500" />
              </div>
            </div>
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 size={24} className="text-teal-400 animate-spin" /></div>
            ) : (
              <div className="overflow-y-auto max-h-[500px] divide-y divide-gray-800">
                {filtered.map((p) => {
                  const selected = selectedItems.find((i) => i.product.id === p.id);
                  return (
                    <div key={p.id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-800/40 transition-colors">
                      <div className="min-w-0">
                        <p className="text-white text-sm font-medium truncate">{p.name}</p>
                        <p className="text-gray-500 text-xs font-mono">{p.sku}</p>
                        <p className="text-gray-600 text-xs">{p.category} · Stock: {p.stock_quantity}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-3">
                        <span className="text-gray-400 text-sm">${Number(p.price).toFixed(2)}</span>
                        {selected ? (
                          <div className="flex items-center gap-1">
                            <button onClick={() => updateCount(p.id, -1)}
                              className="w-7 h-7 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center text-white transition-colors">
                              <Minus size={11} />
                            </button>
                            <span className="w-8 text-center text-white text-sm font-mono">{selected.count}</span>
                            <button onClick={() => updateCount(p.id, 1)}
                              className="w-7 h-7 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center text-white transition-colors">
                              <Plus size={11} />
                            </button>
                            <button onClick={() => removeItem(p.id)} className="text-red-400 hover:text-red-300 ml-1 text-xs">×</button>
                          </div>
                        ) : (
                          <button onClick={() => addProduct(p)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs transition-colors">
                            <Plus size={11} />Add
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Print Panel */}
        <div className="lg:col-span-2 space-y-4">
          {/* Label Settings */}
          <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white mb-4">Label Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-2">Label Format</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: 'avery5160', label: 'Avery 5160', sub: '30/sheet · Letter' },
                    { key: 'thermal', label: '4″ × 2″', sub: 'Thermal printer' },
                  ].map((opt) => (
                    <button key={opt.key} onClick={() => setLabelSize(opt.key as typeof labelSize)}
                      className={`p-3 rounded-lg border text-left transition-colors ${labelSize === opt.key ? 'border-teal-500 bg-teal-500/10' : 'border-gray-700 hover:border-gray-600'}`}>
                      <p className={`text-xs font-semibold ${labelSize === opt.key ? 'text-teal-400' : 'text-gray-300'}`}>{opt.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{opt.sub}</p>
                    </button>
                  ))}
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={showPrice} onChange={(e) => setShowPrice(e.target.checked)}
                  className="rounded border-gray-600 bg-gray-800 text-teal-500 focus:ring-teal-500" />
                <span className="text-sm text-gray-300">Show price on label</span>
              </label>
            </div>
          </div>

          {/* Selected Items */}
          <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">Selected Items</h2>
              {selectedItems.length > 0 && (
                <button onClick={() => setSelectedItems([])} className="text-xs text-gray-500 hover:text-red-400 transition-colors">Clear all</button>
              )}
            </div>
            {selectedItems.length === 0 ? (
              <div className="text-center py-8">
                <Package size={28} className="text-gray-700 mx-auto mb-2" />
                <p className="text-gray-500 text-xs">Select products from the list</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-800 max-h-48 overflow-y-auto">
                {selectedItems.map((item) => (
                  <div key={item.product.id} className="flex items-center justify-between px-4 py-2">
                    <div className="min-w-0">
                      <p className="text-white text-xs truncate">{item.product.name}</p>
                      <p className="text-gray-500 text-xs font-mono">{item.product.sku}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => updateCount(item.product.id, -1)}
                        className="w-6 h-6 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center text-white">
                        <Minus size={10} />
                      </button>
                      <span className="w-6 text-center text-white text-xs font-mono">{item.count}</span>
                      <button onClick={() => updateCount(item.product.id, 1)}
                        className="w-6 h-6 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center text-white">
                        <Plus size={10} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            disabled={selectedItems.length === 0}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-teal-600 hover:bg-teal-500 disabled:bg-gray-800 disabled:text-gray-600 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            <Printer size={16} />
            Print {totalLabels > 0 ? `${totalLabels} Label${totalLabels !== 1 ? 's' : ''}` : 'Labels'}
          </button>

          <p className="text-xs text-gray-600 text-center">
            Opens a print-ready window in your browser.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
