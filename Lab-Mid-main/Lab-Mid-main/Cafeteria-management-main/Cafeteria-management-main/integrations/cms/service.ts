import type { Administrators, Discounts, MenuItems, Students, Teachers } from "@/entities";
import type { WixDataItem } from ".";

const STORAGE_KEY = "cafeteria-management-db-v1";

/**
 * Pagination options for querying collections.
 */
export interface PaginationOptions {
  limit?: number;
  skip?: number;
}

/**
 * Metadata for a multi-reference field.
 * This app stores references inline, so these values are always local.
 */
export interface RefFieldMeta {
  totalCount: number;
  returnedCount: number;
  hasMore: boolean;
}

export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  hasNext: boolean;
  currentPage: number;
  pageSize: number;
  nextSkip: number | null;
}

type DatabaseState = Record<string, WixDataItem[]>;

let memoryDatabase: DatabaseState | null = null;

const canUseStorage = () => typeof window !== "undefined" && typeof localStorage !== "undefined";

const nowIso = () => new Date().toISOString();

const generateId = () =>
  globalThis.crypto?.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const createSeedData = (): DatabaseState => {
  const createdDate = new Date();

  const menuitems: MenuItems[] = [
    {
      _id: "menu-1",
      itemName: "Chicken Biryani",
      itemPrice: 5.99,
      itemDescription: "Spiced rice with tender chicken and fresh herbs.",
      category: "Lunch",
      dietaryRestrictions: "Halal",
      isAvailable: true,
      itemImage:
        "https://static.wixstatic.com/media/a525c7_81f4b76f50b04205bc0e0661511f5926~mv2.png?originWidth=1280&originHeight=704",
      _createdDate: createdDate,
      _updatedDate: createdDate,
    },
    {
      _id: "menu-2",
      itemName: "Club Sandwich",
      itemPrice: 3.75,
      itemDescription: "Triple layer sandwich with chicken, egg, and fresh vegetables.",
      category: "Snacks",
      dietaryRestrictions: "Halal",
      isAvailable: true,
      itemImage:
        "https://static.wixstatic.com/media/a525c7_bfb040f3965343e7aa123f1f837df956~mv2.png?originWidth=128&originHeight=128",
      _createdDate: createdDate,
      _updatedDate: createdDate,
    },
    {
      _id: "menu-3",
      itemName: "Lemon Mint",
      itemPrice: 1.5,
      itemDescription: "Fresh lemon and mint drink, served chilled.",
      category: "Beverages",
      isAvailable: true,
      _createdDate: createdDate,
      _updatedDate: createdDate,
    },
  ];

  const discounts: Discounts[] = [
    {
      _id: "discount-1",
      discountCode: "WELCOME10",
      discountType: "percentage",
      discountValue: 10,
      minimumOrderAmount: 5,
      isActive: true,
      validFrom: createdDate,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      _createdDate: createdDate,
      _updatedDate: createdDate,
    },
  ];

  const students: Students[] = [
    {
      _id: "student-1",
      fullName: "Demo Student",
      email: "student@comsats.edu.pk",
      registrationNumber: "COMSATS-2026-001",
      contactNumber: "+92 300 1111111",
      role: "student",
      universityName: "Comsats University",
      _createdDate: createdDate,
      _updatedDate: createdDate,
    },
  ];

  const teachers: Teachers[] = [
    {
      _id: "teacher-1",
      fullName: "Demo Teacher",
      email: "teacher@comsats.edu.pk",
      cnicNumber: "12345-1234567-1",
      phoneNumber: "+92 300 2222222",
      department: "Computer Science",
      role: "teacher",
      _createdDate: createdDate,
      _updatedDate: createdDate,
    },
  ];

  const admins: Administrators[] = [
    {
      _id: "admin-1",
      fullName: "Demo Admin",
      email: "admin@comsats.edu.pk",
      cnicNumber: "12345-7654321-1",
      phoneNumber: "+92 300 3333333",
      adminRole: "Cafeteria Manager",
      universityName: "Comsats University",
      _createdDate: createdDate,
      _updatedDate: createdDate,
    },
  ];

  return {
    menuitems: menuitems as WixDataItem[],
    discounts: discounts as WixDataItem[],
    students: students as WixDataItem[],
    teachers: teachers as WixDataItem[],
    admins: admins as WixDataItem[],
    orders: [],
    orderitems: [],
    payments: [],
  };
};

const parseDatabase = (raw: string | null): DatabaseState | null => {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed as DatabaseState;
  } catch {
    return null;
  }
};

const readDatabase = (): DatabaseState => {
  if (canUseStorage()) {
    const parsed = parseDatabase(localStorage.getItem(STORAGE_KEY));
    if (parsed) return parsed;

    const seeded = createSeedData();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }

  if (!memoryDatabase) {
    memoryDatabase = createSeedData();
  }
  return memoryDatabase;
};

const writeDatabase = (database: DatabaseState) => {
  if (canUseStorage()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(database));
    return;
  }
  memoryDatabase = database;
};

