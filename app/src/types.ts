export interface KitchenData {
  kitchen: string;
  kitchenId: string;
  categories: KitchenItem[];
  dishes: KitchenItem[];
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
