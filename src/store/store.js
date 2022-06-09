// Libraries
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

// Reducer
import rootReducer from "./rootReducer";

function saveToLocalStorage(state) {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('state', serializedState);
    } catch (e) {
        return undefined;
    }
}

function loadFromLocalStorage() {
    try {
        const serializedState = localStorage.getItem('state');
        if (serializedState === null) return undefined;
        return JSON.parse(serializedState);
    } catch (e) {
        return undefined;
    }
}

const persistedState = loadFromLocalStorage();

const store = createStore(rootReducer, persistedState, applyMiddleware(thunk));

store.subscribe(() => saveToLocalStorage(store.getState()))

export default store;
