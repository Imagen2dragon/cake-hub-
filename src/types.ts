export type TabType = 
  | 'dashboard' 
  | 'orders' 
  | 'catalogue' 
  | 'analytics' 
  | 'calendar' 
  | 'custom-builder' 
  | 'tracker' 
  | 'login' 
  | 'settings';

export type FulfillmentType = 'Delivery' | 'Pickup';

export type OrderStatus = 'New' | 'In Progress' | 'Ready' | 'Delivered' | 'Cancelled';

export type PaymentMethod = 'Telebirr' | 'Chapa' | 'CBE Birr' | 'Credit Card' | 'Cash on Delivery';

export type DepositStatus = 'Paid (50%)' | 'Full Paid' | 'Pending Deposit';

export type BakeryBranch = 
  | 'Addis Ababa - Bole Medhanialem' 
  | 'Addis Ababa - Kazanchis Main' 
  | 'Addis Ababa - Piassa Heritage' 
  | 'Hawassa - Lake View';

export interface Customer {
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  initials?: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Order {
  id: string; // e.g. "#AB-9842" or "#4402"
  customer: Customer;
  items: string; // text summary or breakdown
  itemDetails?: { name: string; qty: number; price: number; tiers?: number; flavor?: string; inscription?: string }[];
  fulfillment: FulfillmentType;
  status: OrderStatus;
  total: number;
  depositAmount: number;
  depositStatus: DepositStatus;
  paymentMethod: PaymentMethod;
  branch: BakeryBranch;
  date: string; // Delivery/Pickup date e.g. 2026-08-10
  timeSlot?: string;
  notes?: string;
  trackingStep?: number; // 1: Confirmed, 2: Baking, 3: Decorating, 4: Quality Check, 5: Delivered
}

export interface CakeItem {
  id: string;
  code: string; // e.g. "#CK-1029"
  name: string;
  category: 'Tiered Cakes' | 'Signature' | 'Small Bites' | 'Seasonal' | 'Vegan Delights';
  price: number;
  rating: number;
  reviewCount: number;
  soldCount: number;
  revenue: number;
  stockCount: number;
  stockStatus: 'In Stock' | 'Low Stock' | 'Critical';
  image: string;
  altText: string;
  description: string;
  isPopular?: boolean;
  flavors?: string[];
  maxTiers?: number;
  reviews?: Review[];
}

export interface CartItem {
  cake: CakeItem;
  quantity: number;
  customization?: {
    tiers?: number;
    flavor?: string;
    inscription?: string;
    guests?: number;
    deliveryDate?: string;
    timeSlot?: string;
    fulfillment?: FulfillmentType;
  };
}

export interface InventoryItem {
  id: string;
  name: string;
  stock: number;
  maxStock: number;
  status: 'High' | 'Medium' | 'Low Stock' | 'Critical';
  image: string;
  altText: string;
}

export interface CustomCakeSpec {
  tiers: number;
  topFlavor: string;
  middleFlavor?: string;
  baseFlavor: string;
  frostingColor: string;
  topper: '🎓 Graduation' | '💍 Wedding' | '🕯️ Birthday' | '🌸 Fresh Roses' | '👑 Gold Crown';
  inscription: string;
  guests: number;
  calculatedPrice: number;
}
