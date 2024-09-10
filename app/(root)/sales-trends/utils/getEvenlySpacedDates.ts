import { OrderMultiDayData } from "@/app/src/types";

export const getEvenlySpacedDates = (
  orders: OrderMultiDayData[],
  intervalDays: number
): string[] => {
  if (orders.length === 0) return [];

  const dates = getOrderDates(orders);

  const parsedDates = dates.map(date => new Date(date));

  parsedDates.sort((a, b) => a.getTime() - b.getTime());

  const earliestDate = parsedDates[0];
  const latestDate = parsedDates[parsedDates.length - 1];

  const totalDays = Math.floor(
    (latestDate.getTime() - earliestDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const numberOfIntervals = Math.ceil(totalDays / intervalDays);

  const evenlySpacedDates: string[] = [];
  for (let i = 0; i < numberOfIntervals; i++) {
    const intervalDate = new Date(earliestDate);
    intervalDate.setDate(earliestDate.getDate() + i * intervalDays);
    evenlySpacedDates.push(intervalDate.toISOString().split("T")[0]);
  }

  return evenlySpacedDates.filter(date => dates.includes(date));
};

function getOrderDates(data: OrderMultiDayData[]): string[] {
  return data.map(item => item.order_date.value);
}
