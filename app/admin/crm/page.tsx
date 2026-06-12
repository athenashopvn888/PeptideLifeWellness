'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Users, Search, RefreshCw, Loader2, Star, Ban,
  Mail, Phone, ShoppingCart, DollarSign, ArrowRight, AlertCircle
} from 'lucide-react';

interface Customer {
  id: string; email: string; first_name: string; last_name: string;
  phone: string | null; total_orders: number; total_spent: number;
  is_vip: boolean; do_not_contact: boolean; tags: string[];
  created_at: string;
}

const TIER_CONFIG = (spent: number) => {
  if (spent >= 500) return { label: 'VIP', color: 'text-amber-400', bg: 'bg-amber-500/10' };
  if (spent >= 200) return { label: 'Regular', color: 'text-blue-400', bg: 'bg-blue-500/10' };
  return { label: 'New', color: 'text-gray-400', bg: 'bg-gray-700' };
};

export default function CRMPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterVip, setFilterVip] = useState(false);

  
  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (filterVip) params.set('vip', 'true');
      const res = await fetch(`/api/admin/crm?${params}`);
      if (res.ok) setCustomers(await res.json());
    } catch (err) { console.error(err); }
    setLoading(false);
  }, [search, filterVip]);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const totalRevenue = customers.reduce((s, c) => s + Number(c.total_spent), 0);
  const vipCount = customers.filter((c) => c.is_vip || c.total_spent >= 500).length;

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users size={24} className="text-teal-400" />Customers (CRM)
          </h1>
          <p className="text-sm text-gray-500 mt-1">{customers.length} customers · ${totalRevenue.toFixed(0)} total revenue</p>
        </div>
        <button onClick={fetchCustomers}
          className="flex items-center gap-1.5 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors">
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Total Customers', value: customers.length, color: 'text-white', icon: Users },
          { label: 'VIP Customers', value: vipCount, color: 'text-amber-400', icon: Star },
          { label: 'Total Revenue', value: `$${totalRevenue.toFixed(0)}`, color: 'text-emerald-400', icon: DollarSign },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="bg-[#111827] border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-1.5 mb-1">
              <Icon size={12} className="text-gray-500" />
              <p className="text-xs text-gray-500">{label}</p>
            </div>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input type="text" value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchCustomers()}
            placeholder="Search name or email... (press Enter)"
            id="crm-search"
            className="w-full pl-9 pr-4 py-2.5 bg-[#111827] border border-gray-800 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-teal-500" />
        </div>
        <button onClick={() => setFilterVip(!filterVip)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${filterVip ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
          <Star size={13} />VIP Only
        </button>
      </div>

      {/* Customer Table */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 size={32} className="text-teal-400 animate-spin" /></div>
      ) : customers.length === 0 ? (
        <div className="text-center py-20">
          <Users size={40} className="text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500">{search ? 'No customers match your search.' : 'No customers yet. They appear after placing orders.'}</p>
        </div>
      ) : (
        <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-3 px-4 text-xs text-gray-500 font-medium">Customer</th>
                  <th className="text-left py-3 px-3 text-xs text-gray-500 font-medium">Contact</th>
                  <th className="text-center py-3 px-3 text-xs text-gray-500 font-medium">Orders</th>
                  <th className="text-right py-3 px-3 text-xs text-gray-500 font-medium">Total Spent</th>
                  <th className="text-left py-3 px-3 text-xs text-gray-500 font-medium">Tier</th>
                  <th className="text-left py-3 px-3 text-xs text-gray-500 font-medium">Flags</th>
                  <th className="py-3 px-3" />
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => {
                  const tier = TIER_CONFIG(customer.total_spent);
                  return (
                    <tr key={customer.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                      <td className="py-3 px-4">
                        <p className="text-white font-medium text-sm">
                          {customer.first_name} {customer.last_name}
                          {customer.is_vip && <Star size={10} className="inline text-amber-400 ml-1 mb-0.5" />}
                        </p>
                        <p className="text-gray-500 text-xs">
                          Since {new Date(customer.created_at).toLocaleDateString('en-CA', { year: 'numeric', month: 'short' })}
                        </p>
                      </td>
                      <td className="py-3 px-3">
                        <a href={`mailto:${customer.email}`} className="flex items-center gap-1 text-xs text-teal-400 hover:underline">
                          <Mail size={10} />{customer.email}
                        </a>
                        {customer.phone && (
                          <p className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                            <Phone size={10} />{customer.phone}
                          </p>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <ShoppingCart size={11} className="text-gray-500" />
                          <span className="text-white font-mono">{customer.total_orders}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className="text-white font-semibold">${Number(customer.total_spent).toFixed(2)}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`text-xs px-2 py-0.5 rounded font-medium ${tier.bg} ${tier.color}`}>{tier.label}</span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex gap-1">
                          {customer.do_not_contact && (
                            <span className="flex items-center gap-0.5 text-xs text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded">
                              <Ban size={9} />DNC
                            </span>
                          )}
                          {customer.tags?.map((tag) => (
                            <span key={tag} className="text-xs bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded">{tag}</span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <Link href={`/admin/crm/${customer.id}`}
                          className="flex items-center gap-1 px-2 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-xs transition-colors">
                          View <ArrowRight size={10} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
