// Libraries
import axios from "axios";
import { NotificationManager } from 'react-notifications';

// Types
import { SET_CREATE_METADT_OVERLAY, GET_ALL_META_DTs, GET_META_DT, GET_META_DT_DETAIL } from "./metadtTypes";

// Action Methods
export const setCreateMetaDTOverlay = (visible, mode) => {
    return {
        type: SET_CREATE_METADT_OVERLAY,
        visible,
        mode,
    }
}

export const getAllMetaDTs = (payload) => {
    return {
        type: GET_ALL_META_DTs,
        payload,
    }
}

export const getSingleMetaDT = (payload) => {
    return {
        type: GET_META_DT,
        payload
    }
}

export const getSingleMetaDTDetail = (payload) => {
    return {
        type: GET_META_DT_DETAIL,
        payload
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
                    dispatch(setCreateMetaDTOverlay(false, "create"));
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

export const fetchDeleteMetaDT = (id) => {
    return (dispatch, getState) => {
        let url = `${process.env.REACT_APP_API_URL}metadt/${id}`;

        axios
            .delete(url, {
                headers: {
                    'Authorization': `Bearer: ${getState().auth.token}`
                }
            })
            .then(response => {
                if (response.status === 200) {
                    dispatch(fetchGetAllMetaDTs());

                    NotificationManager.success(response.data.message, 'Success', 3000);
                }
            })
            .catch(err => {
                NotificationManager.error(err.response.data.message, 'Error', 3000);
            })
    }
}

export const fetchUpdateMetaDT = (id, payload) => {
    return (dispatch, getState) => {
        let url = `${process.env.REACT_APP_API_URL}metadt/${id}`;

        axios
            .put(url, payload, { headers: { 'Authorization': `Bearer: ${getState().auth.token}` } })
            .then(response => {
                if (response.status === 200) {
                    dispatch(fetchGetAllMetaDTs());
                    dispatch(fetchGetSingleMetaDT(id));

                    NotificationManager.success(response.data.message, 'Success', 3000);
                }
            })
            .catch(err => {
                NotificationManager.error(err.response.data.message, 'Error', 3000);
            })
    }
}

export const fetchGetSingleMetaDT = (id) => {
    return (dispatch, getState) => {
        let url = `${process.env.REACT_APP_API_URL}metadt/${id}`;

        axios
            .get(url, { headers: { 'Authorization': `Bearer: ${getState().auth.token}` } })
            .then(response => {
                if (response.status === 200) {
                    dispatch(getSingleMetaDT(response.data.data));
                }
            })
            .catch(err => {
                dispatch(getSingleMetaDT({}));
                NotificationManager.error(err.response.data.message, 'Error', 3000);
            })
    }
}

export const fetchGetSingleMetaDTDetail = (id) => {
    return (dispatch, getState) => {
        let url = `${process.env.REACT_APP_API_URL}metadt/${id}/detail`;

        axios
            .get(url, { headers: { 'Authorization': `Bearer: ${getState().auth.token}` } })
            .then(response => {
                if (response.status === 200) {
                    dispatch(getSingleMetaDTDetail(response.data.data));
                }
            })
            .catch(err => {
                dispatch(getSingleMetaDT({}));
                NotificationManager.error(err.response.data.message, 'Error', 3000);
            })
    }
}