// Libraries
import axios from "axios";
import { NotificationManager } from 'react-notifications';

// Types
import { LOADING_DTs, GET_ALL_DTs, GET_DT, SET_SELECTED_NODE, SET_IMPORT_DT_FROM_TWINBASE_OVERLAY, GET_DTS_FROM_TWINBASE } from "./dtTypes";

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
    return {
        type: SET_SELECTED_NODE,
        payload
    }
}

export const setImportDTFromTwinbaseOverlay = (payload) => {
    return {
        type: SET_IMPORT_DT_FROM_TWINBASE_OVERLAY,
        payload
    }
}

export const getDTsFromTwinbase = (payload) => {
    return {
        type: GET_DTS_FROM_TWINBASE,
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
                    dispatch(fetchGetSingleDT(id));

                    NotificationManager.success(response.data.message, 'Success', 3000);
                }
            })
            .catch(err => {
                NotificationManager.error(err.response.data.message, 'Error', 3000);
            })
    }
}

export const fetchReplaceDTWithNewDocument = (id, payload) => {
    return (dispatch, getState) => {
        let url = `${process.env.REACT_APP_API_URL}dt/${id}/replace`;

        axios
            .put(url, payload, { headers: { 'Authorization': `Bearer: ${getState().auth.token}` } })
            .then(response => {
                if (response.status === 200) {
                    dispatch(fetchGetAllDTs());
                    dispatch(fetchGetSingleDT(id));

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

        axios
            .get(url, { headers: { 'Authorization': `Bearer: ${getState().auth.token}` } })
            .then(response => {
                if (response.status === 200) {
                    dispatch(getSingleDT(response.data.data));
                }
            })
            .catch(err => {
                dispatch(getSingleDT({}));
                NotificationManager.error(err.response.data.message, 'Error', 3000);
            })
    }
}

export const fetchUploadDTVisualFile = (id, payload, selectedDT) => {
    return (dispatch, getState) => {
        let url = `${process.env.REACT_APP_API_URL}dt/${id}/uploadVisualFile`;

        axios
            .post(url, payload, { headers: { 'Authorization': `Bearer: ${getState().auth.token}` } })
            .then(response => {
                if (response.status === 200) {
                    dispatch(fetchReplaceDTWithNewDocument(id, selectedDT))
                    NotificationManager.success(response.data.message, 'Success', 2000);
                }
            })
            .catch(err => {
                NotificationManager.error(err.response.data.message, 'Error', 3000);
            })
    }
}

export const fetchGetDTsFromTwinbase = () => {
    return (dispatch, getState) => {
        let url = process.env.REACT_APP_TWINBASE_URL;

        axios
            .get(url)
            .then(response => {
                if (response.status === 200) {
                    dispatch(getDTsFromTwinbase(response.data.twins));
                }
            })
            .catch(err => {
                dispatch(getDTsFromTwinbase([]));
                NotificationManager.error(err.response.data.message, 'Error', 3000);
            })
    }
}