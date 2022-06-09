// Libraries
import { combineReducers } from "redux";

// Reducers
import authReducer from "./auth/authReducer";
import dataReducer from "./data/dataReducer";
import dtReducer from "./dt/dtReducer";
import metadtReducer from "./metadt/metadtReducer";

const rootReducer = combineReducers({
    auth: authReducer,
    dt: dtReducer,
    metadt: metadtReducer,
    data: dataReducer
});

export default rootReducer;
