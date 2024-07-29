import { Categories } from "@/app/src/types";

export function getCategoryStats(categories: Categories[]) {
  if (categories.length === 0) {
    throw new Error("The categories array is empty");
  }

  // Sort by item_count and then by total_price for mostPopular
  const sortedByCount = [...categories].sort((a, b) => {
    if (b.item_count === a.item_count) {
      return b.total_price - a.total_price;
    }
    return b.item_count - a.item_count;
  });

  // Sort by item_count and then by total_price for leastPopular
  const sortedByLeastPopular = [...categories].sort((a, b) => {
    if (a.item_count === b.item_count) {
      return a.total_price - b.total_price;
    }
    return a.item_count - b.item_count;
  });

  // Sort by total_price and then by item_count for highestNetSale
  const sortedByPrice = [...categories].sort((a, b) => {
    if (b.total_price === a.total_price) {
      return b.item_count - a.item_count;
    }
    return b.total_price - a.total_price;
  });

  // Sort by total_price and then by item_count for lowestNetSale
  const sortedByLowestNetSale = [...categories].sort((a, b) => {
    if (a.total_price === b.total_price) {
      return a.item_count - b.item_count;
    }
    return a.total_price - b.total_price;
  });

  const mostPopular = sortedByCount[0];
  const leastPopular = sortedByLeastPopular[0];
  const highestNetSale = sortedByPrice[0];
  const lowestNetSale = sortedByLowestNetSale[0];

  return {
    mostPopular,
    highestNetSale,
    leastPopular,
    lowestNetSale,
  };
}
