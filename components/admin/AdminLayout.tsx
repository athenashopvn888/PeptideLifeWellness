'use client';

import { useState, useEffect, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAdminRole } from '@/hooks/useAdminRole';
import type { AdminRole } from '@/lib/auth/types';
import {
  Package, LogOut, ShoppingCart, Truck, Warehouse,
  Users, BarChart3, Tag, ChevronDown, ChevronRight,
  LayoutDashboard, ClipboardList, Printer, ReceiptText,
  Shield, Loader2, Home, MoreHorizontal, ScanLine,
  BoxIcon, Bell, RotateCcw
} from 'lucide-react';

// ── Sidebar nav items (Desktop) ────────────────────────────────────
interface NavItem {
  label: string;
  href?: string;
  icon: React.ElementType;
  children?: { label: string; href: string; icon: React.ElementType }[];
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  {
    label: 'Orders', icon: ShoppingCart,
    children: [
      { label: 'Order Queue', href: '/admin/orders', icon: ClipboardList },
      { label: 'All Orders', href: '/admin/orders?status=all', icon: ReceiptText },
    ],
  },
  {
    label: 'Dispatch', icon: Truck,
    children: [
      { label: 'Dispatch Queue', href: '/admin/dispatch', icon: Truck },
    ],
  },
  {
    label: 'Warehouse', icon: Warehouse,
    children: [
      { label: 'Receiving', href: '/admin/warehouse', icon: Package },
      { label: 'Purchase Orders', href: '/admin/warehouse/purchase-orders', icon: ClipboardList },
      { label: 'Batches', href: '/admin/warehouse/batches', icon: BoxIcon },
      { label: 'Print SKU Labels', href: '/admin/warehouse/labels', icon: Printer },
    ],
  },
  {
    label: 'Products', icon: Tag,
    children: [
      { label: 'Inventory & Stock', href: '/admin/inventory', icon: Package },
    ],
  },
  {
    label: 'CRM', icon: Users,
    children: [
      { label: 'Customers', href: '/admin/crm', icon: Users },
    ],
  },
  { label: 'Reports', href: '/admin/reports', icon: BarChart3 },
  { label: 'Returns', href: '/admin/returns', icon: RotateCcw },
  { label: 'User Management', href: '/admin/users', icon: Shield },
];

// ── Mobile bottom tabs (role-based) ────────────────────────────────
interface MobileTab {
  label: string;
  href: string;
  icon: React.ElementType;
}

