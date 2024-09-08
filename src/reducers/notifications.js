import { notifications } from './../actions/types';

const defaultState = {
    orders: null,
    total: 0,
    loaded: false,
};

const parseOrderData = (orders) => {
    let parsedOrders = orders.map(order => ({
            id: order.id,
            created_at: order.created_at,
            order_number: order.order_number,
            total_price: order.total_price,
            status: order.status,
            products: parseProductData(order.products)
        }));
    
    return parsedOrders; 
};

const parseProductData = (products) => {
    let parsedProducts = products.map(product => {
        return {
            title: product.title,
            quantity: product.quantity
        }
    })

    return parsedProducts;
};

const countOrders = (orders) => {
    if(orders !== null)
        return orders.length;

    return 0;
};



export default function reducer(state = defaultState, action){
    switch(action.type){
        case notifications.STORE_NOTIFICATIONS:
            let orders = parseOrderData(action.payload);
                return { ...state, orders: orders, loaded: true, total: countOrders(orders)}
        default: 
            return state;
    }
};
