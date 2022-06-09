// Libraries
import axios from "axios";
import { NotificationManager } from 'react-notifications';

// Types
import { SET_CREATE_METADT_OVERLAY, GET_ALL_META_DTs } from "./metadtTypes";

// Action Methods
export const setCreateMetaDTOverlay = (payload) => {
    return {
        type: SET_CREATE_METADT_OVERLAY,
        payload,
    }
}

export const getAllMetaDTs = (payload) => {
    return {
        type: GET_ALL_META_DTs,
        payload,
    }
}


// Redux Thunk
export const fetchCreateMetaDT = (payload) => {
    return (dispatch, getState) => {
        let url = `${process.env.REACT_APP_API_URL}metadt/`;

        axios
            .post(url, payload, { headers: { 'Authorization': `Bearer: ${getState().auth.token}` } })
            .then(response => {
                if (response.status === 200) {
                    dispatch(fetchGetAllMetaDTs());
                    dispatch(setCreateMetaDTOverlay(false));
                    NotificationManager.success(response.data.message, 'Success', 2000);
                }
            })
            .catch(err => {
                NotificationManager.error(err.response.data.message, 'Error', 3000);
            })
    }
}

export const fetchGetAllMetaDTs = () => {
    return (dispatch, getState) => {
        let url = `${process.env.REACT_APP_API_URL}metadt/`;

        axios
            .get(url, { headers: { 'Authorization': `Bearer: ${getState().auth.token}` } })
            .then(response => {
                if (response.status === 200) {
                    dispatch(getAllMetaDTs(response.data.data));
                }
            })
            .catch(err => {
                dispatch(getAllMetaDTs([]));
                NotificationManager.error(err.response.data.message, 'Error', 3000);
            })
    }
}