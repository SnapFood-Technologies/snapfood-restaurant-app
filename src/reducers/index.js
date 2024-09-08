import { combineReducers } from 'redux';
import auth from './auth';
import openingHours from './opening_hours';
import notifications from './notifications';
import products from './products';
import orders_list from './orders_list';
import printModal from './print_modal';
import menu from './menu';

const rootReducer = combineReducers({
    auth, 
    openingHours,
    notifications,
    products,
    orders_list,
    printModal,
    menu
});

export default rootReducer;

