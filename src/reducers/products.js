import { products, SET_LOADED_TO_FALSE} from './../actions/types';
import {order_list} from "../actions/types";

const defaultState = {
    products: [],
    loaded: false,
    refreshing: false,
    next_page_url: null,
    loadNextPage:true
};

const pushNewProducts = (state, newProducts) => {
    let products = state;
    let newProductState =  products.concat(newProducts);
    return newProductState;
}

const removeProducts = (products, id) => {
    return products.filter(product => id !== product.id)
};

export default function reducer(state = defaultState, action){
    switch(action.type){
        case products.STORE_PRODUCTS:
            return { ...state, products: action.payload.data, next_page_url: action.payload.next_page_url, loaded: true};
        case products.STORE_NEXT_PAGE:
            return { ...state, products: pushNewProducts(state.products, action.payload.data),loadNextPage:true, next_page_url: action.payload.next_page_url, loaded: true }
        case SET_LOADED_TO_FALSE:
            return { ...state, loaded: false};
        case products.SET_LOAD_MORE_FALSE:
            return {...state,loadNextPage:false}
        case products.DELETE_PRODUCT:
            return { ...state, products: removeProducts(state.products, action.payload)};
        default:
            return state;
    }
};