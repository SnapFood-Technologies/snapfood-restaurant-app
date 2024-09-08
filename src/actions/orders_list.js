import { order_list } from './types';
import axios from 'axios';
import moment from 'moment';
import { BASE_URL, APP_KEY } from './../../config/settings';

export const fetchOrdersList = () => {
    return (dispatch, getState) => {
        const state = getState();
        const today = moment().format('YYYY-MM-DD');

        const queryString = `order_date_from=${today}&order_date_to=${today}`;

        const token = state.auth.token;
        const vendor = state.auth.vendor_id;
        axios.get(`${BASE_URL}/vendors/${vendor}/orders/search?${queryString}`,
            {headers: {'Authorization': `Bearer ${token}`}})
            .then(response => {
                dispatch(storeOrderList(response.data))
            })
            .catch(error => console.log(error.response))

    }
};

export const searchOrders = () => {
    return (dispatch, getState) => {
        const state = getState();
        const token = state.auth.token;
        const vendor = state.auth.vendor_id;
        const search = state.orders_list.search;
        
        //Set status loaded to false
        dispatch(setLoadedToFalse());
        console.log("SEARCH STATUS: " +search.order_status);
        const order_date_from = search.order_date_from !== null ? 
            moment(search.order_date_from, 'DD/MM/YYYY').format('YYYY-MM-DD') : null;
        const order_date_to = search.order_date_to !== null ? 
            moment(search.order_date_to, 'DD/MM/YYYY').format('YYYY-MM-DD') : null ;
        let queryString = `order_date_from=${order_date_from}&order_date_to=${order_date_to}`;
        if( search.order_status !== 'All' )
            queryString =  `${queryString}&order_status=${search.order_status}`;
        //Get data from API
        axios.get(`${BASE_URL}/vendors/${vendor}/orders/search?${queryString}`,
            {headers: {'Authorization': `Bearer ${token}`}})
            .then(response =>
            {
                dispatch(storeOrderList(response.data))
            })
            .catch(error => console.log(error.response))

    }
};


export const loadNextPage = () => {
    return async (dispatch, getState) => {
       const state = getState();
       const token = state.auth.token;
       const nextPage = state.orders_list.next_page_url;
       await axios.get( nextPage,{ headers:{'Authorization': `Bearer ${token}`}})
           .then(response => dispatch(storeNextPage(response.data.orders)))
           .catch(error => console.log(error))
   }
}


export const storeOrderList = data => {
    return {
        type: order_list.STORE_ORDERS_LIST,
        payload: data
    }
};

export const storeNextPage = data => {
    return {
        type: order_list.STORE_NEXT_PAGE,
        payload: data
    }
}

export const setSearchTimeFrom = data => {
    return {
        type: order_list.SET_SEARCH_TIME_FROM,
        payload: data
    }
};

export const setSearchTimeTo = data => {
    return {
        type: order_list.SET_SEARCH_TIME_TO,
        payload: data
    }
};

export const changeSearchField = data =>{
    return{
        type: order_list.CHANGE_SEARCH_FIELD,
        payload:data
    }
};

export const setLoadedToFalse = () => {
    return {
        type: order_list.SET_LOADED_TO_FALSE
    }
}

export const setSearchStatus = data => {
    return {
        type: order_list.SET_SEARCH_STATUS,
        payload: data
    }
}

export const setLoadMoreToFalse=()=>{
    return {
        type:order_list.SET_LOAD_MORE_FALSE
    }
}

