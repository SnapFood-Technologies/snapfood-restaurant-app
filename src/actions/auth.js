export const login = (email, password) => {
    return {
        type: 'LOGIN',
        email: email,
        password: password
    }
};

export const loginSuccess = (response) => {
    return {
        type: 'LOGIN_SUCCESS',
        response: response
    }
};

export const storeAuthData = data => {
    return {
        type: 'STORE_AUTH_DATA',
        payload: data
    }
};

export const logout = () => {
    return {
        type: 'LOGOUT'
    }
}