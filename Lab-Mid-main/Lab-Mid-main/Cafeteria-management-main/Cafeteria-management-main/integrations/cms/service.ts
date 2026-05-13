import type { WixDataItem } from ".";

export interface PaginationOptions {
  limit?: number;
  skip?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  hasNext: boolean;
  currentPage: number;
  pageSize: number;
  nextSkip: number | null;
}

const API_URL = import.meta.env.VITE_API_URL || '/api';


const collectionMap: Record<string, string> = {
  'menuitems': 'menu-items',
  'orders': 'orders',
  'inventory': 'inventory',
  'orderitems': 'order-items',
  'payments': 'payments',
  'admins': 'admins',
  'teachers': 'teachers',
  'students': 'students',
  'discounts': 'discounts'
};

export class BaseCrudService {
  static async create<T extends WixDataItem>(
    collectionId: string,
    itemData: Partial<T> | Record<string, unknown>
  ): Promise<T> {
    const route = collectionMap[collectionId] || collectionId;
    const id = itemData._id || crypto.randomUUID();
    
    const response = await fetch(`${API_URL}/${route}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...itemData,
        id: id,
        _id: id,
        createdDate: new Date().toISOString()
      })
    });

    if (!response.ok) throw new Error(`Failed to create item in ${collectionId}`);
    return await response.json();
  }

  static async getAll<T extends WixDataItem>(
    collectionId: string,
    _options?: any,
    pagination?: PaginationOptions
  ): Promise<PaginatedResult<T>> {
    const route = collectionMap[collectionId] || collectionId;
    const response = await fetch(`${API_URL}/${route}`);
    const data = await response.json();
    
    const items = data.items || [];
    const limitVal = pagination?.limit ?? 50;
    const skipVal = pagination?.skip ?? 0;
    const paginatedItems = items.slice(skipVal, skipVal + limitVal);

    return {
      items: paginatedItems,
      totalCount: items.length,
      hasNext: skipVal + limitVal < items.length,
      currentPage: Math.floor(skipVal / limitVal),
      pageSize: limitVal,
      nextSkip: skipVal + limitVal < items.length ? skipVal + limitVal : null,
    };
  }

  static async getById<T extends WixDataItem>(
    collectionId: string,
    itemId: string
  ): Promise<T | null> {
    const route = collectionMap[collectionId] || collectionId;
    const response = await fetch(`${API_URL}/${route}/${itemId}`);
    if (response.status === 404) return null;
    return await response.json();
  }

  static async update<T extends WixDataItem>(collectionId: string, itemData: T): Promise<T> {
    const route = collectionMap[collectionId] || collectionId;
    const id = itemData._id || (itemData as any).id;
    
    const response = await fetch(`${API_URL}/${route}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...itemData,
        _updatedDate: new Date().toISOString()
      })
    });
    
    if (!response.ok) throw new Error(`Failed to update item in ${collectionId}`);
    return await response.json();
  }

  static async delete<T extends WixDataItem>(collectionId: string, itemId: string): Promise<T> {
    const route = collectionMap[collectionId] || collectionId;
    const response = await fetch(`${API_URL}/${route}/${itemId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error(`Failed to delete item from ${collectionId}`);
    return { _id: itemId } as T;
  }
}
