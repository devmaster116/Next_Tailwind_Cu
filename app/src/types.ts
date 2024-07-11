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
