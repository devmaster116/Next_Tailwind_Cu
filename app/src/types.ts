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
  total_orders: number;
  total_net_sales: number;
  total_refunded_sum: number;
  total_refunded_orders: number;
}
