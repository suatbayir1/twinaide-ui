// Libraries
import axios from "axios";
import { NotificationManager } from 'react-notifications';

// Types
import { LOADING_DTs, GET_ALL_DTs } from "./dtTypes";

// Action Methods
export const loadingDTs = (payload) => {
    return {
        type: LOADING_DTs,
        payload,
    }
}

export const getAllDTs = (payload) => {
    return {
        type: GET_ALL_DTs,
        payload,
    }
}

// Redux Thunk
export const fetchGetAllDTs = () => {
    return (dispatch, getState) => {
        let url = `${process.env.REACT_APP_API_URL}dt/`;

        axios
            .get(url, { headers: { 'Authorization': `Bearer: ${getState().auth.token}` } })
            .then(response => {
                if (response.status === 200) {
                    dispatch(loadingDTs(true));
                    dispatch(getAllDTs(response.data.data));
                }
            })
            .catch(err => {
                dispatch(getAllDTs([]));
                NotificationManager.error(err.response.data.message, 'Error', 3000);
            })
    }
}

export const fetchUpdateDT = (id, payload) => {
    return (dispatch, getState) => {
        let url = `${process.env.REACT_APP_API_URL}dt/${id}`;

        console.log(url);

        axios
            .put(url, payload, { headers: { 'Authorization': `Bearer: ${getState().auth.token}` } })
            .then(response => {
                console.log("response", response);
                if (response.status === 200) {
                    dispatch(fetchGetAllDTs());

                    NotificationManager.success(response.data.message, 'Success', 3000);
                }
            })
            .catch(err => {
                NotificationManager.error(err.response.data.message, 'Error', 3000);
            })
    }
}