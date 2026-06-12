'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  ArrowLeft, User, Mail, Phone, ShoppingCart, Star,
  Ban, Plus, CheckCircle, Trash2, Loader2, AlertCircle,
  MessageSquare, PhoneCall, AtSign, AlertTriangle, DollarSign,
  Calendar, Tag, Save
} from 'lucide-react';

interface Order {
  id: string; order_number: string; status: string;
  total: number; created_at: string; paid_at: string | null;
}
interface Note {
  id: string; note_type: string; body: string;
  is_resolved: boolean; follow_up_date: string | null;
  created_by: string; created_at: string;
}
interface Customer {
  id: string; email: string; first_name: string; last_name: string;
  phone: string | null; total_orders: number; total_spent: number;
  is_vip: boolean; do_not_contact: boolean; tags: string[];
  created_at: string; default_address: Record<string, string>;
}

const NOTE_TYPE_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  general:   { label: 'Note',      icon: MessageSquare, color: 'text-gray-400' },
  call:      { label: 'Call',      icon: PhoneCall,     color: 'text-blue-400' },
  email:     { label: 'Email',     icon: AtSign,        color: 'text-teal-400' },
  complaint: { label: 'Complaint', icon: AlertTriangle, color: 'text-red-400' },
  refund:    { label: 'Refund',    icon: DollarSign,    color: 'text-amber-400' },
  followup:  { label: 'Follow-up', icon: Calendar,      color: 'text-violet-400' },
};

const STATUS_COLORS: Record<string, string> = {
  pending_payment: 'text-amber-400', confirmed: 'text-emerald-400',
  picking: 'text-blue-400', packed: 'text-violet-400',
  shipped: 'text-teal-400', delivered: 'text-green-400',
  cancelled: 'text-red-400',
};