const cloneItems = <T>(value: T): T => JSON.parse(JSON.stringify(value));

const getCollection = (database: DatabaseState, collectionId: string): WixDataItem[] => {
  if (!database[collectionId]) {
    database[collectionId] = [];
  }
  return database[collectionId];
};

export class BaseCrudService {
  private static readCollection(collectionId: string): WixDataItem[] {
    const database = readDatabase();
    const collection = getCollection(database, collectionId);
    return cloneItems(collection);
  }

  private static writeCollection(collectionId: string, items: WixDataItem[]) {
    const database = readDatabase();
    database[collectionId] = items;
    writeDatabase(database);
  }

  static async create<T extends WixDataItem>(
    collectionId: string,
    itemData: Partial<T> | Record<string, unknown>,
    multiReferences?: Record<string, unknown>
  ): Promise<T> {
    const item = cloneItems(itemData) as T;
    const timestamp = nowIso();
    const created: T = {
      ...(item as object),
      _id: item._id || generateId(),
      _createdDate: item._createdDate || timestamp,
      _updatedDate: timestamp,
    } as T;

    if (multiReferences) {
      Object.entries(multiReferences).forEach(([field, value]) => {
        (created as any)[field] = cloneItems(value);
      });
    }

    const collection = this.readCollection(collectionId);
    collection.push(created);
    this.writeCollection(collectionId, collection);
    return cloneItems(created);
  }

  static async getAll<T extends WixDataItem>(
    collectionId: string,
    _includeRefs?: { singleRef?: string[]; multiRef?: string[] } | string[],
    pagination?: PaginationOptions
  ): Promise<PaginatedResult<T>> {
    const limit = Math.min(pagination?.limit ?? 50, 1000);
    const skip = Math.max(0, pagination?.skip ?? 0);
    const collection = this.readCollection(collectionId) as T[];

    const items = collection.slice(skip, skip + limit);
    const totalCount = collection.length;
    const hasNext = skip + limit < totalCount;

    return {
      items: cloneItems(items),
      totalCount,
      hasNext,
      currentPage: Math.floor(skip / limit),
      pageSize: limit,
      nextSkip: hasNext ? skip + limit : null,
    };
  }

  static async getById<T extends WixDataItem>(
    collectionId: string,
    itemId: string,
    _includeRefs?: { singleRef?: string[]; multiRef?: string[] } | string[]
  ): Promise<T | null> {
    const collection = this.readCollection(collectionId) as T[];
    const item = collection.find((entry) => entry._id === itemId) || null;
    return item ? cloneItems(item) : null;
  }

  static async update<T extends WixDataItem>(collectionId: string, itemData: T): Promise<T> {
    if (!itemData._id) {
      throw new Error(`${collectionId} ID is required for update`);
    }

    const collection = this.readCollection(collectionId) as T[];
    const index = collection.findIndex((entry) => entry._id === itemData._id);
    if (index === -1) {
      throw new Error(`${collectionId} item not found`);
    }

    const updated = {
      ...collection[index],
      ...cloneItems(itemData),
      _updatedDate: nowIso(),
    } as T;

    collection[index] = updated;
    this.writeCollection(collectionId, collection as WixDataItem[]);
    return cloneItems(updated);
  }

  static async delete<T extends WixDataItem>(collectionId: string, itemId: string): Promise<T> {
    const collection = this.readCollection(collectionId) as T[];
    const index = collection.findIndex((entry) => entry._id === itemId);

    if (index === -1) {
      throw new Error(`${collectionId} item not found`);
    }

    const [deleted] = collection.splice(index, 1);
    this.writeCollection(collectionId, collection as WixDataItem[]);
    return cloneItems(deleted);
  }

  static async addReferences(
    collectionId: string,
    itemId: string,
    references: Record<string, string[]>
  ): Promise<void> {
    const item = await this.getById<WixDataItem>(collectionId, itemId);
    if (!item) throw new Error(`${collectionId} item not found`);

    const updated = { ...item };
    Object.entries(references).forEach(([fieldName, refIds]) => {
      const mutableUpdated = updated as WixDataItem & Record<string, unknown>;
      const current = Array.isArray(mutableUpdated[fieldName]) ? (mutableUpdated[fieldName] as string[]) : [];
      mutableUpdated[fieldName] = Array.from(new Set([...current, ...refIds]));
    });

    await this.update(collectionId, updated);
  }

  static async removeReferences(
    collectionId: string,
    itemId: string,
    references: Record<string, string[]>
  ): Promise<void> {
    const item = await this.getById<WixDataItem>(collectionId, itemId);
    if (!item) throw new Error(`${collectionId} item not found`);

    const updated = { ...item };
    Object.entries(references).forEach(([fieldName, refIds]) => {
      const mutableUpdated = updated as WixDataItem & Record<string, unknown>;
      const current = Array.isArray(mutableUpdated[fieldName]) ? (mutableUpdated[fieldName] as string[]) : [];
      mutableUpdated[fieldName] = current.filter((id) => !refIds.includes(id));
    });

    await this.update(collectionId, updated);
  }
}
