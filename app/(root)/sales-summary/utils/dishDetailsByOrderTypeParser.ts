interface Order {
    orderType: string;
    item_count: number;
    total_price: number;
}

// Function to extract item count and total price by order type
export const dishDetailsByOrderTypeParser= (orders: Order[], orderType: string) => {
    // Find the order with the matching type
    const order = orders && orders?.find(o => o.orderType === orderType);
    
    if (order) {
        return {
            itemCount: order.item_count,
            totalPrice: order.total_price
        };
    } else {
        return null;
    }
}
