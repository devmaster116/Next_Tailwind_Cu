import { Timestamp } from "firebase/firestore";

export interface KitchenData {
  kitchen: string;
  kitchenId: string;
  categories: KitchenItem[];
  dishes: KitchenItem[];
  response: OrdersResponse[];
}

export interface KitchenItem {
  item_name: string;
  item_count: number;
  total_price: number;
}

export interface Categories extends KitchenItem {
  category_name: string;
}

export interface Dishes extends KitchenItem {
  dish_name: string;
}

export interface OrdersResponse {
  dine_in_order_net_avg: number;
  online_order_net_avg: number;
  take_away_order_net_avg: number;
  total_card_orders: number;
  total_card_refunded_sum: number;
  total_card_sum: number;
  total_card_surcharge: number;
  total_card_tip: number;
  total_cash_orders: number;
  total_cash_refunded_sum: number;
  total_cash_sum: number;
  total_completed_orders: number;
  total_dine_in_orders: number;
  total_holiday_surcharge: number;
  total_net_sales: number;
  total_online_orders: number;
  total_orders: number;
  total_refunded_orders: number;
  total_refunded_sum: number;
  total_revenue: number;
  total_split_payment_orders: number;
  total_split_payment_sum: number;
  total_take_away_orders: number;
}

// Manually entered subscription details for MVP. Used to create subscription checkout page from admin console
export type ChosenSubscriptionDetails = {
  activeProducts: string[];
  addonNames: string[];
  products: SubscriptionProduct[];
};

export type ActiveSubscribtionDetails = {
  activeProducts: string[];
  addonNames: string[];
  cancel_at_period_end: boolean;
  current_period_end: Timestamp;
  current_period_start: Timestamp;
  customerId: string;
  subscriptionId: string;
  subscriptionStatus: string;
  products: SubscriptionProduct[];
};

export type SubscriptionProduct = {
  amount: number;
  lookup_key: string;
  priceId: string;
  productId: string;
  productName: string;
  quantity: number;
};

interface HoursSchedule {
  from: string;
  to: string;
}

interface DaySchedule {
  [key: string]: HoursSchedule;
}

interface Hours {
  schedule: DaySchedule[];
}

interface DateCreated {
  seconds: number;
  nanoseconds: number;
}

interface TakeAwayConfig {
  enabled: boolean;
}

export interface Kitchen {
  activeAccount?: boolean;
  dishes?: Record<string, any>;
  hours?: Hours;
  kitchenId: string;
  phoneNumber: string;
  isTransferOwnershipReview?: boolean;
  orderIdInitials?: string;
  dateCreated?: DateCreated;
  fullAddress: string;
  stripe_customer_id: string;
  orderWaitTime?: number;
  orderCount: string;
  email: string;
  tier?: string;
  kitchenSlug?: string;
  abn: string;
  kitchenName: string;
  isBetaTrialEnabled?: boolean;
  kitchenOrderStatus?: string;
  takeAwayConfig?: TakeAwayConfig;
  subscriptionId?: string | null;
  DocumentData?: any;
}

export interface User {
  uid: string;
  email: string;
  userType?: string;
  secondaryContact: boolean;
  createdAt?: Timestamp | string;
  displayName?: string;
  kitchenId: string | null;
  setupComplete?: boolean;
  owner: boolean;
  mobileNumber?: string;
  isTransferOwnershipReview?: boolean | null;
  emailVerified?: boolean;
}

export interface RoleInfo {
  id: string; // Use ID to uniquely identify roles
  roles: string[];
  access: string;
  staff: number;
  name: string;
  permissions: Permission[];
}

export interface Permission {
id: string;
label: string;
description: string;
enabled: boolean;
}
