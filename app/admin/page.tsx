'use client';

import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAdminRole } from '@/hooks/useAdminRole';
import {
  ShoppingCart, Warehouse, Truck, Users, Package,
  ArrowRight, ClipboardList, Tag, BarChart2, Shield,
  BoxIcon, Printer
} from 'lucide-react';

const QUICK_LINKS = [
  {
    href: '/admin/orders',
    icon: ShoppingCart,
    label: 'Orders',
    desc: 'View and process customer orders',
    color: 'text-teal-400',
    bg: 'bg-teal-500/10',
    border: 'border-teal-500/20',
    roles: ['master_admin', 'dispatch_admin', 'dispatch_staff'],
  },
  {
    href: '/admin/dispatch',
    icon: Truck,
    label: 'Dispatch Queue',
    desc: 'Fulfil orders and print shipping labels',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    roles: ['master_admin', 'dispatch_admin', 'dispatch_staff'],
  },
  {
    href: '/admin/warehouse',
    icon: Warehouse,
    label: 'Warehouse',
    desc: 'Purchase orders and stock receiving',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
    roles: ['master_admin', 'warehouse_admin', 'warehouse_staff'],
  },
  {
    href: '/admin/warehouse/batches',
    icon: BoxIcon,
    label: 'Batch Registry',
    desc: 'Track batches through the pipeline',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    roles: ['master_admin', 'warehouse_admin', 'warehouse_staff', 'web_admin'],
  },
  {
    href: '/admin/warehouse/labels',
    icon: Printer,
    label: 'Print SKU Labels',
    desc: 'Generate Avery or thermal labels',
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/20',
    roles: ['master_admin', 'warehouse_admin', 'warehouse_staff', 'dispatch_admin'],
  },
  {
    href: '/admin/inventory',
    icon: Package,
    label: 'Inventory',
    desc: 'Manage products and stock levels',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    roles: ['master_admin', 'web_admin', 'web_staff', 'warehouse_admin'],
  },
  {
    href: '/admin/crm',
    icon: Users,
    label: 'Customers (CRM)',
    desc: 'Customer profiles and interaction notes',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    roles: ['master_admin', 'dispatch_admin'],
  },
  {
    href: '/admin/reports',
    icon: BarChart2,
    label: 'Reports',
    desc: 'Revenue, fulfilment and product metrics',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    roles: ['master_admin', 'warehouse_admin', 'web_admin', 'dispatch_admin'],
  },
  {
    href: '/admin/users',
    icon: Shield,
    label: 'User Management',
    desc: 'Manage staff accounts and permissions',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
    roles: ['master_admin'],
  },
];

export default function AdminHomePage() {
  const { role, fullName, isMaster } = useAdminRole();

  const visibleLinks = QUICK_LINKS.filter(
    (link) => isMaster || (role && link.roles.includes(role))
  );

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          {fullName ? `Welcome, ${fullName.split(' ')[0]}` : 'Admin Dashboard'}
        </h1>
        <p className="text-gray-500 mt-1 text-sm">Peptide Life Wellness — Operations Centre</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {visibleLinks.map(({ href, icon: Icon, label, desc, color, bg, border }) => (
          <Link
            key={href}
            href={href}
            className={`group flex flex-col gap-2 sm:gap-3 p-4 sm:p-5 rounded-2xl border ${border} ${bg} hover:scale-[1.02] active:scale-[0.98] transition-all duration-200`}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-black/20">
              <Icon size={18} className={color} />
            </div>
            <div>
              <p className="font-semibold text-white text-xs sm:text-sm">{label}</p>
              <p className="text-gray-500 text-[10px] sm:text-xs mt-0.5 leading-relaxed hidden sm:block">{desc}</p>
            </div>
            <div className={`flex items-center gap-1 text-[10px] sm:text-xs font-medium ${color} mt-auto`}>
              Open <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
        <p className="text-amber-400 text-sm font-semibold mb-1">⚠️ Before going live</p>
        <ul className="text-amber-300/70 text-xs space-y-1">
          <li>• Update business address in <code className="bg-black/20 px-1 rounded">app/admin/dispatch/[orderId]/label/page.tsx</code></li>
          <li>• Update Interac e-Transfer email in <code className="bg-black/20 px-1 rounded">lib/supabase/orderService.ts</code></li>
          <li>• Setup SMTP credentials for transactional emails</li>
        </ul>
      </div>
    </AdminLayout>
  );
}
