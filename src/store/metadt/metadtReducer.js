// TYPES
import { SET_CREATE_METADT_OVERLAY, GET_ALL_META_DTs } from "./metadtTypes";

const initialState = {
    visibleCreateMetaDTOverlay: false,
    metadts: [],
}

const metadtReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_CREATE_METADT_OVERLAY:
            return {
                ...state,
                visibleCreateMetaDTOverlay: action.payload
            }
        case GET_ALL_META_DTs:
            return {
                ...state,
                metadts: action.payload
            }
        default:
            return state;
    }
}

export default metadtReducer;