
const defaultState = {
    isLoggedIn: false,
    email: null,
    token: null,
    type: null,
    vendor_id: null,
    currencyChoosen: null
};

export default function reducer(state = defaultState, action){
    switch(action.type){
        case 'LOGIN_SUCCESS':
            return Object.assign({}, state, {
                isLoggedIn: true,
                email: action.response.user.email,
                token: action.response.token,
                role: action.response.role,
                vendor_id: action.response.vendors[0].id,
                currencyChoosen: action.response.currencyChoosen

            });
        case 'LOGIN':
            return Object.assign({}, state, {
                isLoggedIn: true,
            });
        case 'LOGOUT':

            return Object.assign({}, state, {
                isLoggedIn: false,
                email: null,
                token:null,
                role:null,
                vendor_id:null,
                currencyChoosen: null
            });
        case 'STORE_AUTH_DATA':
            //Get the data as JSON string
            let data = JSON.parse(action.payload);

            return Object.assign({}, state, {
                isLoggedIn: true,
                email: data.email,
                token: data.token,
                role: data.role,
                vendor_id: data.vendor_id,
                currencyChoosen: data.currencyChoosen
            });
        default:
            return state;
    }
};

