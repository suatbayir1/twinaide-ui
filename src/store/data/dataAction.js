// Types
import { SET_VISUALIZE_SENSOR_DATA_OVERLAY } from "./dataTypes";

// Action Methods
export const setVisualizeSensorDataOverlay = (payload) => {
    return {
        type: SET_VISUALIZE_SENSOR_DATA_OVERLAY,
        payload,
    }
}