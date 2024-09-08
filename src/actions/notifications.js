import { notifications } from './types';
import axios from 'axios';
import { BASE_URL, APP_KEY } from './../../config/settings';

export const fetchNewOrders = () => {
    return async (dispatch, getState) => {
        const state = getState();
        const token = state.auth.token;
        const vendor = state.auth.vendor_id;
        await axios.get(`${BASE_URL}/vendors/${vendor}/orders?status=new`,
        { headers: {'Authorization': `Bearer ${token}`} })
         .then( response => dispatch(fetchNewOrdersSuccess(response.data.orders)))
    }
        
};


export const fetchNewOrdersSuccess = data => {
    return {
        type: notifications.STORE_NOTIFICATIONS,
        payload: data
    }
};
