// Libraries
import { combineReducers } from "redux";

// Reducers
import authReducer from "./auth/authReducer";

const rootReducer = combineReducers({
    auth: authReducer,
});

export default rootReducer;
