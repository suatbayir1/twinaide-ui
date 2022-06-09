// TYPES
import { SET_VISUALIZE_SENSOR_DATA_OVERLAY } from "./dataTypes";

const initialState = {
    visibleVisualizeSensorDataOverlay: false,
}

const dataReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_VISUALIZE_SENSOR_DATA_OVERLAY:
            return {
                ...state,
                visibleVisualizeSensorDataOverlay: action.payload
            }
        default:
            return state;
    }
}

export default dataReducer;