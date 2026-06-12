import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Supabase env vars missing');
  return createClient(url, key);
}

export interface CustomerSummary {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  total_orders: number;
  total_spent: number;
  is_vip: boolean;
  do_not_contact: boolean;
  tags: string[];
  created_at: string;
  default_address: Record<string, string>;
}

export interface CRMNote {
  id: string;
  customer_id: string;
  order_id: string | null;
  note_type: string;
  body: string;
  is_resolved: boolean;
  follow_up_date: string | null;
  created_by: string;
  created_at: string;
}

// ── CUSTOMERS ──────────────────────────────────────────────────────────

export async function getCustomers(opts?: { search?: string; vip?: boolean; limit?: number }) {
  const supabase = getSupabase();
  let query = supabase
    .from('customers')
    .select('*')
    .order('total_spent', { ascending: false })
    .limit(opts?.limit || 200);

  if (opts?.search) {
    query = query.or(
      `email.ilike.%${opts.search}%,first_name.ilike.%${opts.search}%,last_name.ilike.%${opts.search}%`
    );
  }
  if (opts?.vip) query = query.eq('is_vip', true);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data || []) as CustomerSummary[];
}

export async function getCustomerById(id: string) {
  const supabase = getSupabase();
  const [customerRes, ordersRes, notesRes] = await Promise.all([
    supabase.from('customers').select('*').eq('id', id).single(),
    supabase
      .from('orders')
      .select('id, order_number, status, total, created_at, paid_at')
      .eq('customer_id', id)
      .order('created_at', { ascending: false }),
    supabase
      .from('crm_notes')
      .select('*')
      .eq('customer_id', id)
      .order('created_at', { ascending: false }),
  ]);

  if (customerRes.error) throw new Error(customerRes.error.message);
  return {
    customer: customerRes.data as CustomerSummary,
    orders: ordersRes.data || [],
    notes: (notesRes.data || []) as CRMNote[],
  };
}

export async function updateCustomer(id: string, updates: Partial<CustomerSummary>) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('customers')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

// ── CRM NOTES ──────────────────────────────────────────────────────────

export async function addCRMNote(note: {
  customerId: string;
  orderId?: string;
  noteType?: string;
  body: string;
  followUpDate?: string;
  createdBy?: string;
}) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('crm_notes')
    .insert({
      customer_id: note.customerId,
      order_id: note.orderId || null,
      note_type: note.noteType || 'general',
      body: note.body,
      follow_up_date: note.followUpDate || null,
      created_by: note.createdBy || 'admin',
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function resolveCRMNote(noteId: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('crm_notes')
    .update({ is_resolved: true })
    .eq('id', noteId)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteCRMNote(noteId: string) {
  const supabase = getSupabase();
  const { error } = await supabase.from('crm_notes').delete().eq('id', noteId);
  if (error) throw new Error(error.message);
}

// ── FOLLOW-UPS ─────────────────────────────────────────────────────────

export async function getPendingFollowUps() {
  const supabase = getSupabase();
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('crm_notes')
    .select('*, customers(id, first_name, last_name, email)')
    .eq('is_resolved', false)
    .not('follow_up_date', 'is', null)
    .lte('follow_up_date', today)
    .order('follow_up_date');
  if (error) throw new Error(error.message);
  return data || [];
}
