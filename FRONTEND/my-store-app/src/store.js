import { createStore, compose, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import { capNhatUserReducer, dangNhapReducer, timKiemReducer } from "./reducers";

const reducer = combineReducers({
  dangNhap: dangNhapReducer,
  capNhatUser: capNhatUserReducer,
  timKiem: timKiemReducer,
});

const initialState = {
  dangNhap: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : "",
};

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  reducer,
  initialState,
  composeEnhancer(applyMiddleware(thunk))
);

export default store;
