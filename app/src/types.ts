import { Timestamp } from "firebase/firestore";

export interface KitchenData {
  kitchen: string;
  kitchenId: string;
  categories: KitchenItem[];
  dishes: KitchenItem[];
  response: OrdersResponse[];
  dishByOrderType: DishByOrderType[];
}
export interface DineInConfig {
  Enabled: boolean;
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
  total_dine_in_card_surcharge: number;
  total_dine_in_orders: number;
  total_dine_in_sum: number;
  total_holiday_surcharge: number;
  total_net_sales: number;
  total_online_orders: number;
  total_orders: number;
  total_refunded_orders: number;
  total_refunded_sum: number;
  total_revenue: number;
  total_split_payment_orders: number;
  total_split_payment_sum: number;
  total_take_away_card_surcharge: number;
  total_take_away_orders: number;
  total_take_away_sum: number;
  transactionFromDate: TransactionDate;
  transactionToDate: TransactionDate;
}

type TransactionDate = {
  value: string;
};

// Manually entered subscription details for MVP. Used to create subscription checkout page from admin console
export type ChosenSubscriptionDetails = {
  activeProducts: string[];
  addonNames: string[];
  products: SubscriptionProduct[];
};

export type ActiveSubscriptionDetails = {
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

export interface DaySchedule {
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
  accessManagementEnabled: boolean;
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
  dineInConfig?: DineInConfig;
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
  id: string;
  roles: string[];
  access: string;
  staff: number;
  name: string;
  description: string;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

export interface SelectedVariantsForDishData {
  category: string;
  dishName: string;
  variantCombination: string;
  totalPriceWithVariants: number;
  total_quantity: number;
}

export interface ItemInsightsData {
  category: string;
  variantCombination: string;
  totalPriceWithVariants: number;
  total_quantity: number;
}

export interface DishVariationTotals {
  totalQuantity: number;
  totalPriceWithVariants: number;
}

export interface ConfigStaffMember {
  id: string;
  displayName: string;
  firstName: string;
  lastName: string;
  passcode: string;
  roleId: string;
  roleName: string;
  description: string;
  displayImageURL: string;
  email: string;
  phoneNumber: string;
}
export interface IConfig {
  isItemImagesHidden: boolean;
  isOpenCashDraw: boolean;
  isSplitPaymentsConfigEnabled: boolean;
  mandatoryPrepaymentConfig: boolean;
  markOrderCompletedConfig: boolean;
  markOrderReadyConfig: boolean;
  enabled: boolean;
  idleTime: number;
  passCodeEnabled: boolean;
  staffMembers: ConfigStaffMember[];
}

export interface StaffMembers {
  id: string;
  displayName: string;
  firstName: string;
  lastName: string;
  passcode: string;
  roleId: string;
  roleName: string;
  description: string;
  displayImageURL: string;
  email: string;
  phoneNumber: string;
}
export interface StaffMemberConfigs {
  enabled: boolean;
  idleTime: number;
  passCodeEnabled: boolean;
  staffMembers: StaffMembers[];
}
export interface Configs {
  isItemImagesHidden: boolean;
  isOpenCashDraw: boolean;
  isSplitPaymentsConfigEnabled: boolean;
  mandatoryPrepaymentConfig: boolean;
  markOrderCompletedConfig: boolean;
  markOrderReadyConfig: boolean;
  kitchenId: string;
  staffMemberConfigs: StaffMemberConfigs;
  surchargeConfigs: SurchargeConfigs;
}
export interface SurchargeConfigs {
  customSurcharges: CustomSurcharges[];
  publicHolidaySurcharge: PublicHolidaySurcharge;
  saturdaySurcharge: SaturdaySurcharge;
  sundaySurcharge: SundaySurcharge;
}
export interface CustomSurcharges {
  enabled: boolean;
  surchargeId: string;
  surchargeName: string;
  surchargeValue: number;
}
export interface PublicHolidaySurcharge {
  enabled: boolean;
  value: number;
}
export interface DishByOrderType {
  orderType: string;
  item_count: number;
  total_price: number;
}
export interface SaturdaySurcharge {
  enabled: true;
  value: number;
}
export interface SundaySurcharge {
  enabled: boolean;
  value: number;
}
export interface OrderMultiDayData {
  order_date: {
    value: string;
  };
  total_take_away_orders: number;
  total_dine_in_orders: number;
  total_take_away_net_sales: number;
  total_dine_in_net_sales: number;
  total_net_sales: number;
}

export interface OrderHourData {
  order_hour: number;
  total_take_away_orders: number;
  total_dine_in_orders: number;
  total_take_away_net_sales: number;
  total_dine_in_net_sales: number;
  total_net_sales: number;
}

export type OrderData = OrderMultiDayData | OrderHourData;

export interface Totals {
  totalTakeAwayOrders: number;
  totalDineInOrders: number;
  totalTakeAwayNetSales: number;
  totalDineInNetSales: number;
}

export interface OnlineOrderConfig {
  dineInEnabled: boolean;
  takeAwayEnabled: boolean;
  cardFeePercent: number;
  cardFeeFixedCharge: number;
  isTyroLocationIdValid: boolean;
  onlineOrderingPaused: boolean;
  orderReadyTime: number;
  tyroLocationId: string;
}
