// product.types.ts
export type ProductStatus =
  | "active"
  | "inactive"
  | "out_of_stock"
  | "discontinued";

export type ProductCategory =
  | "electronics"
  | "fashion"
  | "grocery"
  | "home"
  | "beauty"
  | "sports";

export interface Product {
  /** Core identity */
  id: string;
  sku: string;
  barcode: string;
  name: string;
  description: string;
  brand: string;
  category: ProductCategory;

  /** Pricing */
  costPrice: number;
  retailPrice: number;
  discountPercent: number;
  finalPrice: number;
  currency: "USD" | "EUR" | "INR";

  /** Inventory */
  stockQty: number;
  reservedQty: number;
  reorderLevel: number;
  warehouseLocation: string;
  supplierName: string;
  supplierEmail: string;

  /** Status & flags */
  status: ProductStatus;
  isFeatured: boolean;
  isReturnable: boolean;
  isTaxable: boolean;

  /** Ratings & analytics */
  rating: number;
  reviewCount: number;
  views: number;
  salesCount: number;

  /** Dimensions & logistics */
  weightKg: number;
  heightCm: number;
  widthCm: number;
  lengthCm: number;
  shippingClass: "standard" | "express" | "freight";

  /** Dates */
  launchDate: Date;
  lastRestockedAt: Date | null;
  expiryDate: Date | null;
  createdAt: Date;
  updatedAt: Date;

  /** Metadata (useful for expandable rows) */
  tags: string[];
  notes: string | null;

  /** Owner */
  owner: User;
}

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  role: string;
  email: string;
}
