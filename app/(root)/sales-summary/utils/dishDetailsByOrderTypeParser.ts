interface Order {
  orderType: string;
  item_count: number;
  total_price: number;
}

export const dishDetailsByOrderTypeParser = (
  orders: Order[],
  orderType: string
) => {
  const order = orders && orders?.find(o => o.orderType === orderType);

  if (order) {
    return {
      itemCount: order.item_count,
      totalPrice: order.total_price,
    };
  } else {
    return null;
  }
};
