import axios from 'axios';
import { BASE_URL, APP_KEY } from './../../config/settings';
import {products, STORE_PRODUCTS, DELETE_PRODUCT, SET_LOADED_TO_FALSE, order_list} from './types'

export const fetchProducts = () => {
    return (dispatch, getState) => {
        const state = getState();
        const token = state.auth.token;
        const vendor = state.auth.vendor_id;
        axios.get(`${BASE_URL}/vendors/${vendor}/products/index`,
            { headers:{'Authorization': `Bearer ${token}`}})
            .then(response => dispatch(storeProducts(response.data.products)))
            .catch(error => console.log(error))
    }
};

export const searchProducts = (data) => {
    return (dispatch, getState) => {
        const state = getState();
        const token = state.auth.token;
        const vendor = state.auth.vendor_id;

        axios.get(`${BASE_URL}/vendors/${vendor}/products/search?title=${data}`,
            {headers: {'Authorization': `Bearer ${token}`}})
            .then(response => dispatch(storeProducts(response.data.products)))
            .catch(error => console.log(error))
    }
};

export const loadNextPage = () => {
     return async (dispatch, getState) => {
        const state = getState();
        const token = state.auth.token;
        const nextPage = state.products.next_page_url;
        await axios.get( nextPage,{ headers:{'Authorization': `Bearer ${token}`}})
            .then(response => dispatch(storeNextPage(response.data.products)))
            .catch(error => console.log(error))
    }
}

export const deleteProduct = (id) => {
    return (dispatch, getState) => {
        const state = getState();
        const token = state.auth.token;
        const vendor = state.auth.vendor_id;

        axios.delete(`${BASE_URL}/vendors/${vendor}/products/${id}`,
            {headers : {'Authorization': `Bearer ${token}`}})
            .then(response => dispatch(removeProduct(id)))
            .catch(error => console.log(error))
    }
};




export const removeProduct = id => {
    return {
        type: products.DELETE_PRODUCT,
        payload: id
    }
};


export const storeProducts = data => {
    return {
        type: products.STORE_PRODUCTS,
        payload: data
    }
};

export const storeNextPage = data => {
    return {
        type: products.STORE_NEXT_PAGE,
        payload: data
    }
}


export const setLoadedToFalse = () => {
    return {
        type: SET_LOADED_TO_FALSE
    }
};


export const setloadMoreProducts=()=>{
    return {
        type:products.SET_LOAD_MORE_FALSE
    }
}
