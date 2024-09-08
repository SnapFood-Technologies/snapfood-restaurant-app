import axios from 'axios';
import { BASE_URL, APP_KEY } from './../../config/settings';
import {productsMenu, STORE_PRODUCTS_MENU, DELETE_PRODUCT_MENU, SET_LOADED_TO_FALSE} from './types'


export const fetchProductsMenu = (id) => {
    return (dispatch, getState) => {
        const state = getState();
        const token = state.auth.token;
        const vendor = state.auth.vendor_id;
        axios.get(`${BASE_URL}/vendors/${vendor}/menu/${id}`,
            { headers:{'Authorization': `Bearer ${token}`}})
            .then(response => dispatch(storeProductsMenu(response.data.products)))
            .catch(error => console.log(error))
    }
};

export const searchProductsMenu = (searchTerms, id) => {
    return (dispatch, getState) => {
        const state = getState();
        const token = state.auth.token;
        const vendor = state.auth.vendor_id;

        axios.get(`${BASE_URL}/vendors/${vendor}/products/search?title=${searchTerms}&category=${id}`,
            { headers:{'Authorization': `Bearer ${token}`}})
            .then(response => dispatch(storeProductsMenu(response.data.products.data)))
            .catch(error => console.log(error));
    }
};


export const deleteProductFromMenu = (id,menu) => {
    return (dispatch, getState) => {
        const state = getState();
        const token = state.auth.token;
        const vendor = state.auth.vendor_id;

        axios.delete(`${BASE_URL}/vendors/${vendor}/menu/${menu}/products/${id}`,
            {headers: {'Authorization': `Bearer ${token}`}})
            .then(response => dispatch(removeProductMenu(id)))
            .catch(error => console.log(error))
    }
};


export const removeProductMenu = (id) => {
    return {
        type: productsMenu.DELETE_PRODUCT_MENU,
        payload: id
    }
};


export const storeProductsMenu = data => {
    return {
        type: productsMenu.STORE_PRODUCTS_MENU,
        payload: data
    }
};


export const setLoadedToFalse = () => {
    return {
        type: SET_LOADED_TO_FALSE
    }
};