// TYPES
import { SET_CREATE_METADT_OVERLAY, GET_ALL_META_DTs, GET_META_DT, GET_META_DT_DETAIL } from "./metadtTypes";

const initialState = {
    visibleCreateMetaDTOverlay: false,
    metadtOverlayMode: "create",
    metadts: [],
    metadt: {},
    selectedMetaDT: {},
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
        case GET_META_DT_DETAIL:
            return {
                ...state,
                selectedMetaDT: action.payload
            }
        default:
            return state;
    }
}

export default metadtReducer;