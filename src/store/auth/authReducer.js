// TYPES
import { LOGIN, LOADING, SIGNUP, LOGOUT } from "./authTypes";

const initialState = {
    token: "",
    user: {},
    isLoading: false,
}

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN:
            return {
                ...state,
                token: action.payload.token,
                user: action.payload.user
            }
        case LOADING:
            return {
                ...state,
                isLoading: action.payload,
            }
        case SIGNUP:
            return {
                ...state,
                token: action.payload.token,
                user: action.payload.user
            }
        case LOGOUT:
            return {
                ...state,
                token: "",
                user: {}
            }
        default:
            return state;
    }
}

export default authReducer;