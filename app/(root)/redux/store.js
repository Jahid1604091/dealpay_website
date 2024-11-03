import { apiSlice } from "./slices/apiSlice";
import authSliceReducer from "./slices/authSlice";
import accountSliceReducer from "./slices/accountSlice";

const { configureStore } = require("@reduxjs/toolkit");

const store = configureStore({
    reducer:{
        auth:authSliceReducer,
        account:accountSliceReducer,
        [apiSlice.reducerPath]:apiSlice.reducer,
    },
    middleware:getDefaultMiddleware=>getDefaultMiddleware().concat(apiSlice.middleware),
    devTools:true
})

export default store;