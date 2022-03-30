// Libraries
import axios from "axios";
import { NotificationManager } from 'react-notifications';

// Types
import { LOGIN, LOADING, SIGNUP, LOGOUT } from "./authTypes";

// Constants
import { history } from "../../history";

// Action Methods
export const loading = (payload) => {
    return {
        type: LOADING,
        payload,
    }
}

export const login = (payload) => {
    return {
        type: LOGIN,
        payload,
    }
}

export const signup = (payload) => {
    return {
        type: SIGNUP,
        payload,
    }
}

export const logout = () => {
    return {
        type: LOGOUT,
    }
}

// Redux Thunk
export const fetchLogin = (payload) => {
    return (dispatch) => {
        let url = `${process.env.REACT_APP_API_URL}auth/login`;

        axios
            .post(url, payload)
            .then(response => {
                if (response.status === 200) {
                    dispatch(loading(true));
                    dispatch(login({
                        token: response.data.access_token,
                        user: response.data.data
                    }));

                    NotificationManager.success(response.data.message, 'Success', 2000);

                    setTimeout(() => {
                        history.push("/");
                        dispatch(loading(false));
                    }, 1000)
                }
            })
            .catch(err => {
                NotificationManager.error(err.response.data.message, 'Error', 3000);
            })
    }
}

export const fetchSignup = (payload) => {
    return (dispatch) => {
        let url = `${process.env.REACT_APP_API_URL}auth/register`;

        axios
            .post(url, payload)
            .then(response => {
                if (response.status === 200) {
                    dispatch(loading(true));
                    dispatch(signup({
                        token: response.data.access_token,
                        user: response.data.data
                    }));

                    NotificationManager.success("User created successfully", 'Success', 2000);

                    setTimeout(() => {
                        history.push("/");
                        dispatch(loading(false));
                    }, 1000)
                }
            })
            .catch(err => {
                NotificationManager.error(err.response.data.message, 'Error', 3000);
            })
    }
}