import { order_list } from './../actions/types';


const defaultState = {
    orders: null,
    loaded: false,
    search: {
        order_date_from: null,
        order_date_to: null,
        order_status: 'All'
    },
    searchField:'Today',
    next_page_url: null,
    totals:{},
    loadNextPage:true
};


const setOrderDateFrom = (state, date) => { 
    return { ...state, order_date_from: date, order_date_to: date }
}

const setOrderDateTo = (state, date) => {
    return { ...state, order_date_to: date }
}

const setOrderStatus = (state, status) => {
    return { ...state, order_status: status }
}

const pushNewOrders = (state, newOrders) => {
    let orders = state;
    let newOrdersState =  orders.concat(newOrders);
    return newOrdersState;
}


export default function reducer(state = defaultState, action){
    switch(action.type){

        case order_list.STORE_ORDERS_LIST:
            return { ...state, orders: action.payload.orders.data,totals:action.payload.total, next_page_url: action.payload.orders.next_page_url, loaded: true}
        case order_list.STORE_NEXT_PAGE:
            return { ...state, orders: pushNewOrders(state.orders, action.payload.data), loadNextPage:true, next_page_url: action.payload.next_page_url}
        case order_list.SET_SEARCH_TIME_FROM:
            return { ...state, search: setOrderDateFrom(state.search, action.payload)};
        case order_list.SET_SEARCH_TIME_TO:
            return { ...state, search: setOrderDateTo(state.search, action.payload)};
        case order_list.SET_SEARCH_STATUS:
            return { ...state, search: setOrderStatus(state.search, action.payload)};
        case order_list.SET_LOADED_TO_FALSE:
            return { ...state, loaded: false}
        case order_list.SET_LOAD_MORE_FALSE:
            return {...state,loadNextPage:false}

        case order_list.CHANGE_SEARCH_FIELD:
            return {...state,searchField:action.payload}
        default: 
            return state;
    }
};
