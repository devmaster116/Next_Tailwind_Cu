export interface KitchenData {
  kitchen: string;
  kitchenId: string;
  categories: KitchenItem[];
  dishes: KitchenItem[];
  orders: OrdersResponse[];
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
  completedOrders: number;
  refundedOrders: number;
  refundedAmount: number;
  averageOrder: number;
  grossSales: number;
  tips: number;
}
