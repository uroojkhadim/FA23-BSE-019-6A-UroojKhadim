import type { UserRole } from '@/store/authStore';

export interface AppNavItem {
  path: string;
  label: string;
  roles?: UserRole[];
  allowGuest?: boolean;
}

export interface RoleFeature {
  title: string;
  description: string;
  link: string;
  roleLabel: string;
  roles?: UserRole[];
  allowGuest?: boolean;
}

export const appNavItems: AppNavItem[] = [
  { path: '/', label: 'Home', allowGuest: true },
  { path: '/menu', label: 'Menu', roles: ['student'], allowGuest: true },
  { path: '/orders', label: 'Orders', roles: ['student', 'admin'] },
  { path: '/pos', label: 'POS', roles: ['admin'] },
  { path: '/admin', label: 'Admin', roles: ['admin'] },
];

export const roleFeatures: RoleFeature[] = [
  {
    title: 'Browse Menu',
    description: 'Students can browse meals, add them to cart, and place orders from one checkout flow.',
    link: '/menu',
    roleLabel: 'Students',
    roles: ['student'],
    allowGuest: true,
  },
  {
    title: 'Order Tracking',
    description: 'Students can track only their own orders, and administrators can review all cafeteria orders.',
    link: '/orders',
    roleLabel: 'Students & Administrators',
    roles: ['student', 'admin'],
  },
  {
    title: 'POS Payments',
    description: 'Administrators can create walk-in orders and record cash, JazzCash, EasyPaisa, debit or credit card, student balance, or online transfer payments.',
    link: '/pos',
    roleLabel: 'Administrators',
    roles: ['admin'],
  },
  {
    title: 'Admin Dashboard',
    description: 'Administrators manage menu items, discounts, reporting, and payment visibility from one dashboard.',
    link: '/admin',
    roleLabel: 'Administrators',
    roles: ['admin'],
  },
];

export const roleSummaries: Record<UserRole, { title: string; description: string }> = {
  student: {
    title: 'Student',
    description: 'Browse the menu, choose a payment method, place orders, and track only your own requests.',
  },
  teacher: {
    title: 'Teacher',
    description: 'Teacher accounts can sign in for staff access, while student order details remain private.',
  },
  admin: {
    title: 'Administrator',
    description: 'Manage menu items, process payments, create POS orders, and review order and revenue activity.',
  },
};

export const canAccessRoleScopedItem = (
  userRole: UserRole | null | undefined,
  roles?: UserRole[],
  allowGuest = false,
) => {
  if (!roles || roles.length === 0) {
    return allowGuest || !!userRole;
  }

  if (!userRole) {
    return allowGuest;
  }

  return roles.includes(userRole);
};

export const getNavItemsForRole = (userRole?: UserRole | null) =>
  appNavItems.filter((item) => canAccessRoleScopedItem(userRole, item.roles, item.allowGuest));

export const getFeaturesForRole = (userRole?: UserRole | null) =>
  roleFeatures.filter((item) => canAccessRoleScopedItem(userRole, item.roles, item.allowGuest));
