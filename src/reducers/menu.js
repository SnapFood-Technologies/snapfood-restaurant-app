
import { productsMenu, SET_LOADED_TO_FALSE} from './../actions/types';

const defaultState = {
    products: null,
    loaded: false,
    refreshing: false
};

const removeProductMenu = (productsMenu, id) => {
    return productsMenu.filter(product => id !== product.id)
};

export default function reducer(state = defaultState, action){
    switch(action.type){
        case productsMenu.STORE_PRODUCTS_MENU:
            return { ...state, products: action.payload, loaded: true};
        case SET_LOADED_TO_FALSE:
            return { ...state, loaded: false};
        case productsMenu.DELETE_PRODUCT_MENU:
            return { ...state, products: removeProductMenu(state.products, action.payload)};
        default:
            return state;
    }
};