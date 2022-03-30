// TYPES
import { GET_ALL_DTs, LOADING_DTs } from "./dtTypes";

const initialState = {
    isLoadingDTs: false,
    dts: [],
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
        default:
            return state;
    }
}

export default dtReducer;