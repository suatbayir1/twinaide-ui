// Libraries
import { combineReducers } from "redux";

// Reducers
import authReducer from "./auth/authReducer";
import dtReducer from "./dt/dtReducer";

const rootReducer = combineReducers({
    auth: authReducer,
    dt: dtReducer,
});

export default rootReducer;
