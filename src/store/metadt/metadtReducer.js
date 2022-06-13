// TYPES
import { SET_CREATE_METADT_OVERLAY, GET_ALL_META_DTs, GET_META_DT } from "./metadtTypes";

const initialState = {
    visibleCreateMetaDTOverlay: false,
    metadtOverlayMode: "create",
    metadts: [],
    metadt: {},
}

const metadtReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_CREATE_METADT_OVERLAY:
            return {
                ...state,
                visibleCreateMetaDTOverlay: action.visible,
                metadtOverlayMode: action.mode
            }
        case GET_ALL_META_DTs:
            return {
                ...state,
                metadts: action.payload
            }
        case GET_META_DT:
            return {
                ...state,
                metadt: action.payload
            }
        default:
            return state;
    }
}

export default metadtReducer;