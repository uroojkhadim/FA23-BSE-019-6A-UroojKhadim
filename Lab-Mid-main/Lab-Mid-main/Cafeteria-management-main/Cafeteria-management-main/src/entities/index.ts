/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: admins
 * Interface for Administrators
 */
export interface Administrators {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  fullName?: string;
  /** @wixFieldType text */
  cnicNumber?: string;
  /** @wixFieldType text */
  email?: string;
  /** @wixFieldType text */
  phoneNumber?: string;
  /** @wixFieldType text */
  adminRole?: string;
  /** @wixFieldType text */
  universityName?: string;
}


/**
 * Collection ID: discounts
 * Interface for Discounts
 */
export interface Discounts {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  discountCode?: string;
  /** @wixFieldType text */
  discountType?: string;
  /** @wixFieldType number */
  discountValue?: number;
  /** @wixFieldType number */
  minimumOrderAmount?: number;
  /** @wixFieldType boolean */
  isActive?: boolean;
  /** @wixFieldType datetime */
  validFrom?: Date | string;
  /** @wixFieldType datetime */
  validUntil?: Date | string;
}


/**
 * Collection ID: menuitems
 * @catalog This collection is an eCommerce catalog
 * Interface for MenuItems
 */
export interface MenuItems {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  itemName?: string;
  /** @wixFieldType number */
  itemPrice?: number;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  itemImage?: string;
  /** @wixFieldType text */
  itemDescription?: string;
  /** @wixFieldType boolean */
  isAvailable?: boolean;
  /** @wixFieldType text */
  category?: string;
  /** @wixFieldType text */
  dietaryRestrictions?: string;
}


/**
 * Collection ID: orderitems
 * Interface for OrderItems
 */
export interface OrderItems {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  orderId?: string;
  /** @wixFieldType text */
  menuItemId?: string;
  /** @wixFieldType number */
  quantity?: number;
  /** @wixFieldType number */
  unitPrice?: number;
  /** @wixFieldType number */
  lineItemTotal?: number;
}


/**
 * Collection ID: orders
 * Interface for Orders
 */
export interface Orders {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  orderNumber?: string;
  /** @wixFieldType text */
  userId?: string;
  /** @wixFieldType text */
  status?: string;
  /** @wixFieldType number */
  totalPrice?: number;
  /** @wixFieldType datetime */
  orderTime?: Date | string;
  /** @wixFieldType boolean */
  isPaid?: boolean;
  /** @wixFieldType text */
  paymentMethod?: string;
  /** @wixFieldType text */
  notes?: string;
}


/**
 * Collection ID: payments
 * Interface for Payments
 */
export interface Payments {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  transactionId?: string;
  /** @wixFieldType text */
  orderReference?: string;
  /** @wixFieldType text */
  paymentMethod?: string;
  /** @wixFieldType number */
  amountPaid?: number;
  /** @wixFieldType text */
  paymentStatus?: string;
  /** @wixFieldType datetime */
  paymentDateTime?: Date | string;
}


/**
 * Collection ID: students
 * Interface for Students
 */
export interface Students {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  registrationNumber?: string;
  /** @wixFieldType text */
  fullName?: string;
  /** @wixFieldType text */
  email?: string;
  /** @wixFieldType text */
  role?: string;
  /** @wixFieldType text */
  contactNumber?: string;
  /** @wixFieldType text */
  universityName?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  profilePicture?: string;
}


/**
 * Collection ID: teachers
 * Interface for Teachers
 */
export interface Teachers {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  fullName?: string;
  /** @wixFieldType text */
  cnicNumber?: string;
  /** @wixFieldType text */
  email?: string;
  /** @wixFieldType text */
  phoneNumber?: string;
  /** @wixFieldType text */
  department?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  profilePicture?: string;
  /** @wixFieldType text */
  role?: string;
}
