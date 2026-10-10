export interface IProduct {
  _id?: string;
  name: string;
  category: string;
  price: number;
  salePrice?: number;
  isSale?: boolean;
  deal?: boolean;
  description?: string;
  image: string[];
  tags?: string[];
  active: boolean;
  // Balloons
  colors?: string[];
  colorPalette: string[];
  // Gifts
  occasion?: string;
  boxContents?: string[];
  // Perfumes
  concentration?: '';
  size?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface Announcement {
  _id?: string;
  text: string;
  link?: string;
  active?: boolean;
  startDate?: string | Date;
  endDate: string | Date;
}

export interface Product {
  _id?: string;
  name: string;
  description?: string;
  price: number;
  categoryName: string;
  isSale?: boolean;
  deal?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductQueryParams {
  category?: string;
  isSale?: boolean;
  deal?: boolean;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: 'price-asc' | 'price-desc';
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  totalItems: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  pagination?: PaginationMeta;
  deletedProductId?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  count?: number;
  message?: string;
  data: T;
}

export interface Banner {
  _id: string;
  title: string;
  subtitle: string;
  discountTag?: string;
  imageUrl: string;
  ctaLink: string;
  ctaText: string;
}
export interface PromoBanner {
  discountText?: string;
  _id?: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  ctaLink: string;
  ctaText: string;
  isActive?: boolean;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  coupon:string;
  totalItems?: number;
  totalPrice: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  _id?: string;
  product: IProduct; // ربط مباشر بـ IProduct الموحد
  quantity: number;
}

export interface ICart {
  _id?: string;
  user: string;
  items: CartItem[];
  coupon:string;
  totalItems?: number;
  totalPrice: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICartResponse {
  success: boolean;
  data: ICart;
  count?: number;
  message?: string;
}

export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

export interface CustomerInfo {
  name: string;
  email: string;
  payerId: string;
}

export interface Order {
  _id?: string;
  orderID: string; // PayPal Order ID
  amount: number;
  currency: string;
  customerInfo: CustomerInfo;
  status: string; // 'COMPLETED', 'PENDING', etc.
  items: OrderItem[];
  createdAt: string;
  updatedAt?: string;
}

export interface Coupon {
  _id?: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  expirationDate: string | Date;
  usageLimit?: number | null;
  usedCount?: number;
  isActive: boolean;
  isValid:  boolean;
  isPromoModal?: boolean; // Unique flag to identify entrance modal promo coupon
  title?: string;         // Optional title display for promo banner
  discountText?: string;  // Optional text display for promo banner
  createdAt?: string;
  updatedAt?: string;
}
export interface User {
  _id?: any;
  name: string;
  phoneNumber: string;
  address: string;
}

export interface ValidateCouponResponse {
  success: boolean;
  message: string;
  data?: {
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    discountAmount: number;
    finalAmount: number;
  isValid:  boolean;

  };
}

export interface PromoSettings {
  _id?: string;
  code: string;
  title: string;
  discountText: string;
  isActive: boolean;
}
