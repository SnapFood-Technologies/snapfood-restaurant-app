import { print_modal } from './../actions/types';

const defaultState = {
    isOpen: false,
    url: null
};

export default function reducer(state = defaultState, action){
    switch(action.type){
        case print_modal.OPEN_PRINT_MODAL:
            return { ...state, isOpen: true, url: action.payload.split("#")[2] };
        case print_modal.CLOSE_PRINT_MODAL:
            return { ...state, isOpen: false, url: null };
        default:
            return state;
    }
};