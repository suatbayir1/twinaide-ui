// TYPES
import { GET_ALL_DTs, LOADING_DTs, GET_DT, SET_SELECTED_NODE, SET_IMPORT_DT_FROM_TWINBASE_OVERLAY, GET_DTS_FROM_TWINBASE } from "./dtTypes";

const initialState = {
    isLoadingDTs: false,
    dts: [],
    selectedDT: {},
    selectedNode: {},
    visibleImportDTFromTwinbaseOverlay: false,
    twinbaseDTs: [],
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
        case SET_IMPORT_DT_FROM_TWINBASE_OVERLAY:
            console.log("action", action.payload);
            return {
                ...state,
                visibleImportDTFromTwinbaseOverlay: action.payload,
            }
        case GET_DTS_FROM_TWINBASE:
            return {
                ...state,
                twinbaseDTs: action.payload
            }
        default:
            return state;
    }
}

export default dtReducer;