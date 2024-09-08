import {
    opening_hours,
    STORE_OPENING_HOURS,
    UPDATE_OPENING_HOURS
} from './../actions/types';

const defaultState = {
    weekDays: null,
    loaded: false
};

export default function reducer(state = defaultState, action){
    switch(action.type){
        case opening_hours.STORE_OPENING_HOURS:
            return { ...state, weekDays: action.payload, loaded: true};
        case opening_hours.UPDATE_OPENING_HOURS:
           let newWeekDays =  state.weekDays.map( day => {
                if(day.weekDay === action.payload.weekDay)
                    return action.payload;
                return day;
            })
            return { ...state, weekDays: newWeekDays};
        default: 
            return state;
    }
};