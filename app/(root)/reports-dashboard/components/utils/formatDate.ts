import { KitchenItem } from "@/app/src/types";

export const formatDate = (date: Date | null): string => {
  if (!date) return "null";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const formatReadableDate = (date: Date | null): string => {
  if (!date) {
    return "";
  }

  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear().toString().slice(-2);

  return `${day} ${month} '${year}`;
};

export const getTopFive = (items: KitchenItem[]): KitchenItem[] => {
  const sortedItems = items.sort((a, b) => b.item_count - a.item_count);
  return sortedItems.slice(0, 5);
};

export const getYesterdayDate = (): Date => {
  const today = new Date();
  today.setDate(today.getDate() - 1);
  return today;
};

export function getCurrentWeekRange(): { startDate: Date; endDate: Date } {
  const today = new Date();
  const day = today.getDay();
  const diffToMonday = (day === 0 ? -6 : 1) - day;
  const diffToSunday = day === 0 ? 0 : 7 - day;

  const startDate = new Date(today);
  startDate.setDate(today.getDate() + diffToMonday);

  const endDate = new Date(today);
  endDate.setDate(today.getDate() + diffToSunday);

  return { startDate, endDate };
}

export function getCurrentMonthRange(): {
  startMonthDate: Date;
  endMonthDate: Date;
} {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const startMonthDate = new Date(year, month, 1);
  const endMonthDate = new Date(year, month + 1, 0);

  return { startMonthDate, endMonthDate };
}