function getMobileTabs(role: AdminRole | null): MobileTab[] {
  switch (role) {
    case 'master_admin':
      return [
        { label: 'Home', href: '/admin', icon: Home },
        { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
        { label: 'Warehouse', href: '/admin/warehouse', icon: Warehouse },
        { label: 'CRM', href: '/admin/crm', icon: Users },
        { label: 'More', href: '/admin/reports', icon: MoreHorizontal },
      ];
    case 'warehouse_admin':
    case 'warehouse_staff':
      return [
        { label: 'Receive', href: '/admin/warehouse', icon: ScanLine },
        { label: 'POs', href: '/admin/warehouse/purchase-orders', icon: ClipboardList },
        { label: 'Batches', href: '/admin/warehouse/batches', icon: BoxIcon },
        { label: 'Labels', href: '/admin/warehouse/labels', icon: Printer },
        { label: 'More', href: '/admin', icon: MoreHorizontal },
      ];
    case 'dispatch_admin':
    case 'dispatch_staff':
      return [
        { label: 'Queue', href: '/admin/dispatch', icon: Truck },
        { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
        { label: 'Labels', href: '/admin/warehouse/labels', icon: Printer },
        { label: 'More', href: '/admin', icon: MoreHorizontal },
      ];
    case 'web_admin':
    case 'web_staff':
      return [
        { label: 'Products', href: '/admin/inventory', icon: Tag },
        { label: 'Batches', href: '/admin/warehouse/batches', icon: BoxIcon },
        { label: 'More', href: '/admin', icon: MoreHorizontal },
      ];
    default:
      return [
        { label: 'Home', href: '/admin', icon: Home },
        { label: 'More', href: '/admin/reports', icon: MoreHorizontal },
      ];
  }
}

const ROLE_LABELS: Record<string, string> = {
  master_admin: 'Master Admin',
  warehouse_admin: 'WH Admin',
  warehouse_staff: 'WH Staff',
  web_admin: 'Web Admin',
  web_staff: 'Web Staff',
  dispatch_admin: 'Dispatch Admin',
  dispatch_staff: 'Dispatch Staff',
};

const ROLE_COLORS: Record<string, string> = {
  master_admin: 'text-violet-400',
  warehouse_admin: 'text-amber-400',
  warehouse_staff: 'text-amber-300',
  web_admin: 'text-blue-400',
  web_staff: 'text-blue-300',
  dispatch_admin: 'text-teal-400',
  dispatch_staff: 'text-teal-300',
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { role, fullName, loading, isMaster, isAdmin, can } = useAdminRole();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['Orders', 'Products']);

  // Auto-expand section for current path
  useEffect(() => {
    NAV_ITEMS.forEach((item) => {
      if (item.children) {
        const isActive = item.children.some((c) => pathname.startsWith(c.href.split('?')[0]));
        if (isActive) {
          setExpandedSections((prev) =>
            prev.includes(item.label) ? prev : [...prev, item.label]
          );
        }
      }
    });
  }, [pathname]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace('/admin/login');
  };

  const toggleSection = (label: string) => {
    setExpandedSections((prev) =>
      prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label]
    );
  };

  const isActivePath = (href: string) => {
    const clean = href.split('?')[0];
    return pathname === clean || pathname.startsWith(clean + '/');
  };

  // Filter nav items based on role
  const getVisibleNav = () => {
    if (isMaster) return NAV_ITEMS;
    return NAV_ITEMS.filter((item) => {
      if (item.href === '/admin/users') return isAdmin && can('can_manage_staff');
      if (item.href === '/admin/reports') return can('can_view_reports');
      if (item.label === 'Warehouse') return role === 'warehouse_admin' || role === 'warehouse_staff';
      if (item.label === 'Dispatch' || item.label === 'Orders') return role === 'dispatch_admin' || role === 'dispatch_staff';
      if (item.label === 'Products') return role === 'web_admin' || role === 'web_staff' || role === 'warehouse_admin';
      if (item.label === 'CRM') return can('can_view_crm');
      if (item.label === 'Dashboard') return true;
      return true;
    });
  };

  const mobileTabs = getMobileTabs(role);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center">
        <Loader2 size={28} className="text-teal-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1c] flex">
      {/* ─── Mobile overlay ─── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ─── Desktop Sidebar ─── */}
      <aside className={`
        fixed top-0 left-0 h-full w-60 bg-[#0d1117] border-r border-gray-800 z-30
        transform transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
        flex flex-col
      `}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-800">
          <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center shrink-0">
            <Package size={16} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">PLW Admin</p>
            <p className={`text-[10px] font-medium ${ROLE_COLORS[role || ''] || 'text-gray-500'}`}>
              {ROLE_LABELS[role || ''] || 'Operations Portal'}
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {getVisibleNav().map((item) => {
            const Icon = item.icon;

            if (item.href && !item.children) {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-0.5 ${
                    isActivePath(item.href)
                      ? 'bg-teal-500/10 text-teal-400'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon size={15} />
                  {item.label}
                </Link>
              );
            }

            const expanded = expandedSections.includes(item.label);
            const anyChildActive = item.children?.some((c) => isActivePath(c.href));

            return (
              <div key={item.label} className="mb-0.5">
                <button
                  onClick={() => toggleSection(item.label)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    anyChildActive ? 'text-teal-400' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon size={15} className="shrink-0" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {expanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                </button>

                {expanded && item.children && (
                  <div className="ml-5 pl-3 border-l border-gray-800 mt-0.5 space-y-0.5">
                    {item.children.map((child) => {
                      const ChildIcon = child.icon;
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            isActivePath(child.href)
                              ? 'text-teal-400 bg-teal-500/10'
                              : 'text-gray-500 hover:text-white hover:bg-gray-800'
                          }`}
                        >
                          <ChildIcon size={12} />
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer — user info + logout */}
        <div className="p-3 border-t border-gray-800 space-y-2">
          <div className="px-3 py-2 bg-gray-800/50 rounded-lg">
            <p className="text-white text-xs font-medium truncate">{fullName || 'Staff'}</p>
            <p className={`text-[10px] font-medium ${ROLE_COLORS[role || ''] || 'text-gray-500'}`}>
              {ROLE_LABELS[role || ''] || role}
            </p>
          </div>
          <Link
            href="/shop"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            <Tag size={12} />View Storefront
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-500 hover:text-red-400 transition-colors"
            id="admin-logout-btn"
          >
            <LogOut size={12} />Sign Out
          </button>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile topbar */}
        <header className="lg:hidden flex items-center justify-between bg-[#0d1117] border-b border-gray-800 px-4 py-3 sticky top-0 z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-400 hover:text-white p-1"
            aria-label="Open menu"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 5h14a1 1 0 000-2H3a1 1 0 000 2zm0 6h14a1 1 0 000-2H3a1 1 0 000 2zm0 6h14a1 1 0 000-2H3a1 1 0 000 2z" />
            </svg>
          </button>
          <div className="text-center">
            <span className="text-white font-bold text-sm">PLW Admin</span>
            <span className={`text-[10px] block font-medium ${ROLE_COLORS[role || '']}`}>
              {ROLE_LABELS[role || ''] || ''}
            </span>
          </div>
          <button className="text-gray-500 hover:text-white p-1 relative" aria-label="Notifications">
            <Bell size={18} />
          </button>
        </header>

        {/* Content area — bottom padding for mobile nav */}
        <main className="flex-1 px-4 sm:px-6 py-5 overflow-auto pb-20 lg:pb-6">
          {children}
        </main>
      </div>

      {/* ─── Mobile Bottom Tab Bar ─── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-20 bg-[#0d1117] border-t border-gray-800 safe-area-bottom">
        <div className="flex items-stretch justify-around" style={{ height: '56px' }}>
          {mobileTabs.map((tab) => {
            const Icon = tab.icon;
            const active = isActivePath(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex flex-col items-center justify-center flex-1 gap-0.5 text-[10px] font-medium transition-colors ${
                  active ? 'text-teal-400' : 'text-gray-500'
                }`}
              >
                <Icon size={20} strokeWidth={active ? 2.5 : 1.5} />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
