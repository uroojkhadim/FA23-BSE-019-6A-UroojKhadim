export const ORDER_STATUS_FLOW = ['ordered', 'accepted', 'in_process', 'delivered'] as const;

export const ORDER_STATUS_FILTERS = [...ORDER_STATUS_FLOW, 'cancelled'] as const;

export type CanonicalOrderStatus = (typeof ORDER_STATUS_FILTERS)[number];

const ORDER_STATUS_ALIASES: Record<string, CanonicalOrderStatus> = {
  ordered: 'ordered',
  accepted: 'accepted',
  in_process: 'in_process',
  inprocess: 'in_process',
  inprogress: 'in_process',
  delivered: 'delivered',
  cancelled: 'cancelled',
  pending: 'ordered',
  preparing: 'in_process',
  ready: 'in_process',
  completed: 'delivered',
};

export const normalizeOrderStatus = (status?: string): CanonicalOrderStatus => {
  if (!status) return 'ordered';

  const normalized = status.trim().toLowerCase().replace(/[\s-]+/g, '_');
  return ORDER_STATUS_ALIASES[normalized] ?? 'ordered';
};

export const getOrderStatusLabel = (status?: string) => {
  switch (normalizeOrderStatus(status)) {
    case 'ordered':
      return 'Ordered';
    case 'accepted':
      return 'Accepted';
    case 'in_process':
      return 'In Process';
    case 'delivered':
      return 'Delivered';
    case 'cancelled':
      return 'Cancelled';
    default:
      return 'Ordered';
  }
};

export const isOrderActive = (status?: string) => {
  const normalized = normalizeOrderStatus(status);
  return normalized !== 'delivered' && normalized !== 'cancelled';
};
