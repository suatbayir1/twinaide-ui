// Libraries
import axios from "axios";
import { NotificationManager } from 'react-notifications';

// Types
import { LOADING_DTs, GET_ALL_DTs, GET_DT, SET_SELECTED_NODE } from "./dtTypes";

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

export const getSingleDT = (payload) => {
    return {
        type: GET_DT,
        payload
    }
}

export const setSelectedNode = (payload) => {
    console.log("payload", payload);
    return {
        type: SET_SELECTED_NODE,
        payload
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

        axios
            .put(url, payload, { headers: { 'Authorization': `Bearer: ${getState().auth.token}` } })
            .then(response => {
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

export const fetchDeleteDT = (id) => {
    return (dispatch, getState) => {
        let url = `${process.env.REACT_APP_API_URL}dt/${id}`;

        axios
            .delete(url, {
                headers: {
                    'Authorization': `Bearer: ${getState().auth.token}`
                }
            })
            .then(response => {
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

export const fetchCreateDT = (payload) => {
    return (dispatch, getState) => {
        let url = `${process.env.REACT_APP_API_URL}dt/createDT`;

        axios
            .post(url, payload, { headers: { 'Authorization': `Bearer: ${getState().auth.token}` } })
            .then(response => {
                if (response.status === 200) {
                    dispatch(fetchGetAllDTs());
                    NotificationManager.success(response.data.message, 'Success', 2000);
                }
            })
            .catch(err => {
                NotificationManager.error(err.response.data.message, 'Error', 3000);
            })
    }
}

export const fetchGetSingleDT = (id) => {
    return (dispatch, getState) => {
        let url = `${process.env.REACT_APP_API_URL}dt/${id}`;

        console.log("id", id);

        axios
            .get(url, { headers: { 'Authorization': `Bearer: ${getState().auth.token}` } })
            .then(response => {
                if (response.status === 200) {
                    console.log("response", response.data.data);
                    dispatch(getSingleDT(response.data.data));
                }
            })
            .catch(err => {
                dispatch(getSingleDT({}));
                NotificationManager.error(err.response.data.message, 'Error', 3000);
            })
    }
}