export default function CustomerProfilePage() {
  const params = useParams();
  const customerId = params.id as string;

  const [data, setData] = useState<{ customer: Customer; orders: Order[]; notes: Note[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingNote, setDeletingNote] = useState<string | null>(null);

  // Note form
  const [noteType, setNoteType] = useState('general');
  const [noteBody, setNoteBody] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [showNoteForm, setShowNoteForm] = useState(false);

  // Flags edit
  const [editFlags, setEditFlags] = useState(false);
  const [isVip, setIsVip] = useState(false);
  const [isDNC, setIsDNC] = useState(false);
  const [tagInput, setTagInput] = useState('');

  
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/crm?id=${customerId}`);
      if (res.ok) {
        const d = await res.json();
        setData(d);
        setIsVip(d.customer.is_vip);
        setIsDNC(d.customer.do_not_contact);
        setTagInput((d.customer.tags || []).join(', '));
      }
    } catch (err) { console.error(err); }
    setLoading(false);
  }, [customerId]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const saveFlags = async () => {
    setSaving(true);
    try {
      await fetch('/api/admin/crm', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json',  },
        body: JSON.stringify({
          id: customerId,
          is_vip: isVip,
          do_not_contact: isDNC,
          tags: tagInput.split(',').map((t) => t.trim()).filter(Boolean),
        }),
      });
      setEditFlags(false);
      await fetchProfile();
    } catch (err) { console.error(err); }
    setSaving(false);
  };

  const addNote = async () => {
    if (!noteBody.trim()) return;
    setSaving(true);
    try {
      await fetch('/api/admin/crm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',  },
        body: JSON.stringify({
          customerId, noteType, body: noteBody.trim(),
          followUpDate: followUpDate || undefined,
        }),
      });
      setNoteBody(''); setFollowUpDate(''); setNoteType('general');
      setShowNoteForm(false);
      await fetchProfile();
    } catch (err) { console.error(err); }
    setSaving(false);
  };

  const resolveNote = async (noteId: string) => {
    try {
      await fetch('/api/admin/crm?action=resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',  },
        body: JSON.stringify({ noteId }),
      });
      await fetchProfile();
    } catch (err) { console.error(err); }
  };

  const deleteNote = async (noteId: string) => {
    setDeletingNote(noteId);
    try {
      await fetch('/api/admin/crm?action=delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',  },
        body: JSON.stringify({ noteId }),
      });
      await fetchProfile();
    } catch (err) { console.error(err); }
    setDeletingNote(null);
  };

  if (loading) return <AdminLayout><div className="flex justify-center py-20"><Loader2 size={32} className="text-teal-400 animate-spin" /></div></AdminLayout>;
  if (!data) return <AdminLayout><div className="text-center py-20"><AlertCircle size={40} className="text-gray-700 mx-auto mb-3" /><p className="text-gray-500">Customer not found</p><Link href="/admin/crm" className="text-teal-400 text-sm hover:underline">← Back</Link></div></AdminLayout>;

  const { customer, orders, notes } = data;
  const openNotes = notes.filter((n) => !n.is_resolved);
  const resolvedNotes = notes.filter((n) => n.is_resolved);

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/crm" className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              {customer.first_name} {customer.last_name}
              {customer.is_vip && <Star size={16} className="text-amber-400" />}
              {customer.do_not_contact && <Ban size={14} className="text-red-400" />}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">Customer since {new Date(customer.created_at).toLocaleDateString('en-CA', { year: 'numeric', month: 'long' })}</p>
          </div>
        </div>
        <button onClick={() => setShowNoteForm(!showNoteForm)}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-sm font-medium transition-colors">
          <Plus size={14} />Add Note
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Notes timeline */}
        <div className="lg:col-span-2 space-y-5">
          {/* Note Form */}
          {showNoteForm && (
            <div className="bg-teal-500/5 border border-teal-500/20 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-teal-400 mb-4 flex items-center gap-2"><Plus size={13} />New Note</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Type</label>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(NOTE_TYPE_CONFIG).map(([key, cfg]) => {
                      const Icon = cfg.icon;
                      return (
                        <button key={key} onClick={() => setNoteType(key)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${noteType === key ? 'bg-teal-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
                          <Icon size={11} />{cfg.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Note *</label>
                  <textarea value={noteBody} onChange={(e) => setNoteBody(e.target.value)} rows={3}
                    placeholder="Enter note details..."
                    className="w-full px-3 py-2 bg-[#0a0f1c] border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 resize-none" />
                </div>
                {(noteType === 'followup' || noteType === 'complaint') && (
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Follow-up Date</label>
                    <input type="date" value={followUpDate} onChange={(e) => setFollowUpDate(e.target.value)}
                      className="px-3 py-2 bg-[#0a0f1c] border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-teal-500" />
                  </div>
                )}
                <div className="flex gap-2">
                  <button onClick={() => setShowNoteForm(false)}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors">Cancel</button>
                  <button onClick={addNote} disabled={saving || !noteBody.trim()}
                    className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 disabled:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors">
                    {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}Save Note
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Open Notes */}
          {openNotes.length > 0 && (
            <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-800">
                <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                  <AlertCircle size={14} className="text-amber-400" />Open Notes ({openNotes.length})
                </h2>
              </div>
              <div className="divide-y divide-gray-800">
                {openNotes.map((note) => {
                  const cfg = NOTE_TYPE_CONFIG[note.note_type] || NOTE_TYPE_CONFIG.general;
                  const Icon = cfg.icon;
                  return (
                    <div key={note.id} className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className={`mt-0.5 shrink-0 ${cfg.color}`}><Icon size={14} /></div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs font-semibold ${cfg.color}`}>{cfg.label}</span>
                              <span className="text-gray-600 text-xs">{new Date(note.created_at).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}</span>
                              {note.follow_up_date && (
                                <span className="text-xs bg-violet-500/10 text-violet-400 px-1.5 py-0.5 rounded">
                                  Follow-up: {new Date(note.follow_up_date).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}
                                </span>
                              )}
                            </div>
                            <p className="text-gray-300 text-sm whitespace-pre-wrap">{note.body}</p>
                          </div>
                        </div>
                        <div className="flex gap-1.5 shrink-0">
                          <button onClick={() => resolveNote(note.id)}
                            className="p-1.5 hover:bg-emerald-500/10 rounded text-gray-500 hover:text-emerald-400 transition-colors" title="Mark resolved">
                            <CheckCircle size={14} />
                          </button>
                          <button onClick={() => deleteNote(note.id)} disabled={deletingNote === note.id}
                            className="p-1.5 hover:bg-red-500/10 rounded text-gray-500 hover:text-red-400 transition-colors" title="Delete">
                            {deletingNote === note.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Order History */}
          <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-800">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <ShoppingCart size={14} className="text-teal-400" />Order History ({orders.length})
              </h2>
            </div>
            {orders.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">No orders yet</p>
            ) : (
              <div className="divide-y divide-gray-800">
                {orders.map((order) => (
                  <Link key={order.id} href={`/admin/orders/${order.id}`}
                    className="flex items-center justify-between px-5 py-3 hover:bg-gray-800/40 transition-colors group">
                    <div>
                      <p className="text-white font-mono text-xs font-semibold">{order.order_number}</p>
                      <p className="text-gray-500 text-xs">{new Date(order.created_at).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-medium ${STATUS_COLORS[order.status] || 'text-gray-400'}`}>
                        {order.status.replace('_', ' ')}
                      </span>
                      <span className="text-white font-semibold text-sm">${Number(order.total).toFixed(2)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Resolved Notes */}
          {resolvedNotes.length > 0 && (
            <details className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden">
              <summary className="px-5 py-4 text-sm text-gray-500 cursor-pointer hover:text-gray-300 transition-colors">
                {resolvedNotes.length} resolved note{resolvedNotes.length !== 1 ? 's' : ''}
              </summary>
              <div className="divide-y divide-gray-800 border-t border-gray-800">
                {resolvedNotes.map((note) => {
                  const cfg = NOTE_TYPE_CONFIG[note.note_type] || NOTE_TYPE_CONFIG.general;
                  const Icon = cfg.icon;
                  return (
                    <div key={note.id} className="px-5 py-3 opacity-60">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon size={11} className={cfg.color} />
                        <span className="text-xs text-gray-500">{cfg.label}</span>
                        <span className="text-gray-600 text-xs">{new Date(note.created_at).toLocaleDateString('en-CA')}</span>
                        <CheckCircle size={10} className="text-emerald-500" />
                      </div>
                      <p className="text-gray-400 text-sm">{note.body}</p>
                    </div>
                  );
                })}
              </div>
            </details>
          )}
        </div>

        {/* Right: Customer info */}
        <div className="space-y-4">
          {/* Contact */}
          <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><User size={13} className="text-teal-400" />Contact</h2>
            <a href={`mailto:${customer.email}`} className="flex items-center gap-1.5 text-xs text-teal-400 hover:underline mb-1.5">
              <Mail size={11} />{customer.email}
            </a>
            {customer.phone && (
              <p className="flex items-center gap-1.5 text-xs text-gray-400"><Phone size={11} />{customer.phone}</p>
            )}
            {customer.default_address && Object.keys(customer.default_address).length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-800 text-xs text-gray-400 space-y-0.5">
                <p>{customer.default_address.address}</p>
                <p>{customer.default_address.city}, {customer.default_address.province}</p>
                <p>{customer.default_address.postalCode}</p>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white mb-3">Lifetime Value</h2>
            <div className="space-y-2 text-xs">
              {[
                ['Orders Placed', customer.total_orders],
                ['Total Spent', `$${Number(customer.total_spent).toFixed(2)}`],
                ['Avg Order', customer.total_orders > 0 ? `$${(Number(customer.total_spent) / customer.total_orders).toFixed(2)}` : '—'],
              ].map(([l, v]) => (
                <div key={l as string} className="flex justify-between">
                  <span className="text-gray-500">{l as string}</span>
                  <span className="text-white font-semibold">{String(v)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CRM Flags */}
          <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2"><Tag size={13} className="text-teal-400" />CRM Flags</h2>
              <button onClick={() => setEditFlags(!editFlags)}
                className="text-xs text-gray-400 hover:text-white transition-colors">
                {editFlags ? 'Cancel' : 'Edit'}
              </button>
            </div>
            {editFlags ? (
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={isVip} onChange={(e) => setIsVip(e.target.checked)}
                    className="rounded border-gray-600 bg-gray-800 text-amber-400 focus:ring-amber-400" />
                  <span className="text-sm text-gray-300 flex items-center gap-1.5"><Star size={12} className="text-amber-400" />VIP Customer</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={isDNC} onChange={(e) => setIsDNC(e.target.checked)}
                    className="rounded border-gray-600 bg-gray-800 text-red-400 focus:ring-red-400" />
                  <span className="text-sm text-gray-300 flex items-center gap-1.5"><Ban size={12} className="text-red-400" />Do Not Contact</span>
                </label>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Tags (comma-separated)</label>
                  <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                    placeholder="e.g. wholesale, researcher"
                    className="w-full px-3 py-2 bg-[#0a0f1c] border border-gray-700 rounded-lg text-xs text-white focus:outline-none focus:border-teal-500" />
                </div>
                <button onClick={saveFlags} disabled={saving}
                  className="flex items-center gap-1.5 px-3 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-medium transition-colors">
                  {saving ? <Loader2 size={11} className="animate-spin" /> : <Save size={11} />}Save
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Star size={12} className={customer.is_vip ? 'text-amber-400' : 'text-gray-700'} />
                  <span className={`text-xs ${customer.is_vip ? 'text-amber-400' : 'text-gray-600'}`}>
                    {customer.is_vip ? 'VIP Customer' : 'Not VIP'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Ban size={12} className={customer.do_not_contact ? 'text-red-400' : 'text-gray-700'} />
                  <span className={`text-xs ${customer.do_not_contact ? 'text-red-400' : 'text-gray-600'}`}>
                    {customer.do_not_contact ? 'Do Not Contact' : 'No DNC Flag'}
                  </span>
                </div>
                {customer.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {customer.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Email shortcut */}
          {!customer.do_not_contact && (
            <a href={`mailto:${customer.email}`}
              className="flex items-center gap-2 w-full px-4 py-3 bg-[#111827] border border-gray-800 hover:bg-gray-800 text-gray-300 rounded-xl text-sm transition-colors">
              <Mail size={14} className="text-teal-400" />Email Customer
            </a>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
