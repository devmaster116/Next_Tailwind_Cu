import { Dishes } from "@/app/src/types";

export function getDishStats(dishes: Dishes[]) {
  if (dishes.length === 0) {
    throw new Error("The dishes array is empty");
  }

  // Sort by item_count and then by total_price for mostPopular
  const sortedByCount = [...dishes].sort((a, b) => {
    if (b.item_count === a.item_count) {
      return b.total_price - a.total_price;
    }
    return b.item_count - a.item_count;
  });

  // Sort by total_price and then by item_count for highestNetSale
  const sortedByPrice = [...dishes].sort((a, b) => {
    if (b.total_price === a.total_price) {
      return b.item_count - a.item_count;
    }
    return b.total_price - a.total_price;
  });
  const mostPopular = sortedByCount[0];
  const highestNetSale = sortedByPrice[0];

  return {
    mostPopular,
    highestNetSale,
  };
}
