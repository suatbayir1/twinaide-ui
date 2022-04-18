// TYPES
import { GET_ALL_DTs, LOADING_DTs, GET_DT, SET_SELECTED_NODE } from "./dtTypes";

const initialState = {
    isLoadingDTs: false,
    dts: [],
    selectedDT: {},
    selectedNode: {},
}

const dtReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOADING_DTs:
            return {
                ...state,
                isLoadingDTs: true
            }
        case GET_ALL_DTs:
            return {
                ...state,
                dts: action.payload
            }
        case GET_DT:
            return {
                ...state,
                selectedDT: action.payload
            }
        case SET_SELECTED_NODE:
            return {
                ...state,
                selectedNode: action.payload
            }
        default:
            return state;
    }
}

export default dtReducer;