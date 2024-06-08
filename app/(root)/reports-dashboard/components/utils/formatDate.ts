import { KitchenItem } from "@/app/src/types";

export const formatDate = (date: Date | null): string => {
  if (!date) return "null";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getTopFive = (items: KitchenItem[]): KitchenItem[] => {
  const sortedItems = items.sort((a, b) => b.item_count - a.item_count);
  return sortedItems.slice(0, 5);
};
