export function filterProperties(items: { [key: string]: any }[]) {
  return items.map(
    ({ variantCombination, total_quantity, totalPriceWithVariants }) => ({
      variantCombination,
      total_quantity,
      totalPriceWithVariants,
    })
  );
}
