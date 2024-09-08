import axios from 'axios';
import { BASE_URL, APP_KEY } from './../../config/settings';
import { 
    opening_hours,
    STORE_OPENING_HOURS,
    UPDATE_OPENING_HOURS
} from './types';


const manageOpeningHours = data => {
    let obj = [];
        data.map((day, index) =>  {
            let key =  Object.keys(day)[0];  
            obj.push( {
                weekDay: key,
                open: day[key].open,
                time_open: day[key].time_open,
                time_close: day[key].time_close
            }); 
        })
    return obj;
}

export const fetchOpeningHours = () => {
    return (dispatch, getState) => {
        const state = getState();
        const token = state.auth.token;
        const vendor = state.auth.vendor_id;
        axios.get(`${BASE_URL}/vendors/${vendor}/opening-hours`,
            { headers:{'Authorization': `Bearer ${token}`}})
            .then(response => dispatch(storeOpeningDays(response.data.open)))
            .catch(error => console.log(error))
    }
}

export const storeOpeningDays = (data) => {
    return {
        type: opening_hours.STORE_OPENING_HOURS,
        payload: manageOpeningHours(data)
    }
};

export const updateOpeningHours = data => {
    return {
        type: opening_hours.UPDATE_OPENING_HOURS,
        payload: data
    }
}